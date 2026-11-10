import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class LoginDto {
  @IsOptional() @IsBoolean() rememberMe?: boolean;
  @ApiProperty({ description: 'System username or email', example: 'asha_lakshmi' })
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  @MaxLength(64)
  username: string;

  @ApiProperty({ description: 'Account password', example: 'Aarogya@2026' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;

  @ApiPropertyOptional({ description: 'Requested portal role persona for multi-role accounts', example: 'health_worker' })
  @IsOptional()
  @IsString()
  requestedRole?: string;

  @ApiPropertyOptional({ description: 'Client physical device identifier for tablet binding', example: 'dev-tab-0842-asr' })
  @IsOptional()
  @IsString()
  deviceId?: string;
}
