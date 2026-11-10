import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {startServer} from '../src/server.mjs';
import {runResearchAI, generateFollowUpRecommendations} from '../src/research-ai.mjs';

const SAMPLE_PHOTO_BASE64 =
  'data:image/jpeg;base64,' +
  Buffer.from(
    '\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xFF\xDB\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.\' ",#\x1c\x1c(7),01444\x1f\'9=82<.342\xFF\xC0\x00\x11\x08\x00\xC8\x00\xC8\x03\x01"\x00\x02\x11\x01\x03\x11\x01\xFF\xDA\x00\x0C\x03\x01\x00\x02\x11\x03\x11\x00?\x00\xBF\x00\xFF\xD9',
    'binary'
  ).toString('base64');

test('Basic Oral Health & Triage: Backend follow-up recommendations for dental, tongue, and gingival abnormalities', () => {
  // Dental Caries & Cavity
  const dentalRec = generateFollowUpRecommendations('dental_caries_cavity', 'screen_positive', {pass: true}, {history: 'Severe throbbing toothache for 3 days'});
  assert.ok(dentalRec.specialistReferral.includes('Dental Surgeon'), 'Specialist should be dental surgeon');
  assert.ok(dentalRec.referralUrgency.includes('Dental Referral'), 'Urgency should recommend dental referral');
  assert.ok(dentalRec.additionalInvestigations.includes('IOPA') || dentalRec.additionalInvestigations.includes('radiograph'), 'Investigations should include radiograph');

  // Tongue Glossitis / Geographic
  const tongueRec = generateFollowUpRecommendations('tongue_glossitis_geographic', 'screen_positive', {pass: true}, {history: 'Burning sensation on tongue'});
  assert.ok(tongueRec.specialistReferral.includes('Oral Medicine') || tongueRec.specialistReferral.includes('Dental Surgeon'));
  assert.ok(tongueRec.additionalInvestigations.includes('Vitamin B12') || tongueRec.additionalInvestigations.includes('KOH'));

  // Gingivitis / Periodontal
  const gumRec = generateFollowUpRecommendations('gingivitis_periodontal', 'screen_positive', {pass: true}, {history: 'Bleeding gums when brushing'});
  assert.ok(gumRec.specialistReferral.includes('Periodontist') || gumRec.specialistReferral.includes('Dental Surgeon'));
  assert.ok(gumRec.additionalInvestigations.includes('scaling') || gumRec.additionalInvestigations.includes('probing'));
});

test('MedGemma Inference identifies Dentition and Dental Caries from photo and clinical context', async () => {
  const result = await runResearchAI(SAMPLE_PHOTO_BASE64, {
    site: 'Dentition / Teeth / Cavity',
    history: 'Pain in upper molar with visible dark cavity when chewing food',
    age: 34
  });

  assert.ok(result.findings, 'Must return clinical findings');
  assert.equal(result.findings.imageAssessment?.anatomicalLocation?.subsiteId, 'dentition', 'Subsite must be resolved as dentition');
  assert.equal(result.findings.imageAssessment?.visibleAbnormality?.abnormalityType, 'dental_caries_cavity', 'Visual abnormality must be dental caries cavity');
  assert.ok(
    String(result.findings.recommendedClinicalNextSteps || '').includes('Dental') ||
    result.recommendations?.specialistReferral?.includes('Dental'),
    'Must recommend Dental Surgeon'
  );
});

test('MedGemma Inference identifies Tongue conditions from photo and clinical context', async () => {
  const result = await runResearchAI(SAMPLE_PHOTO_BASE64, {
    site: 'Tongue',
    history: 'White coating on dorsum of tongue with burning sensation on spicy food',
    age: 42
  });

  assert.ok(result.findings, 'Must return clinical findings');
  const subsiteId = result.findings.imageAssessment?.anatomicalLocation?.subsiteId || '';
  assert.ok(subsiteId.includes('tongue'), 'Subsite must be resolved as tongue or dorsal_tongue');
  const abType = result.findings.imageAssessment?.visibleAbnormality?.abnormalityType || '';
  assert.ok(
    abType.includes('white') || abType.includes('tongue'),
    'Abnormality must reflect tongue presentation'
  );
  assert.ok(result.findings.differentialConsiderations?.length >= 2, 'Must have at least 2 differential diagnoses');
});

