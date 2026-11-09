import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { OralViewKey } from '@prisma/client';

describe('Phase 6: Secure Private Image Storage (S3/MinIO) (e2e)', () => {
  let app: INestApplication;
  let ashaToken: string;
  let doctorToken: string;
  let kondalaScreeningId = 'scr-0101-8420';
  let createdScreeningId: string;
  let withdrawConsentId: string;
  let withdrawScreeningId: string;

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

    // 1. Authenticate as ASHA Lakshmi Devi
    const ashaRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'asha_lakshmi', password: 'Aarogya@2026' });
    ashaToken = ashaRes.body.data.accessToken;

    // 2. Authenticate as Dr. K. Suresh (Medical Officer with MFA)
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

    // 3. Register patient and record consent to create a fresh screening
    const patRes = await request(app.getHttpServer())
      .post('/patients')
      .set('Authorization', `Bearer ${ashaToken}`)
      .send({
        fullName: 'Babu Rao Somula',
        age: 52,
        gender: 'MALE',
        habitationVillageId: 'vil-kothapalli',
        villageName: 'Kothapalli',
        mandal: 'G. Madugula',
        isTribalMember: true,
      });
    const patientId = patRes.body.data.uniquePatientId;

    const conRes = await request(app.getHttpServer())
      .post('/consents')
      .set('Authorization', `Bearer ${ashaToken}`)
      .send({
        patientId,
        type: 'VERBAL_RECORDED',
        languageCode: 'te',
        purposeOralExam: true,
        purposePhotography: true,
        purposeNonClinicalDemo: true,
        purposeHospitalReferral: true,
      });
    const consentId = conRes.body.data.id;

    const scrRes = await request(app.getHttpServer())
      .post('/screenings')
      .set('Authorization', `Bearer ${ashaToken}`)
      .send({
        patientId,
        consentId,
        tobaccoChewing: true,
        symptomsUlcerLongDuration: true,
        frontlineRiskImpression: 'HIGH',
      });
    createdScreeningId = scrRes.body.data.id;

    // 4. Create another patient with photography consent refused
    const patNoPhoto = await request(app.getHttpServer())
      .post('/patients')
      .set('Authorization', `Bearer ${ashaToken}`)
      .send({
        fullName: 'Devi Pangi',
        age: 40,
        gender: 'FEMALE',
        habitationVillageId: 'vil-kothapalli',
        villageName: 'Kothapalli',
        mandal: 'G. Madugula',
        isTribalMember: true,
      });
    const conNoPhoto = await request(app.getHttpServer())
      .post('/consents')
      .set('Authorization', `Bearer ${ashaToken}`)
      .send({
        patientId: patNoPhoto.body.data.uniquePatientId,
        type: 'VERBAL_RECORDED',
        languageCode: 'te',
        purposeOralExam: true,
        purposePhotography: false, // Refused photography consent
        purposeNonClinicalDemo: false,
        purposeHospitalReferral: true,
      });
    withdrawConsentId = conNoPhoto.body.data.id;

    const scrNoPhoto = await request(app.getHttpServer())
      .post('/screenings')
      .set('Authorization', `Bearer ${ashaToken}`)
      .send({
        patientId: patNoPhoto.body.data.uniquePatientId,
        consentId: withdrawConsentId,
        frontlineRiskImpression: 'LOW',
      });
    withdrawScreeningId = scrNoPhoto.body.data.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Presigned Upload URL Generation', () => {
    it('should generate S3 presigned upload URL with AES-256 encryption headers and 15m expiry', async () => {
      const response = await request(app.getHttpServer())
        .post(`/screenings/${kondalaScreeningId}/images/upload-init`)
        .set('Authorization', `Bearer ${ashaToken}`)
        .send({
          viewKey: OralViewKey.RIGHT_CHEEK,
          originalFilename: 'oral_ulcer_highres.jpg',
          mimeType: 'image/jpeg',
          fileSizeBytes: 2450000,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.uploadUrl).toBeDefined();
      expect(response.body.data.objectKey).toContain('screenings/scr-0101-8420/right_cheek_');
      expect(response.body.data.expiresInSeconds).toBe(900);
      expect(response.body.data.headers['x-amz-server-side-encryption']).toBe('AES256');
    });

    it('should block upload init if patient refused or withdrew photography consent (403 Forbidden)', async () => {
      const response = await request(app.getHttpServer())
        .post(`/screenings/${withdrawScreeningId}/images/upload-init`)
        .set('Authorization', `Bearer ${ashaToken}`)
        .send({
          viewKey: OralViewKey.TONGUE,
          originalFilename: 'tongue.jpg',
        })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('photography consent is not active');
    });
  });

  describe('2. Binary File Signature Inspection (Magic Bytes)', () => {
    it('should accept and confirm valid JPEG binary image (0xFF 0xD8 0xFF)', async () => {
      const jpegHeader = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
      const base64Jpeg = jpegHeader.toString('base64');

      const response = await request(app.getHttpServer())
        .post(`/screenings/${kondalaScreeningId}/images/confirm`)
        .set('Authorization', `Bearer ${ashaToken}`)
        .send({
          viewKey: OralViewKey.RIGHT_CHEEK,
          storagePath: 'screenings/scr-0101-8420/right_cheek_valid.jpg',
          originalFilename: 'right_cheek_valid.jpg',
          mimeType: 'image/jpeg',
          fileSizeBytes: jpegHeader.length,
          sha256Checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          imageBase64: base64Jpeg,
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.viewKey).toBe('RIGHT_CHEEK');
      expect(response.body.data.storagePath).toContain('right_cheek_valid.jpg');
    });

    it('should reject Windows PE/MZ executable binary disguised as JPEG (400 Bad Request)', async () => {
      const exeHeader = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00]);
      const base64Exe = exeHeader.toString('base64');

      const response = await request(app.getHttpServer())
        .post(`/screenings/${kondalaScreeningId}/images/confirm`)
        .set('Authorization', `Bearer ${ashaToken}`)
        .send({
          viewKey: OralViewKey.LEFT_CHEEK,
          storagePath: 'screenings/scr-0101-8420/malicious_payload.jpg',
          originalFilename: 'payload.exe',
          mimeType: 'image/jpeg',
          fileSizeBytes: exeHeader.length,
          sha256Checksum: 'fake-checksum',
          imageBase64: base64Exe,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Windows executable (PE/MZ) binary detected');
    });

    it('should reject HTML/script payload disguised as image (400 Bad Request)', async () => {
      const scriptHeader = Buffer.from('<script>alert("XSS")</script>');
      const base64Script = scriptHeader.toString('base64');

      const response = await request(app.getHttpServer())
        .post(`/screenings/${kondalaScreeningId}/images/confirm`)
        .set('Authorization', `Bearer ${ashaToken}`)
        .send({
          viewKey: OralViewKey.TONGUE,
          storagePath: 'screenings/scr-0101-8420/script.jpg',
          originalFilename: 'xss.jpg',
          mimeType: 'image/jpeg',
          fileSizeBytes: scriptHeader.length,
          sha256Checksum: 'fake-checksum-2',
          imageBase64: base64Script,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Script or HTML payload spoofed as image');
    });
  });

  describe('3. Short-Lived Presigned GET URLs & Image Retrieval', () => {
    it('should issue 15-minute presigned GET URL for authenticated clinician', async () => {
      const response = await request(app.getHttpServer())
        .get('/images/img-0101-8420-rc/url')
        .set('Authorization', `Bearer ${doctorToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.downloadUrl).toBeDefined();
      expect(response.body.data.expiresInSeconds).toBe(900);
      expect(response.body.data.viewKey).toBe('RIGHT_CHEEK');
    });

    it('should reject unauthenticated request for presigned GET URL (401 Unauthorized)', async () => {
      await request(app.getHttpServer())
        .get('/images/img-0101-8420-rc/url')
        .expect(401);
    });

    it('should retrieve all 5 oral mucosal views for Kondala Rao', async () => {
      const response = await request(app.getHttpServer())
        .get(`/screenings/${kondalaScreeningId}/images`)
        .set('Authorization', `Bearer ${doctorToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(5);

      const viewKeys = response.body.data.map((img: any) => img.viewKey);
      expect(viewKeys).toContain('RIGHT_CHEEK');
      expect(viewKeys).toContain('LEFT_CHEEK');
      expect(viewKeys).toContain('TONGUE');
      expect(viewKeys).toContain('PALATE');
      expect(viewKeys).toContain('GUMS_FLOOR');
    });
  });
});
