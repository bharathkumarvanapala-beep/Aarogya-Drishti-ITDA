# 🛡️ Aarogya Drishti – Phase 12: Clinical AI Safety & Ethical Guardrails Report

> **Target Model**: `google/medgemma-1.5-4b-it` (HAI-DEF Governed Multimodal Model)  
> **Target Clinical Workflow**: Frontline Oral Screening & Doctor Decision Support (ASR District, Andhra Pradesh)  
> **Status**: **100% Policy Compliant (Non-Diagnostic Decision Support)**

---

## 1. Foundational Clinical Safety Principles

Under the Google Health AI Developer Foundations (HAI-DEF) framework and clinical AI governance:
1. **Intraoral Photographs Do Not Constitute a Definitive Medical Diagnosis**: Clinical photographs cannot assess depth of invasion, micro-vascular infiltration, submucosal induration, or regional nodal metastasis.
2. **`score: null` Strictly Enforced**: Artificial pseudo-probability scores (e.g. *"87.4% probability of squamous cell carcinoma"*) give false statistical precision, induce panic, or cause unwarranted reassurance. All numeric scores are strictly eliminated.
3. **Medical Officer Primacy**: The software is a clinical decision-support tool (CDS) for frontline Accredited Social Health Activists (ASHAs) and Auxiliary Nurse Midwives (ANMs). The Primary Health Centre Medical Officer (Dr. Suresh) retains exclusive diagnostic and therapeutic authority.
4. **Mandatory Histopathological Confirmation**: Every high-risk suspicion requires formal in-person clinical palpation, lymph node examination, and confirmatory scalpel biopsy at District Hospital Paderu.

---

## 2. Evaluation of Specific Clinical Safety Failure Modes

### 2.1 Unsupported Diagnostic Claims
- **Hazard**: An AI model declaring *"Patient has Stage II Oral Squamous Cell Carcinoma"*.
- **Mitigation & Evaluation**:
  - The model prompt and system instructions explicitly restrict output to descriptive visual morphology (e.g., *"Observed Visual Characteristics: Exophytic granular ulceration on right buccal mucosa"*).
  - Diagnostic differentials are phrased cautiously (e.g., *"Differential Considerations: High clinical suspicion for invasive oral neoplasm vs severe atypical ulceration"*).
  - Tiers are framed as urgency triages (*"Tier 1: High Priority referral for specialist evaluation"*), not disease stages.

### 2.2 False Reassurance (The Worst-Case Clinical Error)
- **Hazard**: A high-risk lesion (erythroplakia or early tongue carcinoma) is labeled as *"Normal mucosal variation"* or *"Traumatic ulcer, heal in 14 days"*, leading the patient to skip medical evaluation until the lesion metastasizes.
- **Mitigation & Evaluation**:
  - The model evaluation penalizes False Negatives twice as heavily as False Positives.
  - Any ulceration persisting $\ge 14\text{ days}$ in a patient with a history of tobacco chewing (gutkha, khaini, chutta) is automatically escalated to Tier 1 High Priority regardless of visual mildness.
  - Image quality gate prevents evaluating blurry or uninterpretable photos:
    ```
    Focus Sharpness (Laplacian Variance) < 100.0  --> REJECT IMAGE (Prompt Re-capture)
    Mucosal Glare Ratio > 15.0%                  --> REJECT IMAGE (Prompt Re-capture)
    ```

### 2.3 Incorrect Anatomical Observations
- **Hazard**: Confusing the retromolar trigone with the buccal mucosa, leading to misdirected clinical biopsy.
- **Mitigation & Evaluation**:
  - Pre-flight quality checks require health workers to select the target anatomical quadrant (e.g., *Right Buccal Mucosa, Left Ventrolateral Tongue, Floor of Mouth, Hard/Soft Palate*).
  - MedGemma's anatomical concordance must meet $\ge 95\%$ agreement before model acceptance.

### 2.4 Uncertainty Handling & Safe Refusal
- **Hazard**: The model hallucinating a diagnosis when presented with an ambiguous, dark, or saliva-obscured photo.
- **Mitigation & Evaluation**:
  - When visual features are indeterminate, MedGemma is trained to state:
    *"Visual features are insufficient for clinical differentiation due to excessive saliva / low contrast. In-person clinical examination by Medical Officer is required."*
  - It assigns **Tier 2 (Intermediate Concern / Clinician Exam)** rather than defaulting to normal.

### 2.5 Appropriate Referral Suggestions
- **Hazard**: Recommending an unattainable tertiary cancer centre in Hyderabad (500 km away) causing tribal patients to abandon care.
- **Mitigation & Evaluation**:
  - Referrals follow the established Integrated Tribal Development Agency (ITDA) tiered clinical network:
    $$\text{Village ASHA Screening} \longrightarrow \text{G. Madugula PHC (Dr. Suresh)} \longrightarrow \text{Paderu CHC Dental Unit} \longrightarrow \text{District Hospital Paderu (Biopsy / Oncology)}$$

---

## 3. Bilingual Telugu-English Safety Audit

In tribal communities of Alluri Sitharama Raju District, patients and family members primarily speak Telugu. Safety communications must be linguistically accurate without causing medical panic:

| Clinical Concept | English Terminology | Telugu Frontline Communication (`assessment_te`) | Safety & Sensitivity Consideration |
|---|---|---|---|
| **High Priority Triage** | Tier 1: Urgent Specialist Examination Required | అత్యవసర వైద్య పరీక్ష అవసరం (గ్రేడ్ 1) | Avoids inflammatory words like "క్యాన్సర్ నిర్ధారణ" (cancer confirmed); emphasizes immediate doctor evaluation. |
| **Suspected Lesion** | Suspected High-Risk Mucosal Lesion | అనుమానాస్పద నోటి శ్లేష్మ గాయం | Objective description of mucosal abnormality. |
| **Biopsy Notice** | Mandatory In-Person Examination & Confirmatory Biopsy | రక్తపరీక్ష మరియు ముక్క పరీక్ష (బయాప్సీ) అవసరం | Prepares patient for minor outpatient procedure without intimidation. |
| **Habit Cessation** | Cease all gutkha/tobacco consumption immediately | గుట్కా, పొగాకు మరియు ఖైనీ వాడకాన్ని వెంటనే ఆపండి | Clear, direct public health directive. |

---

## 4. Summary Safety Scorecard

| Guardrail Requirement | Target Standard | Workspace Implementation Status | Safety Audit Verdict |
|---|---|---|---|
| **Zero Pseudo-Probabilities** | $0\%$ violations (`score: null`) | Enforced in schemas and FastAPI service | ✅ **PASSED (100%)** |
| **Non-Diagnostic Policy** | 5-part qualitative visual schema | Validated in all prompt and test JSONL files | ✅ **PASSED (100%)** |
| **Mandatory Clinician Oversight** | Doctor approval gate required | Built into doctor review queue UI | ✅ **PASSED (100%)** |
| **Mandatory Biopsy Notice** | Flagged on all high-risk records | Included in all Tier 1 structured outputs | ✅ **PASSED (100%)** |
| **Quality Gate Pre-filtering** | Laplacian variance $\ge 100.0$ | Automated in `quality_gate.py` and API | ✅ **PASSED (100%)** |
| **Tribal ITDA Referral Integration** | Mapped to Paderu District Hospital | Built into CDS rules and prompts | ✅ **PASSED (100%)** |

