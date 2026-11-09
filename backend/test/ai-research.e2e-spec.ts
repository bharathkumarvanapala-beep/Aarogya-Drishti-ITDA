import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { AiResearchService } from '../src/ai-research/ai-research.service';

describe('Phase 8: AI Research Gateway & Safety Boundaries (e2e)', () => {
  let app: INestApplication;
  let ashaToken: string;
  let doctorToken: string;
  let aiResearchService: AiResearchService;
  const kondalaImageId = 'img-0101-8420-rc';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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

    aiResearchService = app.get(AiResearchService);

    // 1. Authenticate ASHA
    const ashaRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'asha_lakshmi', password: 'Aarogya@2026' });
    ashaToken = ashaRes.body.data.accessToken;

    // 2. Authenticate Doctor with MFA
    const docLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'dr_suresh', password: 'Aarogya@2026' });
    const docVerify = await request(app.getHttpServer())
      .post('/auth/mfa/verify')
      .send({
        mfaSessionToken: docLogin.body.data.mfaSessionToken,
        totpCode: '123456',
      });
    doctorToken = docVerify.body.data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Non-Clinical AI Research Demonstration & Safety Boundaries', () => {
    it('should generate non-clinical demonstration with categorical label and mandatory disclaimer', async () => {
      const response = await request(app.getHttpServer())
        .post(`/images/${kondalaImageId}/ai-demo`)
        .set('Authorization', `Bearer ${doctorToken}`)
        .send({})
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.isNonClinicalDemo).toBe(true);
      expect(response.body.data.categoricalLabel).toBe('suspicious_example');
      expect(response.body.data.safetyDisclaimer).toContain('STRICTLY NON-CLINICAL');
      expect(response.body.data.safetyDisclaimer).toContain('Not for diagnosis or patient treatment decisions');
    });

    it('STRICT SAFETY BOUNDARY: payload must strictly enforce score: null (no numerical cancer probability)', async () => {
      const response = await request(app.getHttpServer())
        .post(`/images/${kondalaImageId}/ai-demo`)
        .set('Authorization', `Bearer ${doctorToken}`)
        .send({
          score: 0.95,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      // STRICT NON-NEGOTIABLE RULE: score must be explicitly null
      expect(response.body.data.score).toBeNull();
      expect(typeof response.body.data.score).not.toBe('number');
    });

    it('should retrieve existing AI research demo record with score: null', async () => {
      const response = await request(app.getHttpServer())
        .get(`/images/${kondalaImageId}/ai-demo`)
        .set('Authorization', `Bearer ${doctorToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.screeningImageId).toBe(kondalaImageId);
      expect(response.body.data.score).toBeNull();
      expect(response.body.data.isNonClinicalDemo).toBe(true);
      expect(response.body.data.modelVersion).toBe('BioMed-Oral-Demo-v1.4');
    });
  });

  describe('2. Graceful Fallback & HTTP 503 Offline Resilience', () => {
    it('should return 503 when AI service is offline without crashing or blocking clinical care', async () => {
      // Toggle AI service offline
      aiResearchService.setAiServiceEnabled(false);

      const aiResponse = await request(app.getHttpServer())
        .post(`/images/${kondalaImageId}/ai-demo`)
        .set('Authorization', `Bearer ${doctorToken}`)
        .send({})
        .expect(503);

      expect(aiResponse.body.success).toBe(false);
      expect(aiResponse.body.error.message).toContain('AI Research Demonstration service is currently offline');
      expect(aiResponse.body.error.message).toContain('Frontline screening and clinical care workflows remain fully functional');

      // CRITICAL VERIFICATION: Frontline screening and patient intake remain 100% operational
      const healthRes = await request(app.getHttpServer())
        .get('/health/liveness')
        .expect(200);
      expect(healthRes.body.data.status).toBe('ok');

      const patRes = await request(app.getHttpServer())
        .get('/patients')
        .set('Authorization', `Bearer ${ashaToken}`)
        .expect(200);
      expect(patRes.body.success).toBe(true);

      // Re-enable AI service for subsequent tests
      aiResearchService.setAiServiceEnabled(true);
    });
  });
});
