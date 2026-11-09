import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class MfaVerifyDto {
  @ApiProperty({ description: 'Temporary MFA session token received from initial login', example: 'eyJhbGciOiJIUzI1Ni...' })
  @IsNotEmpty({ message: 'MFA session token is required' })
  @IsString()
  mfaSessionToken: string;

  @ApiProperty({ description: '6-digit TOTP verification code or demo passkey', example: '123456' })
  @IsNotEmpty({ message: 'Verification code is required' })
  @IsString()
  @Length(6, 6, { message: 'Verification code must be exactly 6 digits' })
  totpCode: string;
}
