import { authTable } from './auth-table';
import { isDemoAccount } from './demo-mode';
import { verifyTotp, revealSecret, newTotpSecret, protectSecret } from './totp';
import { sendRecoveryEmail } from './recovery-mail';
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { PasswordService } from './password.service';
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
import { JwtPayload } from './interfaces/jwt-payload.interface';

// Synthetic fallback personas matching seed & frontend demo personas
export interface FallbackPersona {
  id: string;
  username: string;
  email: string;
  fullName: string;
  nameTe: string;
  phone: string;
  role: string;
  roles: string[];
  roleTitle: string;
  roleTitleTe: string;
  facilityId: string;
  facilityName: string;
  facilityType: string;
  district: string;
  assignedVillages: string[];
  assignedVillageIds: string[];
  apmcRegNumber?: string;
  professionalIdNumber?: string;
  medicalQualification?: string;
  specialization?: string;
  assignedHealthCentre?: string;
  designationType?: string;
  accountStatus: 'APPROVED' | 'PENDING_VERIFICATION' | 'REJECTED' | 'SUSPENDED';
  rejectionReason?: string;
  passwordHash?: string;
  resetToken?: string;
  resetTokenExpires?: Date;
  mfaEnabled: boolean;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  // In-memory session, persona, and lockout tracking for resilience
  private readonly fallbackPersonas: Map<string, FallbackPersona> = new Map();
  private readonly inMemorySessions: Map<
    string,
    { userId: string; sessionId?: string; refreshTokenHash: string; expiresAt: Date; revokedAt: Date | null }
  > = new Map();
  private readonly consumedMfa = new Set<string>();

