import test from 'node:test';
import assert from 'node:assert/strict';
import {runResearchAI, validateAndSanitizeClinicalFindings} from '../src/research-ai.mjs';

const VALID_PHOTO_BASE64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

test('Clinical Guardrail: Image-only analysis contains all 4 clinical sections and no prohibited palpation claims', async () => {
  const result = await runResearchAI(VALID_PHOTO_BASE64, {
    site: '',
    history: '',
    age: null
  });

  const f = result.findings;
  assert.ok(f, 'Findings must be present');

  // Section A: IMAGE ASSESSMENT
  assert.ok(f.imageAssessment, 'Section A imageAssessment must be present');
  assert.ok(f.imageAssessment.anatomicalLocation.value, 'anatomicalLocation required');
  assert.equal(f.imageAssessment.anatomicalLocation.source, 'IMAGE_OBSERVATION');
  assert.ok(f.imageAssessment.visibleAbnormality.value, 'visibleAbnormality required');
  assert.equal(f.imageAssessment.visibleAbnormality.source, 'IMAGE_OBSERVATION');
  assert.ok(f.imageAssessment.colorAndAppearance.color, 'colorAndAppearance color required');
  assert.equal(f.imageAssessment.colorAndAppearance.source, 'IMAGE_OBSERVATION');
  assert.ok(f.imageAssessment.shapeAndBorders.borders, 'shapeAndBorders borders required');
  assert.equal(f.imageAssessment.shapeAndBorders.source, 'IMAGE_OBSERVATION');
  assert.equal(f.imageAssessment.approximateDimensions.isMeasurable, false);
  assert.ok(f.imageAssessment.approximateDimensions.value.includes('calibration marker'));
  assert.equal(f.imageAssessment.imageQuality.source, 'IMAGE_OBSERVATION');

  // Section B: POSSIBLE CLINICAL SUSPICION
  assert.ok(f.possibleClinicalSuspicion, 'Section B possibleClinicalSuspicion must be present');
  assert.ok(Array.isArray(f.possibleClinicalSuspicion.possibleConditions));
  assert.ok(f.possibleClinicalSuspicion.possibleConditions.length > 0);
  assert.ok(Array.isArray(f.possibleClinicalSuspicion.visualReasonsSupporting));
  assert.ok(f.possibleClinicalSuspicion.levelOfConcern, 'levelOfConcern required');
  assert.ok(f.possibleClinicalSuspicion.diagnosticUncertainty, 'diagnosticUncertainty required');
  assert.equal(f.possibleClinicalSuspicion.source, 'IMAGE_OBSERVATION');

  // Must never claim low risk or rule out cancer
  const levelOfConcernLower = f.possibleClinicalSuspicion.levelOfConcern.toLowerCase();
  assert.ok(!levelOfConcernLower.includes('low risk of cancer'));
  assert.ok(!levelOfConcernLower.includes('low malignant risk'));
  assert.ok(!levelOfConcernLower.includes('ruled out malignancy'));
  assert.ok(!levelOfConcernLower.includes('non-malignant'));

  // Section C: RECOMMENDED FOLLOW-UP
  assert.ok(f.recommendedFollowUp, 'Section C recommendedFollowUp must be present');
  assert.ok(f.recommendedFollowUp.nextClinicalExamination);
  assert.ok(f.recommendedFollowUp.appropriateSpecialist);
  assert.ok(f.recommendedFollowUp.referralUrgency);
  assert.ok(f.recommendedFollowUp.additionalInvestigations);
  assert.equal(typeof f.recommendedFollowUp.repeatPhotographyRecommended, 'boolean');
  assert.equal(f.recommendedFollowUp.source, 'IMAGE_OBSERVATION');

  // Section D: LIMITATIONS
  assert.ok(f.limitations, 'Section D limitations must be present');
  assert.ok(f.limitations.whatCannotBeDetermined);
  assert.ok(f.limitations.physicalExamOrBiopsyNecessary);
  assert.equal(f.limitations.source, 'IMAGE_OBSERVATION');

  // Physical Examination Guardrails
  assert.ok(f.physicalExaminationFindings, 'physicalExaminationFindings must be present');
  assert.notEqual(f.physicalExaminationFindings.induration.value, 'No induration');
  assert.ok(f.physicalExaminationFindings.induration.value.includes('Not assessed – physical examination'));
  assert.equal(f.physicalExaminationFindings.induration.source, 'PHYSICAL_EXAMINATION');

  assert.ok(f.physicalExaminationFindings.tissueConsistency.value.includes('Not assessed'));
  assert.equal(f.physicalExaminationFindings.tissueConsistency.source, 'PHYSICAL_EXAMINATION');

  assert.ok(f.physicalExaminationFindings.tenderness.value.includes('Not assessed'));
  assert.equal(f.physicalExaminationFindings.tenderness.source, 'PHYSICAL_EXAMINATION');

  assert.ok(f.physicalExaminationFindings.lesionDepth.value.includes('Not assessable'));
  assert.equal(f.physicalExaminationFindings.lesionDepth.source, 'PHYSICAL_EXAMINATION');

  assert.ok(f.physicalExaminationFindings.regionalLymphNodes.value.includes('Not assessed'));
  assert.equal(f.physicalExaminationFindings.regionalLymphNodes.source, 'PHYSICAL_EXAMINATION');

  // Prohibited words in visual observation
  const visualText = f.observedVisualCharacteristics.toLowerCase();
  assert.ok(!visualText.includes('indurated'));
  assert.ok(!visualText.includes('firm'));
  assert.ok(!visualText.includes('supple'));
  assert.ok(!visualText.includes('palpation confirmed'));
  assert.ok(!visualText.includes('lymph node metastasis'));

  // Source attributions map
  assert.ok(f.sourceAttributions);
  assert.ok(f.sourceAttributions.IMAGE_OBSERVATION);
  assert.ok(f.sourceAttributions.PHYSICAL_EXAMINATION);
  assert.ok(f.sourceAttributions.LABORATORY_OR_PATHOLOGY);
});

