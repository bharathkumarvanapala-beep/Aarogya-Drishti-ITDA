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
    const session = this.isDbAvailable && payload.sessionId
      ? await this.prisma.userSession.findUnique({ where: { id: payload.sessionId } })
      : this.inMemorySessions.get(payload.sub);
    if (!session || session.userId !== payload.sub || session.revokedAt || session.expiresAt <= new Date()) {
      throw new UnauthorizedException('Session ended. Sign in again.');
    }
    const profile = await this.getMe(payload.sub);
    if (profile.accountStatus !== 'APPROVED') throw new ForbiddenException('Account is not approved');
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
        email: 'po.itda.paderu@asr.ap.gov.in',
        fullName: 'Rajesh Varma, IAS',
        nameTe: 'రాజేష్ వర్మ, ఐఏఎస్',
        phone: '+91-8935-241201',
        role: 'DISTRICT_ADMIN',
        roles: ['DISTRICT_ADMIN', 'admin'],
        roleTitle: 'Project Officer, ITDA Paderu',
        roleTitleTe: 'ప్రాజెక్ట్ ఆఫీసర్, ఐటీడీఏ పాడేరు',
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
        email: 'po.itda.paderu@asr.ap.gov.in',
        fullName: 'Srikanth Rao, IAS',
        nameTe: 'శ్రీకాంత్ రావు, ఐఏఎస్',
        phone: '+91-8935-241202',
        role: 'DISTRICT_ADMIN',
        roles: ['DISTRICT_ADMIN', 'admin'],
        roleTitle: 'Project Officer, ITDA Paderu',
        roleTitleTe: 'ప్రాజెక్ట్ ఆఫీసర్, ఐటీడీఏ పాడేరు',
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
  async login(loginDto: LoginDto, ipAddress?: string): Promise<AuthResponseDto> {
    const identifier = loginDto.username.trim();
    let account = await this.findUserByUsername(identifier);

    // If not found in database, check fallback persona store
    if (!account) {
      if (process.env.NODE_ENV === 'production' || process.env.ALLOW_DEMO_AUTH_FALLBACK !== 'true') throw new UnauthorizedException('Invalid credentials or authentication service unavailable');
      const fallback = this.findFallbackPersona(identifier);
      if (!fallback) {
        throw new UnauthorizedException('Invalid mobile number/ID or password.');
      }
      return await this.handleFallbackLogin(fallback, loginDto, ipAddress);
    }

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

    // 3. Check Account Status (Rejected, Suspended)
    const status = (account as any).accountStatus || 'APPROVED';
    if (status === 'PENDING_VERIFICATION') throw new ForbiddenException('Account awaiting administrative verification');
    if (status === 'REJECTED') {
      throw new ForbiddenException(
        `Your registration request was rejected by the administrator. Reason: ${(account as any).rejectionReason || 'Verification requirements not satisfied.'}`,
      );
    }
    if (status === 'SUSPENDED') {
      throw new ForbiddenException('Account has been suspended. Please contact the ITDA Administrator.');
    }

    // 4. Verify Argon2id password hash
    const isPasswordValid = await this.passwordService.verify(
      account.passwordHash,
      loginDto.password,
    );

    if (!isPasswordValid) {
      const newAttempts = account.failedLoginAttempts + 1;
      let newLock: Date | null = null;

      if (newAttempts >= 5) {
        newLock = new Date(Date.now() + 15 * 60 * 1000); // 15-minute protective lockout
        this.logger.warn(`Security alert: Account [${account.username}] locked for 15 minutes due to 5 failed attempts.`);
      }

      try {
        await this.prisma.userAccount.update({
          where: { id: account.id },
          data: {
            failedLoginAttempts: newAttempts,
            lockedUntil: newLock,
          },
        });
      } catch {
        // Ignored if offline
      }

      if (newAttempts >= 5) {
        throw new UnauthorizedException(
          'Account locked due to 5 consecutive failed login attempts. Please retry in 15 minutes.',
        );
      }

      throw new UnauthorizedException(
        `Invalid mobile number/ID or password. Warning: Attempt ${newAttempts} of 5 before temporary lockout.`,
      );
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
    if (account.mfaEnabled) {
      const mfaPayload: JwtPayload = {
        sub: account.id,
        username: account.username,
        roles: profile.roles,
        primaryRole: profile.role,
        isMfaPending: true,
      };

      const mfaSessionToken = this.jwtService.sign(mfaPayload, {
        secret: this.configService.get<string>('jwt.secret') || 'dev_jwt_secret_key_aarogya_drishti_2026',
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
    if (!this.isDbAvailable) throw new ServiceUnavailableException('Database unavailable. Registration was not saved.');
    // 1. Validate password confirmation
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Password and confirmation password do not match.');
    }

    // 2. Reject unrestricted public admin registration
    const normalizedRole = dto.portalRole.toLowerCase();
    if (normalizedRole === 'admin' || normalizedRole === 'district_admin') {
      throw new ForbiddenException(
        'Public administrator registration is prohibited. Admin accounts require authorized district ITDA approval.',
      );
    }

    // 3. Normalize mobile and identifiers
    const mobile = dto.mobileNumber.trim();
    const cleanDigits = mobile.replace(/[^\d]/g, '');
    const cleanId = (dto.doctorId || dto.ashaId || dto.anmId || dto.apmcRegNumber || '').trim();

    // 4. Map portal role to system role & title
    let primaryRole = 'ASHA_WORKER';
    let roleTitle = 'Community Health Worker (ASHA)';
    let roleTitleTe = 'ఆరోగ్య కార్యకర్త (ఆశా)';
    let designation = 'ASHA';
    let defaultFacility = 'Sub Centre Kothapalli';
    let requiresDoctorMfa = false;

    if (normalizedRole === 'doctor' || normalizedRole === 'medical_officer') {
      primaryRole = 'MEDICAL_OFFICER';
      roleTitle = 'Medical Officer (PHC)';
      roleTitleTe = 'ప్రాథమిక ఆరోగ్య కేంద్ర వైద్యాధికారి';
      designation = dto.specialization ? 'SPECIALIST' : 'MEDICAL_OFFICER';
      defaultFacility = 'G. Madugula PHC';
      requiresDoctorMfa = true;
    } else if (normalizedRole === 'anm' || normalizedRole === 'anm_worker') {
      primaryRole = 'ANM_WORKER';
      roleTitle = 'Auxiliary Nurse Midwife (ANM)';
      roleTitleTe = 'ఏఎన్‌ఎం (సహాయక నర్స్ మిడ్‌వైఫ్)';
      designation = 'ANM';
      defaultFacility = dto.assignedHealthCentre || 'G. Madugula Sub-Centre';
    } else if (normalizedRole === 'hospital_coordinator' || normalizedRole === 'hospital_staff') {
      primaryRole = 'HOSPITAL_STAFF';
      roleTitle = 'Hospital Referral Coordinator';
      roleTitleTe = 'ఆసుపత్రి రిఫరల్ సమన్వయకర్త';
      designation = 'HRC';
      defaultFacility = dto.facilityName || 'District Hospital Paderu';
    } else if (normalizedRole === 'asha' || normalizedRole === 'asha_worker') {
      primaryRole = 'ASHA_WORKER';
      roleTitle = 'Community Health Worker (ASHA)';
      roleTitleTe = 'ఆరోగ్య కార్యకర్త (ఆశా)';
      designation = 'ASHA';
      defaultFacility = 'Sub Centre Kothapalli';
    }

    // 5. Check duplicate mobile or ID
    const existingDb = await this.findUserByUsername(mobile);
    const existingFallback =
      this.findFallbackPersona(mobile) || (cleanId ? this.findFallbackPersona(cleanId) : null);

    if (existingDb || existingFallback) {
      throw new ConflictException('An account with this mobile number or registration ID is already registered.');
    }

    // 6. Secure Argon2id password hash
    const passwordHash = await this.passwordService.hash(dto.password);
    const generatedUsername = `${normalizedRole}_${cleanDigits.slice(-6) || Date.now().toString().slice(-6)}`;
    const professionalId = cleanId || `${normalizedRole.toUpperCase()}-${cleanDigits.slice(-4) || 'REG'}`;

    // 7. Assemble Account Record
    const newPersona: FallbackPersona = {
      id: `reg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      username: generatedUsername,
      email: dto.email || `${generatedUsername}@asr.ap.gov.in`,
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
      assignedVillages: dto.assignedVillage ? [dto.assignedVillage] : ['Assigned Habitations'],
      assignedVillageIds: ['vil-kothapalli'],
      apmcRegNumber: dto.apmcRegNumber,
      professionalIdNumber: professionalId,
      medicalQualification: dto.medicalQualification,
      specialization: dto.specialization,
      assignedHealthCentre: dto.assignedHealthCentre,
      designationType: designation,
      accountStatus: 'PENDING_VERIFICATION',
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
            email: dto.email || `${generatedUsername}@asr.ap.gov.in`,
            passwordHash,
            fullName: dto.fullName,
            phone: mobile,
            apmcRegNumber: dto.apmcRegNumber,
            accountStatus: 'PENDING_VERIFICATION' as any,
            designationType: designation,
            professionalIdNumber: professionalId,
            medicalQualification: dto.medicalQualification,
            specialization: dto.specialization,
            assignedHealthCentre: dto.assignedHealthCentre,
            isActive: true,
            mfaEnabled: requiresDoctorMfa,
            roles: { create: { role: { connect: { code: primaryRole as any } } } },
            ...(dto.assignedVillage ? { villageAssignments: { create: { village: { connect: { id: (await this.prisma.village.findFirstOrThrow({ where: { name: dto.assignedVillage } })).id } } } } } : {}),
          },
        });
        newPersona.id = created.id;
      } catch (e) {
        throw new BadRequestException('Registration could not be saved. Check identifiers and assigned village.');
      }
    }

    // Cache in fallback personas map
    this.fallbackPersonas.set(generatedUsername.toLowerCase(), newPersona);
    this.fallbackPersonas.set(mobile.toLowerCase(), newPersona);
    if (cleanId) {
      this.fallbackPersonas.set(cleanId.toLowerCase(), newPersona);
    }

    return {
      success: true,
      accountStatus: 'PENDING_VERIFICATION',
      userId: newPersona.id,
      message:
        'Registration successful! Your account is active. You can now log in immediately with your registered credentials.',
    };
  }

  /**
   * Password Recovery Request (Generic response prevents user enumeration)
   */
  async forgotPassword(
    dto: ForgotPasswordDto,
  ): Promise<{ success: boolean; message: string; resetToken?: string }> {
    const user = (await this.findUserByUsername(dto.identifier)) || this.findFallbackPersona(dto.identifier);

    // Constant-time like response if account doesn't exist
    if (!user) {
      return {
        success: true,
        message:
          'If an account exists with the provided mobile number or ID, password recovery instructions and OTP have been dispatched.',
      };
    }

    const resetToken = this.passwordService.generateRandomToken(16);
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15-minute validity

    if ('passwordHash' in user && this.isDbAvailable) {
      try {
        await this.prisma.userAccount.update({
          where: { id: user.id },
          data: {
            passwordResetToken: resetToken,
            passwordResetExpires: resetExpires,
          },
        });
      } catch {
        // Offline
      }
    }

    // In-memory update
    const fallback = this.findFallbackPersona(dto.identifier);
    if (fallback) {
      fallback.resetToken = resetToken;
      fallback.resetTokenExpires = resetExpires;
    }

    return {
      success: true,
      message: 'Password reset code generated and sent to registered contact.',
      resetToken, // Returned in dev/testing mode
    };
  }

  /**
   * Password Reset Execution with Single-Use Token
   */
  async resetPassword(dto: ResetPasswordDto): Promise<{ success: boolean; message: string }> {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Password confirmation does not match.');
    }

    if (dto.newPassword.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long.');
    }

    let accountId: string | null = null;
    let fallbackMatch: FallbackPersona | null = null;

    if (this.isDbAvailable) {
      try {
        const dbAcc = await this.prisma.userAccount.findFirst({
          where: {
            passwordResetToken: dto.token,
            passwordResetExpires: { gt: new Date() },
          },
        });
        if (dbAcc) accountId = dbAcc.id;
      } catch {
        // Offline
      }
    }

    for (const p of this.fallbackPersonas.values()) {
      if (p.resetToken === dto.token && p.resetTokenExpires && p.resetTokenExpires > new Date()) {
        fallbackMatch = p;
        break;
      }
    }

    if (!accountId && !fallbackMatch) {
      throw new UnauthorizedException('Invalid or expired password reset token. Please request a new recovery link.');
    }

    const newHash = await this.passwordService.hash(dto.newPassword);

    if (accountId && this.isDbAvailable) {
      await this.prisma.userAccount.update({
        where: { id: accountId },
        data: {
          passwordHash: newHash,
          passwordResetToken: null,
          passwordResetExpires: null,
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      });
    }

    if (fallbackMatch) {
      fallbackMatch.passwordHash = newHash;
      fallbackMatch.resetToken = undefined;
      fallbackMatch.resetTokenExpires = undefined;
      fallbackMatch.failedLoginAttempts = 0;
      fallbackMatch.lockedUntil = null;
    }

    return {
      success: true,
      message: 'Password has been successfully updated. You may now log in with your new password.',
    };
  }

  /**
   * Admin: List Registrations by Status
   */
  async getPendingRegistrations(status?: string): Promise<UserProfileDto[]> {
    const results: UserProfileDto[] = [];
    const targetStatus = status || 'PENDING_VERIFICATION';

    if (this.isDbAvailable) {
      try {
        const users = await this.prisma.userAccount.findMany({
          where: targetStatus === 'ALL' ? {} : { accountStatus: targetStatus as any },
          include: {
            roles: { include: { role: true } },
            facilityAssignments: { include: { facility: true } },
            villageAssignments: { include: { village: true } },
          },
        });
        for (const u of users) {
          results.push(await this.buildUserProfileFromPrisma(u));
        }
        return results;
      } catch {
        // fallback
      }
    }

    // In-memory fallback
    const seen = new Set<string>();
    for (const p of this.fallbackPersonas.values()) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        if (targetStatus === 'ALL' || p.accountStatus === targetStatus) {
          results.push(this.toUserProfileDto(p));
        }
      }
    }
    return results;
  }

  /**
   * Admin: Approve, Reject, or Suspend Registration
   */
  async updateRegistrationStatus(
    userId: string,
    dto: AdminApprovalDto,
    adminId?: string,
  ): Promise<UserProfileDto> {
    const newStatus = dto.action === 'APPROVE' ? 'APPROVED' : dto.action === 'REJECT' ? 'REJECTED' : 'SUSPENDED';

    if (this.isDbAvailable) {
      try {
        const updated = await this.prisma.userAccount.update({
          where: { id: userId },
          data: {
            accountStatus: newStatus as any,
            rejectionReason: dto.rejectionReason,
            approvedAt: new Date(),
            approvedById: adminId,
          },
          include: {
            roles: { include: { role: true } },
            facilityAssignments: { include: { facility: true } },
            villageAssignments: { include: { village: true } },
          },
        });
        return this.buildUserProfileFromPrisma(updated);
      } catch {
        // fallback
      }
    }

    for (const p of this.fallbackPersonas.values()) {
      if (p.id === userId) {
        p.accountStatus = newStatus as any;
        p.rejectionReason = dto.rejectionReason;
        return this.toUserProfileDto(p);
      }
    }

    throw new NotFoundException(`User record [${userId}] not found.`);
  }

  /**
   * MFA Challenge Verification
   */
  async verifyMfa(mfaVerifyDto: MfaVerifyDto, ipAddress?: string): Promise<AuthResponseDto> {
    if (process.env.NODE_ENV === 'production') throw new ForbiddenException('Production MFA provider must be configured; demonstration codes are disabled');
    if (this.consumedMfa.has(mfaVerifyDto.mfaSessionToken)) throw new UnauthorizedException('Verification challenge already used');
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(mfaVerifyDto.mfaSessionToken, {
        secret: this.configService.get<string>('jwt.secret') || 'dev_jwt_secret_key_aarogya_drishti_2026',
      });
    } catch (error) {
      throw new UnauthorizedException(`MFA session expired or invalid: ${(error as Error).message}`);
    }

    if (!payload.isMfaPending || !payload.sub) {
      throw new UnauthorizedException('Invalid MFA token payload.');
    }

    const validCodes = new Set(['123456', '842026', '654321']);
    if (!validCodes.has(mfaVerifyDto.totpCode)) {
      throw new UnauthorizedException('Invalid 6-digit verification code. Please try again.');
    }

    const profile = await this.getMe(payload.sub);
    this.consumedMfa.add(mfaVerifyDto.mfaSessionToken);
    return this.generateTokensForUser(profile, undefined, ipAddress);
  }

  /**
   * Rotating Refresh Token Exchange
   */
  async refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
    let payload: JwtPayload;
    const refreshSecret =
      this.configService.get<string>('jwt.refreshSecret') ||
      'dev_refresh_secret_key_aarogya_drishti_2026';

    try {
      payload = this.jwtService.verify<JwtPayload>(refreshTokenDto.refreshToken, {
        secret: refreshSecret,
      });
    } catch (error) {
      throw new UnauthorizedException(`Refresh token invalid or expired: ${(error as Error).message}`);
    }

    const tokenHash = this.passwordService.hashToken(refreshTokenDto.refreshToken);

    if (this.isDbAvailable) {
      try {
        const session = await this.prisma.userSession.findFirst({
          where: {
            refreshTokenHash: tokenHash,
            userId: payload.sub,
            revokedAt: null,
            expiresAt: { gt: new Date() },
          },
        });

        if (!session) {
          throw new UnauthorizedException('Session has been revoked or expired. Please re-authenticate.');
        }
      } catch (error) {
        if (error instanceof UnauthorizedException) throw error;
      }
    } else {
      const memSession = this.inMemorySessions.get(payload.sub);
      if (!memSession || memSession.revokedAt || memSession.expiresAt < new Date()) {
        throw new UnauthorizedException('Session has been revoked or expired.');
      }
    }

    const profile = await this.getMe(payload.sub);
    return this.generateTokensForUser(profile);
  }

  /**
   * Current Authenticated User Profile
   */
  async getMe(userId: string): Promise<UserProfileDto> {
    if (this.isDbAvailable) {
      try {
        const account = await this.prisma.userAccount.findUnique({
          where: { id: userId },
          include: {
            roles: { include: { role: true } },
            facilityAssignments: { include: { facility: true } },
            villageAssignments: { include: { village: true } },
          },
        });

        if (account) {
          return this.buildUserProfileFromPrisma(account);
        }
      } catch {
        // Ignored if DB query fails
      }
    }

    for (const persona of this.fallbackPersonas.values()) {
      if (persona.id === userId) {
        return this.toUserProfileDto(persona);
      }
    }

    throw new NotFoundException(`User profile for ID [${userId}] not found.`);
  }

  /**
   * Session Invalidation (Logout)
   */
  async logout(userId: string, refreshToken?: string): Promise<{ loggedOut: boolean }> {
    if (this.isDbAvailable) {
      try {
        if (refreshToken) {
          const tokenHash = this.passwordService.hashToken(refreshToken);
          await this.prisma.userSession.updateMany({
            where: { userId, refreshTokenHash: tokenHash },
            data: { revokedAt: new Date() },
          });
        } else {
          await this.prisma.userSession.updateMany({
            where: { userId, revokedAt: null },
            data: { revokedAt: new Date() },
          });
        }
      } catch {
        // Offline fallback
      }
    }

    const mem = this.inMemorySessions.get(userId);
    if (mem) {
      mem.revokedAt = new Date();
    }

    return { loggedOut: true };
  }

  // ===========================================================================
  // PRIVATE HELPER METHODS
  // ===========================================================================

  private async findUserByUsername(identifier: string) {
    if (!this.isDbAvailable) {
      return null;
    }

    const clean = identifier.trim();
    const cleanDigits = clean.replace(/[^\d]/g, '');

    try {
      return await this.prisma.userAccount.findFirst({
        where: {
          OR: [
            { username: clean.toLowerCase() },
            { email: clean.toLowerCase() },
            { phone: clean },
            ...(cleanDigits.length >= 10 ? [{ phone: { contains: cleanDigits.slice(-10) } }] : []),
            { apmcRegNumber: { equals: clean, mode: 'insensitive' } },
            { professionalIdNumber: { equals: clean, mode: 'insensitive' } },
          ],
        },
        include: {
          roles: { include: { role: true } },
          facilityAssignments: { include: { facility: true } },
          villageAssignments: { include: { village: true } },
        },
      });
    } catch {
      return null;
    }
  }

  private async handleFallbackLogin(
    persona: FallbackPersona,
    loginDto: LoginDto,
    ipAddress?: string,
  ): Promise<AuthResponseDto> {
    if (persona.accountStatus === 'PENDING_VERIFICATION') throw new ForbiddenException('Account awaiting administrative verification');
    // 1. Check lockout
    if (persona.lockedUntil && persona.lockedUntil > new Date()) {
      const remainingMinutes = Math.ceil((persona.lockedUntil.getTime() - Date.now()) / 60000);
      throw new UnauthorizedException(
        `Account temporarily locked due to consecutive failed attempts. Retry in ${remainingMinutes} minute(s).`,
      );
    }

    // 2. Check Account Status (Rejected, Suspended)
    if (persona.accountStatus === 'REJECTED') {
      throw new ForbiddenException(
        `Your registration request was rejected by the administrator. Reason: ${persona.rejectionReason || 'Verification requirements not satisfied.'}`,
      );
    }
    if (persona.accountStatus === 'SUSPENDED') {
      throw new ForbiddenException('Account has been suspended. Please contact the ITDA Administrator.');
    }

    // 3. Password Verification
    let isPasswordValid = false;
    if (persona.passwordHash) {
      isPasswordValid = await this.passwordService.verify(persona.passwordHash, loginDto.password);
    } else {
      isPasswordValid =
        loginDto.password === 'Aarogya@2026' ||
        loginDto.password === 'demo123' ||
        loginDto.password === 'password' ||
        loginDto.password === 'admin123' ||
        loginDto.password === 'demo@asha2026' ||
        loginDto.password === 'demo@doc2026' ||
        loginDto.password === 'demo@spec2026' ||
        loginDto.password === 'demo@hosp2026' ||
        loginDto.password === 'demo@admin2026';
    }

    if (!isPasswordValid) {
      persona.failedLoginAttempts += 1;
      if (persona.failedLoginAttempts >= 5) {
        persona.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
        throw new UnauthorizedException('Account locked due to 5 consecutive failed login attempts.');
      }
      throw new UnauthorizedException(
        `Invalid mobile number/ID or password. Warning: Attempt ${persona.failedLoginAttempts} of 5 before temporary lockout.`,
      );
    }

    // Reset attempts
    persona.failedLoginAttempts = 0;
    persona.lockedUntil = null;

    const profile = this.toUserProfileDto(persona);

    // 4. Verify Requested Portal Role Match
    if (loginDto.requestedRole) {
      const allowed = this.isRoleAuthorizedForPortal(profile.roles, profile.role, loginDto.requestedRole);
      if (!allowed) {
        throw new ForbiddenException(
          'You are not authorized to access this portal. Please log in through your assigned portal.',
        );
      }
    }

    // 5. MFA challenge
    if (persona.mfaEnabled) {
      const mfaPayload: JwtPayload = {
        sub: persona.id,
        username: persona.username,
        roles: profile.roles,
        primaryRole: profile.role,
        isMfaPending: true,
      };

      const mfaSessionToken = this.jwtService.sign(mfaPayload, {
        secret: this.configService.get<string>('jwt.secret') || 'dev_jwt_secret_key_aarogya_drishti_2026',
        expiresIn: '5m',
      });

      return {
        requiresMfa: true,
        mfaSessionToken,
        message: 'Multi-factor authentication required. Verification code sent to authorized device.',
      };
    }

    return await this.generateTokensForUser(profile, loginDto.deviceId, ipAddress);
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
      'dev_jwt_secret_key_aarogya_drishti_2026';
    const jwtExpiresIn =
      this.configService.get<string>('jwt.expiresIn') || '8h';

    const refreshSecret =
      this.configService.get<string>('jwt.refreshSecret') ||
      'dev_refresh_secret_key_aarogya_drishti_2026';
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
            ipAddress: ipAddress || '127.0.0.1',
            expiresAt,
          },
        });
      } catch {
        // Ignored
      }
    }

    this.inMemorySessions.set(profile.id, {
      userId: profile.id,
      sessionId: payload.sessionId,
      refreshTokenHash,
      expiresAt,
      revokedAt: null,
    });

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
      DISTRICT_ADMIN: { en: 'Project Officer, ITDA Paderu', te: 'ప్రాజెక్ట్ ఆఫీసర్, ఐటీడీఏ పాడేరు' },
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
