import { Module } from '@nestjs/common';
import { ImageQualityService } from './quality.service';
import { ImageQualityController } from './quality.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ImageQualityController],
  providers: [ImageQualityService],
  exports: [ImageQualityService],
})
export class ImageQualityModule {}
