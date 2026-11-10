import re

with open('scripts/medgemma-inference.py', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update classify_visual_abnormality
start_marker1 = 'def classify_visual_abnormality(history_lower: str, resolved_site: dict):'
end_marker1 = 'def make_diff(cond: str,'

idx1 = code.find(start_marker1)
idxEnd1 = code.find(end_marker1)

if idx1 == -1 or idxEnd1 == -1:
    print('Error: classify_visual_abnormality markers not found in scripts/medgemma-inference.py')
    exit(1)

new_classify = '''def classify_visual_abnormality(history_lower: str, resolved_site: dict):
    h = history_lower
    site_name = resolved_site.get("name", "").lower()
    is_tongue = "tongue" in site_name or any(k in h for k in ["tongue", "నాలుక"])

    if any(k in h for k in ["erythroleuko", "red and white", "white and red", "speckled", "mottled"]):
        return {
            "type": "mixed_red_white",
            "label": "Mixed red and white mucosal lesion (Erythroleukoplakic appearance)",
            "morphology": "Mixed red and white mucosal lesion with speckled / granular surface architecture",
            "color": "Speckled: intensely erythematous (red) background interspersed with opaque white keratotic nodules",
            "margins": "Irregular, partly circumscribed borders with peripheral erythematous margin",
            "texture": "Granular / nodular surface pattern (visual appearance only; physical consistency requires palpation)",
            "distribution": "Focal heterogeneous lesion with interspersed atrophic and plaque-like zones",
            "category": "malignancy_suspected",
            "whiteOrRedAreas": "Coexisting intensely erythematous (red) atrophic patches and elevated opaque white keratotic nodules; absence of an obvious ulcer does not establish benignity.",
            "surfaceAppearance": "Granular and nodular surface texture with focal epithelial thinning and interspersed keratosis.",
            "shapeAndBorders": "Irregular contour with uneven, partly demarcated erythematous borders.",
            "relationshipWithSurroundingTissue": "Abrupt transition from normotrophic mucosa into peripheral erythematous halo; depth and submucosal invasion require palpation and biopsy.",
            "clinicalDistinction": "Distinguished from homogeneous leukoplakia: coexistence of red atrophic zones and white plaques indicates high clinical concern for moderate-to-severe epithelial dysplasia or early invasive carcinoma. Absence of an ulcer does not establish benignity.",
            "preliminary": "High suspicion of non-homogeneous erythroleukoplakic lesion. Urgent specialist oncology evaluation and multi-site biopsy indicated.",
            "concerns": "High concern for Oral Potentially Malignant Disorder with severe epithelial dysplasia or early invasive squamous cell carcinoma (OSCC)."
        }

    if any(k in h for k in ["ulcer", "non-healing", "breakdown", "crater", "erosion", "bleed", "sore"]):
        return {
            "type": "ulcer",
            "label": "Ulcer-like mucosal appearance",
            "morphology": "Ulcerative mucosal lesion with central epithelial defect and fibrinous bed",
            "color": "Central yellowish-gray fibrinous base surrounded by an erythematous mucosal halo",
            "margins": "Elevated, everted and irregular mucosal borders",
            "texture": "Irregular architectural depression (visual appearance only; depth and induration require palpation)",
            "distribution": "Focal localized ulcerative crater",
            "category": "malignancy_suspected",
            "whiteOrRedAreas": "Yellowish-white central fibrinous exudate within an erythematous atrophic ulcerative halo.",
            "surfaceAppearance": "Depressed central crater with irregular floor and raised peripheral mucosal margins.",
            "shapeAndBorders": "Circumscribed to irregular oval crater with rolled or everted margins.",
            "relationshipWithSurroundingTissue": "Demarcated step-off from adjacent mucosa with surrounding inflammatory erythema; depth of invasion requires palpation and histological staging.",
            "clinicalDistinction": "Distinguished from superficial aphthous ulcer: persistent, raised margins with central architectural loss; diagnostic punch biopsy indicated if non-healing beyond 14 days.",
            "preliminary": "Clinical suspicion of progressive ulcerative oral lesion. Urgent specialist referral and punch biopsy indicated.",
            "concerns": "Concern for invasive squamous cell carcinoma (OSCC) or chronic granulomatous breakdown. Histopathological tissue biopsy mandatory."
        }

    if any(k in h for k in ["coating", "coated", "saburral", "wipe", "scrapable", "fur", "thrush", "candida"]) or ("dorsal" in site_name and not any(k in h for k in ["plaque", "leuko", "ulcer", "erythro"])):
        return {
            "type": "white_coating",
            "label": "White mucosal coating (Tongue dorsum / mucosal film)",
            "morphology": "Superficial diffuse white coating across mucosal surface",
            "color": "Whitish to cream-colored superficial coating over pinkish mucosal bed",
            "margins": "Diffuse, feathered borders without elevated indurated margins",
            "texture": "Velvety / papular surface accumulation (visual appearance only)",
            "distribution": "Diffuse surface distribution across tongue dorsum / mucosal bed; not a discrete fixed plaque",
            "category": "screen_positive",
            "whiteOrRedAreas": "Creamy to grayish-white superficial film over pinkish mucosal bed; underlying mucosal erythema may be present if candidal.",
            "surfaceAppearance": "Velvety, papular or curd-like surface accumulation over filiform papillae.",
            "shapeAndBorders": "Feathered, poorly circumscribed borders blending into surrounding lingual papillae.",
            "relationshipWithSurroundingTissue": "Superficial accumulation resting over mucosal epithelium without visible tissue displacement; scrapability requires tactile gauze wiping test.",
            "clinicalDistinction": "Distinguished from fixed keratotic plaque: coating appears superficial; sterile gauze wiping test during physical exam is required to determine whether it is removable (suggesting saburral coating or candidiasis) vs fixed plaque. Absence of an obvious ulcer does not establish benignity.",
            "preliminary": "Superficial white mucosal coating. Physical examination with sterile gauze wiping test recommended.",
            "concerns": "Superficial mucosal accumulation. Distinguishing removable coating/candidiasis from fixed hyperkeratotic plaque requires clinical wiping test. Premalignancy cannot be excluded without clinical evaluation."
        }

    if any(k in h for k in ["plaque", "leukoplak", "white patch", "fixed white"]):
        return {
            "type": "white_plaque",
            "label": "White plaque (Leukoplakia-like)",
            "morphology": "Discrete, elevated white mucosal plaque with fixed borders",
            "color": "Leukoplakic (opaque white to grayish-white mucosal plaque)",
            "margins": "Demarcated, slightly elevated mucosal borders",
            "texture": "Plaque-like / mildly corrugated surface pattern (visual appearance only)",
            "distribution": "Focal or localized mucosal plaque",
            "category": "opmd",
            "whiteOrRedAreas": "Opaque chalky or grayish-white mucosal plaque; absence of ulceration does not establish benignity.",
            "surfaceAppearance": "Adherent plaque with mildly corrugated, leathery or fissured surface architecture.",
            "shapeAndBorders": "Demarcated, irregular or geographical borders elevated slightly above adjacent mucosa.",
            "relationshipWithSurroundingTissue": "Distinct step-off from adjacent normotrophic mucosa; non-removability and dysplasia grade require gauze rubbing and biopsy.",
            "clinicalDistinction": "Distinguished from superficial coating: adherent, non-scrapable plaque requiring incisional biopsy to evaluate for epithelial dysplasia. Absence of an obvious ulcer does not establish benignity.",
            "preliminary": "Oral Potentially Malignant Disorder (OPMD) presentation consistent with leukoplakic plaque. Specialist review and biopsy recommended.",
            "concerns": "Concern for Oral Leukoplakia / OPMD. Epithelial dysplasia or carcinoma in situ cannot be excluded without histopathology."
        }

    if any(k in h for k in ["linea alba", "occlusal plane", "occlusal line"]):
        return {
            "type": "linea_alba_pattern",
            "label": "Linear keratotic band (Linea alba pattern supported by occlusal history)",
            "morphology": "Linear whitish mucosal band aligned with dental occlusal plane",
            "color": "Pale whitish translucent band without ulceration or erythroplakic component",
            "margins": "Linear, smooth borders following occlusal contact line",
            "texture": "Smooth to mildly hyperkeratotic surface (visual appearance only)",
            "distribution": "Linear distribution along occlusal plane of buccal mucosa",
            "category": "screen_positive",
            "whiteOrRedAreas": "Narrow whitish linear hyperkeratosis; no associated ulceration or erythroplakic changes.",
            "surfaceAppearance": "Smooth mucosal surface without exophytic projections or nodularity.",
            "shapeAndBorders": "Linear horizontal configuration aligned with interdental biting line.",
            "relationshipWithSurroundingTissue": "Flushes with surrounding buccal mucosa; clinical correlation required to exclude early OPMD.",
            "clinicalDistinction": "Supported by occlusal alignment in history; clinical correlation required to confirm stability. Absence of an ulcer does not establish benignity.",
            "preliminary": "Linear hyperkeratotic pattern concordant with occlusal plane. Clinical surveillance recommended.",
            "concerns": "Frictional mucosal thickening. While occlusal history supports frictional etiology, in-person clinical correlation is required."
        }

    has_habit_negation = bool(re.search(r"no\s+(?:tobacco|habit|smoking|chewing)", h, re.I))
    if any(k in h for k in ["keratos", "leathery", "wrinkle", "corrugat", "smokeless", "friction", "sharp tooth", "cheek bit"]) or (not has_habit_negation and any(k in h for k in ["khaini", "gutkha", "tobacco", "chew"])):
        return {
            "type": "keratotic_area",
            "label": "Keratotic-appearing mucosal area",
            "morphology": "Thickened, leathery or corrugated keratotic-appearing mucosal area",
            "color": "Leukoplakic / grayish-white translucent keratotic hue",
            "margins": "Irregular borders blending into adjacent mucosa along habit or friction zone",
            "texture": "Corrugated / leathery surface pattern (visual appearance only)",
            "distribution": "Regional distribution associated with chronic habit or mechanical contact",
            "category": "opmd",
            "whiteOrRedAreas": "Translucent to grayish-white mucosal thickening with corrugated or wrinkled mucosal folds.",
            "surfaceAppearance": "Wrinkled, leathery or pumice-like keratotic surface pattern.",
            "shapeAndBorders": "Diffuse to irregular borders blending into surrounding mucosal tissue.",
            "relationshipWithSurroundingTissue": "Blends into neighboring mucosa; absence of ulceration does not rule out dysplasia within thickened epithelium.",
            "clinicalDistinction": "Distinguished from discrete plaque: diffuse leathery / wrinkled surface texture associated with chronic mechanical friction or habit contact; does not wipe away. Absence of an obvious ulcer does not establish benignity.",
            "preliminary": "Keratotic mucosal changes noted in habit/friction contact zone. Habit cessation counseling and surveillance recommended.",
            "concerns": "Mucosal hyperkeratosis secondary to habit irritation or mechanical trauma. Surveillance and habit cessation required; biopsy if persistent."
        }

    if any(k in h for k in ["red patch", "erythroplak", "burning red", "atrophic patch", "velvety red", "erythema"]):
        return {
            "type": "red_patch",
            "label": "Red patch (Erythroplakia-like appearance)",
            "morphology": "Circumscribed velvety red mucosal patch / erythematous atrophic zone",
            "color": "Intensely erythematous (red) velvety surface without prominent white keratosis",
            "margins": "Distinct, sharply demarcated or irregular borders",
            "texture": "Smooth to velvety atrophic surface (visual appearance only)",
            "distribution": "Solitary focal red patch",
            "category": "opmd",
            "whiteOrRedAreas": "Intense focal erythematous red atrophic patch lacking normal mucosal papillation; no overt ulceration.",
            "surfaceAppearance": "Velvety atrophic surface with fine epithelial thinning.",
            "shapeAndBorders": "Sharply circumscribed or irregular mucosal boundary.",
            "relationshipWithSurroundingTissue": "Abrupt step-off from neighboring pink mucosa; high risk of high-grade dysplasia or carcinoma in situ.",
            "clinicalDistinction": "Distinguished from inflammatory mucositis: persistent solitary red patch lacking obvious infectious etiology carries high risk of cellular atypia or early carcinoma. Absence of an obvious ulcer does not establish benignity.",
            "preliminary": "Solitary erythematous mucosal patch. Priority specialist evaluation and diagnostic biopsy indicated.",
            "concerns": "Concern for Erythroplakia / high-grade epithelial dysplasia or carcinoma in situ. Urgent biopsy mandatory."
        }

    if any(k in h for k in ["verrucous", "papillar", "exophyt", "cauliflower", "growth", "mass", "nodul"]):
        return {
            "type": "irregular_surface",
            "label": "Irregular surface pattern (Verrucous / Exophytic)",
            "morphology": "Irregular verrucous / papillary exophytic surface pattern",
            "color": "Pinkish-white to gray irregular surface projections",
            "margins": "Lobulated, uneven distinct borders",
            "texture": "Papillomatous / exophytic architecture (visual appearance only)",
            "distribution": "Localized exophytic mucosal elevation",
            "category": "malignancy_suspected",
            "whiteOrRedAreas": "Mixed pink and whitish papillary or verrucous projections.",
            "surfaceAppearance": "Warty, cauliflower-like or pebble-grained exophytic projections.",
            "shapeAndBorders": "Lobulated, uneven distinct borders elevated above mucosal plane.",
            "relationshipWithSurroundingTissue": "Distinct exophytic mass arising from mucosal base; depth and broad-based pushing margin require biopsy.",
            "clinicalDistinction": "Distinguished from flat plaques: elevated warty/papillomatous surface architecture requiring deep incisional biopsy to evaluate architecture.",
            "preliminary": "Exophytic / verrucous mucosal architecture. Urgent specialist surgical oncology evaluation indicated.",
            "concerns": "Concern for Verrucous Carcinoma or exophytic Squamous Cell Carcinoma. Deep incisional biopsy mandatory."
        }

    if is_tongue:
        return {
            "type": "white_tongue_abnormality",
            "label": "White mucosal alteration on tongue (Differential evaluation required)",
            "morphology": "Focal or diffuse white mucosal alteration on tongue surface",
            "color": "Whitish to pale mucosal discoloration with visible surface textural contrast",
            "margins": "Partially demarcated borders transitioning into adjacent lingual papillae",
            "texture": "Altered surface texture (visual observation only; consistency requires palpation)",
            "distribution": "Localized or diffuse across tongue mucosal subsite",
            "category": "screen_positive",
            "whiteOrRedAreas": "Visible white mucosal changes without obvious central ulceration; absence of an obvious ulcer does not establish benignity.",
            "surfaceAppearance": "Surface texture showing opacity and focal alteration against adjacent lingual mucosa.",
            "shapeAndBorders": "Feathered to irregular contour; precise borders require clinical retraction and illumination.",
            "relationshipWithSurroundingTissue": "Transition zone with surrounding lingual mucosa; sterile gauze test required to assess removability.",
            "clinicalDistinction": "Distinguishing superficial coating, candidiasis, and keratotic plaque (OPMD) is impossible from photograph alone; in-person wiping test and biopsy required. Absence of an ulcer does not establish benignity.",
            "preliminary": "White mucosal alteration on tongue. In-person clinical examination, gauze wiping test, and specialist review recommended.",
            "concerns": "Indeterminate white mucosal alteration. Premalignant dysplasia (OPMD) or fungal infection cannot be excluded without clinical examination."
        }

    return {
        "type": "indeterminate_mucosal_abnormality",
        "label": "Indeterminate oral mucosal alteration (Screen-positive feature requiring clinical correlation)",
        "morphology": "Focal oral mucosal surface alteration presenting visual contrast against adjacent mucosa",
        "color": "Mucosal surface showing focal chromatic/tonal variation",
        "margins": "Visual boundary transitioning into surrounding mucosal tissue",
        "texture": "Visual surface texture (consistency requires digital palpation)",
        "distribution": "Localized to visible mucosal field (contralateral comparison requires in-person intraoral inspection)",
        "category": "screen_positive",
        "whiteOrRedAreas": "Focal mucosal surface alteration; absence of an obvious ulcer does not establish benignity or rule out early malignancy.",
        "surfaceAppearance": "Surface alteration with focal textural contrast compared to neighboring mucosal bed.",
        "shapeAndBorders": "Irregular to focal visual contour; depth and infiltration cannot be evaluated visually.",
        "relationshipWithSurroundingTissue": "Visual border demarcated from surrounding mucosa; digital palpation and biopsy required for tissue assessment.",
        "clinicalDistinction": "Absence of an obvious ulcer or exophytic mass does not establish benignity. Early premalignant dysplasias, candidiasis, and early carcinomas frequently present as non-ulcerated flat or coated mucosal changes.",
        "preliminary": "Indeterminate mucosal alteration detected during screening. Mandatory in-person clinical correlation and digital palpation recommended.",
        "concerns": "Indeterminate mucosal alteration. Premalignant dysplasia (OPMD) or early neoplastic change cannot be excluded by photographic appearance alone. Clinical physical examination and surveillance mandatory."
    }

'''

code = code[:idx1] + new_classify + code[idxEnd1:]

# 2. Update generate_differential_reasoning
start_marker2 = 'def generate_differential_reasoning(abnormality_type: str, resolved_site: dict, history_lower: str):'
end_marker2 = 'def generate_follow_up_recommendations('

idx2 = code.find(start_marker2)
idxEnd2 = code.find(end_marker2)

if idx2 == -1 or idxEnd2 == -1:
    print('Error: generate_differential_reasoning markers not found in scripts/medgemma-inference.py')
    exit(1)

new_diff = '''def generate_differential_reasoning(abnormality_type: str, resolved_site: dict, history_lower: str):
    if abnormality_type == "ulcer":
        return [
            make_diff(
                "Oral Squamous Cell Carcinoma (OSCC) - high suspicion",
                "Progressive ulcerative mucosal breakdown with irregular or raised borders is the classic clinical hallmark of invasive squamous cell carcinoma.",
                "Visible focal ulceration with central fibrinous base and raised, everted peripheral margins.",
                "Duration of ulcer (>14 days?), tobacco/alcohol/betel nut use duration, digital palpation for tissue induration, and regional lymph node staging.",
                "Depth of tissue invasion, microvascular or perineural infiltration, and histological malignancy grade; confirmatory incisional biopsy is mandatory.",
                "Perform bimanual digital palpation to evaluate tissue induration and lesion depth; palpate cervical lymph node basins (levels I–V)."
            ),
            make_diff(
                "Chronic Traumatic / Frictional Ulcer (Requires Exclusion of Malignancy)",
                "Repetitive mechanical trauma from sharp dentition or restorations produces mucosal ulceration; chronic traumatic beds can harbor malignant transformation.",
                "Focal mucosal defect located adjacent to occlusal surfaces or dental contact planes.",
                "Identification of offending sharp cusp or prosthesis; whether the ulcer resolves within 10–14 days following irritation elimination.",
                "Whether the chronic traumatic bed harbors dysplastic malignant transformation; persistent ulcers must be biopsied.",
                "Inspect dentition for sharp edges; re-evaluate within 10–14 days; persistent ulcers mandate diagnostic biopsy."
            ),
            make_diff(
                "Deep Mycotic / Chronic Granulomatous Ulceration",
                "Chronic granulomatous infections (e.g. tuberculosis, histoplasmosis) can present as persistent oral ulcers with irregular granular bases.",
                "Granular central necrotic base with peripheral erythematous reaction.",
                "Systemic constitutional symptoms (fever, chronic cough, weight loss), immunocompromise status, and chest radiography.",
                "Granuloma formation and micro-organism identification (requires special histologic stains: PAS, GMS, or Ziehl-Neelsen).",
                "Biopsy with specialized histological stains and mycobacterial / fungal cultures."
            )
        ]
    elif abnormality_type == "mixed_red_white":
        return [
            make_diff(
                "Erythroleukoplakia (High-Risk OPMD)",
                "Mixed red and white mucosal lesions carry significantly elevated malignant transformation rates (up to 30–50%) compared to homogeneous white plaques.",
                "Speckled appearance showing bright erythematous atrophic zones intermixed with keratotic white nodular patches.",
                "Tobacco/areca habit duration, spontaneous pain or burning sensation, and persistence beyond 14 days.",
                "Presence of severe dysplasia, carcinoma in situ, or early microinvasive squamous cell carcinoma; multi-site punch biopsy mandatory.",
                "Bimanual palpation for tissue induration; multi-site incisional biopsy of both red atrophic and white nodular components."
            ),
            make_diff(
                "Oral Lichen Planus (Erosive / Atrophic variant)",
                "Chronic autoimmune mucocutaneous disorder presenting with mixed red atrophic/ulcerative areas and white reticular striations.",
                "Interspersed erythematous background and whitish surface changes on mucosal surface.",
                "Contralateral cheek inspection to assess contralateral mucosal involvement, presence of Wickham striae, skin/nail/genital examination, and exacerbation with spicy food.",
                "Subepithelial band-like T-lymphocytic infiltrate and basal membrane liquefaction on histopathology.",
                "Systematic intraoral bilateral mapping, extraoral dermatological inspection, and diagnostic incisional biopsy."
            ),
            make_diff(
                "Oral Squamous Cell Carcinoma (Early / Non-homogeneous)",
                "Early invasive OSCC frequently presents as a non-homogeneous erythroleukoplakic or speckled mucosal lesion without overt ulceration.",
                "Granular, irregular surface architecture with peripheral erythematous margin.",
                "Lesion duration, induration on clinician palpation, and presence of cervical lymphadenopathy.",
                "Basement membrane invasion and histopathological differentiation grade; biopsy is mandatory.",
                "Bimanual digital palpation of mucosal base and comprehensive cervical lymph node examination (levels I–V)."
            )
        ]
    elif abnormality_type == "white_plaque":
        return [
            make_diff(
                "Oral Leukoplakia (Homogeneous / Non-homogeneous OPMD)",
                "Fixed white mucosal plaque that cannot be wiped away and cannot be characterized clinically as any other disease entity. Absence of an obvious ulcer does not establish benignity.",
                "Discrete, adherent white plaque with partially demarcated margins on mucosal surface.",
                "Areca nut/tobacco habit history, duration, and clinical confirmation that plaque cannot be rubbed off with sterile gauze.",
                "Degree of epithelial dysplasia (mild, moderate, severe) or early carcinoma in situ; diagnostic incisional biopsy required.",
                "Perform sterile gauze rub-off test to confirm non-removability; bimanual palpation for submucosal induration; incisional biopsy."
            ),
            make_diff(
                "Hyperplastic / Pseudomembranous Candidiasis",
                "Candidal fungal colonization frequently forms white mucosal plaques or curd-like patches.",
                "Elevated white surface accumulation over mucosal bed.",
                "Response to topical antifungal trial; history of steroid inhalers, antibiotic use, or xerostomia; whether surface can be partially wiped away.",
                "Candidal pseudohyphae/hyphae confirmation via KOH smear or PAS-stained biopsy.",
                "Perform moist gauze rub-off test; obtain mucosal scraping for 10% KOH fungal microscopy."
            ),
            make_diff(
                "Frictional / Mechanical Keratosis (Requires Dysplasia Exclusion)",
                "Chronic physical abrasion stimulates protective epithelial hyperkeratosis, which must be clinically differentiated from true premalignant leukoplakia.",
                "Pale or translucent white mucosal thickening along mechanical friction contact zones.",
                "Confirmation of mechanical habit (e.g. cheek chewing, sharp tooth); regression within 2–3 weeks of habit cessation.",
                "Cytological atypia or architectural dysplasia on microscopic examination; non-resolving lesions mandate biopsy.",
                "Identification and smoothing of sharp cusps; recall examination in 14 days; diagnostic biopsy if plaque persists."
            )
        ]
    elif abnormality_type in ["white_coating", "white_tongue_abnormality"]:
        return [
            make_diff(
                "Superficial Tongue Coating / Saburral Deposition",
                "Elongated filiform papillae and accumulation of desquamated epithelial cells, food debris, and oral bacteria produce a superficial white layer.",
                "Diffuse superficial whitish to cream-colored layer over tongue dorsum or mucosal papillae without discrete elevated indurated margins.",
                "Oral hygiene practices, hydration status, tongue cleaning habits, and whether coating easily scrapes off with moist sterile gauze.",
                "Removability cannot be confirmed from photograph alone; requires physical mechanical wiping with moist gauze in clinic.",
                "Perform moist sterile gauze wiping (rub-off) test to test scrapability; examine underlying lingual papillae."
            ),
            make_diff(
                "Oral Candidiasis (Pseudomembranous or Hyperplastic)",
                "Candidal fungal overgrowth produces curd-like white plaques or film over mucous membranes.",
                "Soft or curd-like whitish accumulation over tongue mucosa with or without underlying erythematous reaction.",
                "Inhaler/antibiotic/corticosteroid use, glycemic control, xerostomia, burning symptoms on eating.",
                "Fungal pseudohyphae and scrapability cannot be confirmed from photographic appearance alone; microscopic cytology required.",
                "Perform gauze wiping test (pseudomembranous wipes away leaving raw/erythematous base); obtain scraping for 10% KOH fungal smear."
            ),
            make_diff(
                "Oral Keratotic Lesion / Leukoplakia (OPMD Rule-Out)",
                "Adherent white plaque or hyperkeratosis that cannot be wiped off. Crucially, absence of an obvious ulcer does not establish benignity.",
                "Discrete, fixed opaque white plaque or leathery hyperkeratotic area on tongue mucosa (lateral, dorsal, or ventral).",
                "Tobacco/areca nut exposure history, lesion duration (>14 days), whether plaque wipes off with sterile gauze.",
                "Epithelial dysplasia grade (mild, moderate, severe) or carcinoma in situ can ONLY be diagnosed by histopathology; visual appearance cannot determine dysplasia.",
                "Perform sterile gauze rub-off test to confirm non-removability; bimanual digital palpation for induration; diagnostic incisional/punch biopsy."
            ),
            make_diff(
                "Other White Mucosal Conditions (Oral Lichen Planus or Chronic Habit Keratosis)",
                "Chronic autoimmune striations (Wickham striae) or chemical/mechanical hyperkeratosis along lingual borders.",
                "Linear, reticular, or corrugated white patterns on tongue mucosa.",
                "Contralateral tongue and cheek inspection to assess bilateral mucosal involvement, extraoral skin/nail exam, habit exposure.",
                "Subepithelial lymphocytic infiltration vs dysplastic hyperkeratosis requires microscopic histopathological evaluation.",
                "Full intraoral inspection of bilateral mucosa, extraoral skin/nail examination, and diagnostic biopsy if persistent."
            )
        ]
    elif abnormality_type == "linea_alba_pattern":
        return [
            make_diff(
                "Frictional Keratosis / Linea Alba (Supported by occlusal alignment in history)",
                "Chronic mechanical suction or biting along the occlusal plane produces a linear hyperkeratotic band.",
                "Whitish keratotic band aligned horizontally along the occlusal surfaces of teeth.",
                "Presence of sharp cusps, bruxism or clenching habit, asymptomatic stability over time.",
                "Microscopic cellular architecture without histological evaluation; in-person clinical correlation required.",
                "Dental occlusal inspection for sharp edges or clenching; confirm long-term stability and absence of induration."
            ),
            make_diff(
                "Smokeless Tobacco / Chemical Keratosis (Rule-Out)",
                "Placement of smokeless tobacco or areca nut along the buccal sulcus produces corrugated grayish-white hyperkeratosis.",
                "Translucent to grayish-white mucosal thickening along buccal contact zone.",
                "Quantification of smokeless tobacco, gutkha, or areca nut chewing habits.",
                "Dysplasia cannot be excluded without clinical evaluation and habit cessation monitoring.",
                "Comprehensive habit history, cessation counseling, and recall evaluation in 14 days."
            ),
            make_diff(
                "Oral Leukoplakia (OPMD Rule-Out)",
                "True premalignant white plaque can arise along buccal mucosa and may initially resemble frictional hyperkeratosis.",
                "Focal white mucosal thickening.",
                "Habit history, lesion duration, non-removability on gauze test.",
                "Histological exclusion of epithelial dysplasia requires diagnostic biopsy if persistent.",
                "Gauze wiping test and diagnostic biopsy if plaque is non-linear, non-removable, or persistent."
            )
        ]
    elif abnormality_type == "red_patch":
        return [
            make_diff(
                "Erythroplakia (High-Risk OPMD)",
                "Persistent solitary red velvety patch lacking obvious traumatic or inflammatory origin; carries high dysplasia/carcinoma risk (>85%). Absence of an obvious ulcer does not establish benignity.",
                "Circumscribed velvety red mucosal patch without predominant white hyperkeratosis.",
                "Habit history (tobacco/alcohol), failure to resolve within 14 days after removing potential local irritants.",
                "Cellular atypia, severe dysplasia, or carcinoma in situ; urgent scalpel biopsy required.",
                "Prompt specialist referral for diagnostic incisional or punch biopsy; bimanual palpation."
            ),
            make_diff(
                "Erythematous / Atrophic Candidiasis",
                "Fungal proliferation can produce smooth, burning red mucosal patches, especially under prostheses or on tongue dorsum.",
                "Generalized or focal erythematous mucosal depapillation / blush.",
                "Denture wearing habits at night, burning sensation on spicy food, response to trial of topical antifungal.",
                "Fungal colonization vs premalignant epithelial atrophy requires fungal smear and clinical monitoring.",
                "10% KOH fungal microscopy smear; empiric topical antifungal trial with close clinical monitoring."
            )
        ]
    elif abnormality_type == "keratotic_area":
        return [
            make_diff(
                "Smokeless Tobacco Keratosis / Pouch Keratosis (OPMD)",
                "Chronic placement of smokeless tobacco/areca nut produces characteristic wrinkled, leathery hyperkeratosis. Absence of an obvious ulcer does not establish benignity.",
                "Corrugated grayish-white mucosal thickening along tobacco contact zone.",
                "Specific habit placement site, daily frequency and duration, whether lesion diminishes after 2–6 weeks of habit cessation.",
                "Whether dysplasia is developing within the thickened keratotic epithelium; biopsy required if persistent.",
                "Habit cessation counseling; bimanual digital palpation; incisional biopsy if lesion persists."
            ),
            make_diff(
                "Frictional Keratosis (Requires Dysplasia Exclusion)",
                "Chronic mechanical suction or biting produces focal hyperkeratosis mimicking premalignant leukoplakia.",
                "Whitish keratotic band aligned with occlusal surfaces or sharp dental contacts.",
                "Presence of sharp cusps, bruxism or clenching habit, asymptomatic stability.",
                "Microscopic cellular architecture without histological evaluation; persistent lesions mandate biopsy.",
                "Dental smoothing of sharp cusps; 14-day recall examination to evaluate resolution."
            ),
            make_diff(
                "Oral Submucous Fibrosis (OSMF) with secondary keratosis",
                "Chronic areca nut chewing induces progressive submucosal fibrosis with blanched mucosal appearance.",
                "Blanched, mottled mucosal appearance with loss of mucosal elasticity.",
                "Inter-incisal mouth opening measurement (<35 mm suggests trismus), burning sensation, habit duration.",
                "Histological collagen hyalinization and subepithelial vascular loss.",
                "Measure inter-incisal distance with calipers; palpate for fibrous bands in buccal mucosa and palate."
            )
        ]
    elif abnormality_type == "irregular_surface":
        return [
            make_diff(
                "Verrucous Carcinoma / OSCC (Exophytic)",
                "Slow-growing, warty, exophytic mucosal proliferation with pebbly surface architecture.",
                "Elevated verrucous, papillary or exophytic surface projections.",
                "Lesion duration, smokeless tobacco habit duration, presence of local tissue destruction.",
                "Pushing vs infiltrative basement membrane invasion on deep biopsy.",
                "Deep full-thickness incisional biopsy including tumor-host interface; cervical lymph node staging."
            ),
            make_diff(
                "Oral Squamous Papilloma / Verruca Vulgaris",
                "Benign epithelial proliferation induced by low-risk Human Papillomavirus (HPV).",
                "Finger-like or cauliflower-like projections with pedunculated or sessile base.",
                "Multiplicity of lesions, history of oral sex, lack of progressive induration.",
                "Koilocytic atypia and viral cytopathic effects on histopathology.",
                "Excisional biopsy with histological examination."
            )
        ]
    else:  # indeterminate_mucosal_abnormality
        return [
            make_diff(
                "Indeterminate Oral Mucosal Abnormality / Early Epithelial Change",
                "Visible focal mucosal alteration. Crucially, absence of an obvious ulcer or exophytic growth does NOT establish benignity; micro-invasive carcinoma and high-grade dysplasia can present without ulceration.",
                "Focal mucosal surface alteration presenting chromatic or textural contrast against adjacent mucosa.",
                "Lesion chronicity (>14 days?), tobacco/areca nut/alcohol exposure history, spontaneous pain, or localized bleeding.",
                "Cellular atypia and basement membrane integrity cannot be evaluated from a surface photograph; tissue biopsy required.",
                "Comprehensive intraoral inspection with bimanual digital palpation of mucosal tissue and regional lymph nodes (levels I–V)."
            ),
            make_diff(
                "Oral Potentially Malignant Disorder (OPMD) - Rule-Out",
                "Early OPMD lesions can be visually subtle and lack obvious malignant hallmarks on 2D photography.",
                "Discrete focal mucosal alteration with visible contrast against surrounding mucosa.",
                "Habit duration, whether area resolves within 14 days of removing potential local mechanical or chemical irritants.",
                "Histopathological dysplasia grading requires scalpel tissue biopsy.",
                "Perform sterile gauze wiping test; habit cessation counseling; diagnostic incisional biopsy if lesion persists."
            ),
            make_diff(
                "Early Non-Ulcerated Carcinoma / Dysplasia - Exclusion Mandatory",
                "Malignancy does not always present as an overt ulcer; early invasive squamous cell carcinoma can present as a flat, irregular, or non-ulcerated mucosal alteration.",
                "Focal mucosal irregularity and altered surface texture.",
                "Palpatory induration, lesion chronicity (>14 days), high-risk habit exposure, regional lymph node enlargement.",
                "Histological invasion of the basement membrane cannot be determined from surface photographs; tissue biopsy is mandatory.",
                "Bimanual digital palpation for submucosal induration; cervical lymph node palpation (levels I–V); diagnostic punch or incisional biopsy."
            ),
            make_diff(
                "Superficial Inflammatory / Reactive Mucosal Change (Requires Active Exclusion of OPMD)",
                "Localized mucosal reaction secondary to mechanical, thermal, or chemical irritation. Can only be considered benign AFTER active clinical exclusion of premalignant dysplasia.",
                "Focal mucosal surface variation concordant with potential local irritation.",
                "Identification and elimination of local irritants; documentation of complete resolution after 10–14 days.",
                "Absence of dysplasia can only be confirmed after complete clinical resolution or histopathology.",
                "Dental inspection for sharp cusps or fractured restorations; re-evaluation after 10–14 days; persistent lesions mandate biopsy."
            )
        ]

'''

code = code[:idx2] + new_diff + code[idxEnd2:]

# 3. Update generate_follow_up_recommendations
start_marker3 = 'def generate_follow_up_recommendations(abnormality_type: str, category: str, quality_notes: str, history: str = ""):'
end_marker3 = 'def analyze_clinical_features('

idx3 = code.find(start_marker3)
idxEnd3 = code.find(end_marker3)

if idx3 == -1 or idxEnd3 == -1:
    print('Error: generate_follow_up_recommendations markers not found in scripts/medgemma-inference.py')
    exit(1)

new_follow_up = '''def generate_follow_up_recommendations(abnormality_type: str, category: str, quality_notes: str, history: str = ""):
    is_high_risk = category == "malignancy_suspected"
    is_opmd = category == "opmd"

    history_lower = (history or "").lower()
    has_concerning_symptoms = any(w in history_lower for w in ["pain", "bleed", "ulcer", "grow", "progres", "rapid", "swelling", "lump"])
    has_chronic_duration = any(w in history_lower for w in ["month", "year", "weeks"])
    has_high_risk_habits = any(w in history_lower for w in ["tobacco", "gutka", "khaini", "pan", "areca", "smoke", "bidi", "cigarette", "alcohol"])

    repeat_needed = "Sub-optimal" in quality_notes or "Low illumination" in quality_notes

    repeat_guidance = (
        "Repeat photograph recommended: capture under bright direct illumination (avoiding flash specular washout), retract cheek/lips with wooden tongue depressor, dry saliva with sterile gauze, and keep lens 10–15 cm from lesion with sharp focus on borders."
        if repeat_needed
        else "Current photograph resolution and lighting are adequate for remote screening triage. Direct in-person clinical examination remains mandatory."
    )

    exam_guidance = (
        "In-person physical examination required: perform bimanual digital palpation of oral lesion to assess tissue induration and depth; perform sterile gauze wiping test to differentiate superficial coating from fixed plaque; perform palpation of cervical lymph node basins (levels I to V)."
    )

    additional_history = (
        "1. Lesion chronicity & duration: Verify exact duration (persisting >14 days?). "
        "2. Tobacco & substance history: Detailed quantification of smokeless tobacco (gutkha, khaini, zarda), combustible tobacco (bidi, cigarette), areca nut / betel quid, and alcohol consumption. "
        "3. Mechanical factors: Assess sharp teeth, broken restorations, or ill-fitting dentures. "
        "4. Symptom history: Spontaneous pain, burning sensation on spicy food, localized bleeding, or dysphagia. "
        "5. Medical history: Prior oral lesions, immunosuppression, diabetes, or topical/inhaled corticosteroid usage."
    )

    physical_exam = (
        "1. Direct mucosal visual inspection: Full oral cavity visualization with good illumination and cheek/tongue retraction. "
        "2. Bimanual digital palpation: Palpate lesion to evaluate tissue induration, depth, and tenderness against underlying structures. "
        "3. Gauze wiping (rub-off) test: Gently rub white areas with moist sterile gauze to determine whether lesion is removable (coating/candidiasis) vs fixed (keratosis/leukoplakia). "
        "4. Cervical lymph node examination: Systematic bilateral palpation of regional lymph node stations (submental, submandibular, upper/middle/lower jugular, levels I to V)."
    )

    if is_high_risk or abnormality_type in ["ulcer", "red_patch", "mixed_red_white", "irregular_surface"]:
        specialist = "Head & Neck Surgical Oncologist / Oral & Maxillofacial Surgeon"
        urgency = (
            "Immediate Specialist Referral (evaluate within 7 days; do not delay with passive observation)"
            if (has_concerning_symptoms or has_chronic_duration)
            else "Urgent Specialist Referral (evaluate within 7 to 14 days for incisional biopsy)"
        )
        investigations = "Urgent diagnostic incisional or punch biopsy of representative lesion margin for histopathological diagnosis, staging, and dysplasia grading; contrast-enhanced CT/MRI if deep invasion suspected."
    elif is_opmd or abnormality_type in ["white_plaque", "keratotic_area"]:
        specialist = "Oral Medicine Specialist / Maxillofacial Surgeon"
        urgency = (
            "Priority Specialist Referral (evaluate within 14 days for biopsy mapping and habit intervention)"
            if has_high_risk_habits
            else "Specialist Evaluation (evaluate within 2 to 3 weeks; prompt biopsy if lesion is non-homogeneous or symptomatic)"
        )
        investigations = "Diagnostic incisional / punch biopsy indicated for any non-removable keratotic plaque; toluidine blue or autofluorescence adjunct if available; strict habit cessation protocol."
    elif abnormality_type in ["white_coating", "white_tongue_abnormality"]:
        specialist = "Oral Medicine Specialist / PHC Medical Officer with Dental Specialist Collaboration"
        urgency = "Priority Clinical Evaluation & Specialist Referral (within 10 to 14 days; perform gauze wiping test; prompt biopsy if non-removable)"
        investigations = "Moist sterile gauze wiping test (rub-off test); 10% KOH fungal microscopy smear; topical antifungal trial (clotrimazole / nystatin); refer to oral specialist if persistent or non-scrapable."
    else:
        specialist = "Oral Medicine Specialist / Medical Officer with Dental Collaboration"
        urgency = (
            "Priority Specialist Referral (within 14 days; do not delay referral simply to observe)"
            if has_high_risk_habits
            else "Primary Care Clinical Correlation & Specialist Referral (within 14 days; do not delay referral simply to observe)"
        )
        investigations = "In-person physical clinical examination, digital tissue palpation, and cervical lymph node evaluation; diagnostic incisional/punch biopsy if lesion persists beyond 14 days; habit cessation counseling."

    delay_warning = "Do not recommend delaying referral simply to observe a lesion; persistent or concerning oral mucosal alterations mandate prompt specialist evaluation."

    phc_action_plan = [
        "1. Habit Cessation: Deliver immediate brief intervention counseling for smokeless tobacco, bidi/cigarettes, areca nut, and alcohol.",
        "2. Irritant & Trauma Removal: Inspect dentition for sharp cusps, broken teeth, or ill-fitting dentures causing mechanical trauma; refer to dentist for smoothing.",
        "3. Physical Clinical Exam: Perform bimanual digital palpation of oral lesion to assess induration and palpate cervical lymph node stations.",
        "4. Gauze Wiping / Rub-Off Test: Gently wipe white mucosal areas with moist sterile gauze to test scrapability (distinguishing superficial coating from fixed plaque).",
        f"5. Structured Clinical Recall & Specialist Referral: Execute referral according to assessed urgency ({urgency}) for diagnostic biopsy; avoid unstructured or delayed observation for concerning lesions."
    ]

    return {
        "additionalPatientHistoryRequired": additional_history,
        "appropriatePhysicalExamination": physical_exam,
        "specialistReferral": specialist,
        "referralUrgency": urgency,
        "delayWarning": delay_warning,
        "additionalInvestigations": investigations,
        "nextClinicalExamination": exam_guidance,
        "directClinicalExaminationRequired": True,
        "directClinicalExaminationGuidance": exam_guidance,
        "appropriateSpecialist": specialist,
        "repeatPhotographyRecommended": repeat_needed,
        "repeatPhotographyGuidance": repeat_guidance,
        "repeatPhotographyReason": quality_notes if repeat_needed else "Photograph quality is satisfactory for screening triage.",
        "phcActionPlan": phc_action_plan,
        "source": "IMAGE_OBSERVATION"
    }

'''

code = code[:idx3] + new_follow_up + code[idxEnd3:]

# 4. Update analyze_clinical_features imageAssessment and recommendedFollowUp
# In analyze_clinical_features, update the returned dict structure to add whiteOrRedAreas, relationshipWithSurroundingTissue, etc.
old_image_assessment_block = '''        "imageAssessment": {
            "anatomicalLocation": {
                "value": resolved_site["name"] if resolved_site["isSpecific"] else anatomical_location,
                "isSpecific": resolved_site["isSpecific"],
                "uncertainty": resolved_site["uncertainty"],
                "source": "IMAGE_OBSERVATION"
            },
            "visibleAbnormality": {
                "value": morphology,
                "abnormalityType": visual_abnormality["type"],
                "clinicalDistinction": visual_abnormality["clinicalDistinction"],
                "distribution": visual_abnormality.get("distribution", "Localized"),
                "source": "IMAGE_OBSERVATION"
            },
            "colorAndAppearance": {
                "color": color,
                "appearance": "Visual surface texture only; consistency not assessable by image",
                "source": "IMAGE_OBSERVATION"
            },
            "shapeAndBorders": {
                "shape": "Focal mucosal contour",
                "borders": margins,
                "source": "IMAGE_OBSERVATION"
            },
            "approximateDimensions": {
                "value": "Not reliably measurable from 2D photograph without clinical calibration marker or caliper.",
                "isMeasurable": False,
                "source": "IMAGE_OBSERVATION"
            },
            "imageQuality": {
                "value": quality_notes,
                "isAdequate": "Sub-optimal" not in quality_notes and "Low illumination" not in quality_notes,
                "requiresRecapture": "Sub-optimal" in quality_notes or "Low illumination" in quality_notes,
                "recaptureReason": quality_notes if ("Sub-optimal" in quality_notes or "Low illumination" in quality_notes) else None,
                "source": "IMAGE_OBSERVATION"
            }
        },'''

new_image_assessment_block = '''        "imageAssessment": {
            "anatomicalLocation": {
                "value": resolved_site["name"] if resolved_site["isSpecific"] else anatomical_location,
                "isSpecific": resolved_site["isSpecific"],
                "uncertainty": resolved_site["uncertainty"],
                "source": "IMAGE_OBSERVATION"
            },
            "whiteOrRedAreas": {
                "value": visual_abnormality.get("whiteOrRedAreas", "Visual white and/or red mucosal features examined; absence of an obvious ulcer does not establish benignity."),
                "whiteFeatures": visual_abnormality.get("whiteFeatures", color if ("white" in visual_abnormality["type"] or "kerato" in visual_abnormality["type"]) else "None distinct"),
                "redFeatures": visual_abnormality.get("redFeatures", color if ("red" in visual_abnormality["type"] or "ulcer" in visual_abnormality["type"]) else "None distinct"),
                "ulcerAbsenceNote": "Absence of an obvious ulcer does not establish benignity; dysplastic OPMDs and early malignant lesions frequently present without central ulceration.",
                "source": "IMAGE_OBSERVATION"
            },
            "distribution": {
                "value": visual_abnormality.get("distribution", "Localized"),
                "description": "Lesion distribution assessed in captured photographic visual field; contralateral intraoral inspection required for bilateral symmetry evaluation.",
                "source": "IMAGE_OBSERVATION"
            },
            "surfaceAppearance": {
                "value": visual_abnormality.get("surfaceAppearance", texture),
                "palpationCaveat": "Visual surface texture only; physical tissue consistency, softness, or induration requires clinical palpation.",
                "source": "IMAGE_OBSERVATION"
            },
            "shapeAndBorders": {
                "shape": visual_abnormality.get("shape", "Focal mucosal contour"),
                "borders": margins,
                "source": "IMAGE_OBSERVATION"
            },
            "relationshipWithSurroundingTissue": {
                "value": visual_abnormality.get("relationshipWithSurroundingTissue", "Demarcated visual transition into adjacent mucosal tissue; submucosal depth and invasion require palpation and biopsy."),
                "infiltrationCaveat": "Absence of visible gross infiltration cannot confirm lack of invasion; histological and palpation assessment of submucosal depth is mandatory.",
                "source": "IMAGE_OBSERVATION"
            },
            "visibleAbnormality": {
                "value": morphology,
                "abnormalityType": visual_abnormality["type"],
                "clinicalDistinction": visual_abnormality["clinicalDistinction"],
                "distribution": visual_abnormality.get("distribution", "Localized"),
                "source": "IMAGE_OBSERVATION"
            },
            "colorAndAppearance": {
                "color": color,
                "appearance": "Visual surface texture only; consistency not assessable by image",
                "source": "IMAGE_OBSERVATION"
            },
            "approximateDimensions": {
                "value": "Not reliably measurable from 2D photograph without clinical calibration marker or caliper.",
                "isMeasurable": False,
                "source": "IMAGE_OBSERVATION"
            },
            "imageQuality": {
                "value": quality_notes,
                "isAdequate": "Sub-optimal" not in quality_notes and "Low illumination" not in quality_notes,
                "requiresRecapture": "Sub-optimal" in quality_notes or "Low illumination" in quality_notes,
                "recaptureReason": quality_notes if ("Sub-optimal" in quality_notes or "Low illumination" in quality_notes) else None,
                "source": "IMAGE_OBSERVATION"
            }
        },'''

if old_image_assessment_block in code:
    code = code.replace(old_image_assessment_block, new_image_assessment_block)
else:
    print('Warning: old_image_assessment_block not found exactly in python script')

# Also update recommendedFollowUp in analyze_clinical_features
old_follow_up_block = '''        "recommendedFollowUp": {
            "nextClinicalExamination": follow_up["nextClinicalExamination"],
            "directClinicalExaminationRequired": True,
            "directClinicalExaminationGuidance": follow_up["directClinicalExaminationGuidance"],
            "appropriateSpecialist": follow_up["appropriateSpecialist"],
            "referralUrgency": follow_up["referralUrgency"],
            "additionalInvestigations": follow_up["additionalInvestigations"],
            "repeatPhotographyRecommended": follow_up["repeatPhotographyRecommended"],
            "repeatPhotographyGuidance": follow_up["repeatPhotographyGuidance"],
            "repeatPhotographyReason": follow_up["repeatPhotographyReason"],
            "phcActionPlan": follow_up["phcActionPlan"],
            "source": "IMAGE_OBSERVATION"
        },'''

new_follow_up_block = '''        "recommendedFollowUp": {
            "additionalPatientHistoryRequired": follow_up["additionalPatientHistoryRequired"],
            "appropriatePhysicalExamination": follow_up["appropriatePhysicalExamination"],
            "specialistReferral": follow_up["specialistReferral"],
            "referralUrgency": follow_up["referralUrgency"],
            "delayWarning": follow_up["delayWarning"],
            "additionalInvestigations": follow_up["additionalInvestigations"],
            "nextClinicalExamination": follow_up["nextClinicalExamination"],
            "directClinicalExaminationRequired": True,
            "directClinicalExaminationGuidance": follow_up["directClinicalExaminationGuidance"],
            "appropriateSpecialist": follow_up["appropriateSpecialist"],
            "repeatPhotographyRecommended": follow_up["repeatPhotographyRecommended"],
            "repeatPhotographyGuidance": follow_up["repeatPhotographyGuidance"],
            "repeatPhotographyReason": follow_up["repeatPhotographyReason"],
            "phcActionPlan": follow_up["phcActionPlan"],
            "source": "IMAGE_OBSERVATION"
        },'''

if old_follow_up_block in code:
    code = code.replace(old_follow_up_block, new_follow_up_block)
else:
    print('Warning: old_follow_up_block not found exactly in python script')

with open('scripts/medgemma-inference.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Successfully updated scripts/medgemma-inference.py!')

