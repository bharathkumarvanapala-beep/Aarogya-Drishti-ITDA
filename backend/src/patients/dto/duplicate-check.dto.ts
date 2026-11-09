import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, Min, Max, IsEnum, IsOptional } from 'class-validator';
import { Gender } from '@prisma/client';

export class DuplicateCheckDto {
  @ApiProperty({ description: 'Full or partial patient name', example: 'Kondala' })
  @IsNotEmpty({ message: 'Name is required for duplicate check' })
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'Habitation village name or UUID', example: 'Kothapalli' })
  @IsNotEmpty({ message: 'Habitation is required to scope duplicate check' })
  @IsString()
  village: string;

  @ApiPropertyOptional({ description: 'Approximate age in years', example: 46 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(130)
  age?: number;

  @ApiPropertyOptional({ description: 'Gender', enum: Gender, example: Gender.MALE })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}

export class MatchedPatientSummaryDto {
  @ApiProperty({ description: 'Unique Patient ID', example: 'ASR-PAT-2026-0842' })
  uniquePatientId: string;

  @ApiProperty({ description: 'Patient registered name', example: 'Kondala Rao' })
  fullName: string;

  @ApiProperty({ description: 'Registered age', example: 46 })
  age: number;

  @ApiProperty({ description: 'Gender', example: 'MALE' })
  gender: string;

  @ApiProperty({ description: 'Habitation village', example: 'Kothapalli' })
  village: string;

  @ApiPropertyOptional({ description: 'Phone number if recorded', example: '+91-94401-88421' })
  phone?: string;

  @ApiProperty({ description: 'Registration date', example: '2026-10-28T09:15:00.000Z' })
  registeredAt: string;

  @ApiProperty({ description: 'Confidence match reason', example: 'Exact village match with similar name and matching age bracket' })
  matchReason: string;
}

export class DuplicateMatchResultDto {
  @ApiProperty({ description: 'Whether any potential duplicate records were discovered', example: true })
  hasPotentialDuplicate: boolean;

  @ApiProperty({ description: 'List of potential existing candidate profiles', type: [MatchedPatientSummaryDto] })
  matchedPatients: MatchedPatientSummaryDto[];

  @ApiProperty({ description: 'Guidance message for frontline health worker', example: 'Potential existing patient record found in this habitation. Verify identity to prevent duplicate physical cards.' })
  message: string;
}
