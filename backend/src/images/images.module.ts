import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { DatabaseModule } from '../database/database.module';
import { StorageModule } from '../storage/storage.module';
import { ClinicalModule } from '../clinical/clinical.module';
import { ImageQualityModule } from '../quality/quality.module';
import { AiResearchModule } from '../ai-research/ai-research.module';

@Module({
  imports: [
    DatabaseModule,
    StorageModule,
    ClinicalModule,
    ImageQualityModule,
    AiResearchModule,
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
