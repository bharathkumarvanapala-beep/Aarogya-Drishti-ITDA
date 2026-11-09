import { OralViewKey } from '@prisma/client';
import { QualityResultDto } from '../../quality/dto/quality-result.dto';
import { AiResearchResponseDto } from '../../ai-research/dto/ai-research.dto';

export class ScreeningImageResponseDto {
  id: string;
  screeningId: string;
  viewKey: OralViewKey;
  storagePath: string;
  originalFilename: string;
  mimeType: string;
  fileSizeBytes: number;
  sha256Checksum: string;
  uploadedAt: string;
  downloadUrl?: string;
  qualityResult?: QualityResultDto | null;
  aiAnalysis?: AiResearchResponseDto | null;
}

export class UploadInitResponseDto {
  uploadUrl: string;
  objectKey: string;
  headers: Record<string, string>;
  expiresInSeconds: number;
  viewKey: OralViewKey;
}

export class PresignedUrlResponseDto {
  imageId: string;
  downloadUrl: string;
  expiresInSeconds: number;
  viewKey: OralViewKey;
  mimeType: string;
}
