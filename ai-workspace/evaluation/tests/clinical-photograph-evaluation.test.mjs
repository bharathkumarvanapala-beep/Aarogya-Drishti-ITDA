import test from 'node:test';
import assert from 'node:assert/strict';
import {runResearchAI} from '../src/research-ai.mjs';

const VALID_PHOTO_BASE64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

test('Clinical Evaluation 1: White Plaque (Leukoplakia on Buccal Mucosa)', async () => {
  const res = await runResearchAI(VALID_PHOTO_BASE64, {
    site: 'Right Buccal Mucosa',
    history: 'Fixed white plaque for 3 months, does not rub off with gauze. Areca nut chewer for 12 years.',
    age: 49
  });

  const f = res.findings;
  // 1. Anatomical accuracy
  assert.equal(f.imageAssessment.anatomicalLocation.isSpecific, true);
  assert.ok(f.imageAssessment.anatomicalLocation.value.includes('Buccal mucosa'));

  // 2. Visual abnormality description (distinguished from coating)
  assert.equal(f.imageAssessment.visibleAbnormality.abnormalityType, 'white_plaque');
  assert.ok(f.imageAssessment.visibleAbnormality.clinicalDistinction.includes('adherent'));
  assert.ok(!f.imageAssessment.visibleAbnormality.value.includes('mild mucosal variation'));

  // 3. Differential reasoning with 4 required aspects
  const leukoDiff = f.possibleClinicalSuspicion.possibleConditions.find(c => c.condition.includes('Leukoplakia'));
  assert.ok(leukoDiff, 'Leukoplakia must be considered');
  assert.ok(leukoDiff.whyConsidered);
  assert.ok(leukoDiff.supportingVisibleFindings);
  assert.ok(leukoDiff.additionalClinicalInfoNeeded);
  assert.ok(leukoDiff.cannotBeDistinguishedFromPhoto);

  // 4. Follow-up recommendations and PHC guidance
  assert.ok(f.recommendedFollowUp.phcActionPlan.length >= 4);
  assert.equal(f.recommendedFollowUp.directClinicalExaminationRequired, true);
  assert.ok(f.recommendedFollowUp.additionalInvestigations.includes('biopsy'));
});

test('Clinical Evaluation 2: White Coating (Superficial Saburral / Candidal Film on Dorsal Tongue)', async () => {
  const res = await runResearchAI(VALID_PHOTO_BASE64, {
    site: 'Dorsal surface of tongue',
    history: 'Diffuse white coating across tongue dorsum, easily wiped away with cotton gauze. No tobacco.',
    age: 38
  });

  const f = res.findings;
  assert.equal(f.imageAssessment.anatomicalLocation.isSpecific, true);
  assert.ok(f.imageAssessment.anatomicalLocation.value.includes('Dorsal surface of tongue'));

  // Must distinguish coating from fixed keratosis/plaque
  assert.equal(f.imageAssessment.visibleAbnormality.abnormalityType, 'white_coating');
  assert.ok(f.imageAssessment.visibleAbnormality.clinicalDistinction.includes('wiping test'));

  // Differential must consider saburral coating / candidiasis
  assert.ok(f.possibleClinicalSuspicion.possibleConditions.some(c => c.condition.includes('Coating') || c.condition.includes('Candidiasis')));
});

test('Clinical Evaluation 3: Red Lesion (Erythroplakia on Floor of Mouth)', async () => {
  const res = await runResearchAI(VALID_PHOTO_BASE64, {
    site: 'Floor of mouth',
    history: 'Solitary bright velvety red patch on floor of mouth, persisting >4 weeks. Chronic bidi smoker.',
    age: 63
  });

  const f = res.findings;
  assert.equal(f.imageAssessment.anatomicalLocation.isSpecific, true);
  assert.ok(f.imageAssessment.anatomicalLocation.value.includes('Floor of mouth'));

  assert.equal(f.imageAssessment.visibleAbnormality.abnormalityType, 'red_patch');
  assert.ok(f.imageAssessment.visibleAbnormality.value.includes('velvety red'));

  const erythroDiff = f.possibleClinicalSuspicion.possibleConditions.find(c => c.condition.includes('Erythroplakia'));
  assert.ok(erythroDiff);
  assert.ok(erythroDiff.whyConsidered);
  assert.ok(f.recommendedFollowUp.referralUrgency.includes('Priority') || f.recommendedFollowUp.referralUrgency.includes('Urgent'));
});

