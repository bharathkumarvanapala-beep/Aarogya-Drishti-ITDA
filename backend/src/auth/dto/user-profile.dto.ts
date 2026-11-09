import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({ description: 'Unique user account UUID', example: 'd3b07384-d113-4f9e-9d8a-6b4d3209121a' })
  id: string;

  @ApiProperty({ description: 'System username', example: 'asha_lakshmi' })
  username: string;

  @ApiProperty({ description: 'Full legal name', example: 'Lakshmi Devi' })
  fullName: string;

  @ApiPropertyOptional({ description: 'Telugu script name', example: 'లక్ష్మి దేవి' })
  nameTe?: string;

  @ApiPropertyOptional({ description: 'Official email address', example: 'lakshmi.asha@asr.ap.gov.in' })
  email?: string;

  @ApiPropertyOptional({ description: 'Mobile contact number', example: '+91-94401-23456' })
  phone?: string;

  @ApiProperty({ description: 'Primary active role', example: 'ASHA_WORKER' })
  role: string;

  @ApiProperty({ description: 'All assigned system roles', example: ['ASHA_WORKER'] })
  roles: string[];

  @ApiProperty({ description: 'Descriptive role title in English', example: 'Community Health Worker (ASHA)' })
  roleTitle: string;

  @ApiProperty({ description: 'Descriptive role title in Telugu', example: 'ఆరోగ్య కార్యకర్త (ఆశా)' })
  roleTitleTe: string;

  @ApiPropertyOptional({ description: 'Primary assigned facility UUID', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  facilityId?: string;

  @ApiPropertyOptional({ description: 'Primary assigned facility name', example: 'Sub Centre Kothapalli' })
  facilityName?: string;

  @ApiPropertyOptional({ description: 'Facility type classification', example: 'SUB_CENTRE' })
  facilityType?: string;

  @ApiProperty({ description: 'Operational district', example: 'Alluri Sitharama Raju' })
  district: string;

  @ApiProperty({ description: 'Names of assigned tribal habitations/villages', example: ['Kothapalli', 'Nurmati', 'Solabham'] })
  assignedVillages: string[];

  @ApiProperty({ description: 'UUIDs of assigned villages', example: ['c6b54a8e-2821-4f40-8b1d-ef2c1294875a'] })
  assignedVillageIds: string[];

  @ApiPropertyOptional({ description: 'Andhra Pradesh Medical Council Registration # for clinicians', example: 'APMC/2014/68421' })
  apmcRegNumber?: string;

  @ApiPropertyOptional({ description: 'Account verification status', example: 'APPROVED' })
  accountStatus?: string;

  @ApiPropertyOptional({ description: 'Designation type code', example: 'ASHA' })
  designationType?: string;

  @ApiPropertyOptional({ description: 'Professional ID number', example: 'ASHA-GMAD-01' })
  professionalIdNumber?: string;

  @ApiPropertyOptional({ description: 'Medical qualification', example: 'MBBS, MD' })
  medicalQualification?: string;

  @ApiPropertyOptional({ description: 'Specialization', example: 'Oral Oncology' })
  specialization?: string;

  @ApiPropertyOptional({ description: 'Assigned Health Centre / Sub-Centre', example: 'Sub Centre Kothapalli' })
  assignedHealthCentre?: string;

  @ApiPropertyOptional({ description: 'Rejection reason if status is REJECTED', example: 'Council number invalid' })
  rejectionReason?: string;

  @ApiProperty({ description: 'Whether multi-factor authentication is active', example: false })
  mfaEnabled: boolean;
}
