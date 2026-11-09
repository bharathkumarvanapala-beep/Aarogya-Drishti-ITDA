import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { RequestUser } from '../../common/decorators/current-user.decorator';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService, private readonly auth: AuthService) {
    const jwtSecret =
      configService.get<string>('jwt.secret') ||
      process.env.JWT_SECRET ||
      'dev_jwt_secret_key_aarogya_drishti_2026';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<RequestUser> {
    if (payload.isMfaPending) {
      throw new UnauthorizedException(
        'Multi-factor authentication challenge incomplete. Please verify OTP first.',
      );
    }

    if (!payload.sub || !payload.username) {
      throw new UnauthorizedException('Invalid or malformed authentication token.');
    }

    await this.auth.assertActiveSession(payload);
    return {
      id: payload.sub,
      username: payload.username,
      role: payload.primaryRole || (payload.roles && payload.roles[0]) || 'GUEST',
      facilityId: payload.facilityId,
      assignedVillages: payload.assignedVillages || [],
      assignedVillageIds: payload.assignedVillageIds || [],
    };
  }
}
