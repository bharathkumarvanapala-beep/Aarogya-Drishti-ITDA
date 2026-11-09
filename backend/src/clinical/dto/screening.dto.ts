import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
  IsNumber,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { ScreeningStatus, RiskImpression } from '@prisma/client';

export class CreateScreeningDto {
  @ApiProperty({ description: 'Patient UUID or Unique ID (ASR-PAT-YYYY-XXXX)', example: 'ASR-PAT-2026-0842' })
  @IsNotEmpty({ message: 'Patient ID is required' })
  @IsString()
  patientId: string;

  @ApiProperty({ description: 'Active Consent UUID verifying consent gate', example: 'con-0101-8420' })
  @IsNotEmpty({ message: 'Active consent ID is required to pass the strict consent gate' })
  @IsString()
  consentId: string;

  @ApiPropertyOptional({ description: 'Habit: Chewing tobacco / Khaini / Gutkha', default: false })
  @IsOptional()
  @IsBoolean()
  tobaccoChewing?: boolean = false;

  @ApiPropertyOptional({ description: 'Duration of tobacco usage in years', example: 15 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  tobaccoYears?: number;

  @ApiPropertyOptional({ description: 'Habit: Commercially packaged gutkha / pan masala', default: false })
  @IsOptional()
  @IsBoolean()
  gutkhaUse?: boolean = false;

  @ApiPropertyOptional({
    description: 'Habit: Reverse chutta / beedi smoking (high prevalence in ASR district)',
    default: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  reverseSmoking?: boolean = false;

  @ApiPropertyOptional({ description: 'Habit: Regular alcohol consumption', default: false })
  @IsOptional()
  @IsBoolean()
  alcoholConsumption?: boolean = false;

  @ApiPropertyOptional({ description: 'Symptom: Oral or facial pain', default: false })
  @IsOptional()
  @IsBoolean()
  symptomsPain?: boolean = false;

  @ApiPropertyOptional({ description: 'Symptom: Burning sensation with spicy food', default: false, example: true })
  @IsOptional()
  @IsBoolean()
  symptomsBurning?: boolean = false;

  @ApiPropertyOptional({
    description: 'Symptom: Non-healing oral ulcer persisting > 2 weeks',
    default: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  symptomsUlcerLongDuration?: boolean = false;

  @ApiPropertyOptional({
    description: 'Symptom: White (Leukoplakia) or Red (Erythroplakia) mucosal patch',
    default: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  symptomsWhiteRedPatch?: boolean = false;

  @ApiPropertyOptional({
    description: 'Trismus assessment: Finger opening count (1, 2, or 3 fingers)',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(4)
  trismusFingerCount?: number;

  @ApiPropertyOptional({ description: 'Trismus mouth opening in millimeters (inter-incisal distance)', example: 28.5 })
  @IsOptional()
  @IsNumber()
  trismusMouthOpeningMm?: number;

  @ApiPropertyOptional({
    description: 'Frontline health worker risk impression',
    enum: RiskImpression,
    default: RiskImpression.MODERATE,
    example: RiskImpression.HIGH,
  })
  @IsOptional()
  @IsEnum(RiskImpression)
  frontlineRiskImpression?: RiskImpression = RiskImpression.MODERATE;

  @ApiPropertyOptional({
    description: 'Clinical observation notes and location of oral mucosal changes',
    example: 'Firm non-healing ulcer on right buccal mucosa with indurated margins and leukoplakic borders. Reduced mouth opening (2 fingers).',
  })
  @IsOptional()
  @IsString()
  clinicalNotes?: string;

  @ApiPropertyOptional({ description: 'Client offline draft UUID for sync reconciliation', example: 'draft-uuid-0842-1234' })
  @IsOptional()
  @IsString()
  offlineDraftId?: string;

  @ApiPropertyOptional({ description: 'Client idempotency key preventing duplicate offline ingestion', example: 'idem-key-842-abc' })
  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}

export class ScreeningDetailDto {
  @ApiProperty({ description: 'Screening database UUID', example: 'scr-0101-8420' })
  id: string;

  @ApiProperty({ description: 'Official Screening ID', example: 'ASR-SCR-2026-0842' })
  screeningNumber: string;

  @ApiProperty({ description: 'Patient UUID or Unique ID', example: 'ASR-PAT-2026-0842' })
  patientId: string;

  @ApiProperty({ description: 'Patient Full Name', example: 'Kondala Rao' })
  patientName: string;

  @ApiProperty({ description: 'Patient Age', example: 46 })
  patientAge: number;

  @ApiProperty({ description: 'Patient Gender', example: 'MALE' })
  patientGender: string;

  @ApiProperty({ description: 'Habitation Village', example: 'Kothapalli' })
  village: string;

  @ApiProperty({ description: 'Consent UUID', example: 'con-0101-8420' })
  consentId: string;

  @ApiProperty({ description: 'Screening Status', enum: ScreeningStatus, example: ScreeningStatus.PENDING_REVIEW })
  status: ScreeningStatus;

  @ApiProperty({ description: 'Tobacco Chewing habit', example: true })
  tobaccoChewing: boolean;

  @ApiPropertyOptional({ description: 'Tobacco years', example: 15 })
  tobaccoYears?: number;

  @ApiProperty({ description: 'Gutkha habit', example: true })
  gutkhaUse: boolean;

  @ApiProperty({ description: 'Reverse smoking habit', example: true })
  reverseSmoking: boolean;

  @ApiProperty({ description: 'Alcohol consumption habit', example: false })
  alcoholConsumption: boolean;

  @ApiProperty({ description: 'Symptoms: Pain', example: true })
  symptomsPain: boolean;

  @ApiProperty({ description: 'Symptoms: Burning sensation', example: true })
  symptomsBurning: boolean;

  @ApiProperty({ description: 'Symptoms: Non-healing ulcer > 2 weeks', example: true })
  symptomsUlcerLongDuration: boolean;

  @ApiProperty({ description: 'Symptoms: White/Red patch', example: true })
  symptomsWhiteRedPatch: boolean;

  @ApiPropertyOptional({ description: 'Trismus finger count', example: 2 })
  trismusFingerCount?: number;

  @ApiPropertyOptional({ description: 'Trismus mouth opening mm', example: 28.5 })
  trismusMouthOpeningMm?: number;

  @ApiProperty({ description: 'Frontline risk impression', enum: RiskImpression, example: RiskImpression.HIGH })
  frontlineRiskImpression: RiskImpression;

  @ApiPropertyOptional({ description: 'Clinical notes' })
  clinicalNotes?: string;

  @ApiProperty({ description: 'Conducting health worker name', example: 'Lakshmi Devi (ASHA)' })
  conductedByName: string;

  @ApiProperty({ description: 'Associated facility ID', example: 'fac-sc-kothapalli' })
  facilityId: string;

  @ApiProperty({ description: 'Total oral camera images captured', example: 5 })
  imagesCount: number;

  @ApiProperty({ description: 'Screening timestamp', example: '2026-10-28T09:30:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Schema version preventing silent historical mutation', example: 'v1.2-ASR-CLINICAL' })
  schemaVersion: string;
}