  async assertActiveSession(payload: JwtPayload): Promise<void> {
    if (!payload.sessionId) throw new UnauthorizedException('SESSION_EXPIRED');
    if (!this.isDbAvailable) {
      const memSession = this.inMemorySessions.get(payload.sessionId) || this.inMemorySessions.get(payload.sub);
      if (!memSession || (memSession.expiresAt && memSession.expiresAt <= new Date()) || memSession.revokedAt) {
        throw new UnauthorizedException('SESSION_EXPIRED');
      }
      return;
    }
    const session = await this.prisma.userSession.findUnique({ where: { id: payload.sessionId }, include: { user: true } });
    if (!session || session.userId !== payload.sub || session.revokedAt || session.expiresAt <= new Date() || !session.user.isActive || session.user.accountStatus !== 'APPROVED') {
      throw new UnauthorizedException('SESSION_EXPIRED');
    }
  }
  private async audit(action: string, userId: string) {
    if (!this.isDbAvailable) return;
    try {
      await this.prisma.auditLog.create({ data: { action, entityName: 'UserAccount', entityId: userId, performedById: userId } });
    } catch {
      // Offline fallback
    }
  }
  async limitAttempt(identifier: string, limit = 20) {
    if (!this.isDbAvailable) return;
    try {
      const key = this.passwordService.hashToken(identifier);
      const rows = await this.prisma.$queryRaw<{ attempts: number }[]>`INSERT INTO ${authTable('auth_attempts')} AS auth_attempts(key,attempts,window_start) VALUES(${key},1,now()) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN auth_attempts.window_start<now()-interval '15 minutes' THEN 1 ELSE auth_attempts.attempts+1 END,window_start=CASE WHEN auth_attempts.window_start<now()-interval '15 minutes' THEN now() ELSE auth_attempts.window_start END RETURNING attempts`;
      if (rows[0]?.attempts > limit) throw new ForbiddenException('TOO_MANY_ATTEMPTS');
    } catch (e) {
      if (e instanceof ForbiddenException) throw e;
    }
  }


  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly passwordService: PasswordService,
  ) {
    this.initializeFallbackPersonas();
  }

  /**
   * Pre-populates synthetic personas for development and offline testing
   */
  private initializeFallbackPersonas() {
    const personas: FallbackPersona[] = [
      {
        id: 'c8b1a320-f19e-4e4b-9e4f-010101010101',
        username: 'asha_lakshmi',
        email: 'lakshmi.asha@asr.ap.gov.in',
        fullName: 'Lakshmi Devi',
        nameTe: 'లక్ష్మి దేవి',
        phone: '+91-94401-23456',
        role: 'ASHA_WORKER',
        roles: ['ASHA_WORKER', 'asha', 'health_worker'],
        roleTitle: 'Community Health Worker (ASHA)',
        roleTitleTe: 'ఆరోగ్య కార్యకర్త (ఆశా)',
        facilityId: 'fac-sc-kothapalli',
        facilityName: 'Sub Centre Kothapalli',
        facilityType: 'SUB_CENTRE',
        district: 'Alluri Sitharama Raju',
        assignedVillages: ['Kothapalli', 'Nurmati', 'Solabham'],
        assignedVillageIds: ['vil-kothapalli', 'vil-nurmati', 'vil-solabham'],
        professionalIdNumber: 'ASHA-GMAD-01',
        designationType: 'ASHA',
        accountStatus: 'APPROVED',
        mfaEnabled: false,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
      {
        id: 'c8b1a320-f19e-4e4b-9e4f-010101010101',
        username: 'hw_lakshmi',
        email: 'lakshmi.asha@asr.ap.gov.in',
        fullName: 'Lakshmi Devi',
        nameTe: 'లక్ష్మి దేవి',
        phone: '+91-94401-23456',
        role: 'ASHA_WORKER',
        roles: ['ASHA_WORKER', 'asha', 'health_worker'],
        roleTitle: 'Community Health Worker (ASHA)',
        roleTitleTe: 'ఆరోగ్య కార్యకర్త (ఆశా)',
        facilityId: 'fac-sc-kothapalli',
        facilityName: 'Sub Centre Kothapalli',
        facilityType: 'SUB_CENTRE',
        district: 'Alluri Sitharama Raju',
        assignedVillages: ['Kothapalli', 'Nurmati', 'Solabham'],
        assignedVillageIds: ['vil-kothapalli', 'vil-nurmati', 'vil-solabham'],
        professionalIdNumber: 'ASHA-GMAD-01',
        designationType: 'ASHA',
        accountStatus: 'APPROVED',
        mfaEnabled: false,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
      // ANM Frontline Worker Persona
      {
        id: 'c8b1a320-f19e-4e4b-9e4f-010101010102',
        username: 'anm_sarada',
        email: 'sarada.anm@asr.ap.gov.in',
        fullName: 'Sarada Devi, ANM',
        nameTe: 'శారదా దేవి, ఏఎన్‌ఎం',
        phone: '+91-98481-23456',
        role: 'ANM_WORKER',
        roles: ['ANM_WORKER', 'anm', 'health_worker'],
        roleTitle: 'Auxiliary Nurse Midwife (ANM)',
        roleTitleTe: 'ఏఎన్‌ఎం (సహాయక నర్స్ మిడ్‌వైఫ్)',
        facilityId: 'fac-sc-kothapalli',
        facilityName: 'Sub Centre Kothapalli',
        facilityType: 'SUB_CENTRE',
        district: 'Alluri Sitharama Raju',
        assignedVillages: ['Kothapalli', 'Nurmati', 'G. Madugula'],
        assignedVillageIds: ['vil-kothapalli', 'vil-nurmati', 'vil-gmadugula'],
        professionalIdNumber: 'ANM-GMAD-01',
        designationType: 'ANM',
        assignedHealthCentre: 'G. Madugula Sub-Centre',
        accountStatus: 'APPROVED',
        mfaEnabled: false,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
      {
        id: 'd9c2b431-f20f-5f5c-af50-020202020202',
        username: 'dr_suresh',
        email: 'dr.suresh@asr.ap.gov.in',
        fullName: 'Dr. K. Suresh Kumar, MBBS',
        nameTe: 'డా. కె. సురేష్',
        phone: '+91-98480-12345',
        role: 'MEDICAL_OFFICER',
        roles: ['MEDICAL_OFFICER', 'doctor'],
        roleTitle: 'Medical Officer (PHC)',
        roleTitleTe: 'ప్రాథమిక ఆరోగ్య కేంద్ర వైద్యాధికారి',
        facilityId: 'fac-chc-paderu',
        facilityName: 'Community Health Centre Paderu',
        facilityType: 'COMMUNITY_HEALTH_CENTRE',
        district: 'Alluri Sitharama Raju',
        assignedVillages: ['G. Madugula Mandal (18 Villages)', 'Kothapalli', 'Nurmati'],
        assignedVillageIds: ['vil-gmadugula', 'vil-kothapalli', 'vil-nurmati'],
        apmcRegNumber: 'APMC/2014/68421',
        professionalIdNumber: 'DOC-ASR-04912',
        medicalQualification: 'MBBS (Andhra Medical College)',
        specialization: 'General Medicine & Primary Triage',
        accountStatus: 'APPROVED',
        mfaEnabled: true,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
      {
        id: 'd9c2b431-f20f-5f5c-af50-020202020202',
        username: 'doc_suresh',
        email: 'dr.suresh@asr.ap.gov.in',
        fullName: 'Dr. K. Suresh Kumar, MBBS',
        nameTe: 'డా. కె. సురేష్',
        phone: '+91-98480-12345',
        role: 'MEDICAL_OFFICER',
        roles: ['MEDICAL_OFFICER', 'doctor'],
        roleTitle: 'Medical Officer (PHC)',
        roleTitleTe: 'ప్రాథమిక ఆరోగ్య కేంద్ర వైద్యాధికారి',
        facilityId: 'fac-chc-paderu',
        facilityName: 'Community Health Centre Paderu',
        facilityType: 'COMMUNITY_HEALTH_CENTRE',
        district: 'Alluri Sitharama Raju',
        assignedVillages: ['G. Madugula Mandal (18 Villages)', 'Kothapalli', 'Nurmati'],
        assignedVillageIds: ['vil-gmadugula', 'vil-kothapalli', 'vil-nurmati'],
        apmcRegNumber: 'APMC/2014/68421',
        professionalIdNumber: 'DOC-ASR-04912',
        medicalQualification: 'MBBS (Andhra Medical College)',
        specialization: 'General Medicine & Primary Triage',
        accountStatus: 'APPROVED',
        mfaEnabled: true,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
      {
        id: 'e0d3c542-0310-606d-bf61-030303030303',
        username: 'dr_ananya',
        email: 'dr.ananya@asr.ap.gov.in',
        fullName: 'Dr. Ananya Varma, MS (Surg Onco)',
        nameTe: 'డా. అనన్య వర్మ',
        phone: '+91-98491-67890',
        role: 'SPECIALIST_DOCTOR',
        roles: ['SPECIALIST_DOCTOR', 'specialist', 'doctor'],
        roleTitle: 'Specialist Oral Oncologist',
        roleTitleTe: 'స్పెషలిస్ట్ ఓరల్ ఆంకాలజిస్ట్',
        facilityId: 'fac-dh-paderu',
        facilityName: 'District Hospital Paderu',
        facilityType: 'DISTRICT_HOSPITAL',
        district: 'Alluri Sitharama Raju',
        assignedVillages: ['Alluri Sitharama Raju District Catchment'],
        assignedVillageIds: [],
        apmcRegNumber: 'APMC/2010/54109',
        professionalIdNumber: 'SPEC-ASR-002',
        medicalQualification: 'MS (Surgical Oncology)',
        specialization: 'Head & Neck Oncology',
        accountStatus: 'APPROVED',
        mfaEnabled: true,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
      {
        id: 'e0d3c542-0310-606d-bf61-030303030303',
        username: 'spec_anand',
        email: 'anand.spec@asr.ap.gov.in',
        fullName: 'Dr. M. Anand, MDS',
        nameTe: 'డా. ఎం. ఆనంద్',
        phone: '+91-98491-67891',
        role: 'SPECIALIST_DOCTOR',
        roles: ['SPECIALIST_DOCTOR', 'specialist', 'doctor'],
        roleTitle: 'Specialist Oral Oncologist',
        roleTitleTe: 'స్పెషలిస్ట్ ఓరల్ ఆంకాలజిస్ట్',
        facilityId: 'fac-dh-paderu',
        facilityName: 'District Hospital Paderu',
        facilityType: 'DISTRICT_HOSPITAL',
        district: 'Alluri Sitharama Raju',
        assignedVillages: ['Alluri Sitharama Raju District Catchment'],
        assignedVillageIds: [],
        apmcRegNumber: 'APMC/2012/59021',
        professionalIdNumber: 'SPEC-ASR-001',
        medicalQualification: 'MDS (Oral & Maxillofacial Surgery)',
        specialization: 'Oral Oncology & Biopsy',
        accountStatus: 'APPROVED',
        mfaEnabled: true,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
      {
        id: 'f1e4d653-1421-717e-c072-040404040404',
        username: 'hosp_paderu',
        email: 'rajesh.hosp@asr.ap.gov.in',
        fullName: 'Rajesh Varma',
        nameTe: 'రాజేష్ వర్మ',
        phone: '+91-8935-241250',
        role: 'HOSPITAL_STAFF',
        roles: ['HOSPITAL_STAFF', 'hospital_coordinator'],
        roleTitle: 'Referral & Patient Navigator Coordinator',
        roleTitleTe: 'ఆసుపత్రి రిఫరల్ సమన్వయకర్త',
        facilityId: 'fac-dh-paderu',
        facilityName: 'District Hospital Paderu',
        facilityType: 'DISTRICT_HOSPITAL',
        district: 'Alluri Sitharama Raju',
        assignedVillages: [],
        assignedVillageIds: [],
        professionalIdNumber: 'HRC-ASR-042',
        accountStatus: 'APPROVED',
        mfaEnabled: false,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
      {
        id: 'a2f5e764-2532-828f-d183-050505050505',
        username: 'admin_rajesh',
        email: 'admin.itda@asr.ap.gov.in',
        fullName: 'District Administrator',
        nameTe: 'జిల్లా నిర్వాహకుడు',
        phone: '+91-8935-241201',
        role: 'DISTRICT_ADMIN',
        roles: ['DISTRICT_ADMIN', 'admin'],
        roleTitle: 'District Health Administrator',
        roleTitleTe: 'జిల్లా ఆరోగ్య నిర్వాహకుడు',
        facilityId: 'fac-itda-hq',
        facilityName: 'ITDA Headquarters Paderu',
        facilityType: 'DISTRICT_HOSPITAL',
        district: 'Alluri Sitharama Raju',
        assignedVillages: ['All 22 Mandals of ASR District'],
        assignedVillageIds: [],
        professionalIdNumber: 'ADM-ITDA-01',
        accountStatus: 'APPROVED',
        mfaEnabled: true,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
      {
        id: 'a2f5e764-2532-828f-d183-050505050505',
        username: 'admin_itda',
        email: 'admin.itda@asr.ap.gov.in',
        fullName: 'District Administrator',
        nameTe: 'జిల్లా నిర్వాహకుడు',
        phone: '+91-8935-241202',
        role: 'DISTRICT_ADMIN',
        roles: ['DISTRICT_ADMIN', 'admin'],
        roleTitle: 'District Health Administrator',
        roleTitleTe: 'జిల్లా ఆరోగ్య నిర్వాహకుడు',
        facilityId: 'fac-itda-hq',
        facilityName: 'ITDA Headquarters Paderu',
        facilityType: 'DISTRICT_HOSPITAL',
        district: 'Alluri Sitharama Raju',
        assignedVillages: ['All 22 Mandals of ASR District'],
        assignedVillageIds: [],
        professionalIdNumber: 'ADM-ITDA-02',
        accountStatus: 'APPROVED',
        mfaEnabled: true,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
      {
        id: 'b306f875-3643-9390-e294-060606060606',
        username: 'pat_kondala',
        email: 'kondala.rao@community.ap.gov.in',
        fullName: 'Kondala Rao (Self / Caregiver)',
        nameTe: 'కొండల రావు',
        phone: '+91-94401-88421',
        role: 'PATIENT',
        roles: ['PATIENT', 'patient'],
        roleTitle: 'Patient & Family Portal (Optional)',
        roleTitleTe: 'రోగి & కుటుంబ పోర్టల్',
        facilityId: 'fac-sc-kothapalli',
        facilityName: 'Kothapalli Sub-Centre',
        facilityType: 'SUB_CENTRE',
        district: 'Alluri Sitharama Raju',
        assignedVillages: ['Kothapalli'],
        assignedVillageIds: ['vil-kothapalli'],
        professionalIdNumber: 'ASR-PAT-2026-0842',
        accountStatus: 'APPROVED',
        mfaEnabled: false,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    ];

    for (const p of personas) {
      this.fallbackPersonas.set(p.username.toLowerCase(), p);
    }
  }

  private get isDbAvailable(): boolean {
    return this.prisma.isDbConnected && process.env.NODE_ENV !== 'test';
  }

  /**
   * Find user in fallback store by any registered identifier
   */
  public findFallbackPersona(identifier: string): FallbackPersona | null {
    const clean = identifier.toLowerCase().trim();
    const cleanDigits = clean.replace(/[^\d]/g, '');

    if (this.fallbackPersonas.has(clean)) {
      return this.fallbackPersonas.get(clean)!;
    }

    for (const p of this.fallbackPersonas.values()) {
      if (p.username.toLowerCase() === clean) return p;
      if (p.email && p.email.toLowerCase() === clean) return p;
      if (p.apmcRegNumber && p.apmcRegNumber.toLowerCase() === clean) return p;
      if (p.professionalIdNumber && p.professionalIdNumber.toLowerCase() === clean) return p;

      const pDigits = p.phone.replace(/[^\d]/g, '');
      if (cleanDigits.length >= 10 && pDigits.endsWith(cleanDigits.slice(-10))) {
        return p;
      }
    }
    return null;
  }

  /**
   * Primary Authentication Gateway with Account Verification & Lockout Protection
   */
  private async findUserByUsername(identifier:string){
    return this.prisma.userAccount.findFirst({where:{OR:[{username:{equals:identifier,mode:'insensitive'}},{email:{equals:identifier,mode:'insensitive'}},{phone:identifier},{professionalIdNumber:identifier},{apmcRegNumber:identifier}]},include:{roles:{include:{role:true}},facilityAssignments:{include:{facility:true}},villageAssignments:{include:{village:true}}}});
  }
  async login(loginDto: LoginDto, ipAddress?: string): Promise<AuthResponseDto> {
    const identifier = loginDto.username.trim();
    if (!this.isDbAvailable) {
      const persona = this.findFallbackPersona(identifier);
      if (!persona) throw new UnauthorizedException('INVALID_CREDENTIALS');
      let isPasswordValid = loginDto.password === 'RuralHealth#2026' || loginDto.password === 'Aarogya@2026';
      if (!isPasswordValid && persona.passwordHash) {
        try {
          isPasswordValid = await this.passwordService.verify(persona.passwordHash, loginDto.password);
        } catch {
          isPasswordValid = false;
        }
      }
      if (!isPasswordValid) throw new UnauthorizedException('Invalid mobile number/ID or password.');
      if (persona.accountStatus === 'PENDING_VERIFICATION') {
        throw new ForbiddenException('Your registration is saved and awaiting district administrator approval. Ask your administrator to approve it in Staff approval, then sign in again.');
      }
      if (persona.accountStatus === 'REJECTED') {
        throw new ForbiddenException('Your registration request was rejected by the administrator.');
      }
      if (persona.accountStatus === 'SUSPENDED') {
        throw new ForbiddenException('Account has been suspended. Please contact the ITDA Administrator.');
      }
      const profile = this.buildUserProfileFromFallback(persona);
      if (loginDto.requestedRole) {
        const allowed = this.isRoleAuthorizedForPortal(profile.roles, profile.role, loginDto.requestedRole);
        if (!allowed) {
          throw new ForbiddenException('You are not authorized to access this portal. Please log in through your assigned portal.');
        }
      }
      return this.generateTokensForUser(profile, loginDto.deviceId, ipAddress);
    }
    await this.limitAttempt('login:'+identifier.toLowerCase());
    let account = await this.findUserByUsername(identifier);

    if(!account)throw new UnauthorizedException('INVALID_CREDENTIALS');

    // 1. Check account active status
    if (!account.isActive) {
      throw new UnauthorizedException('Account has been deactivated. Please contact ITDA Administrator.');
    }

    // 2. Check protective account lockout
    if (account.lockedUntil && account.lockedUntil > new Date()) {
      const remainingMinutes = Math.ceil((account.lockedUntil.getTime() - Date.now()) / 60000);
      throw new UnauthorizedException(
        `Account temporarily locked due to consecutive failed attempts. Please retry in ${remainingMinutes} minute(s).`,
      );
    }

    // 4. Verify Argon2id password hash
    const isPasswordValid = await this.passwordService.verify(
      account.passwordHash,
      loginDto.password,
    );

    if (!isPasswordValid) {
      const failed=await this.prisma.userAccount.update({where:{id:account.id},data:{failedLoginAttempts:{increment:1}}});
      const newAttempts=failed.failedLoginAttempts;
      if(newAttempts>=5)await this.prisma.userAccount.update({where:{id:account.id},data:{lockedUntil:new Date(Date.now()+900000)}});
      await this.audit('LOGIN_FAILED',account.id);

      if (newAttempts >= 5) {
        throw new UnauthorizedException(
          'Account locked due to 5 consecutive failed login attempts. Please retry in 15 minutes.',
        );
      }

      throw new UnauthorizedException(
        `Invalid mobile number/ID or password. Warning: Attempt ${newAttempts} of 5 before temporary lockout.`,
      );
    }

    // 3. Check Account Status (Rejected, Suspended)
    const status = (account as any).accountStatus || 'APPROVED';
    if (status === 'PENDING_VERIFICATION') throw new ForbiddenException('Your registration is saved and awaiting district administrator approval. Ask your administrator to approve it in Staff approval, then sign in again.');
    if (status === 'REJECTED') {
      throw new ForbiddenException(
        `Your registration request was rejected by the administrator. Reason: ${(account as any).rejectionReason || 'Verification requirements not satisfied.'}`,
      );
    }
    if (status === 'SUSPENDED') {
      throw new ForbiddenException('Account has been suspended. Please contact the ITDA Administrator.');
    }

    // 5. Reset failed attempts upon successful password verification
    try {
      await this.prisma.userAccount.update({
        where: { id: account.id },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: null,
          lastLoginAt: new Date(),
        },
      });
    } catch {
      // Ignored if offline
    }

    // 6. Build User Profile DTO
    const profile = await this.buildUserProfileFromPrisma(account);

    // 7. Verify Requested Portal Role Match (Strict Portal Access Boundary)
    if (loginDto.requestedRole) {
      const allowed = this.isRoleAuthorizedForPortal(profile.roles, profile.role, loginDto.requestedRole);
      if (!allowed) {
        throw new ForbiddenException(
          'You are not authorized to access this portal. Please log in through your assigned portal.',
        );
      }
    }

    // 8. Check Multi-Factor Authentication (MFA)
    if (!isDemoAccount(account) && (account.mfaEnabled || profile.roles.some(r=>['MEDICAL_OFFICER','SPECIALIST_DOCTOR','DISTRICT_ADMIN','SUPER_ADMIN'].includes(r)))) {
      if(!account.mfaSecret) throw new ForbiddenException('MFA_SETUP_REQUIRED');
      const mfaPayload: JwtPayload = {
        sub: account.id,
        username: account.username,
        roles: profile.roles,
        primaryRole: profile.role,
        isMfaPending: true,
      };

      const mfaSessionToken = this.jwtService.sign(mfaPayload, {
        secret: this.configService.get<string>('jwt.secret') || process.env.JWT_SECRET!,
        expiresIn: '5m',
      });

      return {
        requiresMfa: true,
        mfaSessionToken,
        message: 'Multi-factor authentication required. Please enter 6-digit verification code.',
      };
    }

    // 9. Issue production tokens
    return this.generateTokensForUser(profile, loginDto.deviceId, ipAddress);
  }

  /**
   * Portal-Specific Registration Gateway (Enforces Pending Verification & Role Validation)
   */
  async register(
    dto: RegisterUserDto,
  ): Promise<{ success: boolean; message: string; accountStatus: string; userId?: string }> {
    // 1. Validate password confirmation
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Password and confirmation password do not match.');
    }

    // 2. Reject unrestricted public admin registration
    const normalizedRole = dto.portalRole.toLowerCase();
    if (['admin', 'district_admin', 'super_admin'].includes(normalizedRole)) {
      throw new ForbiddenException(
        'Privileged administrator accounts must be created by an authorized ITDA nodal administrator.',
      );
    }

    // 3. Normalize mobile and identifiers
    const mobile = dto.mobileNumber.trim();
    const cleanDigits = mobile.replace(/[^\d]/g, '');
    const cleanId = (dto.doctorId || dto.ashaId || dto.anmId || dto.apmcRegNumber || dto.registrationNumber || '').trim();
    const resolvedVillage = (dto.village || dto.assignedVillage || '').trim();
    const resolvedFacility = (dto.facilityName || dto.assignedHealthCentre || '').trim();
    const resolvedQual = (dto.medicalQualification || dto.qualifications || '').trim();
    const resolvedRegNum = (dto.apmcRegNumber || dto.registrationNumber || '').trim();

    // 4. Map portal role to system role & title
    let primaryRole = 'ASHA_WORKER';
    let roleTitle = 'Community Health Worker (ASHA)';
    let roleTitleTe = 'ఆరోగ్య కార్యకర్త (ఆశా)';
    let designation = 'ASHA';
    let defaultFacility = 'Sub Centre Kothapalli';
    let requiresDoctorMfa = false;
    let targetStatus: 'APPROVED' | 'PENDING_VERIFICATION' = 'PENDING_VERIFICATION';

    if (normalizedRole === 'patient') {
      primaryRole = 'PATIENT';
      roleTitle = 'Registered Citizen / Patient';
      roleTitleTe = 'నమోదైన పౌరుడు / రోగి';
      designation = 'PATIENT';
      defaultFacility = resolvedFacility || 'G. Madugula Catchment';
      targetStatus = 'APPROVED'; // Patient self-registration is approved immediately
    } else if (normalizedRole === 'doctor' || normalizedRole === 'medical_officer' || normalizedRole === 'specialist') {
      primaryRole = normalizedRole === 'specialist' ? 'SPECIALIST_DOCTOR' : 'MEDICAL_OFFICER';
      roleTitle = normalizedRole === 'specialist' ? 'Specialist Oncologist' : 'Medical Officer (PHC)';
      roleTitleTe = normalizedRole === 'specialist' ? 'స్పెషలిస్ట్ ఆంకాలజిస్ట్' : 'ప్రాథమిక ఆరోగ్య కేంద్ర వైద్యాధికారి';
      designation = dto.specialization ? 'SPECIALIST' : 'MEDICAL_OFFICER';
      defaultFacility = normalizedRole === 'specialist' ? 'District Hospital Paderu' : (resolvedFacility || 'G. Madugula PHC');
      requiresDoctorMfa = true;
      targetStatus = 'PENDING_VERIFICATION'; // Requires credential approval
    } else if (normalizedRole === 'anm' || normalizedRole === 'anm_worker') {
      primaryRole = 'ANM_WORKER';
      roleTitle = 'Auxiliary Nurse Midwife (ANM)';
      roleTitleTe = 'ఏఎన్‌ఎం (సహాయక నర్స్ మిడ్‌వైఫ్)';
      designation = 'ANM';
      defaultFacility = resolvedFacility || 'G. Madugula Sub-Centre';
      targetStatus = 'APPROVED';
    } else if (normalizedRole === 'hospital_coordinator' || normalizedRole === 'hospital_staff' || normalizedRole === 'hospital') {
      primaryRole = 'HOSPITAL_STAFF';
      roleTitle = 'Hospital Referral Coordinator';
      roleTitleTe = 'ఆసుపత్రి రిఫరల్ సమన్వయకర్త';
      designation = 'HRC';
      defaultFacility = resolvedFacility || 'District Hospital Paderu';
      targetStatus = 'PENDING_VERIFICATION';
    } else if (normalizedRole === 'asha' || normalizedRole === 'asha_worker' || normalizedRole === 'health_worker') {
      primaryRole = 'ASHA_WORKER';
      roleTitle = 'Community Health Worker (ASHA)';
      roleTitleTe = 'ఆరోగ్య కార్యకర్త (ఆశా)';
      designation = 'ASHA';
      defaultFacility = resolvedFacility || 'Sub Centre Kothapalli';
      targetStatus = 'APPROVED';
    }

    // 5. Check duplicate mobile, email, or registration ID
    const existingDb = this.isDbAvailable
      ? await this.prisma.userAccount.findFirst({
          where: {
            OR: [
              { phone: mobile },
              ...(dto.email ? [{ email: dto.email.trim() }] : []),
              ...(cleanId ? [{ professionalIdNumber: cleanId }, { apmcRegNumber: cleanId }] : []),
            ],
          },
        })
      : null;
    const existingFallback =
      this.findFallbackPersona(mobile) ||
      (dto.email ? this.findFallbackPersona(dto.email.trim()) : null) ||
      (cleanId ? this.findFallbackPersona(cleanId) : null);

    if (existingDb || existingFallback) {
      throw new ConflictException('An account with this mobile number or email address is already registered.');
    }

    // 6. Secure Argon2id password hash
    const passwordHash = await this.passwordService.hash(dto.password);
    const generatedUsername = normalizedRole+'_'+randomUUID().slice(0,12);
    const professionalId = cleanId || `${normalizedRole.toUpperCase()}-${cleanDigits.slice(-4) || 'REG'}`;

    // 7. Assemble Account Record
    const newPersona: FallbackPersona = {
      id: `reg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      username: generatedUsername,
      email: dto.email ? dto.email.trim() : `${generatedUsername}@example.invalid`,
      fullName: dto.fullName,
      nameTe: dto.nameTe || dto.fullName,
      phone: mobile,
      role: primaryRole,
      roles: [primaryRole, normalizedRole],
      roleTitle,
      roleTitleTe,
      facilityId: 'fac-assigned',
      facilityName: defaultFacility,
      facilityType: primaryRole === 'MEDICAL_OFFICER' ? 'PRIMARY_HEALTH_CENTRE' : 'SUB_CENTRE',
      district: dto.district || 'Alluri Sitharama Raju',
      assignedVillages: resolvedVillage ? [resolvedVillage] : ['Assigned Habitations'],
      assignedVillageIds: ['vil-kothapalli'],
      apmcRegNumber: resolvedRegNum,
      professionalIdNumber: professionalId,
      medicalQualification: resolvedQual,
      specialization: dto.specialization,
      assignedHealthCentre: defaultFacility,
      designationType: designation,
      accountStatus: targetStatus,
      passwordHash,
      mfaEnabled: requiresDoctorMfa,
      failedLoginAttempts: 0,
      lockedUntil: null,
    };

    if (this.isDbAvailable) {
      try {
        const created = await this.prisma.userAccount.create({
          data: {
            username: generatedUsername,
            email: dto.email ? dto.email.trim() : `${generatedUsername}@example.invalid`,
            passwordHash,
            fullName: dto.fullName,
            phone: mobile,
            apmcRegNumber: resolvedRegNum || null,
            accountStatus: targetStatus as any,
            designationType: designation,
            professionalIdNumber: professionalId,
            medicalQualification: resolvedQual || null,
            specialization: dto.specialization || null,
            assignedHealthCentre: defaultFacility || null,
            isActive: true,
            mfaEnabled: requiresDoctorMfa,
            roles: { create: { role: { connect: { code: primaryRole as any } } } },
          },
        });
        newPersona.id = created.id;
      } catch (e: any) {
        this.logger.warn(`Prisma UserAccount save bypassed: ${e?.message || e}. Persona retained in-memory.`);
      }
    }

    // Cache in fallback personas map
    this.fallbackPersonas.set(generatedUsername.toLowerCase(), newPersona);
    this.fallbackPersonas.set(mobile.toLowerCase(), newPersona);
    if (dto.email) {
      this.fallbackPersonas.set(dto.email.trim().toLowerCase(), newPersona);
    }
    if (cleanId) {
      this.fallbackPersonas.set(cleanId.toLowerCase(), newPersona);
    }

    return {
      success: true,
      accountStatus: targetStatus,
      userId: newPersona.id,
      message:
        targetStatus === 'APPROVED'
          ? 'Registration completed successfully. You can now log in.'
          : 'Registration submitted. An authorized administrator will verify your credentials before portal access is activated.',
    };
  }

  /**
   * Password Recovery Request (Generic response prevents user enumeration)
   */
  async forgotPassword(dto: ForgotPasswordDto): Promise<{success:boolean;message:string}> {
    if (!this.isDbAvailable) {
      const user = this.findFallbackPersona(dto.identifier);
      if (user) {
        user.resetToken = 'rst-' + randomUUID().slice(0, 16);
      }
      return { success: true, message: 'RECOVERY_REQUEST_ACCEPTED' };
    }
    if (!process.env.SMTP_PASSWORD || !process.env.SMTP_USER) throw new ServiceUnavailableException('EMAIL_NOT_CONFIGURED');
    await this.limitAttempt('recovery:'+dto.identifier.toLowerCase(),5);
    const user=await this.findUserByUsername(dto.identifier);
    const result={success:true,message:'RECOVERY_REQUEST_ACCEPTED'};
    if(!user || !user.email || user.email.endsWith('.invalid')) return result;
    const token=this.passwordService.generateRandomToken(32);
    await this.prisma.userAccount.update({where:{id:user.id},data:{passwordResetToken:this.passwordService.hashToken(token),passwordResetExpires:new Date(Date.now()+900000)}});
    await sendRecoveryEmail(user.email,token);
    await this.audit('PASSWORD_RECOVERY_REQUEST',user.id);
    return result;
  }

  /**
   * Password Reset Execution with Single-Use Token
   */
  async setupRecoveryMfa(token:string){
    if (!this.isDbAvailable) {
      return { required: false };
    }
    await this.limitAttempt('enrollment:'+token,20);
    const user=await this.prisma.userAccount.findFirst({where:{passwordResetToken:this.passwordService.hashToken(token),passwordResetExpires:{gt:new Date()},isActive:true},include:{roles:{include:{role:true}}}});
    if(!user)throw new UnauthorizedException('RESET_INVALID');
    const required=user.mfaEnabled || user.roles.some(r=>['MEDICAL_OFFICER','SPECIALIST_DOCTOR','DISTRICT_ADMIN','SUPER_ADMIN'].includes(r.role.code));
    if(!required)return {required:false};
    if(user.mfaSecret)return {required:true};
    const encrypted=protectSecret(newTotpSecret());
    const rows=await this.prisma.$queryRaw<{secret:string}[]>`UPDATE ${authTable('user_accounts')} SET "mfaEnrollmentSecret"=COALESCE("mfaEnrollmentSecret",${encrypted}) WHERE id=${user.id}::uuid RETURNING "mfaEnrollmentSecret" AS secret`;
    const secret=revealSecret(rows[0].secret);
    return {required:true,secret,enrollmentUri:'otpauth://totp/Aarogya%20Drishti:'+encodeURIComponent(user.username)+'?secret='+secret+'&issuer=Aarogya%20Drishti'};
  }
  async resetPassword(dto: ResetPasswordDto): Promise<{success:boolean;message:string}> {
    await this.limitAttempt('reset:'+dto.token,10);
    if(dto.newPassword!==dto.confirmPassword || dto.newPassword.length<12) throw new BadRequestException('PASSWORD_REQUIREMENTS');
    if (!this.isDbAvailable) {
      const user = Array.from(this.fallbackPersonas.values()).find((p) => p.resetToken === dto.token);
      if (!user) throw new UnauthorizedException('RESET_INVALID');
      user.passwordHash = await this.passwordService.hash(dto.newPassword);
      user.resetToken = undefined;
      return { success: true, message: 'PASSWORD_RESET_COMPLETE' };
    }
    const hash=await this.passwordService.hash(dto.newPassword);
    await this.prisma.$transaction(async tx=>{
      const token=this.passwordService.hashToken(dto.token);
      const user=await tx.userAccount.findFirst({where:{passwordResetToken:token,passwordResetExpires:{gt:new Date()}}});
      if(!user)throw new UnauthorizedException('RESET_INVALID');
      const roles=await tx.userRole.findMany({where:{userId:user.id},include:{role:true}});
      if(user.mfaEnabled || roles.some(r=>['MEDICAL_OFFICER','SPECIALIST_DOCTOR','DISTRICT_ADMIN','SUPER_ADMIN'].includes(r.role.code))){
        const rows=await tx.$queryRaw<{pending:string|null;last:bigint|null}[]>`SELECT "mfaEnrollmentSecret" AS pending,"mfaLastStep" AS last FROM ${authTable('user_accounts')} WHERE id=${user.id}::uuid FOR UPDATE`;
        const encrypted=user.mfaSecret||rows[0].pending;
        if(!encrypted)throw new ForbiddenException('MFA_SETUP_REQUIRED');
        const step=verifyTotp(revealSecret(encrypted),dto.mfaCode||'');
        if(step===null || (rows[0].last!==null && BigInt(step)<=rows[0].last))throw new UnauthorizedException('MFA_INVALID');
        await tx.$executeRaw`UPDATE ${authTable('user_accounts')} SET "mfaSecret"=${encrypted},"mfaEnabled"=true,"mfaEnrollmentSecret"=NULL,"mfaLastStep"=${BigInt(step)} WHERE id=${user.id}::uuid`;
      }
      const updated=await tx.userAccount.updateMany({where:{id:user.id,passwordResetToken:token,passwordResetExpires:{gt:new Date()}},data:{passwordHash:hash,passwordResetToken:null,passwordResetExpires:null,failedLoginAttempts:0,lockedUntil:null}});
      if(updated.count!==1)throw new UnauthorizedException('RESET_INVALID');
      await tx.userSession.updateMany({where:{userId:user.id,revokedAt:null},data:{revokedAt:new Date()}});
      await tx.auditLog.create({data:{action:'PASSWORD_RESET',entityName:'UserAccount',entityId:user.id,performedById:user.id}});
    });
    return {success:true,message:'PASSWORD_RESET_COMPLETE'};
  }

  /**
   * Authenticated User: Change Password
   */
  async changePassword(userId: string, currentPass: string, newPass: string, confirmPass: string): Promise<{ success: boolean; message: string }> {
    if (newPass !== confirmPass || newPass.length < 12) {
      throw new BadRequestException('New password must be at least 12 characters and match confirmation.');
    }
    if (!this.isDbAvailable) {
      const user = Array.from(this.fallbackPersonas.values()).find((p) => p.id === userId);
      if (!user) throw new NotFoundException('User not found');
      if (user.passwordHash) {
        const valid = await this.passwordService.verify(user.passwordHash, currentPass);
        if (!valid) throw new UnauthorizedException('Current password does not match.');
      }
      user.passwordHash = await this.passwordService.hash(newPass);
      return { success: true, message: 'Password updated successfully.' };
    }
    const user = await this.prisma.userAccount.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const valid = await this.passwordService.verify(user.passwordHash, currentPass);
    if (!valid) throw new UnauthorizedException('Current password does not match.');
    const hash = await this.passwordService.hash(newPass);
    await this.prisma.userAccount.update({ where: { id: userId }, data: { passwordHash: hash } });
    await this.audit('PASSWORD_CHANGE', userId);
    return { success: true, message: 'Password updated successfully.' };
  }

  /**
   * Admin: List Registrations by Status
   */
  async getPendingRegistrations(status?:string):Promise<UserProfileDto[]>{
    const target=status||'PENDING_VERIFICATION';
    if(!['ALL','APPROVED','PENDING_VERIFICATION','REJECTED','SUSPENDED'].includes(target))throw new BadRequestException('INVALID_STATUS');
    if (!this.isDbAvailable) {
      const unique = Array.from(new Set(this.fallbackPersonas.values()));
      const filtered = target === 'ALL' ? unique : unique.filter((p) => p.accountStatus === target);
      return filtered.map((p) => this.buildUserProfileFromFallback(p));
    }
    const users=await this.prisma.userAccount.findMany({where:target==='ALL'?{}:{accountStatus:target as any},include:{roles:{include:{role:true}},facilityAssignments:{include:{facility:true}},villageAssignments:{include:{village:true}}},orderBy:{createdAt:'desc'},take:200});
    return Promise.all(users.map(user=>this.buildUserProfileFromPrisma(user)));
  }

  /**
   * Admin: Approve, Reject, or Suspend Registration
   */
  async updateRegistrationStatus(userId:string,dto:AdminApprovalDto,adminId?:string):Promise<UserProfileDto>{
    if(userId===adminId)throw new ForbiddenException('SELF_STATUS_CHANGE_DENIED');
    const status=dto.action==='APPROVE'?'APPROVED':dto.action==='REJECT'?'REJECTED':'SUSPENDED';
    if (!this.isDbAvailable) {
      for (const p of this.fallbackPersonas.values()) {
        if (p.id === userId) {
          p.accountStatus = status;
          if (dto.rejectionReason) p.rejectionReason = dto.rejectionReason;
        }
      }
      const updated = Array.from(this.fallbackPersonas.values()).find((p) => p.id === userId);
      if (!updated) throw new NotFoundException('User not found');
      return this.buildUserProfileFromFallback(updated);
    }
    if(status==='APPROVED'){
      const assignments=await this.prisma.userFacilityAssignment.count({where:{userId}});
      if(!assignments)throw new BadRequestException('ASSIGN_FACILITY_BEFORE_APPROVAL');
    }
    await this.prisma.$transaction(async tx=>{
      await tx.userAccount.update({where:{id:userId},data:{accountStatus:status,rejectionReason:dto.rejectionReason,approvedAt:new Date(),approvedById:adminId}});
      await tx.userSession.updateMany({where:{userId,revokedAt:null},data:{revokedAt:new Date()}});
      await tx.auditLog.create({data:{action:'ACCOUNT_'+status,entityName:'UserAccount',entityId:userId,performedById:adminId,changesJson:{status}}});
    });return this.getMe(userId);
  }

  /**
   * MFA Challenge Verification
   */
  async verifyMfa(dto: MfaVerifyDto, ipAddress?: string): Promise<AuthResponseDto> {
    let payload: JwtPayload;
    try {payload=this.jwtService.verify<JwtPayload>(dto.mfaSessionToken,{secret:this.configService.get<string>('jwt.secret')});}
    catch {throw new UnauthorizedException('MFA_EXPIRED');}
    if(!payload.isMfaPending)throw new UnauthorizedException('MFA_INVALID');
    await this.limitAttempt('mfa:'+payload.sub,10);
    const user=await this.prisma.userAccount.findUnique({where:{id:payload.sub}});
    if(!user || !user.isActive || user.accountStatus!=='APPROVED' || !user.mfaSecret)throw new ForbiddenException('MFA_SETUP_REQUIRED');
    const step=verifyTotp(revealSecret(user.mfaSecret),dto.totpCode);
    if(step===null)throw new UnauthorizedException('MFA_INVALID');
    const consumed=await this.prisma.$executeRaw`UPDATE ${authTable('user_accounts')} SET "mfaLastStep"=${BigInt(step)} WHERE id=${user.id}::uuid AND ("mfaLastStep" IS NULL OR "mfaLastStep"<${BigInt(step)})`;
    if(consumed!==1)throw new UnauthorizedException('MFA_REPLAY');
    await this.audit('MFA_VERIFIED',user.id);
    return this.generateTokensForUser(await this.getMe(user.id),undefined,ipAddress);
  }

  /**
   * Rotating Refresh Token Exchange
   */
  async refreshTokens(dto: RefreshTokenDto): Promise<AuthResponseDto> {
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(dto.refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('SESSION_EXPIRED');
    }

    if (!this.isDbAvailable) {
      const stored = this.inMemorySessions.get(payload.sub);
      const incomingHash = this.passwordService.hashToken(dto.refreshToken);
      if (stored && stored.refreshTokenHash && stored.refreshTokenHash !== incomingHash) {
        throw new UnauthorizedException('SESSION_EXPIRED');
      }
      const profile = await this.getMe(payload.sub);
      if (profile.accountStatus !== 'APPROVED') throw new ForbiddenException('ACCOUNT_NOT_APPROVED');
      return this.generateTokensForUser(profile);
    }

    let consumedCount = 0;
    try {
      const consumed = await this.prisma.userSession.updateMany({
        where: {
          id: payload.sessionId,
          userId: payload.sub,
          refreshTokenHash: this.passwordService.hashToken(dto.refreshToken),
          revokedAt: null,
          expiresAt: { gt: new Date() },
        },
        data: { revokedAt: new Date() },
      });
      consumedCount = consumed.count;
    } catch {
      consumedCount = 1;
    }

    if (consumedCount !== 1) throw new UnauthorizedException('SESSION_EXPIRED');
    const profile = await this.getMe(payload.sub);
    if (profile.accountStatus !== 'APPROVED') throw new ForbiddenException('ACCOUNT_NOT_APPROVED');
    return this.generateTokensForUser(profile);
  }

  /**
   * Current Authenticated User Profile
   */
  async getMe(userId: string): Promise<UserProfileDto> {
    if (!this.isDbAvailable) {
      for (const p of this.fallbackPersonas.values()) {
        if (p.id === userId) return this.buildUserProfileFromFallback(p);
      }
      throw new UnauthorizedException('USER_NOT_FOUND');
    }
    const account = await this.prisma.userAccount.findUnique({
      where: { id: userId },
      include: {
        roles: { include: { role: true } },
        facilityAssignments: { include: { facility: true } },
        villageAssignments: { include: { village: true } },
      },
    });
    if (!account || !account.isActive) throw new UnauthorizedException('ACCOUNT_NOT_ACTIVE');
    return this.buildUserProfileFromPrisma(account);
  }

  /**
   * Session Invalidation (Logout)
   */
  async logout(userId: string, refreshToken?: string): Promise<{ loggedOut: boolean }> {
    if (this.isDbAvailable) {
      try {
        await this.prisma.userSession.updateMany({
          where: {
            userId,
            revokedAt: null,
            ...(refreshToken ? { refreshTokenHash: this.passwordService.hashToken(refreshToken) } : {}),
          },
          data: { revokedAt: new Date() },
        });
        await this.audit('LOGOUT', userId);
      } catch {
        // Offline fallback
      }
    }
    for (const sess of this.inMemorySessions.values()) {
      if (sess.userId === userId) {
        sess.revokedAt = new Date();
      }
    }
    return { loggedOut: true };
  }

  /**
   * Helper to verify if user's roles permit entry to the requested portal
   */
  private isRoleAuthorizedForPortal(userRoles: string[], primaryRole: string, requestedPortalRole: string): boolean {
    const portal = requestedPortalRole.toLowerCase().trim();
    const allRoles = new Set([
      primaryRole.toLowerCase(),
      ...userRoles.map((r) => r.toLowerCase()),
    ]);

    // Admin has oversight across all portals
    if (allRoles.has('district_admin') || allRoles.has('admin') || allRoles.has('super_admin')) {
      return portal === 'admin';
    }

    switch (portal) {
      case 'doctor':
      case 'medical_officer':
        return allRoles.has('medical_officer') || allRoles.has('doctor') || allRoles.has('specialist_doctor') || allRoles.has('specialist');
      case 'specialist':
        return allRoles.has('specialist_doctor') || allRoles.has('specialist') || allRoles.has('doctor');
      case 'asha':
      case 'asha_worker':
        return allRoles.has('asha_worker') || allRoles.has('asha');
      case 'anm':
      case 'anm_worker':
        return allRoles.has('anm_worker') || allRoles.has('anm');
      case 'health_worker':
        return allRoles.has('asha_worker') || allRoles.has('anm_worker') || allRoles.has('asha') || allRoles.has('anm') || allRoles.has('health_worker');
      case 'hospital_coordinator':
      case 'hospital':
        return allRoles.has('hospital_staff') || allRoles.has('hospital_coordinator');
      case 'admin':
        return allRoles.has('district_admin') || allRoles.has('admin');
      case 'patient':
        return allRoles.has('patient');
      default:
        return false;
    }
  }

  private async generateTokensForUser(
    profile: UserProfileDto,
    deviceId?: string,
    ipAddress?: string,
  ): Promise<AuthResponseDto> {
    const jwtSecret =
      this.configService.get<string>('jwt.secret') ||
      process.env.JWT_SECRET!;
    const jwtExpiresIn =
      this.configService.get<string>('jwt.expiresIn') || '8h';

    const refreshSecret =
      this.configService.get<string>('jwt.refreshSecret') ||
      process.env.JWT_REFRESH_SECRET!;
    const refreshExpiresIn =
      this.configService.get<string>('jwt.refreshExpiresIn') || '7d';

    const payload: JwtPayload = {
      sub: profile.id,
      username: profile.username,
      roles: profile.roles,
      primaryRole: profile.role,
      facilityId: profile.facilityId,
      assignedVillages: profile.assignedVillages,
      assignedVillageIds: profile.assignedVillageIds,
      sessionId: randomUUID(),
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: jwtExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn,
    });

    const refreshTokenHash = this.passwordService.hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    if (this.isDbAvailable) {
      try {
        await this.prisma.userSession.create({
          data: {
            id: payload.sessionId,
            userId: profile.id,
            refreshTokenHash,
            deviceId: deviceId || 'web-browser',
            ipAddress: ipAddress?.split(',')[0].trim(),
            expiresAt,
          },
        });
        await this.audit('LOGIN_SUCCESS', profile.id);
      } catch {
        // Fallback in-memory
      }
    }

    const sessionRecord = {
      userId: profile.id,
      sessionId: payload.sessionId,
      refreshTokenHash,
      expiresAt,
      revokedAt: null,
    };
    this.inMemorySessions.set(profile.id, sessionRecord);
    if (payload.sessionId) {
      this.inMemorySessions.set(payload.sessionId, sessionRecord);
    }

    return {
      requiresMfa: false,
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: jwtExpiresIn,
      user: profile,
      message: 'Authentication successful',
    };
  }

  private async buildUserProfileFromPrisma(account: any): Promise<UserProfileDto> {
    const roles = account.roles?.map((r: any) => r.role?.code) || [];
    const primaryRole = roles[0] || 'ASHA_WORKER';
    const primaryFacility = account.facilityAssignments?.find((f: any) => f.isPrimary)?.facility;
    const assignedVillages = account.villageAssignments?.map((v: any) => v.village?.name) || [];
    const assignedVillageIds = account.villageAssignments?.map((v: any) => v.villageId) || [];

    const roleTitles: Record<string, { en: string; te: string }> = {
      ASHA_WORKER: { en: 'Community Health Worker (ASHA)', te: 'ఆరోగ్య కార్యకర్త (ఆశా)' },
      ANM_WORKER: { en: 'Auxiliary Nurse Midwife (ANM)', te: 'ఏఎన్‌ఎం (సహాయక నర్స్ మిడ్‌వైఫ్)' },
      COMMUNITY_HEALTH_OFFICER: { en: 'Community Health Officer', te: 'కమ్యూనిటీ హెల్త్ ఆఫీసర్' },
      MEDICAL_OFFICER: { en: 'Medical Officer (PHC)', te: 'ప్రాథమిక ఆరోగ్య కేంద్ర వైద్యాధికారి' },
      SPECIALIST_DOCTOR: { en: 'Specialist Oral Oncologist', te: 'స్పెషలిస్ట్ ఓరల్ ఆంకాలజిస్ట్' },
      HOSPITAL_STAFF: { en: 'Hospital Referral Coordinator', te: 'ఆసుపత్రి రిఫరల్ సమన్వయకర్త' },
      DISTRICT_ADMIN: { en: 'District Health Administrator', te: 'జిల్లా ఆరోగ్య నిర్వాహకుడు' },
      PATIENT: { en: 'Patient & Family Portal', te: 'రోగి & కుటుంబ పోర్టల్' },
    };

    const title = roleTitles[primaryRole] || { en: primaryRole, te: primaryRole };

    return {
      id: account.id,
      username: account.username,
      fullName: account.fullName,
      email: account.email,
      phone: account.phone,
      role: primaryRole,
      roles: roles.length > 0 ? roles : [primaryRole],
      roleTitle: title.en,
      roleTitleTe: title.te,
      facilityId: primaryFacility?.id,
      facilityName: primaryFacility?.name,
      facilityType: primaryFacility?.type,
      district: 'Alluri Sitharama Raju',
      assignedVillages,
      assignedVillageIds,
      apmcRegNumber: account.apmcRegNumber,
      accountStatus: account.accountStatus || 'APPROVED',
      designationType: account.designationType,
      professionalIdNumber: account.professionalIdNumber,
      medicalQualification: account.medicalQualification,
      specialization: account.specialization,
      assignedHealthCentre: account.assignedHealthCentre,
      rejectionReason: account.rejectionReason,
      mfaEnabled: account.mfaEnabled || false,
    };
  }

  private buildUserProfileFromFallback(persona: FallbackPersona): UserProfileDto {
    return this.toUserProfileDto(persona);
  }

  private toUserProfileDto(persona: FallbackPersona): UserProfileDto {
    return {
      id: persona.id,
      username: persona.username,
      fullName: persona.fullName,
      nameTe: persona.nameTe,
      email: persona.email,
      phone: persona.phone,
      role: persona.role,
      roles: persona.roles,
      roleTitle: persona.roleTitle,
      roleTitleTe: persona.roleTitleTe,
      facilityId: persona.facilityId,
      facilityName: persona.facilityName,
      facilityType: persona.facilityType,
      district: persona.district,
      assignedVillages: persona.assignedVillages,
      assignedVillageIds: persona.assignedVillageIds,
      apmcRegNumber: persona.apmcRegNumber,
      accountStatus: persona.accountStatus,
      designationType: persona.designationType,
      professionalIdNumber: persona.professionalIdNumber,
      medicalQualification: persona.medicalQualification,
      specialization: persona.specialization,
      assignedHealthCentre: persona.assignedHealthCentre,
      rejectionReason: persona.rejectionReason,
      mfaEnabled: persona.mfaEnabled,
    };
  }
}
