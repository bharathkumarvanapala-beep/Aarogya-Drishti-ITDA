import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

describe('Phase 7: OpenCV Image Quality Service (e2e)', () => {
  let app: INestApplication;
  let ashaToken: string;
  let doctorToken: string;
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

  describe('1. Optical Quality Evaluation & Bilingual Feedback', () => {
    it('should evaluate acceptable oral mucosal image with high sharpness and illumination', async () => {
      const response = await request(app.getHttpServer())
        .post(`/images/${kondalaImageId}/quality-check`)
        .set('Authorization', `Bearer ${ashaToken}`)
        .send({
          filename: 'acceptable_buccal_mucosa.jpg',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.verdict).toBe('ACCEPTABLE');
      expect(response.body.data.sharpnessScore).toBeGreaterThan(100);
      expect(response.body.data.brightnessScore).toBeGreaterThanOrEqual(45);
      expect(response.body.data.resolution).toBe('1920x1440');
      expect(response.body.data.automatedFeedbackEn).toContain('Image quality is acceptable');
      expect(response.body.data.automatedFeedbackTe).toContain('చిత్రం నాణ్యత ఆమోదయోగ్యంగా ఉంది');
    });

    it('should flag blurry image with RECAPTURE_REQUIRED and plain-language bilingual instructions', async () => {
      const response = await request(app.getHttpServer())
        .post('/images/img-test-blurry/quality-check')
        .set('Authorization', `Bearer ${ashaToken}`)
        .send({
          filename: 'shaky_blurry_lesion.jpg',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.verdict).toBe('RECAPTURE_REQUIRED');
      expect(response.body.data.sharpnessScore).toBeLessThan(100);
      expect(response.body.data.automatedFeedbackEn).toContain('blurry');
      expect(response.body.data.automatedFeedbackTe).toContain('మసకగా');
    });

    it('should flag underexposed / dark oral cavity with torch illumination recommendation', async () => {
      const response = await request(app.getHttpServer())
        .post('/images/img-test-dark/quality-check')
        .set('Authorization', `Bearer ${ashaToken}`)
        .send({
          filename: 'dark_dim_floor_of_mouth.jpg',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.verdict).toBe('RECAPTURE_REQUIRED');
      expect(response.body.data.brightnessScore).toBeLessThan(45);
      expect(response.body.data.automatedFeedbackEn).toContain('dark');
      expect(response.body.data.automatedFeedbackTe).toContain('టార్చ్ లైట్');
    });

    it('should flag specular mucosal glare and instruct camera angle adjustment', async () => {
      const response = await request(app.getHttpServer())
        .post('/images/img-test-glare/quality-check')
        .set('Authorization', `Bearer ${ashaToken}`)
        .send({
          filename: 'flash_glare_reflection.jpg',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.verdict).toBe('RECAPTURE_REQUIRED');
      expect(response.body.data.glareScore).toBeGreaterThan(0.08);
      expect(response.body.data.automatedFeedbackEn).toContain('specular glare');
      expect(response.body.data.automatedFeedbackTe).toContain('కాంతి ప్రతిబింబం');
    });
  });

  describe('2. Quality Result Retrieval', () => {
    it('should retrieve existing image quality result for Kondala Rao', async () => {
      const response = await request(app.getHttpServer())
        .get(`/images/${kondalaImageId}/quality`)
        .set('Authorization', `Bearer ${doctorToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.screeningImageId).toBe(kondalaImageId);
      expect(response.body.data.verdict).toBe('ACCEPTABLE');
      expect(response.body.data.resolution).toBe('1920x1440');
    });
  });
});
