import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { OralViewKey } from '@prisma/client';

export class ConfirmImageDto {
  @IsEnum(OralViewKey)
  @IsNotEmpty()
  viewKey: OralViewKey;

  @IsString()
  @IsNotEmpty()
  storagePath: string;

  @IsString()
  @IsNotEmpty()
  originalFilename: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsNumber()
  @IsNotEmpty()
  fileSizeBytes: number;

  @IsString()
  @IsNotEmpty()
  sha256Checksum: string;

  @IsOptional()
  @IsString()
  imageBase64?: string;
}
