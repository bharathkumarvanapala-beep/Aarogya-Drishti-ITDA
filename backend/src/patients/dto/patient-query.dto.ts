import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PatientQueryDto {
  @ApiPropertyOptional({ description: 'Page number (1-indexed)', default: 1, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of records per page', default: 20, example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Fuzzy search by patient name, ID, or phone', example: 'Kondala' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by habitation village name or UUID', example: 'Kothapalli' })
  @IsOptional()
  @IsString()
  village?: string;

  @ApiPropertyOptional({ description: 'Filter by mandal name or code', example: 'PADERU' })
  @IsOptional()
  @IsString()
  mandal?: string;

  @ApiPropertyOptional({ description: 'Filter by gender', example: 'MALE' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ description: 'Filter by clinical risk category (NORMAL, SUSPICIOUS, REFERRAL_ACTIVE)', example: 'SUSPICIOUS' })
  @IsOptional()
  @IsString()
  status?: string;
}
