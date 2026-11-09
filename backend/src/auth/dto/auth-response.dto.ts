import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserProfileDto } from './user-profile.dto';

export class AuthResponseDto {
  @ApiProperty({ description: 'Indicates whether multi-factor verification is required before full access', example: false })
  requiresMfa: boolean;

  @ApiPropertyOptional({ description: 'Short-lived single-use MFA session token if requiresMfa is true' })
  mfaSessionToken?: string;

  @ApiPropertyOptional({ description: 'Cryptographic JSON Web Token for API authentication' })
  accessToken?: string;

  @ApiPropertyOptional({ description: 'Refresh token for rotating session renewal' })
  refreshToken?: string;

  @ApiPropertyOptional({ description: 'Token schema type', example: 'Bearer' })
  tokenType?: string;

  @ApiPropertyOptional({ description: 'Token duration string', example: '8h' })
  expiresIn?: string;

  @ApiPropertyOptional({ description: 'Full authenticated user profile details', type: UserProfileDto })
  user?: UserProfileDto;

  @ApiPropertyOptional({ description: 'Descriptive guidance message', example: 'Authentication successful' })
  message?: string;
}
