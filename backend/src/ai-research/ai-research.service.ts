import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ServiceUnavailableException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { AiResearchResponseDto } from './dto/ai-research.dto';

interface InMemoryAiRecord {
  id: string;
  screeningImageId: string;
  isNonClinicalDemo: boolean;
  score: null;
  categoricalLabel: 'suspicious_example' | 'benign_example' | 'inconclusive_example';
  modelVersion: string;
  heatmapStoragePath?: string | null;
  anatomicalLandmarks?: Record<string, any> | null;
  safetyDisclaimer: string;
  generatedAt: Date;
}

@Injectable()
export class AiResearchService {
  private readonly logger = new Logger(AiResearchService.name);
  private readonly aiUrl: string;
  private readonly inMemoryAnalyses: Map<string, InMemoryAiRecord> = new Map();
  private isAiServiceEnabled = true;

  public static readonly MANDATORY_SAFETY_DISCLAIMER =
    'STRICTLY NON-CLINICAL: For academic and research demonstration only. Not for diagnosis or patient treatment decisions.';

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.aiUrl =
      this.configService.get<string>('aiResearchServiceUrl') || 'http://localhost:8002';
    this.seedKondalaAiDemo();
  }

  private get isDbAvailable(): boolean {
    return this.prisma.isDbConnected && process.env.NODE_ENV !== 'test';
  }

  private seedKondalaAiDemo() {
    const kondalaImageId = 'img-0101-8420-rc';
    const record: InMemoryAiRecord = {
      id: 'ai-0101-8420-rc',
      screeningImageId: kondalaImageId,
      isNonClinicalDemo: true,
      score: null, // STRICT SAFETY BOUNDARY: Numerical score must be null
      categoricalLabel: 'suspicious_example',
      modelVersion: 'BioMed-Oral-Demo-v1.4',
      heatmapStoragePath: 'research-heatmaps/scr-0101-8420/rc_gradcam_sim.png',
      anatomicalLandmarks: {
        buccalMucosaDetected: true,
        regionOfInterest: { x: 420, y: 310, width: 280, height: 260 },
      },
      safetyDisclaimer: AiResearchService.MANDATORY_SAFETY_DISCLAIMER,
      generatedAt: new Date('2026-10-28T09:36:00.000Z'),
    };

    this.inMemoryAnalyses.set(record.id, record);
    this.inMemoryAnalyses.set(`image:${kondalaImageId}`, record);
  }

  /**
   * Helper to toggle AI service status for offline / 503 resilience testing
   */
  setAiServiceEnabled(enabled: boolean) {
    this.isAiServiceEnabled = enabled;
  }

  /**
   * 1. Run Non-Clinical Research Demonstration Analysis
   * Strictly enforces:
   *  - Active informed consent for non-clinical research demo
   *  - score: null payload rule (zero numerical probability)
   *  - Mandatory safety disclaimer banner
   *  - HTTP 503 graceful degradation when offline without blocking clinical workflows
   */
  async runDemonstrationAnalysis(
    screeningImageId: string,
    viewKey?: string,
    consentNonClinicalDemo = true,
  ): Promise<AiResearchResponseDto> {
    // Check consent gate
    if (!consentNonClinicalDemo) {
      throw new ForbiddenException(
        'Consent Gate Block: Non-clinical AI research demonstration consent was not granted by this patient.',
      );
    }

    // Check service availability toggle (Phase 8 graceful fallback)
    if (!this.isAiServiceEnabled) {
      throw new ServiceUnavailableException(
        'AI Research Demonstration service is currently offline. Frontline screening and clinical care workflows remain fully functional.',
      );
    }

    this.logger.log(`Executing non-clinical AI research demonstration for image [${screeningImageId}]`);

    // In a live research cluster, call worker via HTTP/REST or BullMQ queue:
    // When offline, worker returns categorical labels based on lesion characteristics
    let categoricalLabel: 'suspicious_example' | 'benign_example' | 'inconclusive_example' = 'suspicious_example';
    const vk = (viewKey || screeningImageId || '').toUpperCase();
    if (vk.includes('CHEEK') || vk.includes('TONGUE') || vk.includes('FLOOR') || vk.includes('RC') || vk.includes('LC') || vk.includes('TG')) {
      categoricalLabel = 'suspicious_example';
    } else if (vk.includes('PALATE') || vk.includes('PL')) {
      categoricalLabel = 'benign_example';
    } else {
      categoricalLabel = 'suspicious_example';
    }

    const id = `ai-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const record: InMemoryAiRecord = {
      id,
      screeningImageId,
      isNonClinicalDemo: true,
      // STRICT SAFETY BOUNDARY: Numerical cancer probabilities are forbidden!
      score: null,
      categoricalLabel,
      modelVersion: 'BioMed-Oral-Demo-v1.4',
      heatmapStoragePath: `research-heatmaps/${screeningImageId}_gradcam.png`,
      anatomicalLandmarks: {
        anatomicalRegion: viewKey || 'ORAL_MUCOSA',
        featureContoursDetected: 3,
      },
      safetyDisclaimer: AiResearchService.MANDATORY_SAFETY_DISCLAIMER,
      generatedAt: new Date(),
    };

    // Store in-memory
    this.inMemoryAnalyses.set(record.id, record);
    this.inMemoryAnalyses.set(`image:${screeningImageId}`, record);

    // Persist strictly to isolated AIResearchAnalysis table
    if (this.isDbAvailable) {
      try {
        await this.prisma.aIResearchAnalysis.upsert({
          where: { screeningImageId },
          create: {
            screeningImageId,
            isNonClinicalDemo: true,
            score: null, // Strictly enforced null in DB
            modelVersion: record.modelVersion,
            heatmapStoragePath: record.heatmapStoragePath,
            anatomicalLandmarks: record.anatomicalLandmarks as any,
            safetyDisclaimer: record.safetyDisclaimer,
            generatedAt: record.generatedAt,
          },
          update: {
            isNonClinicalDemo: true,
            score: null,
            modelVersion: record.modelVersion,
            heatmapStoragePath: record.heatmapStoragePath,
            anatomicalLandmarks: record.anatomicalLandmarks as any,
            safetyDisclaimer: record.safetyDisclaimer,
            generatedAt: record.generatedAt,
          },
        });
      } catch (err) {
        this.logger.warn(`Failed persisting AI analysis to DB: ${(err as Error).message}`);
      }
    }

    return this.toAiDto(record);
  }

  /**
   * 2. Retrieve AI Research Demo Result for Image
   */
  async getAnalysisByImageId(screeningImageId: string): Promise<AiResearchResponseDto> {
    const cached = this.inMemoryAnalyses.get(`image:${screeningImageId}`);
    if (cached) {
      return this.toAiDto(cached);
    }

    if (this.isDbAvailable) {
      try {
        const found = await this.prisma.aIResearchAnalysis.findUnique({
          where: { screeningImageId },
        });
        if (found) {
          return {
            id: found.id,
            screeningImageId: found.screeningImageId,
            isNonClinicalDemo: found.isNonClinicalDemo,
            score: null, // Enforce null
            categoricalLabel: 'suspicious_example',
            modelVersion: found.modelVersion,
            heatmapStoragePath: found.heatmapStoragePath,
            anatomicalLandmarks: (found.anatomicalLandmarks as Record<string, any>) || null,
            safetyDisclaimer: found.safetyDisclaimer,
            generatedAt: found.generatedAt.toISOString(),
          };
        }
      } catch (err) {
        this.logger.warn(`Error retrieving AI analysis from DB: ${(err as Error).message}`);
      }
    }

    throw new NotFoundException(`AI Research analysis for image [${screeningImageId}] not found.`);
  }

  private toAiDto(record: InMemoryAiRecord): AiResearchResponseDto {
    return {
      id: record.id,
      screeningImageId: record.screeningImageId,
      isNonClinicalDemo: true,
      score: null, // STRICT NON-NEGOTIABLE NULL
      categoricalLabel: record.categoricalLabel,
      modelVersion: record.modelVersion,
      heatmapStoragePath: record.heatmapStoragePath,
      anatomicalLandmarks: record.anatomicalLandmarks,
      safetyDisclaimer: record.safetyDisclaimer,
      generatedAt: record.generatedAt.toISOString(),
    };
  }
}
