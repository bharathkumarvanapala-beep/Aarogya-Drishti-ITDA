# AAROGYA DRISHTI — Frontend API Contract Specification
**Document Version:** 1.0.0 (Phase 0 Contract)  
**Protocol:** RESTful JSON over HTTPS (Targeting future FastAPI backend)  
**Standard Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <demo_token>`
- `X-Idempotency-Key: <uuid-v4>` (For safe offline sync retries)
- `Accept-Language: te, en`

---

## 1. Authentication & Session Endpoints

### 1.1 POST `/auth/login`
**Purpose:** Authenticate user persona and establish active session.
- **Request:**
  ```json
  {
    "username": "hw_lakshmi",
    "password": "demo_password",
    "role": "health_worker"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo_token",
    "expires_at": "2026-10-31T18:00:00Z",
    "user": {
      "id": "USR-HW-001",
      "username": "hw_lakshmi",
      "name": "Lakshmi Devi",
      "name_te": "లక్ష్మి దేవి",
      "role": "health_worker",
      "assigned_facility": "G. Madugula Sub-Centre",
      "assigned_villages": ["Kothapalli", "Nurmati", "Solabham"]
    }
  }
  ```

---

## 2. Patient & Consent Management

### 2.1 POST `/patients`
**Purpose:** Register synthetic patient via frontline assisted pathway.
- **Request:**
  ```json
  {
    "first_name": "Kondala",
    "last_name": "Rao",
    "first_name_te": "కొండల",
    "last_name_te": "రావు",
    "age": 46,
    "gender": "male",
    "district": "Alluri Sitharama Raju",
    "mandal": "G. Madugula",
    "gram_panchayat": "G. Madugula",
    "village": "Kothapalli",
    "contact_phone": null,
    "alternate_phone": "9440123456",
    "preferred_language": "te",
    "has_smartphone": false
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "patient_id": "ASR-PAT-2026-0842",
    "card_reference_token": "urn:aarogya:ref:ASR-2026-0842",
    "created_at": "2026-10-30T10:30:00Z",
    "status": "REGISTERED"
  }
  ```

### 2.2 POST `/patients/{id}/consents`
**Purpose:** Capture bilingual purpose-scoped informed consent.
- **Request:**
  ```json
  {
    "patient_id": "ASR-PAT-2026-0842",
    "consent_type": "ORAL_SCREENING_AND_IMAGING",
    "language": "te",
    "is_verbal": true,
    "witness_name": "Lakshmi Devi (ASHA)",
    "granted_purposes": [
      "clinical_oral_examination",
      "photography_of_mouth",
      "non_clinical_research_ai_analysis",
      "referral_coordination"
    ],
    "timestamp": "2026-10-30T10:35:00Z"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "consent_id": "CNS-2026-0042",
    "patient_id": "ASR-PAT-2026-0842",
    "status": "ACTIVE",
    "recorded_by": "USR-HW-001"
  }
  ```

---

## 3. Screening & Guided Oral Photography

### 3.1 POST `/screenings`
**Purpose:** Record frontline clinical history, tobacco/gutkha exposure, and symptoms.
- **Request:**
  ```json
  {
    "patient_id": "ASR-PAT-2026-0842",
    "health_worker_id": "USR-HW-001",
    "exposure": {
      "chewing_tobacco": true,
      "chewing_frequency_daily": 4,
      "chewing_duration_years": 22,
      "smoking": false,
      "reverse_smoking": true,
      "alcohol": false
    },
    "symptoms": {
      "persistent_ulcer": false,
      "white_or_red_patch": true,
      "patch_color": "white",
      "anatomical_site": "right_buccal_mucosa",
      "duration_weeks": 3,
      "burning_sensation": true,
      "restricted_mouth_opening": true,
      "mouth_opening_fingers": 2.5
    }
  }
  ```

### 3.2 POST `/ai/analyze`
**Purpose:** Submit image to non-clinical demonstration AI adapter.
- **Strict Non-Clinical Response (200 OK):**
  ```json
  {
    "analysis_id": "DEMO-AI-009",
    "screening_id": "SCR-2026-0042",
    "image_quality": "acceptable",
    "provider": "mock",
    "model_version": "mock-v1-efficientnet-b0",
    "research_label": "suspicious_example",
    "score": null,
    "clinical_use": false,
    "requires_clinician_review": true,
    "warning": "NOT FOR CLINICAL USE - RESEARCH DEMONSTRATION ONLY"
  }
  ```

---

## 4. Clinical Review, Referrals & Biopsy Tracking

### 4.1 POST `/reviews`
**Purpose:** Medical Officer documents independent assessment.
- **Request:**
  ```json
  {
    "screening_id": "SCR-2026-0042",
    "doctor_id": "USR-DOC-001",
    "doctor_name": "Dr. K. Suresh, MBBS",
    "independent_observations": "Leukoplakic lesion noted on right buccal mucosa, non-scrapable, ~1.5 x 1.0 cm.",
    "clinical_assessment": "SUSPICIOUS_POTENTIALLY_MALIGNANT_DISORDER",
    "decision": "REFER_TO_SPECIALIST",
    "recommended_specialty": "Oral Onco-Surgery / Specialist ENT",
    "notes": "Recommend urgent biopsy and histopathological correlation at District Hospital Paderu.",
    "signed_at": "2026-10-30T11:15:00Z"
  }
  ```

### 4.2 POST `/referrals`
**Purpose:** Dispatch specialist referral to hospital.
- **Response (201 Created):**
  ```json
  {
    "referral_id": "REF-2026-0019",
    "patient_id": "ASR-PAT-2026-0842",
    "target_facility": "District Hospital Paderu",
    "priority": "HIGH",
    "status": "APPOINTMENT_REQUESTED"
  }
  ```
