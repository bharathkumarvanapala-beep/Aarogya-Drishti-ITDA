import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RequestAiAnalysisDto {
  @IsOptional()
  @IsString()
  modelPreference?: string;
}

export class AiResearchResponseDto {
  @IsString()
  id: string;

  @IsString()
  screeningImageId: string;

  @IsBoolean()
  isNonClinicalDemo: boolean;

  /**
   * STRICT SAFETY BOUNDARY: Numerical cancer probabilities are forbidden.
   * This field is permanently and non-negotiably null.
   */
  score: null;

  @IsString()
  categoricalLabel: 'suspicious_example' | 'benign_example' | 'inconclusive_example';

  @IsString()
  modelVersion: string;

  @IsOptional()
  @IsString()
  heatmapStoragePath?: string | null;

  @IsOptional()
  anatomicalLandmarks?: Record<string, any> | null;

  @IsString()
  safetyDisclaimer: string;

  @IsString()
  generatedAt: string;
}
