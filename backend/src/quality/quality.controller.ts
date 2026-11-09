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
import { ImageQualityService } from './quality.service';
import { QualityResultDto, QualityCheckRequestDto } from './dto/quality-result.dto';

@ApiTags('Image Quality')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('images')
export class ImageQualityController {
  constructor(private readonly qualityService: ImageQualityService) {}

  @Post(':imageId/quality-check')
  @HttpCode(HttpStatus.OK)
  @Roles('ASHA_WORKER', 'COMMUNITY_HEALTH_OFFICER', 'MEDICAL_OFFICER', 'DISTRICT_ADMIN', 'health_worker', 'admin')
  @ApiOperation({
    summary: 'Evaluate Frontline Oral Mucosal Image Quality',
    description:
      'Runs Laplacian blur variance, lighting histogram checks, and specular glare detection. Returns bilingual plain-language feedback (Telugu & English).',
  })
  @ApiResponse({ status: 200, description: 'Image quality evaluation completed', type: QualityResultDto })
  async evaluateImageQuality(
    @Param('imageId') imageId: string,
    @Body() dto: QualityCheckRequestDto,
  ): Promise<QualityResultDto> {
    return this.qualityService.assessQuality(imageId, dto);
  }

  @Get(':imageId/quality')
  @Roles('ASHA_WORKER', 'COMMUNITY_HEALTH_OFFICER', 'MEDICAL_OFFICER', 'DISTRICT_ADMIN', 'health_worker', 'admin')
  @ApiOperation({
    summary: 'Get Quality Result for Image',
    description: 'Retrieves existing image quality verdict and metric scores.',
  })
  @ApiResponse({ status: 200, description: 'Image quality result retrieved', type: QualityResultDto })
  async getQualityResult(
    @Param('imageId') imageId: string,
  ): Promise<QualityResultDto> {
    return this.qualityService.getQualityResultByImageId(imageId);
  }
}
