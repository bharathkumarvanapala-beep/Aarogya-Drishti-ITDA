# AAROGYA DRISHTI — Backend Task Tracker
**Project Title:** AAROGYA DRISHTI (ఆరోగ్య దృష్టి) — *Every Smile Deserves Care*  
**Document Version:** 1.0.0 (Phase 0 Baseline)  
**Tracking System:** Sequential Phased Development (Phases 0 through 15)  

---

## Progress Overview

| Phase | Description | Status | Progress |
|---|---|---|---|
| **Phase 0** | Existing Frontend Audit & Planning | 🟢 COMPLETED | 100% |
| **Phase 1** | Backend Foundation & Toolchain Setup | 🟢 COMPLETED | 100% |
| **Phase 2** | Database Architecture & Prisma Schema | 🟢 COMPLETED | 100% |
| **Phase 3** | Authentication & Multi-Tier Authorization | 🟢 COMPLETED | 100% |
| **Phase 4** | Patient Management & Physical Health Card | 🟢 COMPLETED | 100% |
| **Phase 5** | Informed Consent & Clinical Screening Intake | 🟢 COMPLETED | 100% |
| **Phase 6** | Secure Private Image Storage (S3/MinIO) | 🟢 COMPLETED | 100% |
| **Phase 7** | OpenCV Image Quality Service (Python Micro-service) | 🟢 COMPLETED | 100% |
| **Phase 8** | AI Research Gateway & Safety Boundaries | 🟢 COMPLETED | 100% |
| **Phase 9** | Doctor Clinical Review & Triage Workstation | ⚪ PENDING | 0% |
| **Phase 10** | Hospital Referral & Diagnostic Biopsy Pipeline | ⚪ PENDING | 0% |
| **Phase 11** | Idempotent Offline Synchronization Engine | ⚪ PENDING | 0% |
| **Phase 12** | District Health Administration & Analytics | ⚪ PENDING | 0% |
| **Phase 13** | Audit Logging & Notification System | ⚪ PENDING | 0% |
| **Phase 14** | End-to-End Frontend Integration | ⚪ PENDING | 0% |
| **Phase 15** | Security Hardening, Testing & Production Readiness | ⚪ PENDING | 0% |

---

## Detailed Task Breakdown

### Phase 0: Existing Frontend Audit & Planning
- [x] Inspect completed React frontend structure (40 routes, 93 components, TypeScript models).
- [x] Audit frontend state management (`AuthContext`, `SyncContext`, `LanguageContext`).
- [x] Audit client-side offline persistence (`idb` v8, stores `aarogya_drafts` and `sync_queue`).
- [x] Inspect synthetic personas and workflows (Kondala Rao, Lakshmi Devi, Dr. Suresh, Rajesh Varma).
- [x] Create `docs/BACKEND_IMPLEMENTATION_PLAN.md` with core clinical and safety guardrails.
- [x] Create `docs/FRONTEND_BACKEND_MAPPING.md` mapping all 40 routes and actions to REST endpoints.
- [x] Create `docs/BACKEND_ARCHITECTURE.md` specifying modular monolith, database ER, and security.
- [x] Create `docs/BACKEND_TASK_TRACKER.md` tracking all 16 delivery phases.
- [x] Stop and report Phase 0 findings to the user for formal approval before Phase 1 code execution.

---

### Phase 1: Backend Foundation & Toolchain Setup
- [x] Initialize NestJS modular monolith application in `backend/`.
- [x] Configure TypeScript compiler with strict mode and path aliases.
- [x] Implement environment configuration and validation via `@nestjs/config` and `Joi`.
- [x] Configure Swagger OpenAPI 3.0 documentation at `/api/docs`.
- [x] Implement global HTTP exception filter and Prisma exception filter.
- [x] Implement global response transform interceptor (`{ success: true, data: ..., meta: ... }`).
- [x] Configure structured Winston logger with correlation IDs (`x-request-id`).
- [x] Configure rate-limiting via `@nestjs/throttler`.
- [x] Implement health check endpoints (`/health/liveness`, `/health/readiness`).
- [x] Create Dockerfile and multi-container `docker-compose.yml` (NestJS, PostgreSQL 16, Redis 7).
- [x] Verify clean build, lint, and boot of foundation backend.

---

