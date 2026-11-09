import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { AuthorizationBasis } from '@prisma/client';

export class AuthorizeCaregiverDto {
  @ApiProperty({ description: 'Full legal name of the family caregiver proxy', example: 'Appala Narasamma' })
  @IsNotEmpty({ message: 'Caregiver name is mandatory' })
  @IsString()
  caregiverName: string;

  @ApiProperty({ description: 'Relationship to the patient', example: 'SPOUSE' })
  @IsNotEmpty({ message: 'Relationship is mandatory' })
  @IsString()
  relationship: string;

  @ApiPropertyOptional({ description: 'Caregiver contact phone number', example: '+91-94401-88422' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({
    description: 'Documented legal/customary basis for authorization',
    enum: AuthorizationBasis,
    default: AuthorizationBasis.PATIENT_DELEGATED,
  })
  @IsOptional()
  @IsEnum(AuthorizationBasis)
  authorizationBasis?: AuthorizationBasis;

  @ApiPropertyOptional({ description: 'Permission to inspect screening history', default: true })
  @IsOptional()
  @IsBoolean()
  canAccessScreenings?: boolean;

  @ApiPropertyOptional({ description: 'Permission to coordinate hospital referrals & navigation', default: true })
  @IsOptional()
  @IsBoolean()
  canCoordinateReferrals?: boolean;
}

export class CaregiverResponseDto {
  @ApiProperty({ description: 'Caregiver access record UUID', example: 'c1d2e3f4-5678-90ab-cdef-1234567890ab' })
  id: string;

  @ApiProperty({ description: 'Patient UUID', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  patientId: string;

  @ApiProperty({ description: 'Caregiver full name', example: 'Appala Narasamma' })
  caregiverName: string;

  @ApiProperty({ description: 'Relationship', example: 'SPOUSE' })
  relationship: string;

  @ApiPropertyOptional({ description: 'Contact phone', example: '+91-94401-88422' })
  contactPhone?: string;

  @ApiProperty({ description: 'Authorization Basis', example: 'PATIENT_DELEGATED' })
  authorizationBasis: string;

  @ApiProperty({ description: 'Permission for screening access', example: true })
  canAccessScreenings: boolean;

  @ApiProperty({ description: 'Permission for referral coordination', example: true })
  canCoordinateReferrals: boolean;

  @ApiProperty({ description: 'Whether access is currently active', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Date authorized', example: '2026-10-29T11:00:00.000Z' })
  createdAt: string;
}
