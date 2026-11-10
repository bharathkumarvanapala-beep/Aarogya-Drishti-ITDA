import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'Valid refresh token string', example: 'eyJhbGciOiJIUzI1Ni...' })
  @IsOptional({ message: 'Refresh token is required' })
  @IsString()
  refreshToken: string;
}