### Phase 2: Database Architecture & Prisma Schema
- [x] Configure PostgreSQL 16 container and database connection pool.
- [x] Author complete `schema.prisma` covering all 26 clinical and operational entities.
- [x] Implement unique constraints (`uniquePatientId`, `cardSerial`, `qrReferenceToken`, `idempotencyKey`).
- [x] Implement composite indexes for frequent query patterns (facility + status, mandal + village).
- [x] Implement global `PrismaService` and `DatabaseModule` with lifecycle hooks and query logging.
- [x] Author comprehensive seed script (`prisma/seed.ts`) pre-populating roles, facilities, mandals, and synthetic test cases.
- [x] Integrate `DatabaseModule` into `AppModule` with graceful offline database handling.

---

### Phase 3: Authentication & Multi-Tier Authorization
- [x] Implement `AuthModule` with JWT and secure session token generation.
- [x] Implement password hashing using Argon2id.
- [x] Implement `JwtAuthGuard` and public route decorator (`@Public()`).
- [x] Implement role-based access control via `RolesGuard` and `@Roles(...)`.
- [x] Implement resource-level facility scoping via `FacilityScopeGuard`.
- [x] Implement frontline village scoping via `VillageScopeGuard`.
- [x] Implement multi-factor authentication (MFA) workflow for Doctors and Admins.
- [x] Implement protective account lockout and login throttling.
- [x] Test unauthorized, expired token, and cross-facility access attempts.

---

### Phase 4: Patient Management & Physical Health Card
- [x] Implement `POST /api/v1/patients` supporting registration without phone number or account.
- [x] Implement unique Patient ID generation (`ASR-PAT-YYYY-XXXX`).
- [x] Implement fuzzy duplicate detection (`POST /api/v1/patients/duplicate-check`).
- [x] Implement `GET /api/v1/patients` with pagination and village-scoped filtering.
- [x] Implement `PatientCardsModule` with physical card creation and replacement workflows.
- [x] Implement opaque non-sensitive QR token generator (`AAROGYA-DRISHTI://CARD-REF/...`).
- [x] Implement QR token verification endpoint (`POST /api/v1/cards/verify`) ensuring zero PHI disclosure.
- [x] Implement Caregiver authorization and revocation endpoints (`/api/v1/patients/:id/caregivers`).
- [x] Write unit and integration tests for phone-less patient registration and card replacement.

---

### Phase 5: Informed Consent & Clinical Screening Intake
- [x] Implement `ConsentModule` supporting verbal, witnessed, and written bilingual consent.
- [x] Enforce purpose scoping (oral examination, photography, non-clinical research demo, referral).
- [x] Implement consent withdrawal API and audit history tracking.
- [x] Implement `ScreeningModule` intake API capturing tobacco, gutkha, and reverse smoking habits.
- [x] Implement clinical symptom capture (ulcers, patches, burning sensation, trismus finger count).
- [x] Enforce strict consent gate: prevent screening completion if consent is unrecorded or withdrawn.
- [x] Version screening form schemas to prevent silent historical mutation.

---

### Phase 6: Secure Private Image Storage (S3/MinIO)
- [x] Implement S3-compatible storage adapter supporting MinIO (dev) and AWS S3 (prod).
- [x] Configure private bucket policies: zero public access, server-side AES-256 encryption.
- [x] Implement upload initialization API (`POST /api/v1/screenings/:id/images/upload-init`).
- [x] Implement binary file signature inspection (magic bytes verification) rejecting spoofed files.
- [x] Implement randomized UUID object key generation (`screenings/{id}/{view}_{uuid}.jpg`).
- [x] Implement short-lived presigned GET URLs (15-minute expiry) for authorized clinicians only.
- [x] Log image upload and view events in the audit trail.

---

### Phase 7: OpenCV Image Quality Service (Python Micro-service)
- [x] Scaffold Python 3.11 micro-service in `ai-service/` (or dedicated quality worker).
- [x] Implement Laplacian variance blur detection algorithm.
- [x] Implement brightness and exposure histogram validation.
- [x] Implement specular glare detection and rejection.
- [x] Implement minimum resolution checks (1920x1440 standard).
- [x] Expose REST endpoint `POST /quality-check` returning structured JSON results.
- [x] Implement NestJS `ImageQualityModule` client calling the Python worker.
- [x] Return plain-language retake instructions in Telugu and English upon QA failure.

---

### Phase 8: AI Research Gateway & Safety Boundaries
- [x] Implement `AiResearchModule` in NestJS communicating via BullMQ task queue.
- [x] Implement mock research adapter returning categorical labels (`suspicious_example`, `benign_example`).
- [x] Strictly enforce `score: null` payload rule; reject any numerical cancer probability scores.
- [x] Embed permanent disclaimer: *"NOT FOR CLINICAL USE - RESEARCH DEMONSTRATION ONLY"*.
- [x] Ensure AI output is stored in isolated `AIResearchAnalysis` table separate from clinical reviews.
- [x] Implement graceful fallback when AI service is unavailable (HTTP 503 toggle) without blocking clinical care.

