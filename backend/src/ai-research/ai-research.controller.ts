import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AiResearchService } from './ai-research.service';
import { AiResearchResponseDto, RequestAiAnalysisDto } from './dto/ai-research.dto';

@ApiTags('AI Research Demonstration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class AiResearchController {
  constructor(private readonly aiResearchService: AiResearchService) {}

  @Post('images/:imageId/ai-demo')
  @HttpCode(HttpStatus.OK)
  @Roles('ASHA_WORKER', 'COMMUNITY_HEALTH_OFFICER', 'MEDICAL_OFFICER', 'DISTRICT_ADMIN', 'health_worker', 'admin')
  @ApiOperation({
    summary: 'Request Non-Clinical AI Research Demonstration Analysis',
    description:
      'Performs experimental machine learning evaluation for research and academic demonstration only. STRICT SAFETY BOUNDARY: numerical scores are strictly forbidden (score: null enforced).',
  })
  @ApiResponse({ status: 200, description: 'AI research demonstration generated', type: AiResearchResponseDto })
  @ApiResponse({ status: 403, description: 'Non-clinical AI research consent missing or withdrawn' })
  @ApiResponse({ status: 503, description: 'AI demonstration service offline (clinical workflows unblocked)' })
  async requestAiDemo(
    @Param('imageId') imageId: string,
    @Body() dto: RequestAiAnalysisDto,
  ): Promise<AiResearchResponseDto> {
    return this.aiResearchService.runDemonstrationAnalysis(imageId);
  }

  @Get('images/:imageId/ai-demo')
  @Roles('ASHA_WORKER', 'COMMUNITY_HEALTH_OFFICER', 'MEDICAL_OFFICER', 'DISTRICT_ADMIN', 'health_worker', 'admin')
  @ApiOperation({
    summary: 'Get AI Research Demo for Image',
    description: 'Retrieves existing non-clinical AI analysis with mandatory safety disclaimer.',
  })
  @ApiResponse({ status: 200, description: 'AI research demo retrieved', type: AiResearchResponseDto })
  async getAiDemo(
    @Param('imageId') imageId: string,
  ): Promise<AiResearchResponseDto> {
    return this.aiResearchService.getAnalysisByImageId(imageId);
  }
}
