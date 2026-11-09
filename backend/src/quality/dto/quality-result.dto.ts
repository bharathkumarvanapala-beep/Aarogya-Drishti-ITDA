import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { QualityVerdict } from '@prisma/client';

export class QualityCheckRequestDto {
  @IsOptional()
  @IsString()
  imageBase64?: string;

  @IsOptional()
  @IsString()
  filename?: string;
}

export class QualityResultDto {
  @IsString()
  id: string;

  @IsString()
  screeningImageId: string;

  @IsEnum(QualityVerdict)
  verdict: QualityVerdict;

  @IsNumber()
  sharpnessScore: number;

  @IsNumber()
  brightnessScore: number;

  @IsNumber()
  glareScore: number;

  @IsString()
  resolution: string;

  @IsString()
  automatedFeedbackEn: string;

  @IsString()
  automatedFeedbackTe: string;

  @IsString()
  evaluatedAt: string;
}