---

### Phase 9: Doctor Clinical Review & Triage Workstation
- [ ] Implement `GET /api/v1/doctor/cases` triage queue with priority filters.
- [ ] Implement `GET /api/v1/doctor/cases/:screeningId` case details endpoint.
- [ ] Implement `POST /api/v1/clinical-reviews` independent assessment submission.
- [ ] Store clinician observations, cardinal signs checklist, and provisional category.
- [ ] Enforce independent clinician digital signature (*Dr. K. Suresh, APMC-48291*).
- [ ] Prevent AI demo outputs from auto-populating or overwriting clinician observation fields.
- [ ] Implement immutable audit versioning for clinical assessment amendments.

---

### Phase 10: Hospital Referral & Diagnostic Biopsy Pipeline
- [ ] Implement `ReferralsModule` for specialist hospital referral creation.
- [ ] Implement hospital inbound referral triage and acceptance endpoints (`/api/v1/hospital/referrals`).
- [ ] Implement `AppointmentsModule` with Indian Standard Time (IST) OPD scheduling.
- [ ] Implement `InvestigationsModule` tracking 5-stage biopsy pipeline.
- [ ] Support histopathology report attachment and pathologist review logging.
- [ ] Implement tribal patient navigation touchpoint logger (Ashram lodging, transit assistance, language interpreters).

---

### Phase 11: Idempotent Offline Synchronization Engine
- [ ] Implement `POST /api/v1/sync/batch` endpoint accepting batch submissions from IndexedDB.
- [ ] Enforce client-generated UUID submission tracking and idempotency keys (`X-Idempotency-Key`).
- [ ] Implement database transaction wrapping to prevent partial batch corruption.
- [ ] Implement optimistic concurrency conflict detection based on record version stamps.
- [ ] Return explicit server acknowledgements for each synchronized item.
- [ ] Log all synchronization events in `SyncSubmission` and `SyncItem` tables.
- [ ] Write integration test verifying that retrying an identical batch generates zero duplicate records.

---

### Phase 12: District Health Administration & Analytics
- [ ] Implement `AdministrationModule` aggregate overview API for ITDA Paderu.
- [ ] Implement geographic coverage map endpoint (`/api/v1/admin/coverage-map`) with saturation metrics.
- [ ] Ensure map endpoints return **strictly aggregate figures with zero individual PHI**.
- [ ] Implement epidemiological analytics API (monthly screening volume, gutkha/tobacco habit trends).
- [ ] Implement de-identified CSV dataset export streaming.
- [ ] Implement edge gateway telemetry and sub-centre synchronization health monitor.

---

### Phase 13: Audit Logging & Notification System
- [ ] Implement `AuditModule` with interceptor capturing user, role, action, resource, IP, and timestamp.
- [ ] Audit all PHI reads, patient record creations, image presigned URL requests, and referral changes.
- [ ] Guarantee audit log immutability (prevent ordinary user updates or deletions).
- [ ] Implement in-app notification dispatch for clinical alerts (new referral, biopsy ready, sync error).
- [ ] Enforce notification privacy: zero sensitive clinical diagnostic text in notification previews.

---

### Phase 14: End-to-End Frontend Integration
- [ ] Create typed API client in frontend (`src/services/api.ts`) targeting NestJS `/api/v1`.
- [ ] Connect Authentication: replace mock login with real JWT token exchange.
- [ ] Connect Frontline Intake & Health Card: wire registration and card generator to live endpoints.
- [ ] Connect Guided Camera & S3: test image upload and presigned URL retrieval.
- [ ] Connect Offline Sync Hub: wire IndexedDB batch flusher to `POST /api/v1/sync/batch`.
- [ ] Connect Doctor Workstation, Hospital Referral Desk, and District Admin Portal.
- [ ] Execute complete end-to-end synthetic demo scenario (Kondala Rao, 46M, G. Madugula).

---

### Phase 15: Security Hardening, Testing & Production Readiness
- [ ] Execute automated Jest unit test suite (target >80% code coverage).
- [ ] Execute Supertest API integration test suite covering critical patient journeys.
- [ ] Perform security audit: verify CORS headers, Helmet protection, input validation, and SQL injection safety.
- [ ] Author database backup and automated disaster recovery runbook (`docs/DEPLOYMENT_GUIDE.md`).
- [ ] Deliver all 14 required backend handover documentation files.
- [ ] Final sign-off with zero errors, zero unverified claims, and clean Docker deployment stack.
