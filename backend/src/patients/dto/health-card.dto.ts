import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HealthCardDto {
  @ApiProperty({ description: 'Card unique database UUID', example: 'e4f5a6b7-c8d9-0123-4567-89abcdef0123' })
  id: string;

  @ApiProperty({ description: 'Physical Health Card Serial Number', example: 'ASR-CRD-8420-91' })
  cardSerial: string;

  @ApiProperty({ description: 'Associated Unique Patient ID', example: 'ASR-PAT-2026-0842' })
  patientId: string;

  @ApiProperty({ description: 'Full Patient Name in English', example: 'Kondala Rao' })
  patientName: string;

  @ApiPropertyOptional({ description: 'Full Patient Name in Telugu', example: 'కొండల రావు' })
  patientNameTe?: string;

  @ApiProperty({ description: 'Patient Age', example: 46 })
  age: number;

  @ApiProperty({ description: 'Patient Gender', example: 'MALE' })
  gender: string;

  @ApiProperty({ description: 'Habitation Village', example: 'Kothapalli' })
  habitation: string;

  @ApiProperty({ description: 'Mandal', example: 'G. Madugula' })
  mandal: string;

  @ApiProperty({ description: 'District', example: 'Alluri Sitharama Raju' })
  district: string;

  @ApiProperty({
    description: 'Non-sensitive opaque QR reference token URI (Zero PHI contained)',
    example: 'AAROGYA-DRISHTI://CARD-REF/ASR-PAT-2026-0842/EMERGENCY-VERIFY',
  })
  qrReferenceToken: string;

  @ApiProperty({ description: 'Card Status (ACTIVE, REPLACED, REVOKED)', example: 'ACTIVE' })
  status: string;

  @ApiProperty({ description: 'Card Issuance Timestamp', example: '2026-10-28T09:15:00.000Z' })
  issuedAt: string;

  @ApiPropertyOptional({ description: 'Issuing Health Worker Name', example: 'Lakshmi Devi (ASHA)' })
  issuedByName?: string;
}

import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class VerifyQrTokenDto {
  @ApiPropertyOptional({
    description: 'QR reference token string scanned from physical card',
    example: 'AAROGYA-DRISHTI://CARD-REF/ASR-PAT-2026-0842/EMERGENCY-VERIFY',
  })
  @IsOptional()
  @IsString()
  qrToken?: string;

  @ApiPropertyOptional({
    description: 'Alternative alias for QR reference token',
    example: 'AAROGYA-DRISHTI://CARD-REF/ASR-PAT-2026-0842/EMERGENCY-VERIFY',
  })
  @IsOptional()
  @IsString()
  qrReferenceToken?: string;
}

export class QrTokenVerificationResultDto {
  @ApiProperty({ description: 'Whether the physical card QR token is cryptographically authentic', example: true })
  isValid: boolean;

  @ApiProperty({ description: 'Status of the physical card', example: 'ACTIVE' })
  cardStatus: string;

  @ApiProperty({ description: 'Card serial identifier', example: 'ASR-CRD-8420-91' })
  cardSerial: string;

  @ApiProperty({ description: 'Issuing health authority agency', example: 'ITDA Paderu, Alluri Sitharama Raju District' })
  issuingDistrict: string;

  @ApiProperty({ description: 'Date the card was issued', example: '2026-10-28T09:15:00.000Z' })
  issuedAt: string;

  @ApiProperty({
    description: 'Privacy preservation confirmation guarantee',
    example: 'Zero Protected Health Information (PHI) disclosed. Authenticated frontline worker login required to inspect clinical history.',
  })
  privacyNotice: string;
}
