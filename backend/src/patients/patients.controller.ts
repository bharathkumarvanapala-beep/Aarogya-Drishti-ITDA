import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
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
import { PatientsService } from './patients.service';
import {
  CreatePatientDto,
  DuplicateCheckDto,
  DuplicateMatchResultDto,
  PatientQueryDto,
  PatientListItemDto,
  PatientDetailDto,
  HealthCardDto,
  ReplaceCardDto,
  VerifyQrTokenDto,
  QrTokenVerificationResultDto,
  AuthorizeCaregiverDto,
  CaregiverResponseDto,
} from './dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, RequestUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { VillageScopeGuard } from '../auth/guards/village-scope.guard';

@ApiTags('Patient Management & Physical Health Card')
@Controller()
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post('patients/duplicate-check')
  @HttpCode(HttpStatus.OK)
  @Roles('ASHA_WORKER', 'COMMUNITY_HEALTH_OFFICER', 'MEDICAL_OFFICER', 'DISTRICT_ADMIN', 'health_worker', 'admin')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Fuzzy duplicate patient detection',
    description:
      'Inspects prospective patient name, habitation village, and age bracket against existing directory to prevent duplicate registrations and redundant physical cards.',
  })
  @ApiResponse({
    status: 200,
    description: 'Duplicate assessment results returned',
    type: DuplicateMatchResultDto,
  })
  async checkDuplicate(
    @Body() duplicateCheckDto: DuplicateCheckDto,
  ): Promise<DuplicateMatchResultDto> {
    return this.patientsService.checkDuplicate(duplicateCheckDto);
  }

  @Post('patients')
  @Roles('ASHA_WORKER', 'COMMUNITY_HEALTH_OFFICER', 'MEDICAL_OFFICER', 'DISTRICT_ADMIN', 'health_worker', 'admin')
  @UseGuards(RolesGuard, VillageScopeGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Register new patient without requiring phone or account',
    description:
      'Registers tribal patient, auto-generates Unique Patient ID (ASR-PAT-YYYY-XXXX), and issues initial active physical Health Card with non-sensitive QR token.',
  })
  @ApiResponse({
    status: 201,
    description: 'Patient registered and initial Health Card issued',
    type: PatientDetailDto,
  })
  async registerPatient(
    @Body() createPatientDto: CreatePatientDto,
    @CurrentUser() user: RequestUser,
  ): Promise<PatientDetailDto> {
    return this.patientsService.registerPatient(createPatientDto, user);
  }

  @Get('patients')
  @UseGuards(RolesGuard, VillageScopeGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Paginated patient directory with village scoping',
    description:
      'Lists registered patients. Frontline workers are automatically scoped strictly to their assigned habitations.',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated patient list returned',
    type: [PatientListItemDto],
  })
  async getPatients(
    @Query() query: PatientQueryDto,
    @CurrentUser() user: RequestUser,
  ): Promise<{ items: PatientListItemDto[]; total: number; page: number; limit: number }> {
    return this.patientsService.getPatients(query, user);
  }

  @Get('patients/:id')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve comprehensive patient profile',
    description: 'Fetches patient demographics, active health card, and caregiver authorization.',
  })
  @ApiResponse({
    status: 200,
    description: 'Patient detail record returned',
    type: PatientDetailDto,
  })
  async getPatientById(@Param('id') id: string): Promise<PatientDetailDto> {
    return this.patientsService.getPatientById(id);
  }

  @Get('patients/:id/card')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve physical health card details for printing',
    description: 'Returns card serial, QR token URI, and bilingual cardholder details.',
  })
  @ApiResponse({
    status: 200,
    description: 'Card details returned',
    type: HealthCardDto,
  })
  async getPatientCard(@Param('id') patientId: string): Promise<HealthCardDto> {
    return this.patientsService.getPatientCard(patientId);
  }

  @Post('cards/:cardId/replace')
  @HttpCode(HttpStatus.OK)
  @Roles('ASHA_WORKER', 'COMMUNITY_HEALTH_OFFICER', 'DISTRICT_ADMIN', 'health_worker', 'admin')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Replace lost or damaged physical Health Card',
    description:
      'Invalidates previous card serial, logs immutable replacement audit history, and issues newly minted physical card serial.',
  })
  @ApiResponse({
    status: 200,
    description: 'Card successfully replaced',
    type: HealthCardDto,
  })
  async replaceCard(
    @Param('cardId') cardId: string,
    @Body() replaceCardDto: ReplaceCardDto,
    @CurrentUser() user: RequestUser,
  ): Promise<HealthCardDto> {
    return this.patientsService.replaceCard(cardId, replaceCardDto, user);
  }

  @Public()
  @Post('cards/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cryptographically verify physical Health Card QR reference token',
    description:
      'Public verification endpoint ensuring card authenticity with ZERO Protected Health Information (PHI) disclosed in accordance with DPDP privacy mandates.',
  })
  @ApiResponse({
    status: 200,
    description: 'Card authenticity verified without PHI disclosure',
    type: QrTokenVerificationResultDto,
  })
  async verifyQrToken(
    @Body() verifyDto: VerifyQrTokenDto,
  ): Promise<QrTokenVerificationResultDto> {
    const token = verifyDto?.qrToken || verifyDto?.qrReferenceToken || '';
    return this.patientsService.verifyQrToken(token);
  }

  @Post('patients/:id/caregivers')
  @Roles('ASHA_WORKER', 'COMMUNITY_HEALTH_OFFICER', 'DISTRICT_ADMIN', 'PATIENT', 'health_worker', 'admin')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Authorize family caregiver proxy access',
    description: 'Registers authorized family proxy with documented authorization basis.',
  })
  @ApiResponse({
    status: 201,
    description: 'Caregiver authorized',
    type: CaregiverResponseDto,
  })
  async addCaregiver(
    @Param('id') patientId: string,
    @Body() dto: AuthorizeCaregiverDto,
  ): Promise<CaregiverResponseDto> {
    return this.patientsService.addCaregiver(patientId, dto);
  }

  @Patch('patients/:id/caregivers/:caregiverId/revoke')
  @Roles('ASHA_WORKER', 'COMMUNITY_HEALTH_OFFICER', 'DISTRICT_ADMIN', 'PATIENT', 'health_worker', 'admin')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Revoke family caregiver proxy access',
    description: 'Immediately deactivates caregiver access permissions for the specified patient.',
  })
  @ApiResponse({
    status: 200,
    description: 'Caregiver access revoked',
  })
  async revokeCaregiver(
    @Param('id') patientId: string,
    @Param('caregiverId') caregiverId: string,
  ): Promise<{ revoked: boolean }> {
    return this.patientsService.revokeCaregiver(patientId, caregiverId);
  }

  @Get('patients/:id/caregivers')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List authorized family caregivers for patient',
  })
  @ApiResponse({
    status: 200,
    description: 'Active caregiver list returned',
    type: [CaregiverResponseDto],
  })
  async getCaregivers(
    @Param('id') patientId: string,
  ): Promise<CaregiverResponseDto[]> {
    return this.patientsService.getCaregivers(patientId);
  }
}