test('Clinical Evaluation 4: Ulceration (Suspicious Ulcer on Lateral Border of Tongue)', async () => {
  const res = await runResearchAI(VALID_PHOTO_BASE64, {
    site: 'Lateral border of tongue',
    history: 'Non-healing ulcer with raised everted borders and spontaneous bleeding for 5 weeks. Chews gutkha.',
    age: 58
  });

  const f = res.findings;
  assert.equal(f.imageAssessment.anatomicalLocation.isSpecific, true);
  assert.ok(f.imageAssessment.anatomicalLocation.value.includes('Lateral border of tongue'));

  assert.equal(f.imageAssessment.visibleAbnormality.abnormalityType, 'ulcer');
  assert.ok(f.imageAssessment.visibleAbnormality.value.includes('Ulcerative'));
  assert.equal(f.suggestedCategory, 'malignancy_suspected');

  const osccDiff = f.possibleClinicalSuspicion.possibleConditions.find(c => c.condition.includes('Squamous Cell Carcinoma'));
  assert.ok(osccDiff);
  assert.ok(osccDiff.whyConsidered);
  assert.ok(osccDiff.additionalClinicalInfoNeeded.includes('palpation'));

  // Never claim induration from image
  assert.ok(!f.imageAssessment.visibleAbnormality.value.includes('indurated'));
  assert.ok(!f.observedVisualCharacteristics.includes('indurated'));
  assert.equal(f.physicalExaminationFindings.induration.source, 'PHYSICAL_EXAMINATION');

  assert.ok(f.recommendedFollowUp.referralUrgency.includes('Urgent'));
});

test('Clinical Evaluation 5: Mixed Red and White Lesion (Erythroleukoplakia on Ventral Tongue)', async () => {
  const res = await runResearchAI(VALID_PHOTO_BASE64, {
    site: 'Ventral surface of tongue',
    history: 'Speckled erythroleukoplakic red and white lesion with burning sensation for 6 weeks.',
    age: 54
  });

  const f = res.findings;
  assert.equal(f.imageAssessment.anatomicalLocation.isSpecific, true);
  assert.ok(f.imageAssessment.anatomicalLocation.value.includes('Ventral surface of tongue'));

  assert.equal(f.imageAssessment.visibleAbnormality.abnormalityType, 'mixed_red_white');
  assert.ok(f.imageAssessment.visibleAbnormality.value.includes('Mixed red and white'));
  assert.equal(f.suggestedCategory, 'malignancy_suspected');

  assert.ok(f.possibleClinicalSuspicion.possibleConditions.some(c => c.condition.includes('Erythroleukoplakia')));
  assert.ok(f.recommendedFollowUp.additionalInvestigations.includes('biopsy'));
});

test('Clinical Evaluation 6: Normal Anatomical Variation (Linea Alba on Buccal Mucosa / Routine Screening)', async () => {
  const res = await runResearchAI(VALID_PHOTO_BASE64, {
    site: 'Buccal mucosa',
    history: 'Routine preventive examination. Bilateral whitish line along occlusal plane. No tobacco habits.',
    age: 29
  });

  const f = res.findings;
  assert.equal(f.imageAssessment.anatomicalLocation.isSpecific, true);
  assert.ok(f.imageAssessment.anatomicalLocation.value.includes('Buccal mucosa'));

  // Must not claim low risk of cancer or rule out cancer
  const levelOfConcernLower = f.possibleClinicalSuspicion.levelOfConcern.toLowerCase();
  assert.ok(!levelOfConcernLower.includes('low risk of cancer'));
  assert.ok(!levelOfConcernLower.includes('low malignant risk'));
  assert.ok(!levelOfConcernLower.includes('ruled out'));

  // No vague descriptions like "mild mucosal variation"
  assert.ok(!f.imageAssessment.visibleAbnormality.value.includes('mild mucosal variation'));
  assert.ok(f.possibleClinicalSuspicion.possibleConditions.some(c => c.condition.includes('Variation') || c.condition.includes('Frictional')));
});

test('Clinical Evaluation 7: Diverse Oral Subsites (Gingiva, Hard Palate, Inner Lip)', async () => {
  const gingivaRes = await runResearchAI(VALID_PHOTO_BASE64, {site: 'Gingiva', history: '', age: 35});
  assert.ok(gingivaRes.findings.imageAssessment.anatomicalLocation.value.includes('Gingiva'));

  const palateRes = await runResearchAI(VALID_PHOTO_BASE64, {site: 'Hard palate', history: '', age: 40});
  assert.ok(palateRes.findings.imageAssessment.anatomicalLocation.value.includes('Hard palate'));

  const lipRes = await runResearchAI(VALID_PHOTO_BASE64, {site: 'Inner lip', history: '', age: 42});
  assert.ok(lipRes.findings.imageAssessment.anatomicalLocation.value.includes('Inner lip'));
});

