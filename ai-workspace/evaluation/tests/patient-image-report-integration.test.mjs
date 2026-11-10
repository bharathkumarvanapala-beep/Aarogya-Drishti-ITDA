import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {existsSync} from 'node:fs';
import {startServer} from '../src/server.mjs';

const SAMPLE_PHOTO_BASE64 =
  'data:image/jpeg;base64,' +
  Buffer.from(
    '\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xFF\xDB\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.\' ",#\x1c\x1c(7),01444\x1f\'9=82<.342\xFF\xC0\x00\x11\x08\x00\xC8\x00\xC8\x03\x01"\x00\x02\x11\x01\x03\x11\x01\xFF\xDA\x00\x0C\x03\x01\x00\x02\x11\x03\x11\x00?\x00\xBF\x00\xFF\xD9',
    'binary'
  ).toString('base64');

test('Patient Image Upload -> True Result in Report added in related place', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'drishti-image-report-test-'));
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
      body: await r.json(),
      headers: r.headers
    };
  };

  try {
    const login = async role => {
      const a = accounts.find(acc => acc.role === role);
      const res = await request('/api/auth/login', 'POST', a);
      return {...res.body, cookie: res.headers.get('set-cookie').split(';')[0]};
    };

    const worker = await login('worker');
    const doctor = await login('doctor');

    // 1. Patient Screening with Photo & runAi: true
    // When an oral photo is uploaded during screening, true MedGemma analysis is added to report
    const patientId = 'AD-REPORT-01';
    const screeningRes = await request('/api/patients', 'POST', {
      id: patientId,
      name: 'Ramu Korra',
      age: 46,
      village: 'Araku Valley ITDA',
      site: 'Lateral border of tongue',
      history: 'Daily tobacco chewer for 15 years. Ulcerative lesion with pain for 4 weeks.',
      consent: true,
      photo: SAMPLE_PHOTO_BASE64,
      runAi: true,
      researchAcknowledged: true
    }, worker);

    assert.equal(screeningRes.status, 201, 'Screening with photo and AI analysis must be created');
    const createdPatient = screeningRes.body.patient;
    assert.ok(createdPatient.researchAI, 'Patient record must contain researchAI report');
    assert.equal(createdPatient.researchAI.model, 'google/medgemma-1.5-4b-it');
    assert.ok(createdPatient.researchAI.imageSha256, 'Report must contain SHA-256 fingerprint');
    assert.ok(createdPatient.researchAI.findings, 'Report must contain structured clinical findings');

    // Verify 4 core sections exist in the true report
    const findings = createdPatient.researchAI.findings;
    assert.ok(findings.imageAssessment, 'Section A: imageAssessment must be present in report');
    assert.ok(findings.possibleClinicalSuspicion, 'Section B: possibleClinicalSuspicion must be present in report');
    assert.ok(findings.recommendedFollowUp, 'Section C: recommendedFollowUp must be present in report');
    assert.ok(findings.limitations, 'Section D: limitations must be present in report');
    assert.ok(findings.physicalExaminationFindings, 'Physical examination status guardrails must be present');

    // Verify timeline records AI evaluation
    const timelineAi = createdPatient.timeline.find(t => t.text.includes('MedGemma 1.5 4B'));
    assert.ok(timelineAi, 'Care timeline must record MedGemma evaluation event');

    // 2. Photo Update on existing patient record with runAi: true
    // When a new oral examination photo is uploaded to an existing patient record, report is updated
    const updatePhotoRes = await request(`/api/patients/${patientId}/photos`, 'POST', {
      version: createdPatient.version,
      photo: SAMPLE_PHOTO_BASE64,
      site: 'Right Buccal Mucosa',
      notes: 'New follow-up photo of right buccal mucosa',
      runAi: true,
      researchAcknowledged: true
    }, worker);

    assert.equal(updatePhotoRes.status, 200, 'Photo update with AI analysis must succeed');
    const updatedPatient = updatePhotoRes.body.patient;
    assert.ok(updatedPatient.researchAI, 'Updated patient must have fresh researchAI report');
    assert.ok(updatedPatient.timeline.length >= 3, 'Timeline must record both photo addition and AI analysis');

    // 3. AI Studio inference linked to patient record
    // When an image is uploaded in AI Studio with patientId, report is added to patient record in database
    const studioRes = await request('/api/ai/infer', 'POST', {
      patientId: patientId,
      photo: SAMPLE_PHOTO_BASE64,
      site: 'Floor of mouth',
      age: 46,
      history: 'Red patch on floor of mouth',
      researchAcknowledged: true
    }, doctor);

    assert.equal(studioRes.status, 200, 'AI Studio inference with patientId must succeed');
    assert.ok(studioRes.body.patient, 'Updated patient record must be returned in response');
    assert.equal(studioRes.body.patient.site, 'Floor of mouth');
    assert.ok(studioRes.body.patient.researchAI, 'Returned patient must contain researchAI report');

    // 4. Verify persistent database record has true report in related place
    const listRes = await request('/api/patients', 'GET', null, doctor);
    const persistedPatient = listRes.body.patients.find(p => p.id === patientId);
    assert.ok(persistedPatient, 'Patient must be in database');
    assert.ok(persistedPatient.researchAI, 'Persisted patient must contain researchAI report');
    assert.equal(persistedPatient.researchAI.findings.imageAssessment.anatomicalLocation.value, 'Floor of mouth');
    assert.ok(persistedPatient.researchAI.findings.possibleClinicalSuspicion.possibleConditions.length > 0);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});