test('Clinical Guardrail: Health worker input regarding induration and pain is attributed correctly and not claimed as image finding', async () => {
  const result = await runResearchAI(VALID_PHOTO_BASE64, {
    site: 'Right Buccal Mucosa',
    history: 'Ulcerative lesion with indurated margins and tender on touch for 3 weeks',
    age: 58
  });

  const f = result.findings;
  assert.ok(f);

  // Induration must be attributed to HEALTH_WORKER_INPUT, not IMAGE_OBSERVATION
  assert.equal(f.physicalExaminationFindings.induration.source, 'HEALTH_WORKER_INPUT');
  assert.ok(f.physicalExaminationFindings.induration.value.includes('health worker input'));

  // Tenderness must be attributed to PATIENT_REPORTED, not IMAGE_OBSERVATION
  assert.equal(f.physicalExaminationFindings.tenderness.source, 'PATIENT_REPORTED');
  assert.ok(f.physicalExaminationFindings.tenderness.value.includes('patient'));

  // Image observation must not claim induration was seen in image
  assert.ok(!f.imageAssessment.visibleAbnormality.value.includes('indurated'));
  assert.ok(!f.imageAssessment.shapeAndBorders.borders.includes('indurated'));
});

test('Clinical Guardrail: validateAndSanitizeClinicalFindings sanitizes prohibited claims', () => {
  const dirtyResult = {
    model: 'google/medgemma-1.5-4b-it',
    findings: {
      observedVisualCharacteristics: 'Ulcer with indurated margins and firm mucosal base showing low malignant risk.',
      possibleClinicalConcerns: 'Low immediate cancer risk; benign confirmed by appearance.',
      suggestedCategory: 'screen_positive',
      lesionCharacteristics: {
        morphology: 'Indurated ulcer',
        margins: 'Indurated margins',
        color: 'Red and white',
        texture: 'Firm'
      }
    }
  };

  const sanitized = validateAndSanitizeClinicalFindings(dirtyResult, {});
  const sf = sanitized.findings;

  // Prohibited words must be sanitized
  assert.ok(!sf.observedVisualCharacteristics.includes('indurated'));
  assert.ok(!sf.observedVisualCharacteristics.includes('firm mucosal base'));
  assert.ok(!sf.observedVisualCharacteristics.includes('low malignant risk'));

  assert.ok(!sf.possibleClinicalConcerns.includes('Low immediate cancer risk'));
  assert.ok(!sf.possibleClinicalConcerns.includes('benign confirmed'));

  assert.notEqual(sf.physicalExaminationFindings.induration.value, 'No induration');
  assert.ok(sf.physicalExaminationFindings.induration.value.includes('Not assessed – physical examination'));

  assert.ok(!sf.possibleClinicalSuspicion.levelOfConcern.includes('low risk of cancer'));
  assert.ok(!sf.possibleClinicalSuspicion.levelOfConcern.includes('low malignant risk'));

  // Sections must be created
  assert.ok(sf.imageAssessment);
  assert.ok(sf.possibleClinicalSuspicion);
  assert.ok(sf.recommendedFollowUp);
  assert.ok(sf.limitations);
});