test('Patient Registration: basicReport is accepted, validated, and persisted in server database', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'drishti-basic-report-test-'));
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

    const sampleBasicReport = {
      evaluatedAt: new Date().toISOString(),
      primaryCategory: {
        id: 'dental_cavity',
        icon: '🦷',
        badgeClass: 'dental',
        titleEn: 'Dental Caries / Cavity & Toothache Suspected',
        titleTe: 'దంత క్షయం / పిప్పి పన్ను & పంటి నొప్పి అనుమానం',
        summaryEn: 'Visual signs or history suggestive of dental caries in molar region.',
        summaryTe: 'దంత క్షయం, పిప్పి పన్ను లేదా పంటి నొప్పి లక్షణాలు గుర్తించబడ్డాయి.'
      },
      monthly: {
        monthKey: '2026-11',
        monthLabel: 'November 2026',
        monthLabelTe: 'నవంబర్ 2026',
        totalScreened: 24,
        dentalCavities: 8,
        tongueConditions: 5,
        opmdSuspects: 3,
        routineBenign: 8
      },
      pillars: [
        {
          id: 'oral_cancer_opmd',
          icon: '⚠️',
          nameEn: 'Oral Cancer & OPMD Risk',
          nameTe: 'నోటి క్యాన్సర్ & OPMD తనిఖీ',
          status: 'status-ok',
          statusTextEn: 'No Overt Lesion Detected',
          statusTextTe: 'ప్రమాదకర పుండ్లు కనిపించలేదు'
        },
        {
          id: 'dentition_cavity',
          icon: '🦷',
          nameEn: 'Dentition & Cavities',
          nameTe: 'దంతాలు, పిప్పి పన్ను & పంటి నొప్పి',
          status: 'status-info',
          statusTextEn: 'Cavity / Toothache Suspected',
          statusTextTe: 'పిప్పి పన్ను / క్షయం గుర్తించబడింది'
        },
        {
          id: 'tongue_health',
          icon: '👅',
          nameEn: 'Tongue Health & Dorsum',
          nameTe: 'నాలుక ఆరోగ్యం & పూత',
          status: 'status-ok',
          statusTextEn: 'Normal Tongue Mucosa',
          statusTextTe: 'నాలుక సాధారణం'
        },
        {
          id: 'gingiva_periodontal',
          icon: '🩺',
          nameEn: 'Gums & Periodontium',
          nameTe: 'చిగుళ్ళు & శ్లేష్మ ఆరోగ్యం',
          status: 'status-ok',
          statusTextEn: 'Healthy Pink Gums',
          statusTextTe: 'చిగుళ్ళు ఆరోగ్యకరం'
        }
      ],
      actionsEn: [
        'Refer patient to Dental Surgeon / PHC Dental Chair for cavity restoration (GIC/composite).',
        'Warm saline mouth rinses.'
      ],
      actionsTe: [
        'పిప్పి పన్ను పూడ్చడం కోసం PHC దంత వైద్యుని వద్దకు పంపండి.',
        'గోరువెచ్చని ఉప్పునీటి పుక్కిలింత.'
      ]
    };

    const patientId = 'AD-TRIAGE-01';
    const regRes = await request('/api/patients', 'POST', {
      id: patientId,
      name: 'Laxmi Pangi',
      age: 38,
      village: 'Hukumpeta',
      site: 'Dentition / Teeth / Cavity',
      history: 'Deep molar cavity with pain when eating sweets',
      consent: true,
      photo: SAMPLE_PHOTO_BASE64,
      basicReport: sampleBasicReport
    }, worker);

    assert.equal(regRes.status, 201, 'Patient registration must succeed');
    assert.ok(regRes.body.patient.basicReport, 'basicReport must be persisted on patient object');
    assert.equal(regRes.body.patient.basicReport.primaryCategory.id, 'dental_cavity', 'Primary category must be preserved');
    assert.equal(regRes.body.patient.basicReport.monthly.totalScreened, 24, 'Monthly intake stats must be preserved');
    assert.equal(regRes.body.patient.basicReport.pillars.length, 4, 'All 4 pillars must be preserved');

    // Retrieve patient record to verify persistence across GET
    const getRes = await request('/api/patients', 'GET', null, worker);
    assert.equal(getRes.status, 200);
    const found = getRes.body.patients.find(p => p.id === patientId);
    assert.ok(found, 'Created patient must be in database');
    assert.ok(found.basicReport, 'Retrieved patient must contain basicReport');
    assert.equal(found.basicReport.primaryCategory.id, 'dental_cavity');
    assert.equal(found.basicReport.monthly.dentalCavities, 8);
  } finally {
    server.close();
  }
});

