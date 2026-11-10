import { readFileSync, writeFileSync } from 'node:fs';

const filePath = 'src/research-ai.mjs';
let content = readFileSync(filePath, 'utf8');

// 1. Replace classifyVisualAbnormality
const startMarker1 = 'export function classifyVisualAbnormality(historyText = \'\', resolvedSite = {}) {';
const endMarker1 = 'function createDifferential(';
const idx1 = content.indexOf(startMarker1);
const idxEnd1 = content.indexOf(endMarker1);

if (idx1 === -1 || idxEnd1 === -1) {
  console.error('Markers for classifyVisualAbnormality not found');
  process.exit(1);
}

const newClassifyVisualAbnormality = `export function classifyVisualAbnormality(historyText = '', resolvedSite = {}) {
  const h = historyText.toLowerCase();
  const isTongue = ['dorsal_tongue', 'lateral_tongue', 'ventral_tongue', 'general_tongue'].includes(resolvedSite.subsiteId) || /tongue|నాలుక/.test(h);

  // 1. Mixed red and white (Erythroleukoplakia)
  if (/erythroleuko|red and white|white and red|speckled|mottled/.test(h)) {
    return {
      type: 'mixed_red_white',
      label: 'Mixed red and white mucosal lesion (Erythroleukoplakic appearance)',
      morphology: 'Mixed red and white mucosal lesion with speckled / granular surface architecture',
      color: 'Speckled: intensely erythematous (red) background interspersed with opaque white keratotic nodules',
      margins: 'Irregular, partly circumscribed borders with peripheral erythematous margin',
      texture: 'Granular / nodular surface pattern (visual appearance only; physical consistency requires palpation)',
      distribution: 'Focal heterogeneous lesion with interspersed atrophic and plaque-like zones',
      category: 'malignancy_suspected',
      whiteOrRedAreas: 'Coexisting intensely erythematous (red) atrophic patches and elevated opaque white keratotic nodules; absence of an obvious ulcer does not establish benignity.',
      surfaceAppearance: 'Granular and nodular surface texture with focal epithelial thinning and interspersed keratosis.',
      shapeAndBorders: 'Irregular contour with uneven, partly demarcated erythematous borders.',
      relationshipWithSurroundingTissue: 'Abrupt transition from normotrophic mucosa into peripheral erythematous halo; depth and submucosal invasion require palpation and biopsy.',
      clinicalDistinction: 'Distinguished from homogeneous leukoplakia: coexistence of red atrophic zones and white plaques indicates high clinical concern for moderate-to-severe epithelial dysplasia or early invasive carcinoma. Absence of an ulcer does not establish benignity.',
      preliminary: 'High suspicion of non-homogeneous erythroleukoplakic lesion. Urgent specialist oncology evaluation and multi-site biopsy indicated.',
      concerns: 'High concern for Oral Potentially Malignant Disorder with severe epithelial dysplasia or early invasive squamous cell carcinoma (OSCC).'
    };
  }

  // 2. Ulcer-like appearance
  if (/ulcer|non-healing|breakdown|crater|erosion|bleed|sore|canker/.test(h)) {
    return {
      type: 'ulcer',
      label: 'Ulcer-like mucosal appearance',
      morphology: 'Ulcerative mucosal lesion with central epithelial defect and fibrinous bed',
      color: 'Central yellowish-gray fibrinous base surrounded by an erythematous mucosal halo',
      margins: 'Elevated, everted and irregular mucosal borders',
      texture: 'Irregular architectural depression (visual appearance only; depth and induration require palpation)',
      distribution: 'Focal localized ulcerative crater',
      category: 'malignancy_suspected',
      whiteOrRedAreas: 'Yellowish-white central fibrinous exudate within an erythematous atrophic ulcerative halo.',
      surfaceAppearance: 'Depressed central crater with irregular floor and raised peripheral mucosal margins.',
      shapeAndBorders: 'Circumscribed to irregular oval crater with rolled or everted margins.',
      relationshipWithSurroundingTissue: 'Demarcated step-off from adjacent mucosa with surrounding inflammatory erythema; depth of invasion requires palpation and histological staging.',
      clinicalDistinction: 'Distinguished from superficial aphthous ulcer: persistent, raised margins with central architectural loss; diagnostic punch biopsy indicated if non-healing beyond 14 days.',
      preliminary: 'Clinical suspicion of progressive ulcerative oral lesion. Urgent specialist referral and punch biopsy indicated.',
      concerns: 'Concern for invasive squamous cell carcinoma (OSCC) or chronic granulomatous breakdown. Histopathological tissue biopsy mandatory.'
    };
  }

  // 3. White coating (saburral, candidal film, wipeable)
  if (/coating|coated|saburral|wipe|scrapable|fur|thrush|candida/.test(h) || (resolvedSite.subsiteId === 'dorsal_tongue' && !/plaque|leuko/i.test(h) && !/ulcer|erythro/i.test(h))) {
    return {
      type: 'white_coating',
      label: 'White mucosal coating (Tongue dorsum / mucosal film)',
      morphology: 'Superficial diffuse white coating across mucosal surface',
      color: 'Whitish to cream-colored superficial coating over pinkish mucosal bed',
      margins: 'Diffuse, feathered borders without elevated indurated margins',
      texture: 'Velvety / papular surface accumulation (visual appearance only)',
      distribution: 'Diffuse surface distribution across tongue dorsum / mucosal bed; not a discrete fixed plaque',
      category: 'screen_positive',
      whiteOrRedAreas: 'Creamy to grayish-white superficial film over pinkish mucosal bed; underlying mucosal erythema may be present if candidal.',
      surfaceAppearance: 'Velvety, papular or curd-like surface accumulation over filiform papillae.',
      shapeAndBorders: 'Feathered, poorly circumscribed borders blending into surrounding lingual papillae.',
      relationshipWithSurroundingTissue: 'Superficial accumulation resting over mucosal epithelium without visible tissue displacement; scrapability requires tactile gauze wiping test.',
      clinicalDistinction: 'Distinguished from fixed keratotic plaque: coating appears superficial; sterile gauze wiping test during physical exam is required to determine whether it is removable (suggesting saburral coating or candidiasis) vs fixed plaque. Absence of an obvious ulcer does not establish benignity.',
      preliminary: 'Superficial white mucosal coating. Physical examination with sterile gauze wiping test recommended.',
      concerns: 'Superficial mucosal accumulation. Distinguishing removable coating/candidiasis from fixed hyperkeratotic plaque requires clinical wiping test. Premalignancy cannot be excluded without clinical evaluation.'
    };
  }

  // 4. White plaque (Fixed, Leukoplakia-like)
  if (/plaque|leukoplak|white patch|fixed white/.test(h)) {
    return {
      type: 'white_plaque',
      label: 'White plaque (Leukoplakia-like)',
      morphology: 'Discrete, elevated white mucosal plaque with fixed borders',
      color: 'Leukoplakic (opaque white to grayish-white mucosal plaque)',
      margins: 'Demarcated, slightly elevated mucosal borders',
      texture: 'Plaque-like / mildly corrugated surface pattern (visual appearance only)',
      distribution: 'Focal or localized mucosal plaque',
      category: 'opmd',
      whiteOrRedAreas: 'Opaque chalky or grayish-white mucosal plaque; absence of ulceration does not establish benignity.',
      surfaceAppearance: 'Adherent plaque with mildly corrugated, leathery or fissured surface architecture.',
      shapeAndBorders: 'Demarcated, irregular or geographical borders elevated slightly above adjacent mucosa.',
      relationshipWithSurroundingTissue: 'Distinct step-off from adjacent normotrophic mucosa; non-removability and dysplasia grade require gauze rubbing and biopsy.',
      clinicalDistinction: 'Distinguished from superficial coating: adherent, non-scrapable plaque requiring incisional biopsy to evaluate for epithelial dysplasia. Absence of an obvious ulcer does not establish benignity.',
      preliminary: 'Oral Potentially Malignant Disorder (OPMD) presentation consistent with leukoplakic plaque. Specialist review and biopsy recommended.',
      concerns: 'Concern for Oral Leukoplakia / OPMD. Epithelial dysplasia or carcinoma in situ cannot be excluded without histopathology.'
    };
  }

  // 5. Linea alba / occlusal line pattern (Supported by occlusal history)
  if (/linea alba|occlusal plane|occlusal line/.test(h)) {
    return {
      type: 'linea_alba_pattern',
      label: 'Linear keratotic band (Linea alba pattern supported by occlusal history)',
      morphology: 'Linear whitish mucosal band aligned with dental occlusal plane',
      color: 'Pale whitish translucent band without ulceration or erythroplakic component',
      margins: 'Linear, smooth borders following occlusal contact line',
      texture: 'Smooth to mildly hyperkeratotic surface (visual appearance only)',
      distribution: 'Linear distribution along occlusal plane of buccal mucosa',
      category: 'screen_positive',
      whiteOrRedAreas: 'Narrow whitish linear hyperkeratosis; no associated ulceration or erythroplakic changes.',
      surfaceAppearance: 'Smooth mucosal surface without exophytic projections or nodularity.',
      shapeAndBorders: 'Linear horizontal configuration aligned with interdental biting line.',
      relationshipWithSurroundingTissue: 'Flushes with surrounding buccal mucosa; clinical correlation required to exclude early OPMD.',
      clinicalDistinction: 'Supported by occlusal alignment in history; clinical correlation required to confirm stability. Absence of an ulcer does not establish benignity.',
      preliminary: 'Linear hyperkeratotic pattern concordant with occlusal plane. Clinical surveillance recommended.',
      concerns: 'Frictional mucosal thickening. While occlusal history supports frictional etiology, in-person clinical correlation is required.'
    };
  }

  // 6. Keratotic-appearing mucosal area (corrugated, habit/friction associated)
  const hasHabitNegation = /no\s+(?:tobacco|habit|smoking|chewing)/i.test(h);
  if (/keratos|leathery|wrinkle|corrugat|smokeless|friction|sharp tooth|cheek bit/.test(h) || (!hasHabitNegation && /khaini|gutkha|tobacco|chew/.test(h))) {
    return {
      type: 'keratotic_area',
      label: 'Keratotic-appearing mucosal area',
      morphology: 'Thickened, leathery or corrugated keratotic-appearing mucosal area',
      color: 'Leukoplakic / grayish-white translucent keratotic hue',
      margins: 'Irregular borders blending into adjacent mucosa along habit or friction zone',
      texture: 'Corrugated / leathery surface pattern (visual appearance only)',
      distribution: 'Regional distribution associated with chronic habit or mechanical contact',
      category: 'opmd',
      whiteOrRedAreas: 'Translucent to grayish-white mucosal thickening with corrugated or wrinkled mucosal folds.',
      surfaceAppearance: 'Wrinkled, leathery or pumice-like keratotic surface pattern.',
      shapeAndBorders: 'Diffuse to irregular borders blending into surrounding mucosal tissue.',
      relationshipWithSurroundingTissue: 'Blends into neighboring mucosa; absence of ulceration does not rule out dysplasia within thickened epithelium.',
      clinicalDistinction: 'Distinguished from discrete plaque: diffuse leathery / wrinkled surface texture associated with chronic mechanical friction or habit contact; does not wipe away. Absence of an obvious ulcer does not establish benignity.',
      preliminary: 'Keratotic mucosal changes noted in habit/friction contact zone. Habit cessation counseling and surveillance recommended.',
      concerns: 'Mucosal hyperkeratosis secondary to habit irritation or mechanical trauma. Surveillance and habit cessation required; biopsy if persistent.'
    };
  }

  // 7. Red patch (Erythroplakia-like / Atrophic)
  if (/red patch|erythroplak|burning red|atrophic patch|velvety red|erythema/.test(h)) {
    return {
      type: 'red_patch',
      label: 'Red patch (Erythroplakia-like appearance)',
      morphology: 'Circumscribed velvety red mucosal patch / erythematous atrophic zone',
      color: 'Intensely erythematous (red) velvety surface without prominent white keratosis',
      margins: 'Distinct, sharply demarcated or irregular borders',
      texture: 'Smooth to velvety atrophic surface (visual appearance only)',
      distribution: 'Solitary focal red patch',
      category: 'opmd',
      whiteOrRedAreas: 'Intense focal erythematous red atrophic patch lacking normal mucosal papillation; no overt ulceration.',
      surfaceAppearance: 'Velvety atrophic surface with fine epithelial thinning.',
      shapeAndBorders: 'Sharply circumscribed or irregular mucosal boundary.',
      relationshipWithSurroundingTissue: 'Abrupt step-off from neighboring pink mucosa; high risk of high-grade dysplasia or carcinoma in situ.',
      clinicalDistinction: 'Distinguished from inflammatory mucositis: persistent solitary red patch lacking obvious infectious etiology carries high risk of cellular atypia or early carcinoma. Absence of an obvious ulcer does not establish benignity.',
      preliminary: 'Solitary erythematous mucosal patch. Priority specialist evaluation and diagnostic biopsy indicated.',
      concerns: 'Concern for Erythroplakia / high-grade epithelial dysplasia or carcinoma in situ. Urgent biopsy mandatory.'
    };
  }

  // 8. Irregular surface pattern (Verrucous / Exophytic)
  if (/verrucous|papillar|exophyt|cauliflower|growth|mass|nodul/.test(h)) {
    return {
      type: 'irregular_surface',
      label: 'Irregular surface pattern (Verrucous / Exophytic)',
      morphology: 'Irregular verrucous / papillary exophytic surface pattern',
      color: 'Pinkish-white to gray irregular surface projections',
      margins: 'Lobulated, uneven distinct borders',
      texture: 'Papillomatous / exophytic architecture (visual appearance only)',
      distribution: 'Localized exophytic mucosal elevation',
      category: 'malignancy_suspected',
      whiteOrRedAreas: 'Mixed pink and whitish papillary or verrucous projections.',
      surfaceAppearance: 'Warty, cauliflower-like or pebble-grained exophytic projections.',
      shapeAndBorders: 'Lobulated, uneven distinct borders elevated above mucosal plane.',
      relationshipWithSurroundingTissue: 'Distinct exophytic mass arising from mucosal base; depth and broad-based pushing margin require biopsy.',
      clinicalDistinction: 'Distinguished from flat plaques: elevated warty/papillomatous surface architecture requiring deep incisional biopsy to evaluate architecture.',
      preliminary: 'Exophytic / verrucous mucosal architecture. Urgent specialist surgical oncology evaluation indicated.',
      concerns: 'Concern for Verrucous Carcinoma or exophytic Squamous Cell Carcinoma. Deep incisional biopsy mandatory.'
    };
  }

  // 9. White appearance on tongue
  if (isTongue) {
    return {
      type: 'white_tongue_abnormality',
      label: 'White mucosal alteration on tongue (Differential evaluation required)',
      morphology: 'Focal or diffuse white mucosal alteration on tongue surface',
      color: 'Whitish to pale mucosal discoloration with visible surface textural contrast',
      margins: 'Partially demarcated borders transitioning into adjacent lingual papillae',
      texture: 'Altered surface texture (visual observation only; consistency requires palpation)',
      distribution: 'Localized or diffuse across tongue mucosal subsite',
      category: 'screen_positive',
      whiteOrRedAreas: 'Visible white mucosal changes without obvious central ulceration; absence of an obvious ulcer does not establish benignity.',
      surfaceAppearance: 'Surface texture showing opacity and focal alteration against adjacent lingual mucosa.',
      shapeAndBorders: 'Feathered to irregular contour; precise borders require clinical retraction and illumination.',
      relationshipWithSurroundingTissue: 'Transition zone with surrounding lingual mucosa; sterile gauze test required to assess removability.',
      clinicalDistinction: 'Distinguishing superficial coating, candidiasis, and keratotic plaque (OPMD) is impossible from photograph alone; in-person wiping test and biopsy required. Absence of an ulcer does not establish benignity.',
      preliminary: 'White mucosal alteration on tongue. In-person clinical examination, gauze wiping test, and specialist review recommended.',
      concerns: 'Indeterminate white mucosal alteration. Premalignant dysplasia (OPMD) or fungal infection cannot be excluded without clinical examination.'
    };
  }

  // 10. Indeterminate oral mucosal alteration (Default fallback)
  return {
    type: 'indeterminate_mucosal_abnormality',
    label: 'Indeterminate oral mucosal alteration (Screen-positive feature requiring clinical correlation)',
    morphology: 'Focal oral mucosal surface alteration presenting visual contrast against adjacent mucosa',
    color: 'Mucosal surface showing focal chromatic/tonal variation',
    margins: 'Visual boundary transitioning into surrounding mucosal tissue',
    texture: 'Visual surface texture (consistency requires digital palpation)',
    distribution: 'Localized to visible mucosal field (contralateral comparison requires in-person intraoral inspection)',
    category: 'screen_positive',
    whiteOrRedAreas: 'Focal mucosal surface alteration; absence of an obvious ulcer does not establish benignity or rule out early malignancy.',
    surfaceAppearance: 'Surface alteration with focal textural contrast compared to neighboring mucosal bed.',
    shapeAndBorders: 'Irregular to focal visual contour; depth and infiltration cannot be evaluated visually.',
    relationshipWithSurroundingTissue: 'Visual border demarcated from surrounding mucosa; digital palpation and biopsy required for tissue assessment.',
    clinicalDistinction: 'Absence of an obvious ulcer or exophytic mass does not establish benignity. Early premalignant dysplasias, candidiasis, and early carcinomas frequently present as non-ulcerated flat or coated mucosal changes.',
    preliminary: 'Indeterminate mucosal alteration detected during screening. Mandatory in-person clinical correlation and digital palpation recommended.',
    concerns: 'Indeterminate mucosal alteration. Premalignant dysplasia (OPMD) or early neoplastic change cannot be excluded by photographic appearance alone. Clinical physical examination and surveillance mandatory.'
  };
}

`;

content = content.slice(0, idx1) + newClassifyVisualAbnormality + content.slice(idxEnd1);
writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated classifyVisualAbnormality');