test('Clinical Accuracy: Anatomical subsite localization distinguishes specific oral sites and states uncertainty when unprovided', async () => {
  const sites = [
    {input: 'Dorsal surface of tongue', expected: 'Dorsal surface of tongue'},
    {input: 'Lateral border of tongue', expected: 'Lateral border of tongue'},
    {input: 'Ventral surface of tongue', expected: 'Ventral surface of tongue'},
    {input: 'Right Buccal Mucosa', expected: 'Buccal mucosa'},
    {input: 'Gingiva', expected: 'Gingiva'},
    {input: 'Hard Palate', expected: 'Hard palate'},
    {input: 'Floor of mouth', expected: 'Floor of mouth'},
    {input: 'Inner lip', expected: 'Inner lip'}
  ];

  for (const s of sites) {
    const res = await runResearchAI(VALID_PHOTO_BASE64, {site: s.input, history: '', age: 40});
    assert.equal(res.findings.imageAssessment.anatomicalLocation.isSpecific, true, `Site ${s.input} must be specific`);
    assert.ok(
      res.findings.imageAssessment.anatomicalLocation.value.toLowerCase().includes(s.expected.toLowerCase()),
      `Expected ${s.expected} in ${res.findings.imageAssessment.anatomicalLocation.value}`
    );
  }

  // When no site is provided
  const unprovidedRes = await runResearchAI(VALID_PHOTO_BASE64, {site: '', history: '', age: null});
  assert.equal(unprovidedRes.findings.imageAssessment.anatomicalLocation.isSpecific, false);
  assert.ok(
    unprovidedRes.findings.imageAssessment.anatomicalLocation.value.includes('cannot be identified confidently') ||
    unprovidedRes.findings.imageAssessment.anatomicalLocation.uncertainty.includes('cannot be identified confidently') ||
    unprovidedRes.findings.imageAssessment.anatomicalLocation.uncertainty.includes('Subsite cannot be identified')
  );
});

