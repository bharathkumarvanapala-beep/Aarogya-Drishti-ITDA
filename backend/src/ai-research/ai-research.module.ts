import { Module } from '@nestjs/common';
import { AiResearchService } from './ai-research.service';
import { AiResearchController } from './ai-research.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AiResearchController],
  providers: [AiResearchService],
  exports: [AiResearchService],
})
export class AiResearchModule {}
