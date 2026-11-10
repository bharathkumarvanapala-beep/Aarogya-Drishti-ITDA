import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {startServer} from '../src/server.mjs';

// Valid 1x1 PNG fixture (70 bytes)
const SAMPLE_PNG_BASE64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// Valid JPEG fixture
const SAMPLE_JPEG_BASE64 =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';

test('Persistent Image Storage: upload, binary disk storage, metadata and retrieval', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'drishti-img-test-'));
  const server = await startServer({port: 0, dataDir: directory});
  const base = `http://127.0.0.1:${server.address().port}`;
  const accounts = JSON.parse(await readFile(join(directory, 'demo-accounts.json'), 'utf8')).accounts;

  const request = async (path, method = 'GET', data, auth) => {
    const r = await fetch(base + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(auth ? {Cookie: auth.cookie, 'X-CSRF-Token': auth.csrf} : {})
      },
      ...(data ? {body: JSON.stringify(data)} : {})
    });
    return {
      status: r.status,
      headers: r.headers,
      body: r.headers.get('content-type')?.includes('application/json') ? await r.json() : null,
      bytes: !r.headers.get('content-type')?.includes('application/json') ? Buffer.from(await r.arrayBuffer()) : null,
      cookie: r.headers.get('set-cookie')
    };
  };

  try {
    const login = async role => {
      const a = accounts.find(acc => acc.role === role);
      const r = await request('/api/auth/login', 'POST', a);
      return {...r.body, cookie: r.cookie.split(';')[0]};
    };

    const worker = await login('worker');
    const doctor = await login('doctor');

    // 1. Health worker registers a new patient with an initial photograph
    const patientId = 'AD-REAL-PHOTO-001';
    const createRes = await request('/api/patients', 'POST', {
      id: patientId,
      name: 'Lakshmi Devi',
      age: 52,
      village: 'G. Madugula',
      history: 'Non-healing ulcer on right lateral border of tongue. Tobacco chew habit for 15 years.',
      consent: true,
      site: 'Lateral Border of Tongue',
      photo: SAMPLE_PNG_BASE64
    }, worker);

    assert.equal(createRes.status, 201);
    const createdPatient = createRes.body.patient;
    assert.equal(createdPatient.id, patientId);
    assert.ok(createdPatient.photoUrl, 'Patient should have photoUrl pointing to persistent storage');
    assert.ok(createdPatient.photoId, 'Patient should have photoId');
    assert.ok(Array.isArray(createdPatient.photos), 'Patient should have photos array');
    assert.equal(createdPatient.photos.length, 1);

    const firstPhoto = createdPatient.photos[0];
    assert.equal(firstPhoto.site, 'Lateral Border of Tongue');
    assert.ok(firstPhoto.sha256, 'Should have SHA-256 cryptographic fingerprint');
    assert.ok(firstPhoto.filePath, 'Should have physical file path on disk');
    assert.ok(existsSync(firstPhoto.filePath), 'Image file must physically exist on server disk');

    // 2. Retrieve photograph via authenticated API endpoint
    const getPhotoRes = await request(`/api/patients/${patientId}/photos/${firstPhoto.id}`, 'GET', null, doctor);
    assert.equal(getPhotoRes.status, 200);
    assert.equal(getPhotoRes.headers.get('content-type'), 'image/png');
    assert.ok(getPhotoRes.bytes.length > 0, 'Binary photo bytes must be returned');

    // 3. Unauthorized request without authentication should be rejected with 401
    const unauthRes = await request(`/api/patients/${patientId}/photos/${firstPhoto.id}`, 'GET');
    assert.equal(unauthRes.status, 401);

    // 4. Upload a second examination photograph (multi-photo history without overwriting)
    const updatePhotoRes = await request(`/api/patients/${patientId}/photos`, 'POST', {
      version: createdPatient.version,
      photo: SAMPLE_JPEG_BASE64,
      site: 'Right Buccal Mucosa',
      notes: 'Follow-up examination photo: check lining adjacent to molar'
    }, worker);

    assert.equal(updatePhotoRes.status, 200);
    const updatedPatient = updatePhotoRes.body.patient;
    assert.equal(updatedPatient.photos.length, 2, 'Both examination photographs must be preserved');
    assert.notEqual(updatedPatient.photos[0].id, updatedPatient.photos[1].id, 'Each photo must have a unique ID');
    assert.ok(existsSync(updatedPatient.photos[0].filePath), 'Original examination photo file must remain intact');
    assert.ok(existsSync(updatedPatient.photos[1].filePath), 'New examination photo file must physically exist on disk');

    // 5. Run MedGemma 1.5 4B multimodal analysis on the actual patient photograph
    const aiRes = await request(`/api/patients/${patientId}/research-ai`, 'POST', {
      version: updatedPatient.version,
      researchAcknowledged: true
    }, doctor);

    assert.equal(aiRes.status, 200);
    const aiPatient = aiRes.body.patient;
    assert.ok(aiPatient.researchAI, 'Patient record should contain researchAI result');
    assert.equal(aiPatient.researchAI.model, 'google/medgemma-1.5-4b-it');
    assert.equal(aiPatient.researchAI.researchOnly, true);
    assert.ok(aiPatient.researchAI.imageSha256, 'Inference must record SHA-256 fingerprint of the image');

    // Verify all 7 required Phase 4 clinical fields:
    const findings = aiPatient.researchAI.findings;
    assert.ok(findings.observedVisualCharacteristics, 'Field 1: observedVisualCharacteristics required');
    assert.ok(findings.possibleClinicalConcerns, 'Field 2: possibleClinicalConcerns required');
    assert.ok(findings.anatomicalLocation, 'Field 3: anatomicalLocation required');
    assert.ok(findings.imageQualityLimitations, 'Field 4: imageQualityLimitations required');
    assert.ok(findings.modelGeneratedAssessment, 'Field 5: modelGeneratedAssessment required');
    assert.ok(findings.uncertaintyAndLimitations, 'Field 6: uncertaintyAndLimitations required');
    assert.ok(findings.medicalReviewRecommendation, 'Field 7: medicalReviewRecommendation required');

    // 6. Medical Officer saves clinical review with concurrence, biopsy advice, and referral
    const reviewRes = await request(`/api/patients/${patientId}/review`, 'POST', {
      version: aiPatient.version,
      stage: 'referred',
      notes: 'Indurated ulcer noted on tongue with indurated borders. High suspicion of malignancy. Immediate surgical punch biopsy required.',
      facility: 'King George Hospital (KGH) - Oncology Dept',
      due: '2026-11-05',
      aiConcurrence: 'agree',
      clinicalCategory: 'malignancy_suspected',
      biopsyAdvised: true
    }, doctor);

    assert.equal(reviewRes.status, 200);
    const reviewedPatient = reviewRes.body.patient;
    assert.equal(reviewedPatient.stage, 'referred');
    assert.equal(reviewedPatient.aiConcurrence, 'agree');
    assert.equal(reviewedPatient.clinicalCategory, 'malignancy_suspected');
    assert.equal(reviewedPatient.biopsyAdvised, true);
    assert.equal(reviewedPatient.facility, 'King George Hospital (KGH) - Oncology Dept');
    assert.ok(reviewedPatient.timeline.some(t => t.text.includes('Reviewed by')), 'Timeline must log doctor review');

    // 7. Verify photographs and clinical review persist in database and disk
    assert.ok(existsSync(firstPhoto.filePath), 'First photograph file exists on disk');
    assert.ok(existsSync(updatedPatient.photos[1].filePath), 'Second photograph file exists on disk');

    const listRes = await request('/api/patients', 'GET', null, doctor);
    const persistedPatient = listRes.body.patients.find(p => p.id === patientId);
    assert.ok(persistedPatient, 'Patient must be returned');
    assert.equal(persistedPatient.photos.length, 2, 'Both photographs must be returned');
    assert.equal(persistedPatient.stage, 'referred');
    assert.equal(persistedPatient.biopsyAdvised, true);
    assert.ok(persistedPatient.researchAI, 'AI findings must be persisted');
  } finally {
    if (server) await new Promise(resolve => server.close(resolve));
  }
});
