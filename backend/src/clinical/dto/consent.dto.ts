import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ConsentType, ConsentStatus } from '@prisma/client';

export class CreateConsentDto {
  @ApiProperty({ description: 'Patient UUID or Unique ID (ASR-PAT-YYYY-XXXX)', example: 'ASR-PAT-2026-0842' })
  @IsNotEmpty({ message: 'Patient identifier is mandatory for consent record' })
  @IsString()
  patientId: string;

  @ApiProperty({
    description: 'Format of consent provided',
    enum: ConsentType,
    example: ConsentType.VERBAL_RECORDED,
  })
  @IsEnum(ConsentType, { message: 'Consent type must be VERBAL_RECORDED, WITNESSED_THUMBPRINT, or WRITTEN_BILINGUAL' })
  type: ConsentType;

  @ApiPropertyOptional({ description: 'Language code used for bilingual explanation', example: 'te' })
  @IsOptional()
  @IsString()
  languageCode?: string = 'te';

  @ApiPropertyOptional({ description: 'Witness full legal name', example: 'Appala Narasamma' })
  @IsOptional()
  @IsString()
  witnessName?: string;

  @ApiPropertyOptional({ description: 'Relationship of witness to patient', example: 'SPOUSE' })
  @IsOptional()
  @IsString()
  witnessRelation?: string;

  @ApiPropertyOptional({ description: 'Contact phone of witness', example: '+91-94401-88422' })
  @IsOptional()
  @IsString()
  witnessPhone?: string;

  @ApiPropertyOptional({ description: 'Purpose: Doorstep oral clinical examination', default: true })
  @IsOptional()
  @IsBoolean()
  purposeOralExam?: boolean = true;

  @ApiPropertyOptional({ description: 'Purpose: Standardized 5-view oral photography', default: true })
  @IsOptional()
  @IsBoolean()
  purposePhotography?: boolean = true;

  @ApiPropertyOptional({ description: 'Purpose: Auxiliary non-clinical AI research demonstration', default: true })
  @IsOptional()
  @IsBoolean()
  purposeNonClinicalDemo?: boolean = true;

  @ApiPropertyOptional({ description: 'Purpose: Specialist hospital referral dispatch if indicated', default: true })
  @IsOptional()
  @IsBoolean()
  purposeHospitalReferral?: boolean = true;
}

export class WithdrawConsentDto {
  @ApiProperty({ description: 'Reason for informed consent withdrawal', example: 'Patient chose not to proceed with clinical photography' })
  @IsNotEmpty({ message: 'Withdrawal reason is mandatory' })
  @IsString()
  withdrawalReason: string;
}

export class ConsentRecordDto {
  @ApiProperty({ description: 'Consent unique UUID', example: 'con-0101-8420' })
  id: string;

  @ApiProperty({ description: 'Patient UUID or Unique ID', example: 'ASR-PAT-2026-0842' })
  patientId: string;

  @ApiProperty({ description: 'Consent format', enum: ConsentType, example: ConsentType.VERBAL_RECORDED })
  type: ConsentType;

  @ApiProperty({ description: 'Consent status', enum: ConsentStatus, example: ConsentStatus.ACTIVE })
  status: ConsentStatus;

  @ApiProperty({ description: 'Language used', example: 'te' })
  languageCode: string;

  @ApiPropertyOptional({ description: 'Witness name if witnessed' })
  witnessName?: string;

  @ApiPropertyOptional({ description: 'Witness relationship' })
  witnessRelation?: string;

  @ApiProperty({ description: 'Purpose: Oral Exam', example: true })
  purposeOralExam: boolean;

  @ApiProperty({ description: 'Purpose: Photography', example: true })
  purposePhotography: boolean;

  @ApiProperty({ description: 'Purpose: Non-Clinical AI Demo', example: true })
  purposeNonClinicalDemo: boolean;

  @ApiProperty({ description: 'Purpose: Hospital Referral', example: true })
  purposeHospitalReferral: boolean;

  @ApiProperty({ description: 'Recorded timestamp', example: '2026-10-28T09:20:00.000Z' })
  recordedAt: string;

  @ApiPropertyOptional({ description: 'Recording health worker username', example: 'asha_lakshmi' })
  recordedByName?: string;

  @ApiPropertyOptional({ description: 'Withdrawal timestamp if revoked' })
  withdrawalDate?: string;

  @ApiPropertyOptional({ description: 'Withdrawal reason if revoked' })
  withdrawalReason?: string;
}
