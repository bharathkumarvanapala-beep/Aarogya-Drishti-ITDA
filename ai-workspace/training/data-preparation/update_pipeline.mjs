import { readFileSync, writeFileSync } from 'node:fs';

// --- 1. UPDATE src/research-ai.mjs ---
console.log('Reading src/research-ai.mjs...');
let jsContent = readFileSync('src/research-ai.mjs', 'utf8');

// A. classifyVisualAbnormality
const startMarker1 = 'export function classifyVisualAbnormality(historyText = \'\', resolvedSite = {}) {';
const endMarker1 = 'function createDifferential(';
const idx1 = jsContent.indexOf(startMarker1);
const idxEnd1 = jsContent.indexOf(endMarker1);

if (idx1 === -1 || idxEnd1 === -1) {
  throw new Error('classifyVisualAbnormality markers not found in src/research-ai.mjs');
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
      relationshipWithSurroundingTissue: 'Flushes with surrounding buccal mucosa; clinical correlation required to confirm stability.',
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

jsContent = jsContent.slice(0, idx1) + newClassifyVisualAbnormality + jsContent.slice(idxEnd1);

// B. generateDifferentialReasoning
const startMarker2 = 'export function generateDifferentialReasoning(abnormalityType, resolvedSite, historyText = \'\', riskFactors = []) {';
const endMarker2 = 'export function generateFollowUpRecommendations(';
const idx2 = jsContent.indexOf(startMarker2);
const idxEnd2 = jsContent.indexOf(endMarker2);

if (idx2 === -1 || idxEnd2 === -1) {
  throw new Error('generateDifferentialReasoning markers not found in src/research-ai.mjs');
}

const newGenerateDifferentialReasoning = `export function generateDifferentialReasoning(abnormalityType, resolvedSite, historyText = '', riskFactors = []) {
  switch (abnormalityType) {
    case 'ulcer':
      return [
        createDifferential(
          'Oral Squamous Cell Carcinoma (OSCC) - high suspicion',
          'Progressive ulcerative mucosal breakdown with irregular or raised borders is the classic clinical hallmark of invasive squamous cell carcinoma.',
          'Visible focal ulceration with central fibrinous base and raised, everted peripheral margins.',
          'Duration of ulcer (>14 days?), tobacco/alcohol/betel nut use duration, digital palpation for tissue induration, and regional lymph node staging.',
          'Depth of tissue invasion, microvascular or perineural infiltration, and histological malignancy grade; confirmatory incisional biopsy is mandatory.',
          'Perform bimanual digital palpation to evaluate tissue induration and lesion depth; palpate cervical lymph node basins (levels I–V).'
        ),
        createDifferential(
          'Chronic Traumatic / Frictional Ulcer (Requires Exclusion of Malignancy)',
          'Repetitive mechanical trauma from sharp dentition or restorations produces mucosal ulceration; chronic traumatic beds can harbor malignant transformation.',
          'Focal mucosal defect located adjacent to potential occlusal surfaces or dental contact planes.',
          'Identification of offending sharp cusp or prosthesis; whether the ulcer resolves within 10–14 days following irritation elimination.',
          'Whether the chronic traumatic bed harbors dysplastic malignant transformation; persistent ulcers must be biopsied.',
          'Inspect dentition for sharp edges; re-evaluate within 10–14 days; persistent ulcers mandate diagnostic biopsy.'
        ),
        createDifferential(
          'Deep Mycotic / Chronic Granulomatous Ulceration',
          'Chronic granulomatous infections (e.g. tuberculosis, histoplasmosis) can present as persistent oral ulcers with irregular granular bases.',
          'Granular central necrotic base with peripheral erythematous reaction.',
          'Systemic constitutional symptoms (fever, chronic cough, weight loss), immunocompromise status, and chest radiography.',
          'Granuloma formation and micro-organism identification (requires special histologic stains: PAS, GMS, or Ziehl-Neelsen).',
          'Biopsy with specialized histological stains and mycobacterial / fungal cultures.'
        )
      ];

    case 'mixed_red_white':
      return [
        createDifferential(
          'Erythroleukoplakia (High-Risk OPMD)',
          'Mixed red and white mucosal lesions carry significantly elevated malignant transformation rates (up to 30–50%) compared to homogeneous white plaques.',
          'Speckled appearance showing bright erythematous atrophic zones intermixed with keratotic white nodular patches.',
          'Tobacco/areca habit duration, spontaneous pain or burning sensation, and persistence beyond 14 days.',
          'Presence of severe dysplasia, carcinoma in situ, or early microinvasive squamous cell carcinoma; multi-site punch biopsy mandatory.',
          'Bimanual palpation for tissue induration; multi-site incisional biopsy of both red atrophic and white nodular components.'
        ),
        createDifferential(
          'Oral Lichen Planus (Erosive / Atrophic variant)',
          'Chronic autoimmune mucocutaneous disorder presenting with mixed red atrophic/ulcerative areas and white reticular striations.',
          'Interspersed erythematous background and whitish surface changes on mucosal surface.',
          'Contralateral cheek inspection to assess contralateral mucosal involvement, presence of Wickham striae, skin/nail/genital examination, and exacerbation with spicy food.',
          'Subepithelial band-like T-lymphocytic infiltrate and basal membrane liquefaction on histopathology.',
          'Systematic intraoral bilateral mapping, extraoral dermatological inspection, and diagnostic incisional biopsy.'
        ),
        createDifferential(
          'Oral Squamous Cell Carcinoma (Early / Non-homogeneous)',
          'Early invasive OSCC frequently presents as a non-homogeneous erythroleukoplakic or speckled mucosal lesion without overt ulceration.',
          'Granular, irregular surface architecture with peripheral erythematous margin.',
          'Lesion duration, induration on clinician palpation, and presence of cervical lymphadenopathy.',
          'Basement membrane invasion and histopathological differentiation grade; biopsy is mandatory.',
          'Bimanual digital palpation of mucosal base and comprehensive cervical lymph node examination (levels I–V).'
        )
      ];

    case 'white_plaque':
      return [
        createDifferential(
          'Oral Leukoplakia (Homogeneous / Non-homogeneous OPMD)',
          'Fixed white mucosal plaque that cannot be wiped away and cannot be characterized clinically as any other disease entity. Absence of an obvious ulcer does not establish benignity.',
          'Discrete, adherent white plaque with partially demarcated margins on mucosal surface.',
          'Areca nut/tobacco habit history, duration, and clinical confirmation that plaque cannot be rubbed off with sterile gauze.',
          'Degree of epithelial dysplasia (mild, moderate, severe) or early carcinoma in situ; diagnostic incisional biopsy required.',
          'Perform sterile gauze rub-off test to confirm non-removability; bimanual palpation for submucosal induration; incisional biopsy.'
        ),
        createDifferential(
          'Hyperplastic / Pseudomembranous Candidiasis',
          'Candidal fungal colonization frequently forms white mucosal plaques or curd-like patches.',
          'Elevated white surface accumulation over mucosal bed.',
          'Response to topical antifungal trial; history of steroid inhalers, antibiotic use, or xerostomia; whether surface can be partially wiped away.',
          'Candidal pseudohyphae/hyphae confirmation via KOH smear or PAS-stained biopsy.',
          'Perform moist gauze rub-off test; obtain mucosal scraping for 10% KOH fungal microscopy.'
        ),
        createDifferential(
          'Frictional / Mechanical Keratosis (Requires Dysplasia Exclusion)',
          'Chronic physical abrasion stimulates protective epithelial hyperkeratosis, which must be clinically differentiated from true premalignant leukoplakia.',
          'Pale or translucent white mucosal thickening along mechanical friction contact zones.',
          'Confirmation of mechanical habit (e.g. cheek chewing, sharp tooth); regression within 2–3 weeks of habit cessation.',
          'Cytological atypia or architectural dysplasia on microscopic examination; non-resolving lesions mandate biopsy.',
          'Identification and smoothing of sharp cusps; recall examination in 14 days; diagnostic biopsy if plaque persists.'
        )
      ];

    case 'white_coating':
    case 'white_tongue_abnormality':
      return [
        createDifferential(
          'Superficial Tongue Coating / Saburral Deposition',
          'Elongated filiform papillae and accumulation of desquamated epithelial cells, food debris, and oral bacteria produce a superficial white layer.',
          'Diffuse superficial whitish to cream-colored layer over tongue dorsum or mucosal papillae without discrete elevated indurated margins.',
          'Oral hygiene practices, hydration status, tongue cleaning habits, and whether coating easily scrapes off with moist sterile gauze.',
          'Removability cannot be confirmed from photograph alone; requires physical mechanical wiping with moist gauze in clinic.',
          'Perform moist sterile gauze wiping (rub-off) test to test scrapability; examine underlying lingual papillae.'
        ),
        createDifferential(
          'Oral Candidiasis (Pseudomembranous or Hyperplastic)',
          'Candidal fungal overgrowth produces curd-like white plaques or film over mucous membranes.',
          'Soft or curd-like whitish accumulation over tongue mucosa with or without underlying erythematous reaction.',
          'Inhaler/antibiotic/corticosteroid use, glycemic control, xerostomia, burning symptoms on eating.',
          'Fungal pseudohyphae and scrapability cannot be confirmed from photographic appearance alone; microscopic cytology required.',
          'Perform gauze wiping test (pseudomembranous wipes away leaving raw/erythematous base); obtain scraping for 10% KOH fungal smear.'
        ),
        createDifferential(
          'Oral Keratotic Lesion / Leukoplakia (OPMD Rule-Out)',
          'Adherent white plaque or hyperkeratosis that cannot be wiped off. Crucially, absence of an obvious ulcer does not establish benignity.',
          'Discrete, fixed opaque white plaque or leathery hyperkeratotic area on tongue mucosa (lateral, dorsal, or ventral).',
          'Tobacco/areca nut exposure history, lesion duration (>14 days), whether plaque wipes off with sterile gauze.',
          'Epithelial dysplasia grade (mild, moderate, severe) or carcinoma in situ can ONLY be diagnosed by histopathology; visual appearance cannot determine dysplasia.',
          'Perform sterile gauze rub-off test to confirm non-removability; bimanual digital palpation for induration; diagnostic incisional/punch biopsy.'
        ),
        createDifferential(
          'Other White Mucosal Conditions (Oral Lichen Planus or Chronic Habit Keratosis)',
          'Chronic autoimmune striations (Wickham striae) or chemical/mechanical hyperkeratosis along lingual borders.',
          'Linear, reticular, or corrugated white patterns on tongue mucosa.',
          'Contralateral tongue and cheek inspection to assess bilateral mucosal involvement, extraoral skin/nail exam, habit exposure.',
          'Subepithelial lymphocytic infiltration vs dysplastic hyperkeratosis requires microscopic histopathological evaluation.',
          'Full intraoral inspection of bilateral mucosa, extraoral skin/nail examination, and diagnostic biopsy if persistent.'
        )
      ];

    case 'linea_alba_pattern':
      return [
        createDifferential(
          'Frictional Keratosis / Linea Alba (Supported by occlusal alignment in history)',
          'Chronic mechanical suction or biting along the occlusal plane produces a linear hyperkeratotic band.',
          'Whitish keratotic band aligned horizontally along the occlusal surfaces of teeth.',
          'Presence of sharp cusps, bruxism or clenching habit, asymptomatic stability over time.',
          'Microscopic cellular architecture without histological evaluation; in-person clinical correlation required.',
          'Dental occlusal inspection for sharp edges or clenching; confirm long-term stability and absence of induration.'
        ),
        createDifferential(
          'Smokeless Tobacco / Chemical Keratosis (Rule-Out)',
          'Placement of smokeless tobacco or areca nut along the buccal sulcus produces corrugated grayish-white hyperkeratosis.',
          'Translucent to grayish-white mucosal thickening along buccal contact zone.',
          'Quantification of smokeless tobacco, gutkha, or areca nut chewing habits.',
          'Dysplasia cannot be excluded without clinical evaluation and habit cessation monitoring.',
          'Comprehensive habit history, cessation counseling, and recall evaluation in 14 days.'
        ),
        createDifferential(
          'Oral Leukoplakia (OPMD Rule-Out)',
          'True premalignant white plaque can arise along buccal mucosa and may initially resemble frictional hyperkeratosis.',
          'Focal white mucosal thickening.',
          'Habit history, lesion duration, non-removability on gauze test.',
          'Histological exclusion of epithelial dysplasia requires diagnostic biopsy if persistent.',
          'Gauze wiping test and diagnostic biopsy if plaque is non-linear, non-removable, or persistent.'
        )
      ];

    case 'red_patch':
      return [
        createDifferential(
          'Erythroplakia (High-Risk OPMD)',
          'Persistent solitary red velvety patch lacking obvious traumatic or inflammatory origin; carries high dysplasia/carcinoma risk (>85%). Absence of an obvious ulcer does not establish benignity.',
          'Circumscribed velvety red mucosal patch without predominant white hyperkeratosis.',
          'Habit history (tobacco/alcohol), failure to resolve within 14 days after removing potential local irritants.',
          'Cellular atypia, severe dysplasia, or carcinoma in situ; urgent scalpel biopsy required.',
          'Prompt specialist referral for diagnostic incisional or punch biopsy; bimanual palpation.'
        ),
        createDifferential(
          'Erythematous / Atrophic Candidiasis',
          'Fungal proliferation can produce smooth, burning red mucosal patches, especially under prostheses or on tongue dorsum.',
          'Generalized or focal erythematous mucosal depapillation / blush.',
          'Denture wearing habits at night, burning sensation on spicy food, response to trial of topical antifungal.',
          'Fungal colonization vs premalignant epithelial atrophy requires fungal smear and clinical monitoring.',
          '10% KOH fungal microscopy smear; empiric topical antifungal trial with close clinical monitoring.'
        )
      ];

    case 'keratotic_area':
      return [
        createDifferential(
          'Smokeless Tobacco Keratosis / Pouch Keratosis (OPMD)',
          'Chronic placement of smokeless tobacco/areca nut produces characteristic wrinkled, leathery hyperkeratosis. Absence of an obvious ulcer does not establish benignity.',
          'Corrugated grayish-white mucosal thickening along tobacco contact zone.',
          'Specific habit placement site, daily frequency and duration, whether lesion diminishes after 2–6 weeks of habit cessation.',
          'Whether dysplasia is developing within the thickened keratotic epithelium; biopsy required if persistent.',
          'Habit cessation counseling; bimanual digital palpation; incisional biopsy if lesion persists.'
        ),
        createDifferential(
          'Frictional Keratosis (Requires Dysplasia Exclusion)',
          'Chronic mechanical suction or biting produces focal hyperkeratosis mimicking premalignant leukoplakia.',
          'Whitish keratotic band aligned with occlusal surfaces or sharp dental contacts.',
          'Presence of sharp cusps, bruxism or clenching habit, asymptomatic stability.',
          'Microscopic cellular architecture without histological evaluation; persistent lesions mandate biopsy.',
          'Dental smoothing of sharp cusps; 14-day recall examination to evaluate resolution.'
        ),
        createDifferential(
          'Oral Submucous Fibrosis (OSMF) with secondary keratosis',
          'Chronic areca nut chewing induces progressive submucosal fibrosis with blanched mucosal appearance.',
          'Blanched, mottled mucosal appearance with loss of mucosal elasticity.',
          'Inter-incisal mouth opening measurement (<35 mm suggests trismus), burning sensation, habit duration.',
          'Histological collagen hyalinization and subepithelial vascular loss.',
          'Measure inter-incisal distance with calipers; palpate for fibrous bands in buccal mucosa and palate.'
        )
      ];

    case 'irregular_surface':
      return [
        createDifferential(
          'Verrucous Carcinoma / OSCC (Exophytic)',
          'Slow-growing, warty, exophytic mucosal proliferation with pebbly surface architecture.',
          'Elevated verrucous, papillary or exophytic surface projections.',
          'Lesion duration, smokeless tobacco habit duration, presence of local tissue destruction.',
          'Pushing vs infiltrative basement membrane invasion on deep biopsy.',
          'Deep full-thickness incisional biopsy including tumor-host interface; cervical lymph node staging.'
        ),
        createDifferential(
          'Oral Squamous Papilloma / Verruca Vulgaris',
          'Benign epithelial proliferation induced by low-risk Human Papillomavirus (HPV).',
          'Finger-like or cauliflower-like projections with pedunculated or sessile base.',
          'Multiplicity of lesions, history of oral sex, lack of progressive induration.',
          'Koilocytic atypia and viral cytopathic effects on histopathology.',
          'Excisional biopsy with histological examination.'
        )
      ];

    default: // indeterminate_mucosal_abnormality
      return [
        createDifferential(
          'Indeterminate Oral Mucosal Abnormality / Early Epithelial Change',
          'Visible focal mucosal alteration. Crucially, absence of an obvious ulcer or exophytic growth does NOT establish benignity; micro-invasive carcinoma and high-grade dysplasia can present without ulceration.',
          'Focal mucosal surface alteration presenting chromatic or textural contrast against adjacent mucosa.',
          'Lesion chronicity (>14 days?), tobacco/areca nut/alcohol exposure history, spontaneous pain, or localized bleeding.',
          'Cellular atypia and basement membrane integrity cannot be evaluated from a surface photograph; tissue biopsy required.',
          'Comprehensive intraoral inspection with bimanual digital palpation of mucosal tissue and regional lymph nodes (levels I–V).'
        ),
        createDifferential(
          'Oral Potentially Malignant Disorder (OPMD) - Rule-Out',
          'Early OPMD lesions can be visually subtle and lack obvious malignant hallmarks on 2D photography.',
          'Discrete focal mucosal alteration with visible contrast against surrounding mucosa.',
          'Habit duration, whether area resolves within 14 days of removing potential local mechanical or chemical irritants.',
          'Histopathological dysplasia grading requires scalpel tissue biopsy.',
          'Perform sterile gauze wiping test; habit cessation counseling; diagnostic incisional biopsy if lesion persists.'
        ),
        createDifferential(
          'Early Non-Ulcerated Carcinoma / Dysplasia - Exclusion Mandatory',
          'Malignancy does not always present as an overt ulcer; early invasive squamous cell carcinoma can present as a flat, irregular, or non-ulcerated mucosal alteration.',
          'Focal mucosal irregularity and altered surface texture.',
          'Palpatory induration, lesion chronicity (>14 days), high-risk habit exposure, regional lymph node enlargement.',
          'Histological invasion of the basement membrane cannot be determined from surface photographs; tissue biopsy is mandatory.',
          'Bimanual digital palpation for submucosal induration; cervical lymph node palpation (levels I–V); diagnostic punch or incisional biopsy.'
        ),
        createDifferential(
          'Superficial Inflammatory / Reactive Mucosal Change (Requires Active Exclusion of OPMD)',
          'Localized mucosal reaction secondary to mechanical, thermal, or chemical irritation. Can only be considered benign AFTER active clinical exclusion of premalignant dysplasia.',
          'Focal mucosal surface variation concordant with potential local irritation.',
          'Identification and elimination of local irritants; documentation of complete resolution after 10–14 days.',
          'Absence of dysplasia can only be confirmed after complete clinical resolution or histopathology.',
          'Dental inspection for sharp cusps or fractured restorations; re-evaluation after 10–14 days; persistent lesions mandate biopsy.'
        )
      ];
  }
}

`;

jsContent = jsContent.slice(0, idx2) + newGenerateDifferentialReasoning + jsContent.slice(idxEnd2);

// C. generateFollowUpRecommendations
const startMarker3 = 'export function generateFollowUpRecommendations(abnormalityType, category, quality, context = {}) {';
const endMarker3 = 'function analyzeClinicalContext({rawBytes, site, history, age, imageSha256}) {';
const idx3 = jsContent.indexOf(startMarker3);
const idxEnd3 = jsContent.indexOf(endMarker3);

if (idx3 === -1 || idxEnd3 === -1) {
  throw new Error('generateFollowUpRecommendations markers not found in src/research-ai.mjs');
}

const newGenerateFollowUpRecommendations = `export function generateFollowUpRecommendations(abnormalityType, category, quality, context = {}) {
  const isHighRisk = category === 'malignancy_suspected';
  const isOpmd = category === 'opmd';

  const historyText = String(context.history || '').toLowerCase();
  const hasConcerningSymptoms = /\b(?:pain|bleed|ulcer|grow|progres|rapid|swelling|lump)\b/i.test(historyText);
  const hasChronicDuration = /\b(?:month|year|\d{2,}\s*days|[2-9]\s*weeks)\b/i.test(historyText);
  const hasHighRiskHabits = /\b(?:tobacco|gutka|khaini|pan|areca|smoke|bidi|cigarette|alcohol)\b/i.test(historyText);

  const repeatNeeded = Boolean(quality && (quality.qualityText?.includes('Sub-optimal') || quality.qualityText?.includes('Low illumination')));

  const repeatGuidance = repeatNeeded
    ? 'Repeat photograph recommended: capture under bright direct illumination (avoiding flash specular washout), retract cheek/lips with wooden tongue depressor, dry saliva with sterile gauze, and keep lens 10–15 cm from lesion with sharp focus on borders.'
    : 'Current photograph resolution and lighting are adequate for remote screening triage. Direct in-person clinical examination remains mandatory.';

  const examGuidance =
    'In-person physical examination required: perform bimanual digital palpation of oral lesion to assess tissue induration and depth; perform sterile gauze wiping test to differentiate superficial coating from fixed plaque; perform palpation of cervical lymph node basins (levels I to V).';

  const additionalPatientHistoryRequired =
    '1. Lesion chronicity & duration: Verify exact duration (persisting >14 days?). ' +
    '2. Tobacco & substance history: Detailed quantification of smokeless tobacco (gutkha, khaini, zarda), combustible tobacco (bidi, cigarette), areca nut / betel quid, and alcohol consumption. ' +
    '3. Mechanical factors: Assess sharp teeth, broken restorations, or ill-fitting dentures. ' +
    '4. Symptom history: Spontaneous pain, burning sensation on spicy food, localized bleeding, or dysphagia. ' +
    '5. Medical history: Prior oral lesions, immunosuppression, diabetes, or topical/inhaled corticosteroid usage.';

  const appropriatePhysicalExamination =
    '1. Direct mucosal visual inspection: Full oral cavity visualization with good illumination and cheek/tongue retraction. ' +
    '2. Bimanual digital palpation: Palpate lesion to evaluate tissue induration, depth, and tenderness against underlying structures. ' +
    '3. Gauze wiping (rub-off) test: Gently rub white areas with moist sterile gauze to determine whether lesion is removable (coating/candidiasis) vs fixed (keratosis/leukoplakia). ' +
    '4. Cervical lymph node examination: Systematic bilateral palpation of regional lymph node stations (submental, submandibular, upper/middle/lower jugular, levels I to V).';

  let specialist;
  let urgency;
  let investigations;

  if (isHighRisk || abnormalityType === 'ulcer' || abnormalityType === 'red_patch' || abnormalityType === 'mixed_red_white' || abnormalityType === 'irregular_surface') {
    specialist = 'Head & Neck Surgical Oncologist / Oral & Maxillofacial Surgeon';
    urgency = (hasConcerningSymptoms || hasChronicDuration)
      ? 'Immediate Specialist Referral (evaluate within 7 days; do not delay with passive observation)'
      : 'Urgent Specialist Referral (evaluate within 7 to 14 days for incisional biopsy)';
    investigations = 'Urgent diagnostic incisional or punch biopsy of representative lesion margin for histopathological diagnosis, staging, and dysplasia grading; contrast-enhanced CT/MRI if deep invasion suspected.';
  } else if (isOpmd || abnormalityType === 'white_plaque' || abnormalityType === 'keratotic_area') {
    specialist = 'Oral Medicine Specialist / Maxillofacial Surgeon';
    urgency = hasHighRiskHabits
      ? 'Priority Specialist Referral (evaluate within 14 days for biopsy mapping and habit intervention)'
      : 'Specialist Evaluation (evaluate within 2 to 3 weeks; prompt biopsy if lesion is non-homogeneous or symptomatic)';
    investigations = 'Diagnostic incisional / punch biopsy indicated for any non-removable keratotic plaque; toluidine blue or autofluorescence adjunct if available; strict habit cessation protocol.';
  } else if (abnormalityType === 'white_coating' || abnormalityType === 'white_tongue_abnormality') {
    specialist = 'Oral Medicine Specialist / PHC Medical Officer with Dental Specialist Collaboration';
    urgency = 'Priority Clinical Evaluation & Specialist Referral (within 10 to 14 days; perform gauze wiping test; prompt biopsy if non-removable)';
    investigations = 'Moist sterile gauze wiping test (rub-off test); 10% KOH fungal microscopy smear; topical antifungal trial (clotrimazole / nystatin); refer to oral specialist for biopsy if persistent or non-scrapable.';
  } else {
    specialist = 'Oral Medicine Specialist / Medical Officer with Dental Collaboration';
    urgency = hasHighRiskHabits
      ? 'Priority Specialist Referral (within 14 days; do not delay referral simply to observe)'
      : 'Primary Care Clinical Correlation & Specialist Referral (within 14 days; do not delay referral simply to observe)';
    investigations = 'In-person physical clinical examination, digital tissue palpation, and cervical lymph node evaluation; diagnostic incisional/punch biopsy if lesion persists beyond 14 days; habit cessation counseling.';
  }

  const delayWarning = 'Do not recommend delaying referral simply to observe a lesion; persistent or concerning oral mucosal alterations mandate prompt specialist evaluation.';

  const phcActionPlan = [
    '1. Habit Cessation: Deliver immediate brief intervention counseling for smokeless tobacco, bidi/cigarettes, areca nut, and alcohol.',
    '2. Irritant & Trauma Removal: Inspect dentition for sharp cusps, broken teeth, or ill-fitting dentures causing mechanical trauma; refer to dentist for smoothing.',
    '3. Physical Clinical Exam: Perform bimanual digital palpation of oral lesion to assess induration and palpate cervical lymph node stations.',
    '4. Gauze Wiping / Rub-Off Test: Gently wipe white mucosal areas with moist sterile gauze to test scrapability (distinguishing superficial coating from fixed plaque).',
    \`5. Structured Clinical Recall & Specialist Referral: Execute referral according to assessed urgency (\${urgency}) for diagnostic biopsy; avoid unstructured or delayed observation for concerning lesions.\`
  ];

  return {
    additionalPatientHistoryRequired,
    appropriatePhysicalExamination,
    specialistReferral: specialist,
    referralUrgency: urgency,
    delayWarning,
    additionalInvestigations: investigations,
    nextClinicalExamination: examGuidance,
    directClinicalExaminationRequired: true,
    directClinicalExaminationGuidance: examGuidance,
    appropriateSpecialist: specialist,
    repeatPhotographyRecommended: repeatNeeded,
    repeatPhotographyGuidance: repeatGuidance,
    repeatPhotographyReason: repeatNeeded ? (quality?.qualityText || 'Sub-optimal image quality') : 'Photograph quality is satisfactory for screening triage.',
    phcActionPlan,
    source: 'IMAGE_OBSERVATION'
  };
}

`;

jsContent = jsContent.slice(0, idx3) + newGenerateFollowUpRecommendations + jsContent.slice(idxEnd3);

// D. validateAndSanitizeClinicalFindings
const startMarker4 = 'export function validateAndSanitizeClinicalFindings(result, context = {}) {';
const endMarker4 = 'export function runResearchAI(';
const idx4 = jsContent.indexOf(startMarker4);
const idxEnd4 = jsContent.indexOf(endMarker4);

if (idx4 === -1 || idxEnd4 === -1) {
  throw new Error('validateAndSanitizeClinicalFindings markers not found in src/research-ai.mjs');
}

const newValidateAndSanitizeClinicalFindings = `export function validateAndSanitizeClinicalFindings(result, context = {}) {
  if (!result || !result.findings) return result;

  const f = result.findings;
  const historyText = (context.history || f.userProvidedContext?.clinicalObservations || '').toLowerCase();
  const workerMentionedInduration = /indurat/i.test(historyText);
  const workerMentionedTenderness = /pain|tender|bleed/i.test(historyText);

  // Prohibited palpation / physical exam claims from visual strings
  const prohibitedPalpationPattern = /\\b(indurated|induration|firm|hard|rubbery|soft to (?:touch|palpation)|tenderness|tender|depth of \\d|deep invasion confirmed|lymph node (?:involvement|metastasis))\\b/gi;

  const sanitizeImageObservationText = (text) => {
    if (!text || typeof text !== 'string') return text;
    return text
      .replace(/\\bhealthy architectural alignment\\b/gi, 'demarcated visual mucosal boundary')
      .replace(/\\baligned with adjacent healthy architectural landmarks\\b/gi, 'visual boundary demarcated from adjacent mucosa')
      .replace(/\\bhealthy architectural landmarks\\b/gi, 'adjacent mucosal landmarks')
      .replace(/\\bbilateral symmetry\\b/gi, 'unilateral photographic field (contralateral inspection required)')
      .replace(/\\bsymmetrical anatomical landmarks\\b/gi, 'unilateral anatomical landmarks')
      .replace(/\\babsence of infiltration\\b/gi, 'submucosal depth and infiltration require clinical palpation and biopsy')
      .replace(/\\bnon-infiltrative margins\\b/gi, 'surface margins requiring palpation to assess depth')
      .replace(/\\bnon-infiltrative\\b/gi, 'visual boundary (depth assessable only by palpation/biopsy)')
      .replace(/\\bnormal tissue characteristics\\b/gi, 'mucosal surface appearance')
      .replace(/\\babsence of malignant changes\\b/gi, 'malignancy cannot be excluded by visual appearance alone')
      .replace(/\\bno malignant features\\b/gi, 'malignancy cannot be excluded by visual appearance alone')
      .replace(/\\babsence of malignant characteristics\\b/gi, 'malignancy cannot be excluded by visual appearance alone')
      .replace(/\\bnon-malignant\\b/gi, 'indeterminate')
      .replace(/\\bruled? out malignancy\\b/gi, 'malignancy cannot be excluded by visual appearance alone')
      .replace(/\\bbenign confirmed\\b/gi, 'clinical correlation required')
      .replace(/\\bcompletely non-malignant\\b/gi, 'indeterminate lesion requiring clinical correlation')
      .replace(/\\bbenign physiological variation\\b/gi, 'indeterminate mucosal alteration (clinical correlation required)')
      .replace(/\\bbenign mucosal changes\\b/gi, 'mucosal alteration (clinical examination required)')
      .replace(/\\btraumatic irritation\\b/gi, 'mucosal alteration (irritation requires clinical history/correlation)')
      .replace(/\\babsence of an? (?:obvious )?ulcer (?:proves|confirms|establishes) benign\\b/gi, 'absence of an obvious ulcer does not establish benignity')
      .replace(/\\bwait 14 days (?:before|to see|to observe)\\b/gi, 'prompt specialist evaluation indicated; do not delay referral simply to observe')
      .replace(/\\bindurated margins\\b/gi, 'elevated / raised margins')
      .replace(/\\bindurated\\b/gi, 'raised')
      .replace(/\\binduration\\b/gi, 'mucosal elevation')
      .replace(/\\bfirm mucosal base\\b/gi, 'granular surface base')
      .replace(/\\bfirm\\b/gi, 'raised')
      .replace(/\\bsupple, normal mucosal consistency\\b/gi, 'smooth mucosal surface appearance')
      .replace(/\\bsupple\\b/gi, 'smooth')
      .replace(prohibitedPalpationPattern, '[requires palpation assessment]');
  };

  // Helper to sanitize prohibited "low risk" / rule-out statements
  const prohibitedRuleOutPattern = /\\b(low (?:immediate )?(?:malignant|cancer) risk|non-malignant|ruled? out malignancy|benign confirmed)\\b/gi;

  const sanitizeRiskStatement = (text) => {
    if (!text || typeof text !== 'string') return text;
    return text.replace(
      prohibitedRuleOutPattern,
      'Indeterminate mucosal variation – In-person clinical correlation and surveillance required; malignancy cannot be excluded by visual appearance alone'
    );
  };

  // 1. Sanitize visual observation text
  if (f.observedVisualCharacteristics) {
    f.observedVisualCharacteristics = sanitizeRiskStatement(sanitizeImageObservationText(f.observedVisualCharacteristics));
  }
  if (f.visualObservation) {
    f.visualObservation = sanitizeRiskStatement(sanitizeImageObservationText(f.visualObservation));
  }
  if (f.possibleClinicalConcerns) {
    if (typeof f.possibleClinicalConcerns === 'string') {
      f.possibleClinicalConcerns = sanitizeRiskStatement(sanitizeImageObservationText(f.possibleClinicalConcerns));
    } else if (Array.isArray(f.possibleClinicalConcerns)) {
      f.possibleClinicalConcerns = f.possibleClinicalConcerns.map(c => sanitizeRiskStatement(sanitizeImageObservationText(c)));
    }
  }
  if (f.modelGeneratedAssessment) {
    f.modelGeneratedAssessment = sanitizeRiskStatement(sanitizeImageObservationText(f.modelGeneratedAssessment));
  }
  if (f.preliminaryAssessment) {
    f.preliminaryAssessment = sanitizeRiskStatement(sanitizeImageObservationText(f.preliminaryAssessment));
  }

  if (f.lesionCharacteristics) {
    if (f.lesionCharacteristics.morphology) {
      f.lesionCharacteristics.morphology = sanitizeImageObservationText(f.lesionCharacteristics.morphology);
    }
    if (f.lesionCharacteristics.margins) {
      f.lesionCharacteristics.margins = sanitizeImageObservationText(f.lesionCharacteristics.margins);
    }
    f.lesionCharacteristics.texture = 'Visual surface texture only; physical consistency requires palpation';
  }

  const userSite = context.site || f.userProvidedContext?.anatomicalSite;
  const historyRaw = context.history || f.userProvidedContext?.clinicalObservations || '';
  const resolvedSite = f._resolvedSite || resolveSpecificAnatomicalLocation(userSite, historyRaw);
  const visualAbnormality = f._visualAbnormality || classifyVisualAbnormality(historyText, resolvedSite);

  const hasUserSite = Boolean(userSite && userSite !== 'Not provided' && userSite !== 'Oral cavity (site unspecified)');
  const siteLocation = hasUserSite
    ? \`\${userSite} (corroborated with user input)\`
    : (resolvedSite.isSpecific
        ? \`\${resolvedSite.name} (identified from visual / clinical orientation; suspected site not provided)\`
        : 'Oral mucosa (anatomical location cannot be identified confidently from photographic perspective alone; suspected site not provided; in-person localization required)');

  // 2. A. IMAGE ASSESSMENT (All 6 core visual characterization features)
  f.imageAssessment = {
    anatomicalLocation: {
      value: resolvedSite.isSpecific ? resolvedSite.name : siteLocation,
      isSpecific: resolvedSite.isSpecific,
      subsiteId: resolvedSite.subsiteId,
      uncertainty: resolvedSite.uncertainty,
      source: 'IMAGE_OBSERVATION'
    },
    whiteOrRedAreas: {
      value: sanitizeImageObservationText(visualAbnormality.whiteOrRedAreas || 'Visual white and/or red mucosal features examined; absence of an obvious ulcer does not establish benignity.'),
      whiteFeatures: visualAbnormality.whiteFeatures || (visualAbnormality.type.includes('white') || visualAbnormality.type.includes('kerato') ? visualAbnormality.color : 'None distinct'),
      redFeatures: visualAbnormality.redFeatures || (visualAbnormality.type.includes('red') || visualAbnormality.type.includes('ulcer') ? visualAbnormality.color : 'None distinct'),
      ulcerAbsenceNote: 'Absence of an obvious ulcer does not establish benignity; dysplastic OPMDs and early malignant lesions frequently present without central ulceration.',
      source: 'IMAGE_OBSERVATION'
    },
    distribution: {
      value: visualAbnormality.distribution || 'Localized',
      description: sanitizeImageObservationText('Lesion distribution assessed in captured photographic visual field; contralateral intraoral inspection required for bilateral symmetry evaluation.'),
      source: 'IMAGE_OBSERVATION'
    },
    surfaceAppearance: {
      value: sanitizeImageObservationText(visualAbnormality.surfaceAppearance || visualAbnormality.texture || 'Visual surface texture pattern'),
      palpationCaveat: 'Visual surface texture only; physical tissue consistency, softness, or induration requires clinical palpation.',
      source: 'IMAGE_OBSERVATION'
    },
    shapeAndBorders: {
      shape: visualAbnormality.shape || 'Focal mucosal contour',
      borders: sanitizeImageObservationText(visualAbnormality.margins || f.lesionCharacteristics?.margins || 'Visual margin demarcation'),
      source: 'IMAGE_OBSERVATION'
    },
    relationshipWithSurroundingTissue: {
      value: sanitizeImageObservationText(visualAbnormality.relationshipWithSurroundingTissue || 'Demarcated visual transition into adjacent mucosal tissue; submucosal depth and invasion require palpation and biopsy.'),
      infiltrationCaveat: 'Absence of visible gross infiltration cannot confirm lack of invasion; histological and palpation assessment of submucosal depth is mandatory.',
      source: 'IMAGE_OBSERVATION'
    },
    visibleAbnormality: {
      value: sanitizeImageObservationText(visualAbnormality.morphology || f.lesionCharacteristics?.morphology || 'Mucosal surface inspection'),
      abnormalityType: visualAbnormality.type,
      clinicalDistinction: visualAbnormality.clinicalDistinction,
      distribution: visualAbnormality.distribution,
      source: 'IMAGE_OBSERVATION'
    },
    colorAndAppearance: {
      color: visualAbnormality.color || f.lesionCharacteristics?.color || 'Mucosal coloration',
      appearance: 'Visual surface texture only; consistency not assessable by image',
      source: 'IMAGE_OBSERVATION'
    },
    approximateDimensions: {
      value: 'Not reliably measurable from 2D photograph without clinical calibration marker or caliper.',
      isMeasurable: false,
      source: 'IMAGE_OBSERVATION'
    },
    imageQuality: {
      value: f.imageQualityLimitations || 'Image evaluated for visual triage.',
      isAdequate: !f.imageQualityLimitations?.includes('Sub-optimal') && !f.imageQualityLimitations?.includes('Low illumination'),
      requiresRecapture: Boolean(f.imageQualityLimitations?.includes('Sub-optimal') || f.imageQualityLimitations?.includes('Low illumination')),
      recaptureReason: (f.imageQualityLimitations?.includes('Sub-optimal') || f.imageQualityLimitations?.includes('Low illumination')) ? f.imageQualityLimitations : null,
      source: 'IMAGE_OBSERVATION'
    }
  };

  // 3. PHYSICAL EXAMINATION & PALPATION GUARDRAILS (Never claim induration from image; never report "No induration")
  f.physicalExaminationFindings = {
    induration: {
      value: workerMentionedInduration
        ? 'Induration noted in health worker input; in-person clinician palpation required for verification.'
        : 'Not assessed – physical examination and digital palpation required.',
      source: workerMentionedInduration ? 'HEALTH_WORKER_INPUT' : 'PHYSICAL_EXAMINATION'
    },
    tissueConsistency: {
      value: 'Not assessed – tissue consistency cannot be determined from a 2D photograph; requires clinical palpation.',
      source: 'PHYSICAL_EXAMINATION'
    },
    tenderness: {
      value: workerMentionedTenderness
        ? 'Symptomatic discomfort/tenderness reported by patient; clinical exam correlation required.'
        : 'Not assessed – clinical examination required.',
      source: workerMentionedTenderness ? 'PATIENT_REPORTED' : 'PHYSICAL_EXAMINATION'
    },
    lesionDepth: {
      value: 'Not assessable from surface photograph – depth of invasion requires clinical palpation and cross-sectional imaging/biopsy.',
      source: 'PHYSICAL_EXAMINATION'
    },
    regionalLymphNodes: {
      value: 'Not assessed – requires clinical cervical lymph node palpation.',
      source: 'PHYSICAL_EXAMINATION'
    }
  };

  // 4. B. POSSIBLE CLINICAL SUSPICION (Never declare low risk of cancer)
  let levelOfConcern;
  if (f.suggestedCategory === 'malignancy_suspected') {
    levelOfConcern = 'High Suspicion – Urgent specialist evaluation and biopsy indicated';
  } else if (f.suggestedCategory === 'opmd') {
    levelOfConcern = 'Elevated Concern – Oral Potentially Malignant Disorder (OPMD); specialist review recommended';
  } else {
    levelOfConcern = 'Indeterminate Mucosal Variation – In-person clinical correlation and surveillance required; malignancy cannot be excluded by visual appearance alone';
  }

  const differentials = f._differentials || generateDifferentialReasoning(visualAbnormality.type, resolvedSite, historyText, f.riskFactorsIdentified || []);

  const visualReasons = [
    \`Visible mucosal features: \${visualAbnormality.morphology.toLowerCase()} with \${visualAbnormality.margins.toLowerCase()}.\`,
    \`Clinical distinction: \${visualAbnormality.clinicalDistinction}\`,
    \`Biopsy necessity: Microscopic cellular atypia and basement membrane invasion cannot be evaluated from photograph alone.\`
  ];

  f.possibleClinicalSuspicion = {
    possibleConditions: differentials,
    visualReasonsSupporting: visualReasons,
    levelOfConcern,
    diagnosticUncertainty: 'High – 2D photography cannot evaluate cellular atypia, tissue architecture, or depth of invasion. Visual findings are preliminary differential considerations and never constitute a confirmed diagnosis.',
    source: 'IMAGE_OBSERVATION'
  };

  // 5. C. RECOMMENDED FOLLOW-UP
  const followUp = f._followUp || generateFollowUpRecommendations(visualAbnormality.type, f.suggestedCategory, f.imageAssessment?.imageQuality, context);

  f.recommendedFollowUp = {
    additionalPatientHistoryRequired: followUp.additionalPatientHistoryRequired,
    appropriatePhysicalExamination: followUp.appropriatePhysicalExamination,
    specialistReferral: followUp.specialistReferral,
    referralUrgency: followUp.referralUrgency,
    delayWarning: followUp.delayWarning,
    additionalInvestigations: followUp.additionalInvestigations,
    nextClinicalExamination: followUp.nextClinicalExamination,
    directClinicalExaminationRequired: true,
    directClinicalExaminationGuidance: followUp.directClinicalExaminationGuidance,
    appropriateSpecialist: followUp.appropriateSpecialist,
    repeatPhotographyRecommended: followUp.repeatPhotographyRecommended,
    repeatPhotographyGuidance: followUp.repeatPhotographyGuidance,
    repeatPhotographyReason: followUp.repeatPhotographyReason,
    phcActionPlan: followUp.phcActionPlan,
    source: 'IMAGE_OBSERVATION'
  };

  // 6. D. LIMITATIONS
  f.limitations = {
    whatCannotBeDetermined: 'Tissue consistency, induration, depth of invasion, tenderness, submucosal extent, regional lymph node status, and histopathological dysplasia grade cannot be determined from photograph alone.',
    physicalExamOrBiopsyNecessary: 'Mandatory – in-person physical clinical palpation and confirmatory histopathological biopsy are essential prior to any definitive diagnosis or treatment planning.',
    source: 'IMAGE_OBSERVATION'
  };

  // 7. SOURCE ATTRIBUTIONS METADATA
  f.sourceAttributions = {
    IMAGE_OBSERVATION: 'What the model can actually see in the 2D photograph (color, borders, distribution, surface texture).',
    CLINICAL_INFORMATION: context.history || f.userProvidedContext?.clinicalObservations || 'None provided (patient history / habit duration / symptoms provided by health worker)',
    HEALTH_WORKER_INPUT: context.history || f.userProvidedContext?.clinicalObservations || 'None provided',
    PATIENT_REPORTED: context.history || f.userProvidedContext?.clinicalObservations || 'None provided',
    PHYSICAL_EXAMINATION: 'In-person palpation, tissue induration, and lymph node status not performed during remote image analysis. In-person clinical exam required.',
    CONFIRMATORY_INVESTIGATION: 'Tissue biopsy / histopathological examination required for definitive diagnosis. Biopsy not performed during photography.',
    LABORATORY_OR_PATHOLOGY: 'Tissue biopsy not performed. Histopathology required for confirmed diagnosis.'
  };

  // 8. DEDICATED CLINICAL EVIDENCE-VALIDATION LAYER
  const auditFlags = [];
  const textCorpus = JSON.stringify([
    f.observedVisualCharacteristics,
    f.visualObservation,
    f.possibleClinicalConcerns,
    f.modelGeneratedAssessment,
    f.preliminaryAssessment,
    f.imageAssessment,
    f.possibleClinicalSuspicion,
    f.recommendedFollowUp,
    f.limitations
  ]);

  // Check A: Inferred palpation findings
  if (/\\b(?:firm to palpation|soft consistency|tender on palpation|non-tender to touch|indurated on palpation|palpation reveals)\\b/i.test(textCorpus)) {
    auditFlags.push({
      category: 'INFERRED_PALPATION',
      severity: 'WARNING',
      message: 'Palpation findings cannot be determined from photograph; attributed to physical examination requirement.'
    });
  }

  // Check B: Inferred patient history without data
  if (!context.history && /\\b(?:smokes \\d+|chews \\d+|for \\d+ years|known diabetic|hypertensive)\\b/i.test(textCorpus)) {
    auditFlags.push({
      category: 'INFERRED_HISTORY',
      severity: 'VIOLATION',
      message: 'Patient history or habits inferred without user-provided data.'
    });
  }

  // Check C: Claimed absence of malignancy
  if (/\\b(?:absence of malignant|no malignant features|malignancy (?:is )?ruled? out|benign confirmed|completely non-malignant)\\b/i.test(textCorpus)) {
    auditFlags.push({
      category: 'CLAIMED_ABSENCE_OF_MALIGNANCY',
      severity: 'PROHIBITED',
      message: 'Malignancy cannot be excluded or ruled out based solely on visual appearance.'
    });
  }

  // Check D: Recommended unsupported observation periods or delaying referral
  if (/\\b(?:delay referral for 14 days|delay referral simply to observe|wait 14 days before referral)\\b/i.test(textCorpus)) {
    auditFlags.push({
      category: 'UNSUPPORTED_OBSERVATION_PERIOD',
      severity: 'HAZARD',
      message: 'Delaying specialist referral simply to observe a suspicious or persistent lesion is prohibited; prompt specialist evaluation is required.'
    });
  }

  // Check E: Invented healthy architecture or bilateral symmetry
  if (/\\b(?:healthy architectural alignment|bilateral symmetry confirmed|absence of infiltration confirmed)\\b/i.test(textCorpus)) {
    auditFlags.push({
      category: 'INVENTED_ANATOMICAL_CLAIMS',
      severity: 'PROHIBITED',
      message: 'Architectural alignment, bilateral symmetry, or lack of invasion cannot be assumed without comprehensive examination.'
    });
  }

  f.clinicalValidationAudit = {
    passed: auditFlags.filter(a => a.severity === 'PROHIBITED' || a.severity === 'HAZARD').length === 0,
    flags: auditFlags,
    timestamp: new Date().toISOString()
  };

  return result;
}

`;

jsContent = jsContent.slice(0, idx4) + newValidateAndSanitizeClinicalFindings + jsContent.slice(idxEnd4);

writeFileSync('src/research-ai.mjs', jsContent, 'utf8');
console.log('Successfully updated src/research-ai.mjs!');

