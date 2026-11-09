import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsOptional, IsString } from 'class-validator';

export enum ReplaceReason {
  LOST = 'REPLACED_LOST',
  DAMAGED = 'REPLACED_DAMAGED',
  MUTILATED = 'REPLACED_DAMAGED',
}

export class ReplaceCardDto {
  @ApiProperty({
    description: 'Operational reason for replacement card issuance',
    enum: ReplaceReason,
    example: ReplaceReason.LOST,
  })
  @IsNotEmpty({ message: 'Replacement reason is mandatory' })
  @IsEnum(ReplaceReason)
  reason: ReplaceReason;

  @ApiPropertyOptional({ description: 'Additional incident notes or remarks', example: 'Patient lost original health card during monsoon transit to Paderu weekly shandy.' })
  @IsOptional()
  @IsString()
  notes?: string;
}
