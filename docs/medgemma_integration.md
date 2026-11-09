# MedGemma 1.5 4B Integration: Aarogya Drishti ITDA Platform

## 1. Architectural Architecture & Service Decoupling

The Aarogya Drishti ITDA platform employs a decoupled microservice architecture:
1. **NestJS API Gateway & Backend** (Port 4000): Manages patient records, clinical workflows, authentication, facility scopes, and frontline screening records.
2. **AI & Quality Microservice** (`ai-service/`, FastAPI, Port 8001 / 8002): Dedicated Python service hosting OpenCV image quality assessment and the **MedGemma 1.5 4B** multimodal inference engine (`google/medgemma-1.5-4b-it`).
3. **Frontend Application** (`src/`, Port 3000): React 18 + TypeScript + Tailwind CSS interface.

```text
+-------------------------------------------------------------+
|               Aarogya Drishti Frontline UI                  |
|                 (React 18 + TypeScript)                     |
+------------------------------+------------------------------+
                               | Port 4000 /api/v1
                               v
+-------------------------------------------------------------+
|            NestJS Clinical Backend & API Gateway            |
|                                                             |
|   - /clinical/screenings                                    |
|   - /images/:imageId/ai-demo                                |
|   - /patients, /auth, /quality                              |
+------------------------------+------------------------------+
                               | HTTP / Port 8001
                               v
+-------------------------------------------------------------+
|              Aarogya Drishti AI Microservice                |
|               (ai-service/ - FastAPI)                       |
|                                                             |
|   POST /quality-check   -> Blur, lighting, glare audit      |
|   GET  /ai/status       -> MedGemma 1.5 4B capability check |
|   POST /ai/analyze      -> Multimodal decision support      |
|                                                             |
|   Engine: medgemma_service.py                               |
|   - Visual Anatomical Localization & Discrepancy Detection   |
|   - Bilingual Clinical Answers (English + Telugu)           |
|   - Verified ICD-10 Differential Reasoning (OSCC, OPMD...)  |
|   - Non-Visual Physical Examination Safety Guardrails       |
+-------------------------------------------------------------+
```

---

## 2. Decision Support Features

### 2.1 Anatomical Concordance & Discrepancy Detection
* The AI engine independently detects visual anatomical landmarks (`modelVisualSite`) and compares them against the health worker intake (`healthWorkerSite`).
* If there is a discrepancy (e.g., photo shows tongue, health worker selected buccal mucosa), the engine flags `hasDisagreement: true` and attaches an alert so reviewing clinicians are informed immediately.

### 2.2 Eliminating False Reassurance
* Inconclusive or suspicious keratotic lesions are routed to **Tier 1 (Priority Oncology Referral within 7 days)** or **Tier 2 (Targeted Specialist Evaluation within 14 days)**. Routine 6-month recalls are strictly prohibited for unverified mucosal abnormalities.

### 2.3 Physical Examination Limits
* Scalpel incisional biopsy and histopathology examination remain mandatory. Photographs cannot evaluate tissue induration, submucosal invasion depth, or lymph node metastasis.

---

## 3. API Endpoints

### 3.1 Model Status
* **Method**: `GET /ai/status` (or `GET /medgemma/status`)
* **Returns**:
```json
{
  "available": true,
  "model": "google/medgemma-1.5-4b-it",
  "revision": "pretrained-1.5-4b-it",
  "license": "Health AI Developer Foundations (HAI-DEF)",
  "researchOnly": true,
  "clinicallyValidated": false,
  "modality": "image-text-to-text",
  "parameters": "4B",
  "architecture": "Gemma-3/SigLIP Multimodal",
  "device": "cpu",
  "capabilities": [
    "oral_lesion_analysis",
    "multimodal_image_text",
    "risk_factor_correlation",
    "differential_consideration"
  ]
}
```

### 3.2 Multimodal Analysis
* **Method**: `POST /ai/analyze` (or `POST /medgemma/analyze`)
* **Payload**:
```json
{
  "imageBase64": "data:image/jpeg;base64,...",
  "patientAge": 34,
  "habits": ["Tobacco Chew", "Gutkha daily"],
  "symptoms": "Non-scrapable white patch on buccal mucosa",
  "healthWorkerSite": "Buccal mucosa"
}
```
* **Returns**: Structured dossier with `triageTier`, `basicClinicalAnswer` (EN/TE), `anatomicalDiscrepancy`, `differentialReasoning` with ICD-10, and `biopsyAdvised`.

---

## 4. Verification & Testing

Execute the automated microservice unit test suite:
```bash
python ai-service/tests/test_medgemma_service.py
```
