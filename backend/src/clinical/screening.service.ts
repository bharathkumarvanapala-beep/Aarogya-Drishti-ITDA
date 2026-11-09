import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ConsentService } from './consent.service';
import { PatientsService } from '../patients/patients.service';
import { CreateScreeningDto, ScreeningDetailDto } from './dto';
import { RequestUser } from '../common/decorators/current-user.decorator';
import { ScreeningStatus, RiskImpression } from '@prisma/client';

interface InMemoryScreeningRecord {
  id: string;
  screeningNumber: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  village: string;
  consentId: string;
  conductedById: string;
  conductedByName: string;
  facilityId: string;
  status: ScreeningStatus;
  tobaccoChewing: boolean;
  tobaccoYears?: number;
  gutkhaUse: boolean;
  reverseSmoking: boolean;
  alcoholConsumption: boolean;
  symptomsPain: boolean;
  symptomsBurning: boolean;
  symptomsUlcerLongDuration: boolean;
  symptomsWhiteRedPatch: boolean;
  trismusFingerCount?: number;
  trismusMouthOpeningMm?: number;
  frontlineRiskImpression: RiskImpression;
  clinicalNotes?: string;
  imagesCount: number;
  createdAt: Date;
  schemaVersion: string;
  idempotencyKey?: string;
  offlineDraftId?: string;
}

@Injectable()
export class ScreeningService {
  private readonly logger = new Logger(ScreeningService.name);
  private readonly inMemoryScreenings: Map<string, InMemoryScreeningRecord> = new Map();
  private screeningSequence = 843;

  constructor(
    private readonly prisma: PrismaService,
    private readonly consentService: ConsentService,
    private readonly patientsService: PatientsService,
  ) {
    this.seedKondalaScreening();
  }

  private get isDbAvailable(): boolean {
    return this.prisma.isDbConnected && process.env.NODE_ENV !== 'test';
  }

  private seedKondalaScreening() {
    const kondalaScreeningId = 'scr-0101-8420';
    const kondalaScreeningNo = 'ASR-SCR-2026-0842';
    const kondalaPatientId = 'ASR-PAT-2026-0842';

    const record: InMemoryScreeningRecord = {
      id: kondalaScreeningId,
      screeningNumber: kondalaScreeningNo,
      patientId: kondalaPatientId,
      patientName: 'Kondala Rao',
      patientAge: 46,
      patientGender: 'MALE',
      village: 'Kothapalli',
      consentId: 'con-0101-8420',
      conductedById: 'c8b1a320-f19e-4e4b-9e4f-010101010101',
      conductedByName: 'Lakshmi Devi (ASHA)',
      facilityId: 'fac-sc-kothapalli',
      status: ScreeningStatus.PENDING_REVIEW,
      tobaccoChewing: true,
      tobaccoYears: 15,
      gutkhaUse: true,
      reverseSmoking: true, // Characteristic Eastern Ghats tribal habit
      alcoholConsumption: false,
      symptomsPain: true,
      symptomsBurning: true,
      symptomsUlcerLongDuration: true,
      symptomsWhiteRedPatch: true,
      trismusFingerCount: 2, // Restricted opening (cardinal sign)
      trismusMouthOpeningMm: 28.5,
      frontlineRiskImpression: RiskImpression.HIGH,
      clinicalNotes:
        'Firm non-healing ulcer on right buccal mucosa with indurated margins and leukoplakic borders. Reduced mouth opening (2 fingers). Advised urgent MO clinical triage.',
      imagesCount: 5,
      createdAt: new Date('2026-10-28T09:30:00.000Z'),
      schemaVersion: 'v1.2-ASR-CLINICAL',
    };

    this.inMemoryScreenings.set(kondalaScreeningId, record);
    this.inMemoryScreenings.set(kondalaScreeningNo, record);
    this.inMemoryScreenings.set(`patient:${kondalaPatientId}`, record);
  }

