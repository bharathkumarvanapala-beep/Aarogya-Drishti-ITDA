import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { StorageService } from '../storage/storage.service';
import { ConsentService } from '../clinical/consent.service';
import { ScreeningService } from '../clinical/screening.service';
import { ImageQualityService } from '../quality/quality.service';
import { AiResearchService } from '../ai-research/ai-research.service';
import { RequestUser } from '../common/decorators/current-user.decorator';
import { OralViewKey } from '@prisma/client';
import {
  UploadInitDto,
  ConfirmImageDto,
  ScreeningImageResponseDto,
  UploadInitResponseDto,
  PresignedUrlResponseDto,
} from './dto';

interface InMemoryImageRecord {
  id: string;
  screeningId: string;
  viewKey: OralViewKey;
  storagePath: string;
  originalFilename: string;
  mimeType: string;
  fileSizeBytes: number;
  sha256Checksum: string;
  uploadedAt: Date;
}

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);
  private readonly inMemoryImages: Map<string, InMemoryImageRecord> = new Map();

  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly consentService: ConsentService,
    private readonly screeningService: ScreeningService,
    private readonly qualityService: ImageQualityService,
    private readonly aiResearchService: AiResearchService,
  ) {
    this.seedKondalaImages();
  }

  private get isDbAvailable(): boolean {
    return this.prisma.isDbConnected && process.env.NODE_ENV !== 'test';
  }

  private seedKondalaImages() {
    const screeningId = 'scr-0101-8420';
    const views: { key: OralViewKey; id: string; filename: string; path: string }[] = [
      {
        key: OralViewKey.RIGHT_CHEEK,
        id: 'img-0101-8420-rc',
        filename: 'kondala_right_buccal_ulcer.jpg',
        path: `screenings/${screeningId}/right_cheek_842001.jpg`,
      },
      {
        key: OralViewKey.LEFT_CHEEK,
        id: 'img-0101-8420-lc',
        filename: 'kondala_left_buccal.jpg',
        path: `screenings/${screeningId}/left_cheek_842002.jpg`,
      },
      {
        key: OralViewKey.TONGUE,
        id: 'img-0101-8420-tg',
        filename: 'kondala_dorsal_lateral_tongue.jpg',
        path: `screenings/${screeningId}/tongue_842003.jpg`,
      },
      {
        key: OralViewKey.PALATE,
        id: 'img-0101-8420-pl',
        filename: 'kondala_hard_soft_palate.jpg',
        path: `screenings/${screeningId}/palate_842004.jpg`,
      },
      {
        key: OralViewKey.GUMS_FLOOR,
        id: 'img-0101-8420-gf',
        filename: 'kondala_floor_of_mouth.jpg',
        path: `screenings/${screeningId}/gums_floor_842005.jpg`,
      },
    ];

    for (const v of views) {
      const record: InMemoryImageRecord = {
        id: v.id,
        screeningId,
        viewKey: v.key,
        storagePath: v.path,
        originalFilename: v.filename,
        mimeType: 'image/jpeg',
        fileSizeBytes: 2048576, // ~2.0 MB
        sha256Checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        uploadedAt: new Date('2026-10-28T09:32:00.000Z'),
      };
      this.inMemoryImages.set(record.id, record);
      this.inMemoryImages.set(`${screeningId}:${v.key}`, record);
    }
  }

  /**
   * 1. Initialize Image Upload with Strict Consent Gate
   * Generates randomized S3 object key and 15-minute presigned upload URL with AES-256.
   */
  async initializeUpload(
    screeningId: string,
    dto: UploadInitDto,
    user: RequestUser,
  ): Promise<UploadInitResponseDto> {
    // 1. Verify screening exists
    const screening = await this.screeningService.getScreeningById(screeningId);
    if (!screening) {
      throw new NotFoundException(`Screening record [${screeningId}] not found.`);
    }

    // 2. STRICT CONSENT GATE: Validate that active informed consent includes photography
    const consent = await this.consentService.getConsentById(screening.consentId);
    if (!consent || consent.status !== 'ACTIVE' || !consent.purposePhotography) {
      throw new ForbiddenException(
        `Consent Gate Block: Informed photography consent is not active or has been withdrawn for patient [${screening.patientId}].`,
      );
    }

    // 3. Generate Randomized UUID Object Key
    const ext = dto.originalFilename.split('.').pop() || 'jpg';
    const objectKey = this.storageService.generateObjectKey(screeningId, dto.viewKey, ext);

    // 4. Generate 15-minute Presigned Upload URL with AES256 SSE
    const mimeType = dto.mimeType || 'image/jpeg';
    const presigned = await this.storageService.generateUploadPresignedUrl(objectKey, mimeType, 900);

    this.logger.log(
      `Image upload initialized for screening [${screeningId}], view [${dto.viewKey}] by user [${user.username}]`,
    );

    return {
      uploadUrl: presigned.uploadUrl,
      objectKey,
      headers: presigned.headers,
      expiresInSeconds: presigned.expiresInSeconds,
      viewKey: dto.viewKey,
    };
  }

  /**
   * 2. Confirm Uploaded Image & Inspect Binary Signatures (Magic Bytes)
   */
  async confirmImage(
    screeningId: string,
    dto: ConfirmImageDto,
    user: RequestUser,
  ): Promise<ScreeningImageResponseDto> {
    // Verify screening exists
    const screening = await this.screeningService.getScreeningById(screeningId);
    if (!screening) {
      throw new NotFoundException(`Screening record [${screeningId}] not found.`);
    }

    // Strict Consent Verification
    const consent = await this.consentService.getConsentById(screening.consentId);
    if (!consent || consent.status !== 'ACTIVE' || !consent.purposePhotography) {
      throw new ForbiddenException(
        `Consent Gate Block: Photography consent is not active for this patient.`,
      );
    }

    // Binary Magic Bytes Signature Inspection
    let imageBuffer: Buffer | undefined;
    if (dto.imageBase64) {
      try {
        const cleanBase64 = dto.imageBase64.includes(',')
          ? dto.imageBase64.split(',')[1]
          : dto.imageBase64;
        imageBuffer = Buffer.from(cleanBase64, 'base64');

        const magicResult = this.storageService.validateMagicBytes(imageBuffer);
        if (!magicResult.isValid) {
          this.logger.error(`Magic bytes inspection failed for uploaded image: ${magicResult.error}`);
          throw new BadRequestException(
            `Binary signature inspection failed: ${magicResult.error || 'Disallowed or spoofed file binary.'}`,
          );
        }
      } catch (err) {
        if (err instanceof BadRequestException) throw err;
        throw new BadRequestException(`Failed to parse image binary: ${(err as Error).message}`);
      }
    }

    const existing = this.inMemoryImages.get(`${screeningId}:${dto.viewKey}`);
    const imageId = existing ? existing.id : `img-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const record: InMemoryImageRecord = {
      id: imageId,
      screeningId,
      viewKey: dto.viewKey,
      storagePath: dto.storagePath,
      originalFilename: dto.originalFilename,
      mimeType: dto.mimeType,
      fileSizeBytes: dto.fileSizeBytes,
      sha256Checksum: dto.sha256Checksum,
      uploadedAt: new Date(),
    };

    // Store in-memory
    this.inMemoryImages.set(record.id, record);
    this.inMemoryImages.set(`${screeningId}:${dto.viewKey}`, record);

    // Persist to Database if available
    if (this.isDbAvailable) {
      try {
        await this.prisma.screeningImage.upsert({
          where: {
            screeningId_viewKey: {
              screeningId,
              viewKey: dto.viewKey,
            },
          },
          create: {
            id: record.id,
            screeningId,
            viewKey: dto.viewKey,
            storagePath: dto.storagePath,
            originalFilename: dto.originalFilename,
            mimeType: dto.mimeType,
            fileSizeBytes: dto.fileSizeBytes,
            sha256Checksum: dto.sha256Checksum,
            uploadedAt: record.uploadedAt,
          },
          update: {
            storagePath: dto.storagePath,
            originalFilename: dto.originalFilename,
            mimeType: dto.mimeType,
            fileSizeBytes: dto.fileSizeBytes,
            sha256Checksum: dto.sha256Checksum,
            uploadedAt: record.uploadedAt,
          },
        });
      } catch (err) {
        this.logger.warn(`Failed persisting screening image to DB: ${(err as Error).message}`);
      }
    }

    // Auto-trigger OpenCV Image Quality Verification if payload is provided
    let qualityResult: any = null;
    try {
      qualityResult = await this.qualityService.assessQuality(
        record.id,
        {
          imageBase64: dto.imageBase64,
          filename: dto.originalFilename,
        },
        imageBuffer,
      );
    } catch (err) {
      this.logger.warn(`Initial quality assessment deferred: ${(err as Error).message}`);
    }

    this.logger.log(
      `Image confirmed for screening [${screeningId}], view [${dto.viewKey}] with sha256 [${dto.sha256Checksum.slice(0, 8)}...]`,
    );

    return {
      ...this.toImageDto(record),
      qualityResult,
    };
  }

  /**
   * 3. Issue Short-Lived Presigned GET URL (15-Minute Expiry)
   * Scoped strictly to authenticated clinicians.
   */
  async getPresignedDownloadUrl(
    imageId: string,
    user: RequestUser,
  ): Promise<PresignedUrlResponseDto> {
    const image = await this.getImageRecordById(imageId);
    if (!image) {
      throw new NotFoundException(`Image record [${imageId}] not found.`);
    }

    const { downloadUrl, expiresInSeconds } =
      await this.storageService.generateDownloadPresignedUrl(image.storagePath, 900);

    this.logger.log(
      `Presigned GET URL generated for image [${imageId}] by user [${user.username}] (expires in ${expiresInSeconds}s)`,
    );

    return {
      imageId: image.id,
      downloadUrl,
      expiresInSeconds,
      viewKey: image.viewKey,
      mimeType: image.mimeType,
    };
  }

  /**
   * 4. Get All Images for a Screening
   */
  async getImagesForScreening(screeningId: string): Promise<ScreeningImageResponseDto[]> {
    const results: ScreeningImageResponseDto[] = [];
    const seen = new Set<string>();

    // Check in-memory records
    for (const img of this.inMemoryImages.values()) {
      if (img.screeningId === screeningId && !seen.has(img.id)) {
        seen.add(img.id);
        let qualityResult: any = null;
        try {
          qualityResult = await this.qualityService.getQualityResultByImageId(img.id);
        } catch {}

        let aiAnalysis: any = null;
        try {
          aiAnalysis = await this.aiResearchService.getAnalysisByImageId(img.id);
        } catch {}

        results.push({
          ...this.toImageDto(img),
          qualityResult,
          aiAnalysis,
        });
      }
    }

    if (results.length > 0) {
      return results;
    }

    // DB query if connected
    if (this.isDbAvailable) {
      try {
        const dbImages = await this.prisma.screeningImage.findMany({
          where: { screeningId },
          include: {
            qualityResult: true,
            aiAnalysis: true,
          },
        });

        return dbImages.map((img) => ({
          id: img.id,
          screeningId: img.screeningId,
          viewKey: img.viewKey,
          storagePath: img.storagePath,
          originalFilename: img.originalFilename,
          mimeType: img.mimeType,
          fileSizeBytes: img.fileSizeBytes,
          sha256Checksum: img.sha256Checksum,
          uploadedAt: img.uploadedAt.toISOString(),
          qualityResult: img.qualityResult
            ? {
                id: img.qualityResult.id,
                screeningImageId: img.qualityResult.screeningImageId,
                verdict: img.qualityResult.verdict,
                sharpnessScore: img.qualityResult.sharpnessScore,
                brightnessScore: img.qualityResult.brightnessScore,
                glareScore: img.qualityResult.glareScore,
                resolution: img.qualityResult.resolution,
                automatedFeedbackEn: img.qualityResult.automatedFeedbackEn,
                automatedFeedbackTe: img.qualityResult.automatedFeedbackTe,
                evaluatedAt: img.qualityResult.evaluatedAt.toISOString(),
              }
            : null,
          aiAnalysis: img.aiAnalysis
            ? {
                id: img.aiAnalysis.id,
                screeningImageId: img.aiAnalysis.screeningImageId,
                isNonClinicalDemo: true,
                score: null,
                categoricalLabel: 'suspicious_example',
                modelVersion: img.aiAnalysis.modelVersion,
                heatmapStoragePath: img.aiAnalysis.heatmapStoragePath,
                anatomicalLandmarks: (img.aiAnalysis.anatomicalLandmarks as any) || null,
                safetyDisclaimer: img.aiAnalysis.safetyDisclaimer,
                generatedAt: img.aiAnalysis.generatedAt.toISOString(),
              }
            : null,
        }));
      } catch (err) {
        this.logger.warn(`Error querying images from DB: ${(err as Error).message}`);
      }
    }

    return [];
  }

  /**
   * 5. Get Single Image Details
   */
  async getImageById(imageId: string): Promise<ScreeningImageResponseDto> {
    const image = await this.getImageRecordById(imageId);
    if (!image) {
      throw new NotFoundException(`Image record [${imageId}] not found.`);
    }

    let qualityResult: any = null;
    try {
      qualityResult = await this.qualityService.getQualityResultByImageId(image.id);
    } catch {}

    let aiAnalysis: any = null;
    try {
      aiAnalysis = await this.aiResearchService.getAnalysisByImageId(image.id);
    } catch {}

    return {
      ...this.toImageDto(image),
      qualityResult,
      aiAnalysis,
    };
  }

  private async getImageRecordById(imageId: string): Promise<InMemoryImageRecord | null> {
    const memory = this.inMemoryImages.get(imageId);
    if (memory) return memory;

    if (this.isDbAvailable) {
      try {
        const found = await this.prisma.screeningImage.findUnique({
          where: { id: imageId },
        });
        if (found) {
          return {
            id: found.id,
            screeningId: found.screeningId,
            viewKey: found.viewKey,
            storagePath: found.storagePath,
            originalFilename: found.originalFilename,
            mimeType: found.mimeType,
            fileSizeBytes: found.fileSizeBytes,
            sha256Checksum: found.sha256Checksum,
            uploadedAt: found.uploadedAt,
          };
        }
      } catch (err) {
        this.logger.warn(`DB image retrieval failed: ${(err as Error).message}`);
      }
    }

    return null;
  }

  private toImageDto(r: InMemoryImageRecord): ScreeningImageResponseDto {
    return {
      id: r.id,
      screeningId: r.screeningId,
      viewKey: r.viewKey,
      storagePath: r.storagePath,
      originalFilename: r.originalFilename,
      mimeType: r.mimeType,
      fileSizeBytes: r.fileSizeBytes,
      sha256Checksum: r.sha256Checksum,
      uploadedAt: r.uploadedAt.toISOString(),
    };
  }
}
