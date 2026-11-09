import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
} from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { Roles } from '../src/common/decorators/roles.decorator';
import { RolesGuard } from '../src/auth/guards/roles.guard';
import { FacilityScopeGuard } from '../src/auth/guards/facility-scope.guard';
import { VillageScopeGuard } from '../src/auth/guards/village-scope.guard';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';

// Test controller to verify multi-tier authorization guards
@Controller('test-guarded')
class TestGuardedController {
  @Get('doctor-only')
  @Roles('MEDICAL_OFFICER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  doctorOnlyRoute() {
    return { accessed: true, clearance: 'DOCTOR_ONLY' };
  }

  @Get('facility/:facilityId')
  @UseGuards(JwtAuthGuard, FacilityScopeGuard)
  facilityScopedRoute(@Param('facilityId') facilityId: string) {
    return { accessed: true, facilityId };
  }

  @Get('village/:village')
  @UseGuards(JwtAuthGuard, VillageScopeGuard)
  villageScopedRoute(@Param('village') village: string) {
    return { accessed: true, village };
  }
}

describe('AuthModule & Multi-Tier Authorization (e2e)', () => {
  let app: INestApplication;
  let ashaToken: string;
  let doctorToken: string;
  let adminToken: string;
  let ashaRefreshToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [TestGuardedController],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Frontline Health Worker Authentication', () => {
    it('POST /auth/login successfully authenticates Lakshmi Devi (ASHA)', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'asha_lakshmi',
          password: 'Aarogya@2026',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.requiresMfa).toBe(false);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
      expect(response.body.data.user.role).toBe('ASHA_WORKER');
      expect(response.body.data.user.assignedVillages).toContain('Kothapalli');

      ashaToken = response.body.data.accessToken;
      ashaRefreshToken = response.body.data.refreshToken;
    });

    it('GET /auth/me returns ASHA profile when provided valid Bearer token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${ashaToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe('asha_lakshmi');
      expect(response.body.data.facilityName).toBe('Sub Centre Kothapalli');
    });

    it('POST /auth/refresh generates a valid renewed access token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: ashaRefreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.accessToken).not.toBe(ashaToken);
    });
  });

  describe('2. Multi-Factor Authentication (MFA) Workflow', () => {
    let mfaSessionToken: string;

    it('POST /auth/login triggers MFA challenge for Medical Officer (Dr. Suresh)', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'dr_suresh',
          password: 'Aarogya@2026',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.requiresMfa).toBe(true);
      expect(response.body.data.mfaSessionToken).toBeDefined();
      expect(response.body.data.accessToken).toBeUndefined();

      mfaSessionToken = response.body.data.mfaSessionToken;
    });

    it('POST /auth/mfa/verify rejects invalid TOTP code with HTTP 401', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/mfa/verify')
        .send({
          mfaSessionToken,
          totpCode: '000000',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Invalid 6-digit verification code');
    });

    it('POST /auth/mfa/verify accepts valid code and issues complete doctor tokens', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/mfa/verify')
        .send({
          mfaSessionToken,
          totpCode: '123456',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.user.role).toBe('MEDICAL_OFFICER');
      expect(response.body.data.user.apmcRegNumber).toBe('APMC/2014/68421');

      doctorToken = response.body.data.accessToken;
    });

    it('Authenticates District Administrator with MFA verification', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'admin_rajesh',
          password: 'Aarogya@2026',
        })
        .expect(200);

      const verifyRes = await request(app.getHttpServer())
        .post('/auth/mfa/verify')
        .send({
          mfaSessionToken: loginRes.body.data.mfaSessionToken,
          totpCode: '123456',
        })
        .expect(200);

      expect(verifyRes.body.data.user.role).toBe('DISTRICT_ADMIN');
      adminToken = verifyRes.body.data.accessToken;
    });
  });

  describe('3. Account Lockout & Security Protection', () => {
    it('Increments failed login attempts and locks account on 5 consecutive failures', async () => {
      const testUsername = 'pat_kondala';

      // 4 failed attempts
      for (let i = 1; i <= 4; i++) {
        const res = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ username: testUsername, password: 'WrongPassword' })
          .expect(401);
        expect(res.body.error.message).toContain(`Attempt ${i} of 5`);
      }

      // 5th failed attempt triggers protective lockout
      const lockRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: testUsername, password: 'WrongPassword' })
        .expect(401);
      expect(lockRes.body.error.message).toContain('Account locked due to 5 consecutive failed login attempts');

      // Subsequent attempt while locked
      const blockedRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: testUsername, password: 'Aarogya@2026' })
        .expect(401);
      expect(blockedRes.body.error.message).toContain('Account temporarily locked');
    });

    it('Rejects unauthorized requests without Bearer token with HTTP 401', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toMatch(/No auth token|Authentication required/);
    });

    it('Rejects requests with malformed Bearer token with HTTP 401', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token-string')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('4. Multi-Tier Authorization Guards', () => {
    it('RolesGuard allows Doctor access to doctor-only endpoint', async () => {
      const response = await request(app.getHttpServer())
        .get('/test-guarded/doctor-only')
        .set('Authorization', `Bearer ${doctorToken}`)
        .expect(200);

      expect(response.body.data.clearance).toBe('DOCTOR_ONLY');
    });

    it('RolesGuard blocks ASHA worker from doctor-only endpoint with HTTP 403 Forbidden', async () => {
      const response = await request(app.getHttpServer())
        .get('/test-guarded/doctor-only')
        .set('Authorization', `Bearer ${ashaToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Access denied: insufficient role privileges');
    });

    it('RolesGuard allows District Admin access to clinical doctor endpoints', async () => {
      const response = await request(app.getHttpServer())
        .get('/test-guarded/doctor-only')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.clearance).toBe('DOCTOR_ONLY');
    });

    it('FacilityScopeGuard allows user access to their own facility', async () => {
      const response = await request(app.getHttpServer())
        .get('/test-guarded/facility/fac-chc-paderu')
        .set('Authorization', `Bearer ${doctorToken}`)
        .expect(200);

      expect(response.body.data.facilityId).toBe('fac-chc-paderu');
    });

    it('FacilityScopeGuard rejects cross-facility access with HTTP 403 Forbidden', async () => {
      const response = await request(app.getHttpServer())
        .get('/test-guarded/facility/fac-different-hospital')
        .set('Authorization', `Bearer ${doctorToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Facility Scoping Violation');
    });

    it('FacilityScopeGuard allows District Admin access across any facility in district', async () => {
      const response = await request(app.getHttpServer())
        .get('/test-guarded/facility/fac-different-hospital')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.facilityId).toBe('fac-different-hospital');
    });

    it('VillageScopeGuard allows frontline ASHA worker access to assigned habitation', async () => {
      const response = await request(app.getHttpServer())
        .get('/test-guarded/village/Kothapalli')
        .set('Authorization', `Bearer ${ashaToken}`)
        .expect(200);

      expect(response.body.data.village).toBe('Kothapalli');
    });

    it('VillageScopeGuard rejects frontline ASHA worker access to unassigned habitation with HTTP 403', async () => {
      const response = await request(app.getHttpServer())
        .get('/test-guarded/village/UnassignedRemoteVillage')
        .set('Authorization', `Bearer ${ashaToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Village Scoping Violation');
    });

    it('VillageScopeGuard allows Doctor and Admin oversight across any village in catchment', async () => {
      const response = await request(app.getHttpServer())
        .get('/test-guarded/village/UnassignedRemoteVillage')
        .set('Authorization', `Bearer ${doctorToken}`)
        .expect(200);

      expect(response.body.data.village).toBe('UnassignedRemoteVillage');
    });
  });

  describe('5. Session Termination (Logout)', () => {
    it('POST /auth/logout terminates session', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${ashaToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.loggedOut).toBe(true);
    });
  });
});
