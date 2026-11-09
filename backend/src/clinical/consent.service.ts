import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateConsentDto, WithdrawConsentDto, ConsentRecordDto } from './dto';
import { RequestUser } from '../common/decorators/current-user.decorator';
import { ConsentStatus, ConsentType } from '@prisma/client';

interface InMemoryConsentRecord {
  id: string;
  patientId: string;
  type: ConsentType;
  status: ConsentStatus;
  languageCode: string;
  witnessName?: string;
  witnessRelation?: string;
  witnessPhone?: string;
  purposeOralExam: boolean;
  purposePhotography: boolean;
  purposeNonClinicalDemo: boolean;
  purposeHospitalReferral: boolean;
  recordedById: string;
  recordedByName: string;
  recordedAt: Date;
  withdrawalDate?: Date;
  withdrawalReason?: string;
}

@Injectable()
export class ConsentService {
  private readonly logger = new Logger(ConsentService.name);
  private readonly inMemoryConsents: Map<string, InMemoryConsentRecord> = new Map();

  constructor(private readonly prisma: PrismaService) {
    this.seedKondalaConsent();
  }

  private get isDbAvailable(): boolean {
    return this.prisma.isDbConnected && process.env.NODE_ENV !== 'test';
  }

  private seedKondalaConsent() {
    const kondalaConsentId = 'con-0101-8420';
    const kondalaPatientId = 'ASR-PAT-2026-0842';

    const record: InMemoryConsentRecord = {
      id: kondalaConsentId,
      patientId: kondalaPatientId,
      type: ConsentType.VERBAL_RECORDED,
      status: ConsentStatus.ACTIVE,
      languageCode: 'te',
      witnessName: 'Appala Narasamma',
      witnessRelation: 'SPOUSE',
      purposeOralExam: true,
      purposePhotography: true,
      purposeNonClinicalDemo: true,
      purposeHospitalReferral: true,
      recordedById: 'c8b1a320-f19e-4e4b-9e4f-010101010101',
      recordedByName: 'Lakshmi Devi (ASHA)',
      recordedAt: new Date('2026-10-28T09:20:00.000Z'),
    };

    this.inMemoryConsents.set(kondalaConsentId, record);
    this.inMemoryConsents.set(`patient:${kondalaPatientId}`, record);
  }

