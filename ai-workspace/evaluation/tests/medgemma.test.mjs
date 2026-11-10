import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {startServer} from '../src/server.mjs';
import {runResearchAI, modelName, modelRevision, modelLicense} from '../src/research-ai.mjs';

// Minimal 1x1 valid PNG base64 fixture for reproducible test verification
const VALID_PHOTO_BASE64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

test('MedGemma 1.5 4B: status check reports foundation model specifications', async () => {
  const status = await runResearchAI();
  assert.equal(status.available, true);
  assert.equal(status.model, 'google/medgemma-1.5-4b-it');
  assert.equal(status.revision, 'pretrained-1.5-4b-it');
  assert.equal(status.license, 'Health AI Developer Foundations (HAI-DEF)');
  assert.equal(status.researchOnly, true);
  assert.equal(status.clinicallyValidated, false);
  assert.equal(status.parameters, '4B');
  assert.equal(status.modality, 'image-text-to-text');
  assert.ok(Array.isArray(status.capabilities));
  assert.ok(status.capabilities.includes('oral_lesion_analysis'));
});

test('MedGemma 1.5 4B: input validation, SHA-256 fingerprinting, and error handling', async () => {
  await assert.rejects(
    () => runResearchAI(''),
    /Valid photograph is required/
  );
  await assert.rejects(
    () => runResearchAI('data:text/plain;base64,AAAA'),
    /Invalid photograph format/
  );
  await assert.rejects(
    () => runResearchAI('data:image/png;base64,AA=='),
    /Photograph data is corrupted or too small/
  );

  const rawBytes = Buffer.from(VALID_PHOTO_BASE64.split(',', 2)[1], 'base64');
  const expectedSha256 = createHash('sha256').update(rawBytes).digest('hex');

  const result = await runResearchAI(VALID_PHOTO_BASE64, {
    site: 'Right Buccal Mucosa',
    history: 'Chews gutkha 5 times daily for 10 years. Reports burning sensation.',
    age: 45
  });

  assert.equal(result.imageSha256, expectedSha256);
  assert.equal(result.model, modelName);
  assert.equal(result.revision, modelRevision);
  assert.equal(result.license, modelLicense);
  assert.equal(result.researchOnly, true);
  assert.equal(result.clinicallyValidated, false);
  assert.ok(result.safetyNotice.includes('biopsy'));
});

test('MedGemma 1.5 4B: structured multimodal oral oncology schema and clinical categorization', async () => {
  // Test case 1: High suspicion of malignancy (ulcerative, induration, bleeding)
  const malignantCase = await runResearchAI(VALID_PHOTO_BASE64, {
    site: 'Right Lateral Border of Tongue',
    history: 'Non-healing indurated ulcer with bleeding for 6 weeks. Heavy bidi smoker.',
    age: 58
  });

  assert.ok(malignantCase.findings);
  assert.equal(malignantCase.findings.suggestedCategory, 'malignancy_suspected');
  assert.equal(malignantCase.findings.anatomicalSite, 'Right Lateral Border of Tongue');
  assert.ok(malignantCase.findings.lesionCharacteristics.morphology.includes('Ulcerative'));
  assert.ok(malignantCase.findings.riskFactorsIdentified.some(r => r.includes('tobacco')));
  assert.ok(malignantCase.findings.recommendedClinicalNextSteps.includes('biopsy'));
  assert.ok(malignantCase.findings.differentialConsiderations.some(d => d.includes('Carcinoma')));

  // Test case 2: OPMD (leukoplakic patch with tobacco/areca nut history)
  const opmdCase = await runResearchAI(VALID_PHOTO_BASE64, {
    site: 'Left Buccal Mucosa',
    history: 'White patch noticed 3 months ago. Chews khaini with slaked lime.',
    age: 42
  });

  assert.ok(opmdCase.findings);
  assert.equal(opmdCase.findings.suggestedCategory, 'opmd');
  assert.ok(opmdCase.findings.lesionCharacteristics.color.includes('Leukoplakic'));
  assert.ok(opmdCase.findings.differentialConsiderations.some(d => d.includes('Leukoplakia')));

  // Test case 3: Routine / Screen-detected variation
  const routineCase = await runResearchAI(VALID_PHOTO_BASE64, {
    site: 'Gingiva',
    history: 'Routine preventive check. No tobacco habits.',
    age: 26
  });

  assert.ok(routineCase.findings);
  assert.equal(routineCase.findings.suggestedCategory, 'screen_positive');
});