test('Client Triage Logic: computeBasicOralReport differentiates multi-condition presentation & computes monthly stats', async () => {
  const appJsCode = await readFile(join(process.cwd(), 'public', 'app.js'), 'utf8');

  // Extract computeMonthlyIntakeMetrics and computeBasicOralReport functions from public/app.js
  const metricsFnCode = appJsCode.match(/function computeMonthlyIntakeMetrics\([\s\S]*?^}/m)?.[0];
  const reportFnCode = appJsCode.match(/function computeBasicOralReport\([\s\S]*?^}/m)?.[0];

  assert.ok(metricsFnCode, 'computeMonthlyIntakeMetrics must be defined in app.js');
  assert.ok(reportFnCode, 'computeBasicOralReport must be defined in app.js');

  const fnSandbox = new Function(`
    ${metricsFnCode}
    ${reportFnCode}
    return { computeMonthlyIntakeMetrics, computeBasicOralReport };
  `);
  const { computeMonthlyIntakeMetrics, computeBasicOralReport } = fnSandbox();

  const nowIso = new Date().toISOString();
  const mockPatients = [
    { id: '1', site: 'Dentition / Teeth / Cavity', history: 'Severe toothache in lower molar with cavity', createdAt: nowIso },
    { id: '2', site: 'Tongue', history: 'White coating on dorsum with burning sensation', createdAt: nowIso },
    { id: '3', site: 'Buccal mucosa', history: 'Persistent non-healing ulcer for 4 weeks with red border', createdAt: nowIso },
    { id: '4', site: 'Gingiva / Gums', history: 'Bleeding gums when eating and swollen papillae', createdAt: nowIso },
    { id: '5', site: 'Oral check', history: 'Routine preventive screening, no complaints', createdAt: nowIso }
  ];

  // Test 1: Monthly metrics computation
  const metrics = computeMonthlyIntakeMetrics(mockPatients);
  assert.equal(metrics.totalScreened, 5, 'Total screened this month must be 5');
  assert.equal(metrics.dentalCavities, 1, 'Dental/cavity cases must be 1');
  assert.equal(metrics.tongueConditions, 1, 'Tongue cases must be 1');
  assert.equal(metrics.opmdSuspects, 1, 'OPMD/ulcer cases must be 1');
  assert.equal(metrics.routineBenign, 2, 'Routine / benign checks must be 2');

  // Test 2: Multi-problem triage for Dental Cavities & Toothache
  const dentalReport = computeBasicOralReport(SAMPLE_PHOTO_BASE64, 'Dentition / Teeth / Cavity', 'Patient reports throbbing toothache and dark hole in molar', 28, mockPatients);
  assert.equal(dentalReport.primaryCategory.id, 'dental_cavity', 'Should identify dental cavity as primary problem');
  assert.equal(dentalReport.primaryCategory.icon, '🦷');
  assert.equal(dentalReport.pillars[1].id, 'dentition_cavity');
  assert.equal(dentalReport.pillars[1].status, 'status-info');
  assert.ok(dentalReport.actionsEn.some(a => a.includes('Dental Surgeon') || a.includes('restoration')));
  assert.ok(dentalReport.actionsTe.some(a => a.includes('దంత') || a.includes('పిప్పి')));

  // Test 3: Multi-problem triage for Tongue conditions (coating / glossitis)
  const tongueReport = computeBasicOralReport(SAMPLE_PHOTO_BASE64, 'Tongue', 'White curdy coating across tongue surface with burning', 45, mockPatients);
  assert.equal(tongueReport.primaryCategory.id, 'tongue_condition', 'Should identify tongue condition');
  assert.equal(tongueReport.primaryCategory.icon, '👅');
  assert.equal(tongueReport.pillars[2].id, 'tongue_health');
  assert.equal(tongueReport.pillars[2].status, 'status-warn');
  assert.ok(tongueReport.actionsEn.some(a => a.includes('gauze wiping test')));
  assert.ok(tongueReport.actionsTe.some(a => a.includes('గాజ్ గుడ్డ')));

  // Test 4: Multi-problem triage for Oral Cancer / OPMD / Chronic Ulcer
  const opmdReport = computeBasicOralReport(SAMPLE_PHOTO_BASE64, 'Buccal mucosa', 'Chronic non-healing ulcer persisting 1 month, tobacco chewer', 55, mockPatients);
  assert.equal(opmdReport.primaryCategory.id, 'oral_lesion_opmd', 'Should identify oral cancer / OPMD risk');
  assert.equal(opmdReport.primaryCategory.icon, '⚠️');
  assert.equal(opmdReport.pillars[0].id, 'oral_cancer_opmd');
  assert.equal(opmdReport.pillars[0].status, 'status-alert');
  assert.ok(opmdReport.actionsEn.some(a => a.includes('Medical Officer')));
  assert.ok(opmdReport.actionsEn.some(a => a.includes('biopsy')));
  assert.ok(opmdReport.actionsTe.some(a => a.includes('బయాప్సీ')));

  // Test 5: What we got for the month is attached to the report
  assert.ok(dentalReport.monthly, 'Basic report must include monthly intake metrics');
  assert.equal(dentalReport.monthly.totalScreened, 5);
  assert.equal(dentalReport.monthly.dentalCavities, 1);

  // Test 6: Acute Mouth Ulcer / Aphthous Stomatitis (e.g. young patient with lip ulcer)
  const ulcerReport = computeBasicOralReport(SAMPLE_PHOTO_BASE64, 'Lip / Labial mucosa', 'Painful mouth ulcer on inner lip for 4 days with red halo', 24, mockPatients);
  assert.equal(ulcerReport.primaryCategory.id, 'mouth_ulcer', 'Must identify mouth ulcer / aphthous stomatitis');
  assert.equal(ulcerReport.primaryCategory.icon, '🩹');
  assert.ok(ulcerReport.primaryCategory.titleEn.includes('Ulcer') || ulcerReport.primaryCategory.titleEn.includes('Aphthous'));
  assert.ok(ulcerReport.primaryCategory.titleTe.includes('పుండు') || ulcerReport.primaryCategory.titleTe.includes('అల్సర్'));
  assert.equal(ulcerReport.pillars.length, 5, 'Must contain all 5 oral health pillars');
  assert.equal(ulcerReport.pillars[4].id, 'mouth_ulcer');
  assert.equal(ulcerReport.pillars[4].status, 'status-alert');
  assert.ok(ulcerReport.actionsEn.some(a => a.includes('topical soothing') || a.includes('triamcinolone')));
  assert.ok(ulcerReport.actionsTe.some(a => a.includes('పుండు') || a.includes('జెల్')));
});

test('MedGemma AI generates plain-language Basic Clinical Answer for acute oral ulcers and triage', async () => {
  const result = await runResearchAI(SAMPLE_PHOTO_BASE64, {
    site: 'Lip / Labial mucosa',
    history: 'Painful small round mouth ulcer on lower lip for 5 days with erythematous halo',
    age: 24
  });

  assert.ok(result.findings, 'Must return findings');
  assert.ok(result.findings.basicAnswer, 'Must generate basicAnswer object');
  assert.equal(result.findings.basicAnswer.category, 'mouth_ulcer');
  assert.equal(result.findings.basicAnswer.icon, '🩹');
  assert.ok(result.findings.basicAnswer.titleEn.includes('Ulcer') || result.findings.basicAnswer.titleEn.includes('Aphthous'));
  assert.ok(result.findings.basicAnswer.titleTe.includes('పుండు') || result.findings.basicAnswer.titleTe.includes('అల్సర్'));
  assert.ok(result.findings.basicAnswer.plainAdviceEn.includes('10-14 days') || result.findings.basicAnswer.plainAdviceEn.includes('triamcinolone'));
  assert.equal(result.findings.basicAnswer.pillars.length, 5, 'Must have all 5 pillars in basicAnswer');
});