  /**
   * 1. Record Bilingual Purpose-Scoped Consent
   */
  async recordConsent(
    dto: CreateConsentDto,
    user: RequestUser,
  ): Promise<ConsentRecordDto> {
    const consentId = `con-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const record: InMemoryConsentRecord = {
      id: consentId,
      patientId: dto.patientId,
      type: dto.type,
      status: ConsentStatus.ACTIVE,
      languageCode: dto.languageCode || 'te',
      witnessName: dto.witnessName,
      witnessRelation: dto.witnessRelation,
      witnessPhone: dto.witnessPhone,
      purposeOralExam: dto.purposeOralExam ?? true,
      purposePhotography: dto.purposePhotography ?? true,
      purposeNonClinicalDemo: dto.purposeNonClinicalDemo ?? true,
      purposeHospitalReferral: dto.purposeHospitalReferral ?? true,
      recordedById: user.id,
      recordedByName: user.username,
      recordedAt: new Date(),
    };

    this.inMemoryConsents.set(consentId, record);
    this.inMemoryConsents.set(`patient:${dto.patientId}`, record);

    if (this.isDbAvailable) {
      try {
        await this.prisma.consent.create({
          data: {
            id: consentId,
            patientId: dto.patientId,
            type: dto.type,
            status: ConsentStatus.ACTIVE,
            languageCode: dto.languageCode || 'te',
            witnessName: dto.witnessName || null,
            witnessRelation: dto.witnessRelation || null,
            witnessPhone: dto.witnessPhone || null,
            purposeOralExam: dto.purposeOralExam ?? true,
            purposePhotography: dto.purposePhotography ?? true,
            purposeNonClinicalDemo: dto.purposeNonClinicalDemo ?? true,
            purposeHospitalReferral: dto.purposeHospitalReferral ?? true,
            recordedById: user.id,
          },
        });
      } catch (err) {
        this.logger.warn(`Failed writing consent to PostgreSQL: ${(err as Error).message}`);
      }
    }

    return this.toConsentDto(record);
  }

  /**
   * 2. Consent Withdrawal API
   */
  async withdrawConsent(
    consentId: string,
    dto: WithdrawConsentDto,
  ): Promise<ConsentRecordDto> {
    const consent = this.inMemoryConsents.get(consentId);
    if (!consent) {
      throw new NotFoundException(`Informed consent record [${consentId}] not found.`);
    }

    if (consent.status === ConsentStatus.WITHDRAWN) {
      throw new BadRequestException('Consent has already been withdrawn.');
    }

    consent.status = ConsentStatus.WITHDRAWN;
    consent.withdrawalDate = new Date();
    consent.withdrawalReason = dto.withdrawalReason;

    if (this.isDbAvailable) {
      try {
        await this.prisma.consent.update({
          where: { id: consentId },
          data: {
            status: ConsentStatus.WITHDRAWN,
            withdrawalDate: new Date(),
            withdrawalReason: dto.withdrawalReason,
          },
        });
      } catch (err) {
        this.logger.warn(`Failed withdrawing consent in DB: ${(err as Error).message}`);
      }
    }

    this.logger.warn(`Patient consent [${consentId}] withdrawn: ${dto.withdrawalReason}`);
    return this.toConsentDto(consent);
  }

  /**
   * 3. Validate Active Consent Gate for Patient
   */
  async validateActiveConsent(patientId: string, consentId?: string): Promise<InMemoryConsentRecord> {
    // If specific consentId provided, check it first
    if (consentId) {
      const consent = this.inMemoryConsents.get(consentId);
      if (!consent) {
        throw new BadRequestException(`Specified consent record [${consentId}] does not exist.`);
      }
      if (consent.status !== ConsentStatus.ACTIVE) {
        throw new BadRequestException(
          `Consent Gate Block: Consent record [${consentId}] is ${consent.status}. Active informed consent is required to conduct clinical screenings.`,
        );
      }
      return consent;
    }

    // Lookup latest consent for patient
    const patientConsent = this.inMemoryConsents.get(`patient:${patientId}`);
    if (!patientConsent || patientConsent.status !== ConsentStatus.ACTIVE) {
      throw new BadRequestException(
        `Consent Gate Block: No active informed consent found for patient [${patientId}]. Doorstep screening intake cannot proceed without documented consent.`,
      );
    }

    return patientConsent;
  }

  /**
   * 4. Retrieve Active Consent Record for Patient
   */
  async getActiveConsentForPatient(patientId: string): Promise<ConsentRecordDto> {
    const consent = await this.validateActiveConsent(patientId);
    return this.toConsentDto(consent);
  }

  /**
   * 5. Get Consent by ID
   */
  async getConsentById(consentId: string): Promise<ConsentRecordDto> {
    const consent = this.inMemoryConsents.get(consentId);
    if (!consent) {
      throw new NotFoundException(`Consent record [${consentId}] not found.`);
    }
    return this.toConsentDto(consent);
  }

  private toConsentDto(r: InMemoryConsentRecord): ConsentRecordDto {
    return {
      id: r.id,
      patientId: r.patientId,
      type: r.type,
      status: r.status,
      languageCode: r.languageCode,
      witnessName: r.witnessName,
      witnessRelation: r.witnessRelation,
      purposeOralExam: r.purposeOralExam,
      purposePhotography: r.purposePhotography,
      purposeNonClinicalDemo: r.purposeNonClinicalDemo,
      purposeHospitalReferral: r.purposeHospitalReferral,
      recordedAt: r.recordedAt.toISOString(),
      recordedByName: r.recordedByName,
      withdrawalDate: r.withdrawalDate ? r.withdrawalDate.toISOString() : undefined,
      withdrawalReason: r.withdrawalReason,
    };
  }
}