test('Clinical Accuracy: Visual abnormality distinguishes white coating vs plaque vs keratosis vs red patch vs mixed', async () => {
  // 1. White coating (saburral/candidal wipeable film)
  const coatingRes = await runResearchAI(VALID_PHOTO_BASE64, {
    site: 'Dorsal surface of tongue',
    history: 'Superficial white coating on dorsal tongue, scrapable with gauze',
    age: 35
  });
  assert.equal(coatingRes.findings.imageAssessment.visibleAbnormality.abnormalityType, 'white_coating');
  assert.ok(coatingRes.findings.imageAssessment.visibleAbnormality.clinicalDistinction.includes('wiping test'));
  assert.ok(!coatingRes.findings.imageAssessment.visibleAbnormality.value.includes('mild mucosal variation'));

  // 2. White plaque (fixed leukoplakic plaque)
  const plaqueRes = await runResearchAI(VALID_PHOTO_BASE64, {
    site: 'Buccal mucosa',
    history: 'Fixed white plaque that does not rub off with gauze for 2 months',
    age: 48
  });
  assert.equal(plaqueRes.findings.imageAssessment.visibleAbnormality.abnormalityType, 'white_plaque');
  assert.ok(plaqueRes.findings.imageAssessment.visibleAbnormality.clinicalDistinction.includes('adherent'));
  assert.ok(!plaqueRes.findings.imageAssessment.visibleAbnormality.value.includes('mild mucosal variation'));

  // 3. Keratotic-appearing area (corrugated leathery smokeless tobacco contact)
  const keratosisRes = await runResearchAI(VALID_PHOTO_BASE64, {
    site: 'Buccal mucosa',
    history: 'Corrugated leathery keratosis in lower pouch from chewing gutkha',
    age: 50
  });
  assert.equal(keratosisRes.findings.imageAssessment.visibleAbnormality.abnormalityType, 'keratotic_area');
  assert.ok(keratosisRes.findings.imageAssessment.visibleAbnormality.value.includes('keratotic'));

  // 4. Mixed red and white (Erythroleukoplakia)
  const mixedRes = await runResearchAI(VALID_PHOTO_BASE64, {
    site: 'Lateral border of tongue',
    history: 'Speckled erythroleukoplakic red and white lesion with burning',
    age: 62
  });
  assert.equal(mixedRes.findings.imageAssessment.visibleAbnormality.abnormalityType, 'mixed_red_white');
  assert.equal(mixedRes.findings.suggestedCategory, 'malignancy_suspected');

  // 5. Red patch (Erythroplakia)
  const redRes = await runResearchAI(VALID_PHOTO_BASE64, {
    site: 'Floor of mouth',
    history: 'Solitary velvety red patch on floor of mouth persisting 4 weeks',
    age: 55
  });
  assert.equal(redRes.findings.imageAssessment.visibleAbnormality.abnormalityType, 'red_patch');
});

test('Clinical Accuracy: Differential reasoning provides whyConsidered, supporting findings, clinical info needed, and photo limitations for every condition', async () => {
  const result = await runResearchAI(VALID_PHOTO_BASE64, {
    site: 'Lateral border of tongue',
    history: 'Non-healing ulcer persisting for 4 weeks with tobacco chewing history',
    age: 60
  });

  const conditions = result.findings.possibleClinicalSuspicion.possibleConditions;
  assert.ok(Array.isArray(conditions));
  assert.ok(conditions.length >= 2);

  for (const cond of conditions) {
    assert.ok(cond.condition, 'Condition name required');
    assert.ok(cond.whyConsidered, 'whyConsidered required');
    assert.ok(cond.supportingVisibleFindings, 'supportingVisibleFindings required');
    assert.ok(cond.additionalClinicalInfoNeeded, 'additionalClinicalInfoNeeded required');
    assert.ok(cond.cannotBeDistinguishedFromPhoto, 'cannotBeDistinguishedFromPhoto required');
  }
});

