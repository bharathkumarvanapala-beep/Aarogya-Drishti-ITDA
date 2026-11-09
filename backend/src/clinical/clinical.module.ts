import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { PatientsModule } from '../patients/patients.module';
import { ClinicalController } from './clinical.controller';
import { ConsentService } from './consent.service';
import { ScreeningService } from './screening.service';

@Module({
  imports: [DatabaseModule, AuthModule, PatientsModule],
  controllers: [ClinicalController],
  providers: [ConsentService, ScreeningService],
  exports: [ConsentService, ScreeningService],
})
export class ClinicalModule {}
