import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ConsentService } from './consent.service';
import { ScreeningService } from './screening.service';
import {
  CreateConsentDto,
  WithdrawConsentDto,
  ConsentRecordDto,
  CreateScreeningDto,
  ScreeningDetailDto,
} from './dto';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, RequestUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { VillageScopeGuard } from '../auth/guards/village-scope.guard';

@ApiTags('Informed Consent & Clinical Screening Intake')
@Controller()
export class ClinicalController {
  constructor(
    private readonly consentService: ConsentService,
    private readonly screeningService: ScreeningService,
  ) {}

  @Post('consents')
  @Roles('ASHA_WORKER', 'COMMUNITY_HEALTH_OFFICER', 'MEDICAL_OFFICER', 'DISTRICT_ADMIN', 'health_worker', 'admin')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Record bilingual informed consent with purpose scoping',
    description:
      'Records verbal, witnessed thumbprint, or written consent with distinct purpose scopes (oral examination, photography, non-clinical AI demo, and hospital referral).',
  })
  @ApiResponse({
    status: 201,
    description: 'Informed consent successfully recorded',
    type: ConsentRecordDto,
  })
  async recordConsent(
    @Body() dto: CreateConsentDto,
    @CurrentUser() user: RequestUser,
  ): Promise<ConsentRecordDto> {
    return this.consentService.recordConsent(dto, user);
  }

  @Patch('consents/:id/withdraw')
  @HttpCode(HttpStatus.OK)
  @Roles('ASHA_WORKER', 'COMMUNITY_HEALTH_OFFICER', 'MEDICAL_OFFICER', 'DISTRICT_ADMIN', 'health_worker', 'admin')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Withdraw patient informed consent',
    description:
      'Immediately revokes active consent. Enforces strict consent gate to prevent further screenings or photography under this record.',
  })
  @ApiResponse({
    status: 200,
    description: 'Consent withdrawn',
    type: ConsentRecordDto,
  })
  async withdrawConsent(
    @Param('id') consentId: string,
    @Body() dto: WithdrawConsentDto,
  ): Promise<ConsentRecordDto> {
    return this.consentService.withdrawConsent(consentId, dto);
  }

  @Get('consents/patient/:patientId')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve active consent record for patient',
  })
  @ApiResponse({
    status: 200,
    description: 'Active consent returned',
    type: ConsentRecordDto,
  })
  async getActiveConsentForPatient(
    @Param('patientId') patientId: string,
  ): Promise<ConsentRecordDto> {
    return this.consentService.getActiveConsentForPatient(patientId);
  }

  @Get('consents/:id')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve consent record by UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'Consent details returned',
    type: ConsentRecordDto,
  })
  async getConsentById(
    @Param('id') consentId: string,
  ): Promise<ConsentRecordDto> {
    return this.consentService.getConsentById(consentId);
  }

  @Post('screenings')
  @Roles('ASHA_WORKER', 'COMMUNITY_HEALTH_OFFICER', 'MEDICAL_OFFICER', 'DISTRICT_ADMIN', 'health_worker', 'admin')
  @UseGuards(RolesGuard, VillageScopeGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Conduct doorstep clinical oral health screening intake',
    description:
      'Captures tobacco, gutkha, and reverse smoking exposure, trismus measurements, and mucosal symptoms. Strictly gated by active informed consent.',
  })
  @ApiResponse({
    status: 201,
    description: 'Clinical screening session created',
    type: ScreeningDetailDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Strict consent gate failure: consent missing, invalid, or withdrawn',
  })
  async createScreening(
    @Body() dto: CreateScreeningDto,
    @CurrentUser() user: RequestUser,
  ): Promise<ScreeningDetailDto> {
    return this.screeningService.createScreening(dto, user);
  }

  @Get('screenings/:id')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve screening intake session by ID or Screening Number',
  })
  @ApiResponse({
    status: 200,
    description: 'Screening intake details returned',
    type: ScreeningDetailDto,
  })
  async getScreeningById(
    @Param('id') id: string,
  ): Promise<ScreeningDetailDto> {
    return this.screeningService.getScreeningById(id);
  }

  @Get('screenings/patient/:patientId')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve longitudinal screening history for patient',
  })
  @ApiResponse({
    status: 200,
    description: 'Patient screening sessions returned',
    type: [ScreeningDetailDto],
  })
  async getScreeningsForPatient(
    @Param('patientId') patientId: string,
  ): Promise<ScreeningDetailDto[]> {
    return this.screeningService.getScreeningsForPatient(patientId);
  }
}
