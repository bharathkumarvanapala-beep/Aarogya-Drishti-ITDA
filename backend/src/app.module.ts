import {
  Module,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import configuration, { AppConfig } from './config/configuration';
import { envValidationSchema } from './config/env.validation';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PatientsModule } from './patients/patients.module';
import { ClinicalModule } from './clinical/clinical.module';
import { StorageModule } from './storage/storage.module';
import { ImageQualityModule } from './quality/quality.module';
import { AiResearchModule } from './ai-research/ai-research.module';
import { ImagesModule } from './images/images.module';
import { CareModule } from './care/care.controller';

@Module({
  imports: [
    CareModule,
    // Database Connection & ORM
    DatabaseModule,

    // Global Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: envValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),

    // Rate Limiting Protection
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const throttleConfig = config.get<AppConfig['throttle']>('throttle');
        return [
          {
            ttl: (throttleConfig?.ttl || 60) * 1000,
            limit: throttleConfig?.limit || 120,
          },
        ];
      },
    }),

    // Health & Diagnostic Monitoring
    HealthModule,

    // Authentication & Multi-Tier Authorization
    AuthModule,

    // Patient Demographics & Health Cards
    PatientsModule,

    // Informed Consent & Clinical Screening Intake
    ClinicalModule,

    // Phase 6: Secure Private Image Storage (S3/MinIO)
    StorageModule,

    // Phase 7: OpenCV Image Quality Verification
    ImageQualityModule,

    // Phase 8: AI Research Gateway & Safety Boundaries
    AiResearchModule,

    // Frontline Image Upload & Multi-view Management
    ImagesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
