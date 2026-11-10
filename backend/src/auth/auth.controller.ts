import { cookieValue, sendSession, clearSession } from './session-cookies';
import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  LoginDto,
  MfaVerifyDto,
  RefreshTokenDto,
  AuthResponseDto,
  UserProfileDto,
  RegisterUserDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AdminApprovalDto,
} from './dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@ApiTags('Authentication & Multi-Tier Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Authenticate user with username, phone, or professional ID',
    description:
      'Verifies credentials using Argon2id. Checks accountStatus (blocks Pending, Rejected, and Suspended users). Enforces protective lockout after 5 failed attempts.',
  })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful or MFA challenge initiated',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials or account temporarily locked',
  })
  @ApiResponse({
    status: 403,
    description: 'Account pending verification, rejected, or unauthorized for portal',
  })
  async login(
    @Res({passthrough:true}) res: Response,
    @Body() loginDto: LoginDto,
    @Req() req: Request,
  ): Promise<AuthResponseDto> {
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.ip;
    return sendSession(req,res,await this.authService.login(loginDto, ipAddress),loginDto.rememberMe);
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register new healthcare professional account',
    description:
      'Submits an unassigned ASHA/ANM worker request. Privileged accounts and facility assignments require an administrator.',
  })
  @ApiResponse({
    status: 201,
    description: 'Registration submitted successfully in Pending Verification status',
  })
  @ApiResponse({
    status: 400,
    description: 'Password mismatch or invalid fields',
  })
  @ApiResponse({
    status: 403,
    description: 'Public admin signup prohibited',
  })
  @ApiResponse({
    status: 409,
    description: 'Account with this mobile number or ID is already registered',
  })
  async register(
    @Body() registerDto: RegisterUserDto,
  ): Promise<{ success: boolean; message: string; accountStatus: string; userId?: string }> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request password reset token or OTP',
    description:
      'Dispatches password recovery instructions. Employs generic response to prevent account enumeration.',
  })
  @ApiResponse({
    status: 200,
    description: 'Password recovery notification dispatched if account exists',
  })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Public()
  @Post('mfa/setup')
  async setupMfa(@Body() body: {token:string}) {
    if(typeof body.token!=='string' || !/^[a-f0-9]{64}$/i.test(body.token)) throw new BadRequestException('RESET_INVALID');
    return this.authService.setupRecoveryMfa(body.token);
  }
  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset account password with verified token',
    description:
      'Validates single-use reset token and updates password hash via Argon2id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired token',
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Public()
  @Post('mfa/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify multi-factor TOTP challenge code',
    description:
      'Verifies 6-digit TOTP code for Medical Officers and District Administrators to complete session establishment.',
  })
  @ApiResponse({
    status: 200,
    description: 'MFA verified and full access tokens issued',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired verification code',
  })
  async verifyMfa(
    @Res({passthrough:true}) res: Response,
    @Body() mfaVerifyDto: MfaVerifyDto,
    @Req() req: Request,
  ): Promise<AuthResponseDto> {
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.ip;
    return sendSession(req,res,await this.authService.verifyMfa(mfaVerifyDto, ipAddress),req.headers['x-remember-me']==='true');
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Renew access token using rotating refresh token',
    description:
      'Exchanges an active refresh token for a newly signed access token without requiring re-entry of credentials.',
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens successfully refreshed',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token invalid, revoked, or expired',
  })
  async refreshTokens(
    @Req() req: Request,
    @Res({passthrough:true}) res: Response,
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    return sendSession(req,res,await this.authService.refreshTokens({refreshToken:cookieValue(req,'ad_refresh')||refreshTokenDto.refreshToken}),req.headers['x-remember-me']==='true');
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve current authenticated user profile',
    description:
      'Returns active role, facility assignment, and assigned tribal habitations for the authenticated caller.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile loaded successfully',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication required or token expired',
  })
  async getMe(@CurrentUser('id') userId: string): Promise<UserProfileDto> {
    return this.authService.getMe(userId);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Revoke active session and log out',
    description: 'Invalidates server-side session and prevents token reuse.',
  })
  @ApiResponse({
    status: 200,
    description: 'Session terminated successfully',
  })
  async logout(
    @Req() req: Request,
    @Res({passthrough:true}) res: Response,
    @CurrentUser('id') userId: string,
    @Body() body?: { refreshToken?: string },
  ): Promise<{ loggedOut: boolean }> {
    const result=await this.authService.logout(userId,cookieValue(req,'ad_refresh')||body?.refreshToken);clearSession(res);return result;
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Change password for authenticated user',
    description: 'Validates current password and updates to a new Argon2id hashed password.',
  })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() body: { currentPassword?: string; newPassword?: string; confirmPassword?: string },
  ): Promise<{ success: boolean; message: string }> {
    if (!body?.currentPassword || !body?.newPassword || !body?.confirmPassword) {
      throw new BadRequestException('Current password, new password, and confirmation password are required.');
    }
    return this.authService.changePassword(userId, body.currentPassword, body.newPassword, body.confirmPassword);
  }

  // ===========================================================================
  // ADMINISTRATIVE VERIFICATION & APPROVAL CONSOLE ENDPOINTS
  // ===========================================================================

  @Get('admin/registrations')
  @Roles('DISTRICT_ADMIN', 'SUPER_ADMIN', 'admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List user registrations for administrative review',
    description:
      'Accessible only by authorized District Administrators. Returns accounts filtered by status (default: PENDING_VERIFICATION).',
  })
  @ApiResponse({
    status: 200,
    description: 'Registrations retrieved successfully',
    type: [UserProfileDto],
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied: requires District Administrator privileges',
  })
  async getPendingRegistrations(
    @Query('status') status?: string,
  ): Promise<UserProfileDto[]> {
    return this.authService.getPendingRegistrations(status);
  }

  @Patch('admin/registrations/:id/status')
  @Roles('DISTRICT_ADMIN', 'SUPER_ADMIN', 'admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Approve, reject, or suspend a user registration',
    description:
      'Updates accountStatus to APPROVED, REJECTED, or SUSPENDED. Records approving administrator ID and timestamp.',
  })
  @ApiResponse({
    status: 200,
    description: 'Registration status updated successfully',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied: requires District Administrator privileges',
  })
  async updateRegistrationStatus(
    @Param('id') userId: string,
    @Body() approvalDto: AdminApprovalDto,
    @CurrentUser('id') adminId: string,
  ): Promise<UserProfileDto> {
    return this.authService.updateRegistrationStatus(userId, approvalDto, adminId);
  }
}
