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
import { CurrentUser, RequestUser } from '../common/decorators/current-user.decorator';
import { ImagesService } from './images.service';
import {
  UploadInitDto,
  ConfirmImageDto,
  ScreeningImageResponseDto,
  UploadInitResponseDto,
  PresignedUrlResponseDto,
} from './dto';

@ApiTags('Screening Images & Storage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('screenings/:id/images/upload-init')
  @HttpCode(HttpStatus.OK)
  @Roles('ASHA_WORKER', 'COMMUNITY_HEALTH_OFFICER', 'MEDICAL_OFFICER', 'DISTRICT_ADMIN', 'health_worker', 'admin')
  @ApiOperation({
    summary: 'Initialize S3/MinIO Presigned Image Upload',
    description:
      'Validates active informed consent for photography before generating a randomized UUID object key and a 15-minute presigned PUT URL with AES-256 encryption.',
  })
  @ApiResponse({ status: 200, description: 'Presigned upload URL generated successfully', type: UploadInitResponseDto })
  @ApiResponse({ status: 403, description: 'Photography consent missing or withdrawn' })
  async initializeUpload(
    @Param('id') screeningId: string,
    @Body() dto: UploadInitDto,
    @CurrentUser() user: RequestUser,
  ): Promise<UploadInitResponseDto> {
    return this.imagesService.initializeUpload(screeningId, dto, user);
  }

  @Post('screenings/:id/images/confirm')
  @HttpCode(HttpStatus.CREATED)
  @Roles('ASHA_WORKER', 'COMMUNITY_HEALTH_OFFICER', 'MEDICAL_OFFICER', 'DISTRICT_ADMIN', 'health_worker', 'admin')
  @ApiOperation({
    summary: 'Confirm Image Upload & Inspect Binary Signatures',
    description:
      'Performs magic bytes inspection to reject spoofed executables or HTML, records image metadata with SHA-256 checksum, and initiates OpenCV quality evaluation.',
  })
  @ApiResponse({ status: 201, description: 'Image successfully confirmed and persisted', type: ScreeningImageResponseDto })
  @ApiResponse({ status: 400, description: 'Magic bytes inspection failed / spoofed binary' })
  @ApiResponse({ status: 403, description: 'Photography consent missing or withdrawn' })
  async confirmImage(
    @Param('id') screeningId: string,
    @Body() dto: ConfirmImageDto,
    @CurrentUser() user: RequestUser,
  ): Promise<ScreeningImageResponseDto> {
    return this.imagesService.confirmImage(screeningId, dto, user);
  }

  @Get('screenings/:id/images')
  @Roles('ASHA_WORKER', 'COMMUNITY_HEALTH_OFFICER', 'MEDICAL_OFFICER', 'DISTRICT_ADMIN', 'health_worker', 'admin')
  @ApiOperation({
    summary: 'Get All Clinical Images for Screening',
    description: 'Retrieves all 5 oral views with quality assessment verdicts and AI research statuses.',
  })
  @ApiResponse({ status: 200, description: 'Screening images retrieved successfully' })
  async getImagesForScreening(
    @Param('id') screeningId: string,
  ): Promise<ScreeningImageResponseDto[]> {
    return this.imagesService.getImagesForScreening(screeningId);
  }

  @Get('images/:imageId/url')
  @Roles('ASHA_WORKER', 'COMMUNITY_HEALTH_OFFICER', 'MEDICAL_OFFICER', 'DISTRICT_ADMIN', 'health_worker', 'admin')
  @ApiOperation({
    summary: 'Get Short-Lived Presigned GET URL (15-Minute Expiry)',
    description:
      'Issues a secure 15-minute presigned download URL for authorized clinicians to inspect high-resolution oral mucosal images.',
  })
  @ApiResponse({ status: 200, description: 'Presigned download URL generated', type: PresignedUrlResponseDto })
  async getPresignedUrl(
    @Param('imageId') imageId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<PresignedUrlResponseDto> {
    return this.imagesService.getPresignedDownloadUrl(imageId, user);
  }

  @Get('images/:imageId')
  @Roles('ASHA_WORKER', 'COMMUNITY_HEALTH_OFFICER', 'MEDICAL_OFFICER', 'DISTRICT_ADMIN', 'health_worker', 'admin')
  @ApiOperation({
    summary: 'Get Single Image Details',
    description: 'Retrieves image metadata, quality assessment, and AI demonstration status.',
  })
  @ApiResponse({ status: 200, description: 'Image details retrieved', type: ScreeningImageResponseDto })
  async getImageById(
    @Param('imageId') imageId: string,
  ): Promise<ScreeningImageResponseDto> {
    return this.imagesService.getImageById(imageId);
  }
}
