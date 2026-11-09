# AAROGYA DRISHTI — Known Limitations, Clinical Boundaries & Handover Specifications
**Document Version:** 2.0.0 (Phase 12 Comprehensive Audit & Handover)  
**System:** AAROGYA DRISHTI Community Healthcare Platform (ఆరోగ్య దృష్టి)  
**Target Environment:** Frontend Standalone Demonstration & PWA Prototype  
**Geographic Focus:** Alluri Sitharama Raju (ASR) District, Andhra Pradesh (ITDA Paderu)

---

## 1. Non-Negotiable Clinical Safety Boundaries

1. **AI Output Is NOT a Clinical Diagnosis:**
   - Any AI model output displayed within this application is purely an illustrative research demonstration (`provider: mock`, `model_version: v0.4.1-research`).
   - It cannot diagnose oral cancer, cannot rule out disease, and cannot reassure any individual that they are free of cancer.
   - The platform strictly rejects displaying fabricated cancer probabilities (e.g. *"94.2% chance of cancer"* is prohibited). Model outputs use categorical research labels (`suspicious_example`, `benign_example`) with `score: null`.
   - Only a qualified clinician (Medical Officer, Dental Surgeon, Oral Oncologist) can conduct an examination and finalize a diagnosis.

2. **Photographs Supplement, Never Replace, Clinical Examination:**
   - Visual photographs cannot evaluate tissue induration, depth of invasion, or cervical lymph node consistency.
   - A photograph or AI flag never substitutes for a clinically indicated physical examination, punch biopsy, or histopathological analysis.

3. **Clinician In-the-Loop Architecture:**
   - Research model outputs are strictly isolated in a designated panel; they never auto-fill or influence the Medical Officer's independent clinical observation fields.
   - Clinical assessments and specialist hospital referrals require independent clinician authentication (*Dr. K. Suresh, MBBS, APMC-48291*).

4. **Biopsy Correlation Required:**
   - In accordance with standard oncological protocols, any clinical impression of potentially malignant disorders (OPMDs) or suspected malignancies mandates histological punch biopsy verification before staging or surgical intervention.

---

## 2. Frontend Architectural Scope & Mock Boundaries

| Component / Subsystem | Current Frontend Implementation | Production Backend Roadmap |
|---|---|---|
| **Authentication & Roles** | In-memory `AuthContext` with mock user state and instant role switcher (`/login`) | ABHA / ABDM OAuth2 / OIDC authentication with JWT bearer tokens and RBAC |
| **Patient Database** | In-memory synthetic registries (`demoUsers.ts`, `doctorData.ts`, `hospitalData.ts`) | PostgreSQL 16 with pgvector & PostGIS for geo-spatial habitation saturation |
| **Offline Storage** | Client-side IndexedDB (`idb` v8.0.4) with `aarogya_drafts` and `sync_queue` stores | Client IndexedDB synchronizing with PostgreSQL via REST / WebSocket sync worker |
| **Telemedicine** | Simulated encrypted WebRTC peer connection with active local camera loopback and synthetic audio wave | Production WebRTC SFU (LiveKit / Janus) with end-to-end SRTP encryption |
| **Image Quality Analysis** | HTML5 Canvas client-side heuristics (Laplacian kernel blur, exposure, glare) | On-device WebAssembly OpenCV + server-side torchscript quality verification |
| **PWA Caching** | Service Worker (`public/sw.js`) with Cache-First app shell and offline navigation fallback | Workbox-powered precaching, background sync API, and delta updates |
| **Bilingual i18n** | Synchronous client-side dictionary (`src/i18n/translations.ts`) for English & Telugu | Dynamic JSON locale bundles with remote OTA translation updates for tribal dialects |

---

## 3. Data Privacy & Health Information (PHI) Isolation

1. **Synthetic Data Only:**
   - All patient records (e.g., Kondala Rao, Kumari Devi), clinician identities, and test cases are entirely synthetic.
   - No connection is made to external clinical databases or unvetted cloud AI APIs.
   - Zero Real Protected Health Information (PHI) or Personally Identifiable Information (PII) is processed or stored.

2. **Physical Health Card Privacy:**
   - The printed physical health card (`HealthCardPreviewPage`) displays minimal necessary identifiers (Card ID, Patient ID, Age, Habitation, Emergency ASHA contact).
   - The QR code contains a cryptographically isolated reference token (`AAROGYA-DRISHTI://CARD-REF/.../EMERGENCY-VERIFY`) that requires authorized frontline health worker login to decrypt and access clinical records.

---

## 4. REST API Backend Migration Mapping

All frontend service calls in `src/services/` are typed and structured to match the endpoints defined in [`docs/FRONTEND_API_CONTRACT.md`](file:///c:/Users/poitd/OneDrive/Desktop/Aarogya%20Drishti/docs/FRONTEND_API_CONTRACT.md):

| Service Function | Target REST Endpoint | Contract Method | Status |
|---|---|---|---|
| `login(role, pin)` | `/api/v1/auth/token` | `POST` | Ready for Axios / Fetch hookup |
| `getPatients(filters)` | `/api/v1/patients/` | `GET` | Ready for Axios / Fetch hookup |
| `registerPatient(data)` | `/api/v1/patients/` | `POST` | Ready for Axios / Fetch hookup |
| `submitScreening(payload)` | `/api/v1/screenings/` | `POST` | Ready for Axios / Fetch hookup |
| `runAiDemonstration(images)` | `/api/v1/ai/inspect-demonstration` | `POST` | Ready for FastAPI PyTorch worker |
| `getDoctorCases(status)` | `/api/v1/doctor/cases` | `GET` | Ready for Axios / Fetch hookup |
| `submitDoctorReview(caseId)` | `/api/v1/doctor/cases/{id}/review` | `POST` | Ready for Axios / Fetch hookup |
| `dispatchReferral(data)` | `/api/v1/referrals/` | `POST` | Ready for Axios / Fetch hookup |
| `syncQueue(items)` | `/api/v1/sync/batch` | `POST` | Ready for Idempotent batch handler |

---

## 5. Offline Resiliency Guarantees

1. **Local-First Screening:**
   - Field health workers in non-connected tribal habitations (e.g., Kothapalli, G. Madugula) can perform complete intakes, take guided oral photos, and save drafts locally.
   - Drafts persist across browser reloads, device power-offs, and app restarts via IndexedDB.
2. **Graceful Fallback on AI Outage:**
   - In the event of an AI service outage (simulated via the HTTP 503 toggle), the platform seamlessly continues the referral and doctor review workflow without blocking patient care.

