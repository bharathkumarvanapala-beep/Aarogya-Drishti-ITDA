import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

describe('ClinicalModule: Informed Consent & Screening Intake (e2e)', () => {
  let app: INestApplication;
  let ashaToken: string;
  let patientUniqueId: string;
  let activeConsentId: string;

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

    // Authenticate as Frontline Health Worker
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'asha_lakshmi',
        password: 'Aarogya@2026',
      });
    ashaToken = loginRes.body.data.accessToken;

    // Register a test tribal patient
    const patRes = await request(app.getHttpServer())
      .post('/patients')
      .set('Authorization', `Bearer ${ashaToken}`)
      .send({
        fullName: 'Chitti Babu',
        age: 48,
        gender: 'MALE',
        habitationVillageId: 'vil-kothapalli',
        villageName: 'Kothapalli',
        mandal: 'G. Madugula',
        isTribalMember: true,
      });
    patientUniqueId = patRes.body.data.uniquePatientId;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Bilingual Informed Consent Capture', () => {
    it('POST /consents records bilingual verbal consent with all 4 purpose scopes', async () => {
      const response = await request(app.getHttpServer())
        .post('/consents')
        .set('Authorization', `Bearer ${ashaToken}`)
        .send({
          patientId: patientUniqueId,
          type: 'VERBAL_RECORDED',
          languageCode: 'te',
          witnessName: 'Chitti Somamma',
          witnessRelation: 'SPOUSE',
          purposeOralExam: true,
          purposePhotography: true,
          purposeNonClinicalDemo: true,
          purposeHospitalReferral: true,
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.patientId).toBe(patientUniqueId);
      expect(response.body.data.status).toBe('ACTIVE');
      expect(response.body.data.purposeOralExam).toBe(true);
      expect(response.body.data.purposePhotography).toBe(true);
      expect(response.body.data.purposeNonClinicalDemo).toBe(true);
      expect(response.body.data.purposeHospitalReferral).toBe(true);
      expect(response.body.data.languageCode).toBe('te');

      activeConsentId = response.body.data.id;
    });

    it('GET /consents/patient/:patientId retrieves active consent record', async () => {
      const response = await request(app.getHttpServer())
        .get(`/consents/patient/${patientUniqueId}`)
        .set('Authorization', `Bearer ${ashaToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(activeConsentId);
      expect(response.body.data.status).toBe('ACTIVE');
    });
  });

  describe('2. Strict Consent Gating for Clinical Screening', () => {
    it('POST /screenings blocks intake when invalid/non-existent consent is provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/screenings')
        .set('Authorization', `Bearer ${ashaToken}`)
        .send({
          patientId: patientUniqueId,
          consentId: 'invalid-non-existent-consent-id',
          tobaccoChewing: true,
          village: 'Kothapalli',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Specified consent record [invalid-non-existent-consent-id] does not exist');
    });
  });

  describe('3. Clinical Screening Intake (Habits & Cardinal Signs)', () => {
    let createdScreeningNo: string;

    it('POST /screenings successfully captures habit assessment & mucosal symptoms under active consent', async () => {
      const response = await request(app.getHttpServer())
        .post('/screenings')
        .set('Authorization', `Bearer ${ashaToken}`)
        .send({
          patientId: patientUniqueId,
          consentId: activeConsentId,
          village: 'Kothapalli',
          // High-risk exposure habits in ASR tribal agency
          tobaccoChewing: true,
          tobaccoYears: 18,
          gutkhaUse: true,
          reverseSmoking: true,
          alcoholConsumption: false,
          // Cardinal symptoms
          symptomsPain: true,
          symptomsBurning: true,
          symptomsUlcerLongDuration: true,
          symptomsWhiteRedPatch: true,
          trismusFingerCount: 2,
          trismusMouthOpeningMm: 26.0,
          frontlineRiskImpression: 'HIGH',
          clinicalNotes: 'Indurated ulcer on right lateral border of tongue with leukoplakia. Severe trismus (2 fingers).',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.screeningNumber).toMatch(/^ASR-SCR-\d{4}-\d{4}$/);
      expect(response.body.data.reverseSmoking).toBe(true);
      expect(response.body.data.trismusFingerCount).toBe(2);
      expect(response.body.data.frontlineRiskImpression).toBe('HIGH');
      expect(response.body.data.schemaVersion).toBe('v1.2-ASR-CLINICAL');

      createdScreeningNo = response.body.data.screeningNumber;
    });

    it('GET /screenings/:id retrieves screening record by Screening Number', async () => {
      const response = await request(app.getHttpServer())
        .get(`/screenings/${createdScreeningNo}`)
        .set('Authorization', `Bearer ${ashaToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.screeningNumber).toBe(createdScreeningNo);
      expect(response.body.data.reverseSmoking).toBe(true);
      expect(response.body.data.patientName).toBe('Chitti Babu');
    });

    it('GET /screenings/patient/:patientId retrieves longitudinal screening history', async () => {
      const response = await request(app.getHttpServer())
        .get(`/screenings/patient/${patientUniqueId}`)
        .set('Authorization', `Bearer ${ashaToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
      expect(response.body.data[0].screeningNumber).toBe(createdScreeningNo);
    });
  });

  describe('4. Informed Consent Withdrawal Enforcement', () => {
    it('PATCH /consents/:id/withdraw marks consent as WITHDRAWN', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/consents/${activeConsentId}/withdraw`)
        .set('Authorization', `Bearer ${ashaToken}`)
        .send({
          withdrawalReason: 'Patient withdrew permission for clinical follow-up',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('WITHDRAWN');
      expect(response.body.data.withdrawalReason).toBe('Patient withdrew permission for clinical follow-up');
    });

    it('POST /screenings blocks new intake after consent has been withdrawn', async () => {
      const response = await request(app.getHttpServer())
        .post('/screenings')
        .set('Authorization', `Bearer ${ashaToken}`)
        .send({
          patientId: patientUniqueId,
          consentId: activeConsentId,
          village: 'Kothapalli',
          tobaccoChewing: true,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Consent Gate Block: Consent record');
      expect(response.body.error.message).toContain('is WITHDRAWN');
    });
  });
});