test('Clinical Accuracy: Follow-up recommendations provide PHC Action Plan and practical guidance', async () => {
  const result = await runResearchAI(VALID_PHOTO_BASE64, {
    site: 'Buccal mucosa',
    history: 'White plaque persisting 3 weeks',
    age: 45
  });

  const followUp = result.findings.recommendedFollowUp;
  assert.ok(followUp);
  assert.ok(Array.isArray(followUp.phcActionPlan), 'phcActionPlan must be an array');
  assert.ok(followUp.phcActionPlan.length >= 4, 'At least 4 action steps required');
  assert.ok(followUp.phcActionPlan.some(s => s.includes('Habit Cessation') || s.includes('counseling')));
  assert.ok(followUp.phcActionPlan.some(s => s.includes('Wiping Test') || s.includes('scrapability') || s.includes('gauze')));
  assert.ok(followUp.phcActionPlan.some(s => s.includes('Recall') || s.includes('14 days')));

  assert.ok(followUp.directClinicalExaminationRequired);
  assert.ok(followUp.appropriateSpecialist);
  assert.ok(followUp.referralUrgency);
  assert.ok(followUp.additionalInvestigations);
});

test('Clinical Reliability: Prohibits automatic claims of bilateral distribution, symmetry, non-infiltrative margins, and absent malignancy', async () => {
  const result = await runResearchAI(VALID_PHOTO_BASE64, {
    site: '',
    history: '',
    age: null
  });

  const allText = JSON.stringify(result.findings).toLowerCase();

  assert.ok(!allText.includes('bilateral distribution'), 'Must not claim bilateral distribution from 2D photograph');
  assert.ok(!allText.includes('symmetrical anatomical landmarks'), 'Must not claim symmetrical landmarks without contralateral image');
  assert.ok(!allText.includes('non-infiltrative margins'), 'Infiltration cannot be determined visually');
  assert.ok(!allText.includes('absence of malignant characteristics'), 'Must not claim absence of malignant characteristics');
  assert.ok(!allText.includes('benign physiological variation'), 'Must not declare lesion benign from photograph alone');
});

test('Clinical Reliability: Every differential condition contains all 5 required evidence fields', async () => {
  const result = await runResearchAI(VALID_PHOTO_BASE64, {
    site: 'Lateral border of tongue',
    history: 'Non-healing ulcer with bleeding for 3 weeks',
    age: 52
  });

  const conditions = result.findings.possibleClinicalSuspicion.possibleConditions;
  assert.ok(Array.isArray(conditions) && conditions.length >= 2);

  for (const cond of conditions) {
    assert.ok(cond.possibleCondition, 'Field 1: possibleCondition required');
    assert.ok(cond.supportingVisibleEvidence, 'Field 2: supportingVisibleEvidence required');
    assert.ok(cond.missingEvidence, 'Field 3: missingEvidence required');
    assert.ok(cond.additionalClinicalExaminationRequired, 'Field 4: additionalClinicalExaminationRequired required');
    assert.ok(cond.cannotBeConfirmedFromPhotoReason, 'Field 5: cannotBeConfirmedFromPhotoReason required');
  }
});

test('Clinical Reliability: Clinical evidence-validation layer audits findings and passes validation', async () => {
  const result = await runResearchAI(VALID_PHOTO_BASE64, {
    site: 'Right Buccal Mucosa',
    history: 'White plaque, smoker for 10 years',
    age: 48
  });

  const audit = result.findings.clinicalValidationAudit;
  assert.ok(audit, 'clinicalValidationAudit must be present');
  assert.equal(audit.passed, true, 'Audit must pass without prohibited claims');
  assert.ok(Array.isArray(audit.flags));
  assert.ok(audit.timestamp);
});

test('Clinical Reliability: Dynamic urgency avoids universal 14-day delay for high-risk lesions', async () => {
  // High risk: ulcer with bleeding
  const highRiskResult = await runResearchAI(VALID_PHOTO_BASE64, {
    site: 'Lateral border of tongue',
    history: 'Painful bleeding ulcer persisting for 1 month',
    age: 62
  });

  const followUp = highRiskResult.findings.recommendedFollowUp;
  assert.ok(followUp.referralUrgency.includes('Immediate Specialist Referral') || followUp.referralUrgency.includes('Urgent Specialist Referral'));
  assert.ok(
    !followUp.referralUrgency.toLowerCase().includes('re-evaluate in 14 days'),
    'High-risk lesions must not recommend waiting 14 days'
  );
});