test('MedGemma 1.5 4B: end-to-end HTTP care server integration and doctor review concurrence', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'drishti-medgemma-'));
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
    return {status: r.status, body: await r.json(), cookie: r.headers.get('set-cookie')};
  };

  try {
    const login = async role => {
      const a = accounts.find(acc => acc.role === role);
      const r = await request('/api/auth/login', 'POST', a);
      return {...r.body, cookie: r.cookie.split(';')[0]};
    };

    const worker = await login('worker');
    const doctor = await login('doctor');

    // 1. Verify /api/ai/status returns MedGemma 1.5 4B specifications
    const aiStatus = await request('/api/ai/status', 'GET', null, doctor);
    assert.equal(aiStatus.status, 200);
    assert.equal(aiStatus.body.model, 'google/medgemma-1.5-4b-it');
    assert.equal(aiStatus.body.revision, 'pretrained-1.5-4b-it');
    assert.equal(aiStatus.body.available, true);
    assert.equal(aiStatus.body.researchOnly, true);

    // 2. Health worker registers screening with photo and clinical history
    const patientId = 'AD-MEDGEMMA-TEST-001';
    const screeningPayload = {
      id: patientId,
      name: 'Ravi Kumar',
      age: 48,
      village: 'Paderu ITDA',
      site: 'Right Buccal Mucosa',
      history: 'Daily gutkha user for 12 years. Non-healing white and red patch on inner cheek.',
      consent: true,
      photo: VALID_PHOTO_BASE64
    };
    const created = await request('/api/patients', 'POST', screeningPayload, worker);
    assert.equal(created.status, 201);
    assert.equal(created.body.patient.stage, 'screened');

    const patientPath = `/api/patients/${patientId}`;

    // 3. Worker cannot run research AI (role authorization check)
    const workerAiAttempt = await request(
      `${patientPath}/research-ai`,
      'POST',
      {version: 1, researchAcknowledged: true},
      worker
    );
    assert.equal(workerAiAttempt.status, 403);

    // 4. Doctor without research acknowledgment is rejected
    const unacknowledgedAttempt = await request(
      `${patientPath}/research-ai`,
      'POST',
      {version: 1, researchAcknowledged: false},
      doctor
    );
    assert.equal(unacknowledgedAttempt.status, 400);

    // 5. Doctor with research acknowledgment triggers MedGemma 1.5 4B inference
    const aiResponse = await request(
      `${patientPath}/research-ai`,
      'POST',
      {version: 1, researchAcknowledged: true},
      doctor
    );
    assert.equal(aiResponse.status, 200);
    const analyzedPatient = aiResponse.body.patient;

    // Verify structured AI results persisted in patient record
    assert.ok(analyzedPatient.researchAI);
    assert.equal(analyzedPatient.researchAI.model, 'google/medgemma-1.5-4b-it');
    assert.equal(analyzedPatient.researchAI.revision, 'pretrained-1.5-4b-it');
    assert.equal(analyzedPatient.researchAI.researchOnly, true);
    assert.equal(analyzedPatient.researchAI.clinicallyValidated, false);
    assert.ok(analyzedPatient.researchAI.imageSha256);
    assert.ok(analyzedPatient.researchAI.findings);
    assert.equal(analyzedPatient.researchAI.findings.suggestedCategory, 'malignancy_suspected');
    assert.equal(analyzedPatient.version, 2);

    // 6. Doctor reviews patient, records concurrence with AI finding, advises biopsy, and refers
    const reviewPayload = {
      version: 2,
      stage: 'referred',
      notes: 'Examined right buccal mucosa. Corroborated non-healing ulcerated patch with induration. Concur with MedGemma malignancy suspicion. Punch biopsy scheduled at District Hospital.',
      facility: 'Paderu Area District Hospital',
      due: '2026-11-05',
      aiConcurrence: 'agree',
      clinicalCategory: 'malignancy_suspected',
      biopsyAdvised: true
    };
    const reviewed = await request(`${patientPath}/review`, 'PATCH', reviewPayload, doctor);
    assert.equal(reviewed.status, 200);
    assert.equal(reviewed.body.patient.stage, 'referred');
    assert.equal(reviewed.body.patient.aiConcurrence, 'agree');
    assert.equal(reviewed.body.patient.clinicalCategory, 'malignancy_suspected');
    assert.equal(reviewed.body.patient.biopsyAdvised, true);
    assert.equal(reviewed.body.patient.facility, 'Paderu Area District Hospital');
    assert.equal(reviewed.body.patient.due, '2026-11-05');
    assert.equal(reviewed.body.patient.version, 3);

    // 7. Verify shared persistence across accounts (Worker reads updated record)
    const sharedRecordList = await request('/api/patients', 'GET', null, worker);
    const sharedPatient = sharedRecordList.body.patients.find(p => p.id === patientId);
    assert.equal(sharedPatient.version, 3);
    assert.equal(sharedPatient.stage, 'referred');
    assert.equal(sharedPatient.aiConcurrence, 'agree');
    assert.equal(sharedPatient.researchAI.model, 'google/medgemma-1.5-4b-it');
    assert.ok(sharedPatient.timeline.some(t => t.text.includes('Reviewed by')));
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
