import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsOptional,
  IsBoolean,
  Matches,
} from 'class-validator';
import { Gender } from '@prisma/client';

export class CreatePatientDto {
  @ApiProperty({ description: 'Full legal name of the patient', example: 'Kondala Rao' })
  @IsNotEmpty({ message: 'Patient name is mandatory' })
  @IsString()
  fullName: string;

  @ApiPropertyOptional({ description: 'Name in Telugu script', example: 'కొండల రావు' })
  @IsOptional()
  @IsString()
  fullNameTe?: string;

  @ApiProperty({ description: 'Age in years', example: 46 })
  @IsInt({ message: 'Age must be an integer' })
  @Min(0, { message: 'Age cannot be negative' })
  @Max(130, { message: 'Age must be realistic' })
  age: number;

  @ApiProperty({ description: 'Gender', enum: Gender, example: Gender.MALE })
  @IsEnum(Gender, { message: 'Gender must be MALE, FEMALE, TRANSGENDER, or OTHER' })
  gender: Gender;

  @ApiPropertyOptional({
    description: 'Mobile phone number (explicitly optional for phone-less tribal villagers)',
    example: '+91-94401-88421',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Primary spoken language code', example: 'te' })
  @IsOptional()
  @IsString()
  primarySpokenLanguage?: string;

  @ApiPropertyOptional({ description: 'Whether patient is an indigenous tribal community member', example: true })
  @IsOptional()
  @IsBoolean()
  isTribalMember?: boolean;

  @ApiPropertyOptional({ description: 'Tribal community name', example: 'Konda Dora (PVTG)' })
  @IsOptional()
  @IsString()
  tribeCommunity?: string;

  @ApiProperty({ description: 'Habitation / village UUID or code', example: 'vil-kothapalli' })
  @IsNotEmpty({ message: 'Habitation village is mandatory for doorstep community healthcare' })
  @IsString()
  habitationVillageId: string;

  @ApiPropertyOptional({ description: 'Habitation / village name for display', example: 'Kothapalli' })
  @IsOptional()
  @IsString()
  villageName?: string;

  @ApiPropertyOptional({ description: 'Mandal name', example: 'G. Madugula' })
  @IsOptional()
  @IsString()
  mandal?: string;

  @ApiPropertyOptional({ description: 'Whether patient possesses a smartphone', example: false })
  @IsOptional()
  @IsBoolean()
  hasSmartphone?: boolean;

  @ApiPropertyOptional({ description: 'Whether household is Below Poverty Line (BPL)', example: true })
  @IsOptional()
  @IsBoolean()
  socioEconomicBPL?: boolean;

  @ApiPropertyOptional({ description: 'Dr. YSR Aarogyasri Trust Card Number', example: 'ASR-WAC-2026-08421' })
  @IsOptional()
  @IsString()
  aarogyasriNumber?: string;
}
