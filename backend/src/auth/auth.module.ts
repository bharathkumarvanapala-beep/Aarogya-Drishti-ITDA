import { AccountController } from './account.controller';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PasswordService } from './password.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { FacilityScopeGuard } from './guards/facility-scope.guard';
import { VillageScopeGuard } from './guards/village-scope.guard';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret:
          config.get<string>('jwt.secret') ||
          process.env.JWT_SECRET ||
          process.env.JWT_SECRET!,
        signOptions: {
          expiresIn:
            config.get<string>('jwt.expiresIn') ||
            process.env.JWT_EXPIRES_IN ||
            '15m',
        },
      }),
    }),
  ],
  controllers: [AuthController, AccountController],
  providers: [
    AuthService,
    PasswordService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    FacilityScopeGuard,
    VillageScopeGuard,
  ],
  exports: [
    AuthService,
    PasswordService,
    JwtAuthGuard,
    RolesGuard,
    FacilityScopeGuard,
    VillageScopeGuard,
    JwtModule,
    PassportModule,
  ],
})
export class AuthModule {}
