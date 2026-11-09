import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { OralViewKey } from '@prisma/client';

export class UploadInitDto {
  @IsEnum(OralViewKey)
  @IsNotEmpty()
  viewKey: OralViewKey;

  @IsString()
  @IsNotEmpty()
  originalFilename: string;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @IsNumber()
  fileSizeBytes?: number;
}
