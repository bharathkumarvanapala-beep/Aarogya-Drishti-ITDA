import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HealthCardDto } from './health-card.dto';
import { CaregiverResponseDto } from './caregiver.dto';

export class PatientListItemDto {
  @ApiProperty({ description: 'Internal patient UUID', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ description: 'Official Unique Patient ID', example: 'ASR-PAT-2026-0842' })
  uniquePatientId: string;

  @ApiProperty({ description: 'Full Patient Name in English', example: 'Kondala Rao' })
  fullName: string;

  @ApiPropertyOptional({ description: 'Full Patient Name in Telugu', example: 'కొండల రావు' })
  fullNameTe?: string;

  @ApiProperty({ description: 'Age', example: 46 })
  age: number;

  @ApiProperty({ description: 'Gender', example: 'MALE' })
  gender: string;

  @ApiPropertyOptional({ description: 'Phone number if recorded', example: '+91-94401-88421' })
  phone?: string;

  @ApiProperty({ description: 'Habitation village name', example: 'Kothapalli' })
  village: string;

  @ApiProperty({ description: 'Mandal name', example: 'G. Madugula' })
  mandal: string;

  @ApiProperty({ description: 'Indigenous tribal community affiliation', example: 'Konda Dora (PVTG)' })
  tribeCommunity: string;

  @ApiProperty({ description: 'Latest clinical status impression', example: 'SUSPICIOUS' })
  status: string;

  @ApiProperty({ description: 'Active physical health card serial', example: 'ASR-CRD-8420-91' })
  activeCardSerial: string;

  @ApiProperty({ description: 'Registration date', example: '2026-10-28T09:15:00.000Z' })
  createdAt: string;
}

export class PatientDetailDto extends PatientListItemDto {
  @ApiProperty({ description: 'Primary spoken language', example: 'te' })
  primarySpokenLanguage: string;

  @ApiProperty({ description: 'Whether patient is an indigenous tribal member', example: true })
  isTribalMember: boolean;

  @ApiProperty({ description: 'Whether household holds BPL status', example: true })
  socioEconomicBPL: boolean;

  @ApiPropertyOptional({ description: 'Dr. YSR Aarogyasri Trust Card Number', example: 'ASR-WAC-2026-08421' })
  aarogyasriNumber?: string;

  @ApiProperty({ description: 'Registering Health Worker Name', example: 'Lakshmi Devi (ASHA)' })
  registeredByName: string;

  @ApiProperty({ description: 'Active Health Card details', type: HealthCardDto })
  activeCard: HealthCardDto;

  @ApiProperty({ description: 'List of authorized family caregivers', type: [CaregiverResponseDto] })
  caregivers: CaregiverResponseDto[];

  @ApiProperty({ description: 'Total oral screening sessions completed', example: 1 })
  screeningsCount: number;

  @ApiProperty({ description: 'Total specialist hospital referrals dispatched', example: 1 })
  referralsCount: number;
}