  /**
   * 1. Submit Screening Intake with Strict Consent Gate
   */
  async createScreening(
    dto: CreateScreeningDto,
    user: RequestUser,
  ): Promise<ScreeningDetailDto> {
    // Check Idempotency Key: if already processed, return existing record
    if (dto.idempotencyKey) {
      for (const s of this.inMemoryScreenings.values()) {
        if (s.idempotencyKey === dto.idempotencyKey) {
          this.logger.log(`Idempotency match: returning existing screening [${s.screeningNumber}]`);
          return this.toScreeningDetailDto(s);
        }
      }
    }

    // STRICT CONSENT GATE: Validate that active informed consent exists
    const consent = await this.consentService.validateActiveConsent(
      dto.patientId,
      dto.consentId,
    );

    // Retrieve patient profile for demographic continuity
    const patient = await this.patientsService.getPatientById(dto.patientId);

    // Generate Screening Number: ASR-SCR-YYYY-XXXX
    const currentYear = new Date().getFullYear();
    const seqStr = String(this.screeningSequence++).padStart(4, '0');
    const screeningNumber = `ASR-SCR-${currentYear}-${seqStr}`;
    const screeningId = `scr-${Date.now()}-${seqStr}`;

    const record: InMemoryScreeningRecord = {
      id: screeningId,
      screeningNumber,
      patientId: patient.uniquePatientId,
      patientName: patient.fullName,
      patientAge: patient.age,
      patientGender: patient.gender,
      village: patient.village,
      consentId: consent.id,
      conductedById: user.id,
      conductedByName: user.username,
      facilityId: user.facilityId || 'fac-sc-kothapalli',
      status: ScreeningStatus.PENDING_REVIEW,
      tobaccoChewing: dto.tobaccoChewing ?? false,
      tobaccoYears: dto.tobaccoYears,
      gutkhaUse: dto.gutkhaUse ?? false,
      reverseSmoking: dto.reverseSmoking ?? false,
      alcoholConsumption: dto.alcoholConsumption ?? false,
      symptomsPain: dto.symptomsPain ?? false,
      symptomsBurning: dto.symptomsBurning ?? false,
      symptomsUlcerLongDuration: dto.symptomsUlcerLongDuration ?? false,
      symptomsWhiteRedPatch: dto.symptomsWhiteRedPatch ?? false,
      trismusFingerCount: dto.trismusFingerCount,
      trismusMouthOpeningMm: dto.trismusMouthOpeningMm,
      frontlineRiskImpression: dto.frontlineRiskImpression || RiskImpression.MODERATE,
      clinicalNotes: dto.clinicalNotes,
      imagesCount: 0,
      createdAt: new Date(),
      schemaVersion: 'v1.2-ASR-CLINICAL',
      idempotencyKey: dto.idempotencyKey,
      offlineDraftId: dto.offlineDraftId,
    };

    this.inMemoryScreenings.set(screeningId, record);
    this.inMemoryScreenings.set(screeningNumber, record);
    this.inMemoryScreenings.set(`patient:${patient.uniquePatientId}`, record);

    if (this.isDbAvailable) {
      try {
        await this.prisma.screening.create({
          data: {
            id: screeningId,
            screeningNumber,
            patientId: patient.id,
            consentId: consent.id,
            conductedById: user.id,
            facilityId: user.facilityId || 'fac-sc-kothapalli',
            status: ScreeningStatus.PENDING_REVIEW,
            tobaccoChewing: dto.tobaccoChewing ?? false,
            tobaccoYears: dto.tobaccoYears || null,
            gutkhaUse: dto.gutkhaUse ?? false,
            reverseSmoking: dto.reverseSmoking ?? false,
            alcoholConsumption: dto.alcoholConsumption ?? false,
            symptomsPain: dto.symptomsPain ?? false,
            symptomsBurning: dto.symptomsBurning ?? false,
            symptomsUlcerLongDuration: dto.symptomsUlcerLongDuration ?? false,
            symptomsWhiteRedPatch: dto.symptomsWhiteRedPatch ?? false,
            trismusFingerCount: dto.trismusFingerCount || null,
            trismusMouthOpeningMm: dto.trismusMouthOpeningMm || null,
            frontlineRiskImpression: dto.frontlineRiskImpression || RiskImpression.MODERATE,
            clinicalNotes: dto.clinicalNotes || null,
            offlineDraftId: dto.offlineDraftId || null,
          },
        });
      } catch (err) {
        this.logger.warn(`Failed persisting screening to DB: ${(err as Error).message}`);
      }
    }

    this.logger.log(`Screening intake created: [${screeningNumber}] for patient [${patient.uniquePatientId}]`);
    return this.toScreeningDetailDto(record);
  }

