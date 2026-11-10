import test from 'node:test';
import assert from 'node:assert/strict';
import { startServer } from '../src/server.mjs';
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Clean sample base64 PNG image (320x240 solid white image)
const SAMPLE_IMAGE_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAHgCAYAAAB2bB39AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAXSURBVHhe7cEBDQAAAMKg909tDwcUAAAA+DYD8AAB9f1W+QAAAABJRU5ErkJggg==';

test('Clinical Inference Workflow: Authentication, Multipart, Persistent Storage, and Session Recovery', async (t) => {
  const dataDir = mkdtempSync(join(tmpdir(), 'drishti-clinical-test-'));
  let capturedInferenceOptions = null;

  const mockResearchAI = async (photo, options = {}) => {
    capturedInferenceOptions = { photoLength: photo.length, ...options };
    return {
      model: 'google/medgemma-1.5-4b-it',
      modelClass: 'Oral Cancer',
      confidence: 0.88,
      riskLevel: 'high',
      imageSha256: 'mock-sha256-abc12345',
      findings: {
        suggestedCategory: 'malignancy_suspected',
        imageAssessment: {
          anatomicalLocation: { value: options.site || 'Lateral border of tongue', certainty: 'visually_evident' },
          visibleAbnormality: { description: 'Exophytic ulcerated lesion' },
          colorAndAppearance: { primaryColor: 'Mixed red and white' },
          imageQuality: { assessment: 'adequate' }
        },
        possibleClinicalSuspicion: {
          levelOfConcern: 'High clinical suspicion'
        },
        recommendedFollowUp: {
          nextClinicalExamination: 'Specialist referral and urgent incisional biopsy',
          referralUrgency: 'Urgent (within 72 hours)'
        },
        limitations: {
          whatCannotBeDetermined: 'Histopathological dysplasia grade and depth of invasion cannot be determined from photograph.'
        }
      }
    };
  };

  const server = await startServer({
    port: 4192,
    dataDir,
    researchAI: mockResearchAI
  });

  t.after(() => {
    server.close();
    try { rmSync(dataDir, { recursive: true, force: true }); } catch {}
  });

  const baseUrl = 'http://127.0.0.1:4192';
  const accounts = JSON.parse(readFileSync(join(dataDir, 'demo-accounts.json'), 'utf8')).accounts;
  const doctor = accounts.find(a => a.role === 'doctor');

  // Step 1: Sign in as medical officer
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: doctor.email, password: doctor.password })
  });

  assert.equal(loginRes.status, 200, 'Login should succeed');
  const sessionCookie = loginRes.headers.get('set-cookie');
  assert.ok(sessionCookie, 'Session cookie must be returned');
  const loginData = await loginRes.json();
  const csrfToken = loginData.csrf;
  assert.ok(csrfToken, 'CSRF token must be present');

  // Step 2: Inference request without CSRF token fails with 403
  const badCsrfRes = await fetch(`${baseUrl}/api/ai/infer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': sessionCookie
    },
    body: JSON.stringify({
      photo: SAMPLE_IMAGE_BASE64,
      researchAcknowledged: true
    })
  });

  assert.equal(badCsrfRes.status, 403, 'Request without CSRF header must be rejected with 403');
  const badCsrfBody = await badCsrfRes.json();
  assert.equal(badCsrfBody.error, 'Session verification failed. Reload and sign in again.');

  // Step 3: Legitimate inference request with CSRF token succeeds and persists image to disk storage
  const inferRes = await fetch(`${baseUrl}/api/ai/infer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': sessionCookie,
      'X-CSRF-Token': csrfToken
    },
    body: JSON.stringify({
      photo: SAMPLE_IMAGE_BASE64,
      site: 'Lateral border of tongue',
      age: 52,
      history: 'Non-healing ulcer for 3 weeks',
      researchAcknowledged: true
    })
  });

  assert.equal(inferRes.status, 200, 'Inference request with valid session & CSRF must succeed');
  const inferData = await inferRes.json();
  assert.ok(inferData.result, 'Inference result must be returned');
  assert.equal(inferData.photoStored, true, 'Photo must be persistently stored');
  assert.ok(inferData.photoFilePath, 'Persistent photo file path must be populated');
  assert.ok(existsSync(inferData.photoFilePath), 'Saved photo must exist on disk storage');
  assert.equal(capturedInferenceOptions.age, 52);
  assert.equal(capturedInferenceOptions.site, 'Lateral border of tongue');

  // Step 4: Multipart Form-Data submission
  const boundary = '----WebKitFormBoundaryClinicalTest7MA4YWxkTrZu0gW';
  const rawImageBuffer = Buffer.from('mock binary jpeg image content for clinical evaluation');
  
  const multipartBody = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="site"\r\n\r\nBuccal Mucosa\r\n`),
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="researchAcknowledged"\r\n\r\ntrue\r\n`),
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="photo"; filename="oral-lesion.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`),
    rawImageBuffer,
    Buffer.from(`\r\n--${boundary}--\r\n`)
  ]);

  const multipartRes = await fetch(`${baseUrl}/api/ai/infer`, {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Cookie': sessionCookie,
      'X-CSRF-Token': csrfToken
    },
    body: multipartBody
  });

  assert.equal(multipartRes.status, 200, 'Multipart inference upload must succeed');
  const multipartData = await multipartRes.json();
  assert.ok(multipartData.result, 'Multipart inference result must be returned');
  assert.equal(multipartData.photoStored, true, 'Multipart photo must be saved to disk');
  assert.ok(existsSync(multipartData.photoFilePath), 'Multipart file must exist on disk');

  // Step 5: Simulate session expiration and recovery
  // Log out / invalidate session
  await fetch(`${baseUrl}/api/auth/logout`, {
    method: 'POST',
    headers: { 'Cookie': sessionCookie, 'X-CSRF-Token': csrfToken }
  });

  // Old session cookie is now invalid
  const expiredRes = await fetch(`${baseUrl}/api/ai/infer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': sessionCookie,
      'X-CSRF-Token': csrfToken
    },
    body: JSON.stringify({
      photo: SAMPLE_IMAGE_BASE64,
      researchAcknowledged: true
    })
  });
  assert.equal(expiredRes.status, 401, 'Expired session must return 401');

  // Re-login to get refreshed credentials
  const reloginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: doctor.email, password: doctor.password })
  });
  assert.equal(reloginRes.status, 200, 'Re-login must succeed');
  const newCookie = reloginRes.headers.get('set-cookie');
  const newLoginData = await reloginRes.json();
  const newCsrf = newLoginData.csrf;

  // Re-run inference with the preserved photograph using renewed session
  const resumedRes = await fetch(`${baseUrl}/api/ai/infer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': newCookie,
      'X-CSRF-Token': newCsrf
    },
    body: JSON.stringify({
      photo: SAMPLE_IMAGE_BASE64, // preserved in frontend memory!
      researchAcknowledged: true
    })
  });
  assert.equal(resumedRes.status, 200, 'Inference with preserved photo must succeed after re-authentication');
});
