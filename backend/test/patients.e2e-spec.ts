import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

describe('PatientsModule & Physical Health Cards (e2e)', () => {
  let app: INestApplication;
  let ashaToken: string;

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

    // Authenticate as Frontline Health Worker (ASHA Lakshmi Devi)
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'asha_lakshmi',
        password: 'Aarogya@2026',
      });

    ashaToken = loginRes.body.data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Fuzzy Duplicate Patient Detection', () => {
    it('POST /patients/duplicate-check identifies potential existing patient in habitation', async () => {
      const response = await request(app.getHttpServer())
        .post('/patients/duplicate-check')
        .set('Authorization', `Bearer ${ashaToken}`)
        .send({
          fullName: 'Kondala',
          village: 'Kothapalli',
          age: 46,
          gender: 'MALE',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.hasPotentialDuplicate).toBe(true);
      expect(response.body.data.matchedPatients.length).toBeGreaterThan(0);
      expect(response.body.data.matchedPatients[0].uniquePatientId).toBe('ASR-PAT-2026-0842');
      expect(response.body.data.matchedPatients[0].fullName).toBe('Kondala Rao');
    });

    it('POST /patients/duplicate-check reports zero duplicates for a new villager', async () => {
      const response = await request(app.getHttpServer())
        .post('/patients/duplicate-check')
        .set('Authorization', `Bearer ${ashaToken}`)
        .send({
          fullName: 'Unique New Villager Name',
          village: 'Kothapalli',
          age: 28,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.hasPotentialDuplicate).toBe(false);
      expect(response.body.data.matchedPatients).toHaveLength(0);
    });
  });

  describe('2. Phone-less Patient Registration & Health Card Issuance', () => {
    let createdPatientId: string;
    let createdUniquePatientId: string;
    let createdCardSerial: string;

    it('POST /patients registers tribal patient without requiring phone or user account', async () => {
      const response = await request(app.getHttpServer())
        .post('/patients')
        .set('Authorization', `Bearer ${ashaToken}`)
        .send({
          fullName: 'Gangi Reddy',
          fullNameTe: 'గంగి రెడ్డి',
          age: 52,
          gender: 'MALE',
          habitationVillageId: 'vil-kothapalli',
          villageName: 'Kothapalli',
          mandal: 'G. Madugula',
          isTribalMember: true,
          tribeCommunity: 'Bagata',
          socioEconomicBPL: true,
          // Explicitly zero phone number provided
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.fullName).toBe('Gangi Reddy');
      expect(response.body.data.phone).toBeUndefined();
      expect(response.body.data.uniquePatientId).toMatch(/^ASR-PAT-\d{4}-\d{4}$/);
      expect(response.body.data.activeCard).toBeDefined();
      expect(response.body.data.activeCard.cardSerial).toMatch(/^ASR-CRD-8420-\d+$/);
      expect(response.body.data.activeCard.qrReferenceToken).toContain('AAROGYA-DRISHTI://CARD-REF/');

      createdPatientId = response.body.data.id;
      createdUniquePatientId = response.body.data.uniquePatientId;
      createdCardSerial = response.body.data.activeCard.cardSerial;
    });

    it('GET /patients retrieves paginated directory scoped to ASHA assigned habitations', async () => {
      const response = await request(app.getHttpServer())
        .get('/patients')
        .set('Authorization', `Bearer ${ashaToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.meta.total).toBeGreaterThanOrEqual(2);
    });

    it('GET /patients?search=Kondala filters by patient query', async () => {
      const response = await request(app.getHttpServer())
        .get('/patients?search=Kondala')
        .set('Authorization', `Bearer ${ashaToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].fullName).toBe('Kondala Rao');
      expect(response.body.data[0].uniquePatientId).toBe('ASR-PAT-2026-0842');
    });

    it('GET /patients/:id retrieves detailed demographic & card profile by Unique ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/patients/${createdUniquePatientId}`)
        .set('Authorization', `Bearer ${ashaToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.uniquePatientId).toBe(createdUniquePatientId);
      expect(response.body.data.fullName).toBe('Gangi Reddy');
      expect(response.body.data.activeCard.cardSerial).toBe(createdCardSerial);
    });
  });

  describe('3. Physical Health Card & Non-Sensitive QR Verification', () => {
    it('GET /patients/:id/card returns printable physical health card format', async () => {
      const response = await request(app.getHttpServer())
        .get('/patients/ASR-PAT-2026-0842/card')
        .set('Authorization', `Bearer ${ashaToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.cardSerial).toBe('ASR-CRD-8420-91');
      expect(response.body.data.patientName).toBe('Kondala Rao');
      expect(response.body.data.qrReferenceToken).toBe(
        'AAROGYA-DRISHTI://CARD-REF/ASR-PAT-2026-0842/EMERGENCY-VERIFY',
      );
      expect(response.body.data.status).toBe('ACTIVE');
    });

    it('POST /cards/verify (Public) verifies card QR token with ZERO Protected Health Information (PHI)', async () => {
      // Notice: No Authorization header passed (Publicly scannable physical card QR)
      const response = await request(app.getHttpServer())
        .post('/cards/verify')
        .send({
          qrToken: 'AAROGYA-DRISHTI://CARD-REF/ASR-PAT-2026-0842/EMERGENCY-VERIFY',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.isValid).toBe(true);
      expect(response.body.data.cardStatus).toBe('ACTIVE');
      expect(response.body.data.cardSerial).toBe('ASR-CRD-8420-91');

      // CRITICAL PRIVACY SAFETY ASSERTIONS: Zero patient name, age, phone, or diagnosis disclosed
      expect(response.body.data.patientName).toBeUndefined();
      expect(response.body.data.fullName).toBeUndefined();
      expect(response.body.data.age).toBeUndefined();
      expect(response.body.data.phone).toBeUndefined();
      expect(response.body.data.diagnosis).toBeUndefined();
      expect(response.body.data.privacyNotice).toContain('Zero Protected Health Information (PHI) disclosed');
    });

    it('POST /cards/:cardId/replace executes card replacement and issues new serial', async () => {
      const response = await request(app.getHttpServer())
        .post('/cards/ASR-CRD-8420-91/replace')
        .set('Authorization', `Bearer ${ashaToken}`)
        .send({
          reason: 'REPLACED_LOST',
          notes: 'Card lost during transit to weekly shandy market',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('ACTIVE');
      expect(response.body.data.cardSerial).not.toBe('ASR-CRD-8420-91');
      expect(response.body.data.patientId).toBe('ASR-PAT-2026-0842');
    });
  });

  describe('4. Family Caregiver Access Management', () => {
    let caregiverId: string;

    it('POST /patients/:id/caregivers adds authorized family proxy', async () => {
      const response = await request(app.getHttpServer())
        .post('/patients/ASR-PAT-2026-0842/caregivers')
        .set('Authorization', `Bearer ${ashaToken}`)
        .send({
          caregiverName: 'Subba Rao',
          relationship: 'SON',
          contactPhone: '+91-94401-99999',
          canAccessScreenings: true,
          canCoordinateReferrals: true,
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.caregiverName).toBe('Subba Rao');
      expect(response.body.data.relationship).toBe('SON');
      expect(response.body.data.isActive).toBe(true);

      caregiverId = response.body.data.id;
    });

    it('GET /patients/:id/caregivers lists all active caregivers', async () => {
      const response = await request(app.getHttpServer())
        .get('/patients/ASR-PAT-2026-0842/caregivers')
        .set('Authorization', `Bearer ${ashaToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it('PATCH /patients/:id/caregivers/:caregiverId/revoke revokes caregiver access', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/patients/ASR-PAT-2026-0842/caregivers/${caregiverId}/revoke`)
        .set('Authorization', `Bearer ${ashaToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.revoked).toBe(true);
    });
  });
});