  /**
   * 2. Get Screening Details by ID or Screening Number
   */
  async getScreeningById(idOrScreeningNo: string): Promise<ScreeningDetailDto> {
    const screening = this.inMemoryScreenings.get(idOrScreeningNo);
    if (screening) {
      return this.toScreeningDetailDto(screening);
    }

    if (this.isDbAvailable) {
      try {
        const found = await this.prisma.screening.findFirst({
          where: {
            OR: [{ id: idOrScreeningNo }, { screeningNumber: idOrScreeningNo }],
          },
          include: {
            patient: { include: { habitationVillage: true } },
            conductedBy: true,
            _count: { select: { images: true } },
          },
        });

        if (found) {
          return {
            id: found.id,
            screeningNumber: found.screeningNumber,
            patientId: found.patient.uniquePatientId,
            patientName: found.patient.fullName,
            patientAge: found.patient.age,
            patientGender: found.patient.gender,
            village: found.patient.habitationVillage.name,
            consentId: found.consentId,
            status: found.status,
            tobaccoChewing: found.tobaccoChewing,
            tobaccoYears: found.tobaccoYears || undefined,
            gutkhaUse: found.gutkhaUse,
            reverseSmoking: found.reverseSmoking,
            alcoholConsumption: found.alcoholConsumption,
            symptomsPain: found.symptomsPain,
            symptomsBurning: found.symptomsBurning,
            symptomsUlcerLongDuration: found.symptomsUlcerLongDuration,
            symptomsWhiteRedPatch: found.symptomsWhiteRedPatch,
            trismusFingerCount: found.trismusFingerCount || undefined,
            trismusMouthOpeningMm: found.trismusMouthOpeningMm || undefined,
            frontlineRiskImpression: found.frontlineRiskImpression,
            clinicalNotes: found.clinicalNotes || undefined,
            conductedByName: found.conductedBy.fullName,
            facilityId: found.facilityId,
            imagesCount: found._count.images,
            createdAt: found.createdAt.toISOString(),
            schemaVersion: 'v1.2-ASR-CLINICAL',
          };
        }
      } catch (err) {
        this.logger.warn(`Failed reading screening from DB: ${(err as Error).message}`);
      }
    }

    throw new NotFoundException(`Screening record [${idOrScreeningNo}] not found.`);
  }

  /**
   * 3. Get Longitudinal Screenings for Patient
   */
  async getScreeningsForPatient(patientId: string): Promise<ScreeningDetailDto[]> {
    const list: InMemoryScreeningRecord[] = [];
    for (const s of this.inMemoryScreenings.values()) {
      if (s.patientId === patientId || `patient:${patientId}` in this.inMemoryScreenings) {
        list.push(s);
      }
    }

    const unique = Array.from(new Map(list.map((s) => [s.id, s])).values());
    return unique.map((s) => this.toScreeningDetailDto(s));
  }

  private toScreeningDetailDto(r: InMemoryScreeningRecord): ScreeningDetailDto {
    return {
      id: r.id,
      screeningNumber: r.screeningNumber,
      patientId: r.patientId,
      patientName: r.patientName,
      patientAge: r.patientAge,
      patientGender: r.patientGender,
      village: r.village,
      consentId: r.consentId,
      status: r.status,
      tobaccoChewing: r.tobaccoChewing,
      tobaccoYears: r.tobaccoYears,
      gutkhaUse: r.gutkhaUse,
      reverseSmoking: r.reverseSmoking,
      alcoholConsumption: r.alcoholConsumption,
      symptomsPain: r.symptomsPain,
      symptomsBurning: r.symptomsBurning,
      symptomsUlcerLongDuration: r.symptomsUlcerLongDuration,
      symptomsWhiteRedPatch: r.symptomsWhiteRedPatch,
      trismusFingerCount: r.trismusFingerCount,
      trismusMouthOpeningMm: r.trismusMouthOpeningMm,
      frontlineRiskImpression: r.frontlineRiskImpression,
      clinicalNotes: r.clinicalNotes,
      conductedByName: r.conductedByName,
      facilityId: r.facilityId,
      imagesCount: r.imagesCount,
      createdAt: r.createdAt.toISOString(),
      schemaVersion: r.schemaVersion,
    };
  }
}
