import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {startServer} from '../src/server.mjs';
import {runResearchAI} from '../src/research-ai.mjs';

const VALID_PHOTO_BASE64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

test('Scenario A: Image only (no patient name, age, site, or history)', async () => {
  const result = await runResearchAI(VALID_PHOTO_BASE64, {
    site: '',
    history: '',
    age: null
  });

  assert.ok(result.findings);
  assert.equal(result.findings.userProvidedContext.anatomicalSite, 'Not provided');
  assert.equal(result.findings.userProvidedContext.age, 'Not provided');
  assert.equal(result.findings.userProvidedContext.clinicalObservations, 'Not provided');
  assert.ok(result.findings.anatomicalLocation.includes('Oral mucosa'));
  assert.ok(result.findings.anatomicalLocation.includes('not provided'));
  assert.ok(result.findings.observedVisualCharacteristics.includes('oral mucosa'));
  assert.ok(result.findings.riskFactorsIdentified.some(r => r.includes('Not provided')));
  assert.ok(result.findings.modelGeneratedAssessment);
  assert.ok(result.findings.medicalReviewRecommendation);
});

test('Scenario B: Image + age only', async () => {
  const result = await runResearchAI(VALID_PHOTO_BASE64, {
    site: '',
    history: '',
    age: 52
  });

  assert.ok(result.findings);
  assert.equal(result.findings.userProvidedContext.age, 52);
  assert.equal(result.findings.userProvidedContext.anatomicalSite, 'Not provided');
  assert.equal(result.findings.userProvidedContext.clinicalObservations, 'Not provided');
  assert.ok(result.findings.anatomicalLocation.includes('not provided'));
});

test('Scenario C: Image + anatomical site only', async () => {
  const result = await runResearchAI(VALID_PHOTO_BASE64, {
    site: 'Right Buccal Mucosa',
    history: '',
    age: null
  });

  assert.ok(result.findings);
  assert.equal(result.findings.userProvidedContext.anatomicalSite, 'Right Buccal Mucosa');
  assert.equal(result.findings.userProvidedContext.age, 'Not provided');
  assert.equal(result.findings.userProvidedContext.clinicalObservations, 'Not provided');
  assert.ok(result.findings.anatomicalLocation.includes('Right Buccal Mucosa'));
  assert.ok(result.findings.anatomicalLocation.includes('corroborated'));
  assert.ok(result.findings.observedVisualCharacteristics.toLowerCase().includes('right buccal mucosa'));
});

test('Scenario D: Image + clinical observations only', async () => {
  const result = await runResearchAI(VALID_PHOTO_BASE64, {
    site: '',
    history: 'Leukoplakic patch for 3 months with burning sensation. Chews gutkha.',
    age: null
  });

  assert.ok(result.findings);
  assert.equal(result.findings.userProvidedContext.anatomicalSite, 'Not provided');
  assert.equal(result.findings.userProvidedContext.age, 'Not provided');
  assert.ok(result.findings.userProvidedContext.clinicalObservations.includes('Leukoplakic patch'));
  assert.equal(result.findings.suggestedCategory, 'opmd');
  assert.ok(result.findings.riskFactorsIdentified.some(r => r.includes('tobacco') || r.includes('chewing')));
});

test('Scenario E: Image + all available clinical information', async () => {
  const result = await runResearchAI(VALID_PHOTO_BASE64, {
    site: 'Lateral Border of Tongue',
    history: 'Non-healing ulcer with induration and bleeding for 5 weeks. Heavy bidi smoker.',
    age: 60
  });

  assert.ok(result.findings);
  assert.equal(result.findings.userProvidedContext.anatomicalSite, 'Lateral Border of Tongue');
  assert.equal(result.findings.userProvidedContext.age, 60);
  assert.ok(result.findings.userProvidedContext.clinicalObservations.includes('Non-healing ulcer'));
  assert.equal(result.findings.suggestedCategory, 'malignancy_suspected');
  assert.ok(result.findings.anatomicalLocation.includes('Lateral Border of Tongue'));
});

test('HTTP API /api/ai/infer handles Image-Only analysis seamlessly', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'drishti-optional-'));
  const server = await startServer({port: 0, dataDir: directory});
  const base = `http://127.0.0.1:${server.address().port}`;
  const accounts = JSON.parse(await readFile(join(directory, 'demo-accounts.json'), 'utf8')).accounts;

  try {
    const worker = accounts.find(acc => acc.role === 'worker');
    const loginRes = await fetch(base + '/api/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(worker)
    });
    const loginBody = await loginRes.json();
    const cookie = loginRes.headers.get('set-cookie')?.split(';')[0];
    const csrf = loginBody.csrf;

    // Test Scenario A over HTTP API
    const resA = await fetch(base + '/api/ai/infer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
        'X-CSRF-Token': csrf
      },
      body: JSON.stringify({
        photo: VALID_PHOTO_BASE64,
        researchAcknowledged: true
        // site, age, history completely omitted!
      })
    });

    assert.equal(resA.status, 200);
    const bodyA = await resA.json();
    assert.ok(bodyA.result);
    assert.equal(bodyA.result.findings.userProvidedContext.anatomicalSite, 'Not provided');
    assert.equal(bodyA.result.findings.userProvidedContext.age, 'Not provided');
    assert.equal(bodyA.result.findings.userProvidedContext.clinicalObservations, 'Not provided');

    // Test Scenario E over HTTP API
    const resE = await fetch(base + '/api/ai/infer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
        'X-CSRF-Token': csrf
      },
      body: JSON.stringify({
        photo: VALID_PHOTO_BASE64,
        site: 'Lateral Border of Tongue',
        age: 60,
        history: 'Non-healing indurated ulcer',
        researchAcknowledged: true
      })
    });

    assert.equal(resE.status, 200);
    const bodyE = await resE.json();
    assert.ok(bodyE.result);
    assert.equal(bodyE.result.findings.userProvidedContext.anatomicalSite, 'Lateral Border of Tongue');
    assert.equal(bodyE.result.findings.userProvidedContext.age, 60);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
