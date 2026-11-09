# AAROGYA DRISHTI — Frontend to Backend API & Workflow Mapping
**Document Version:** 1.0.0 (Phase 0 Audit Specification)  
**System:** AAROGYA DRISHTI Community Healthcare Platform  
**Target Environment:** Alluri Sitharama Raju (ASR) District, Andhra Pradesh (ITDA Paderu)  
**Base API URL:** `/api/v1`

---

## 1. Authentication & Session Gateway

| Frontend Component & Route | UI Action / Trigger | Backend Module | Endpoint | Method | Request DTO | Response DTO | Auth & Scoping Rules | Offline Behavior |
|---|---|---|---|---|---|---|---|---|
| `PortalLoginPage.tsx` (`/login`) | User selects persona (e.g. Lakshmi Devi, ASHA) and clicks "Authenticate & Launch Portal" | `AuthModule` (`AuthController`) | `/api/v1/auth/login` | `POST` | `LoginDto` (`username`, `password`, `requestedRole`) | `AuthTokenDto` (`accessToken`, `expiresAt`, `user: UserProfileDto`) | Public endpoint; Rate-limited to 5 attempts/min; protective lockout | Online only (Cached session token preserved in localStorage) |
| `DashboardHeader.tsx` (Logout button) | User clicks "Log Out" | `AuthModule` (`AuthController`) | `/api/v1/auth/logout` | `POST` | Empty / Bearer Token | `ApiResponse<{ loggedOut: true }>` | `JwtAuthGuard` | Clear client session; queue revoke event if offline |
| `DashboardHeader.tsx` (Profile load) | Portal mount / reload | `AuthModule` (`AuthController`) | `/api/v1/auth/me` | `GET` | Header: `Authorization: Bearer <token>` | `UserProfileDto` (`id`, `name`, `nameTe`, `role`, `facility`, `assignedVillages`) | `JwtAuthGuard` | Return cached profile from localStorage |

---

## 2. Frontline Health Worker Workflows

| Frontend Component & Route | UI Action / Trigger | Backend Module | Endpoint | Method | Request DTO | Response DTO | Auth & Scoping Rules | Offline Behavior |
|---|---|---|---|---|---|---|---|---|
| `HealthWorkerDashboard.tsx` (`/health-worker`) | Page mount / habitations summary load | `HealthWorkerModule` | `/api/v1/health-worker/dashboard` | `GET` | None | `HwDashboardSummaryDto` (`weeklyScreenings`, `assignedHabitations`, `stats`) | `RolesGuard('HEALTH_WORKER')`, `FacilityScopeGuard` | Read cached summary; update locally from IndexedDB drafts |
| `PatientDirectoryPage.tsx` (`/health-worker/patients`) | Search villagers, filter by habitation/status | `PatientsModule` | `/api/v1/patients` | `GET` | Query: `?village=Kothapalli&status=SUSPICIOUS&search=Kondala` | `PaginatedResult<PatientListItemDto>` | `RolesGuard('HEALTH_WORKER', 'DOCTOR', 'ADMIN')`, `VillageScopeGuard` | Fallback to IndexedDB local directory if offline |
| `PatientRegistrationPage.tsx` (`/health-worker/register`) | Input first name & habitation for duplicate check | `PatientsModule` | `/api/v1/patients/duplicate-check` | `POST` | `DuplicateCheckDto` (`firstName`, `village`, `age`, `gender`) | `DuplicateMatchResultDto` (`hasPotentialDuplicate`, `matchedPatients[]`) | `RolesGuard('HEALTH_WORKER')` | Local fuzzy match against IndexedDB `aarogya_drafts` if offline |
| `PatientRegistrationPage.tsx` (`/health-worker/register`) | Submit registration form | `PatientsModule` | `/api/v1/patients` | `POST` | `RegisterPatientDto` (`firstName`, `lastName`, `firstNameTe`, `age`, `gender`, `mandal`, `village`, `contactPhone`, `hasSmartphone`) | `PatientCreatedDto` (`patientId`, `cardReferenceToken`, `status`, `createdAt`) | `RolesGuard('HEALTH_WORKER')`, `VillageScopeGuard` | **Full Offline Support:** Saved to `aarogya_drafts` and queued in `sync_queue` with idempotency UUID |
| `ScreeningIntakePage.tsx` (`/health-worker/screening/new`) | Submit bilingual consent modal | `ConsentModule` | `/api/v1/consents` | `POST` | `CreateConsentDto` (`patientId`, `consentType`, `language`, `isVerbalConfirmed`, `witnessName`, `purposes[]`) | `ConsentRecordDto` (`consentId`, `status: ACTIVE`, `timestamp`) | `RolesGuard('HEALTH_WORKER')` | **Full Offline Support:** Attached to screening draft in IndexedDB |
| `ScreeningIntakePage.tsx` (`/health-worker/screening/new`) | Submit exposure & symptoms form | `ScreeningModule` | `/api/v1/screenings` | `POST` | `CreateScreeningDto` (`patientId`, `exposureHistory`, `symptoms`, `workerNotes`, `consentId`) | `ScreeningCreatedDto` (`screeningId`, `patientId`, `status: DRAFT_SAVED`) | `RolesGuard('HEALTH_WORKER')`, Consent verification | **Full Offline Support:** Preserved in IndexedDB `aarogya_drafts` |
| `GuidedOralCameraPage.tsx` (`/health-worker/screening/camera`) | Capture 5 oral views & upload | `ImagesModule` | `/api/v1/screenings/:id/images/upload` | `POST` | Multipart/Form: `file: binary`, `viewKey: string`, `sharpnessScore: number` | `ImageUploadResponseDto` (`imageId`, `viewKey`, `qualityStatus`, `storageRef`) | `RolesGuard('HEALTH_WORKER')`, Valid Consent Gate | **Full Offline Support:** Saved as binary DataURL in IndexedDB; queued for batch upload |
| `GuidedOralCameraPage.tsx` (Quality Checker) | Live canvas quality evaluation | `ImageQualityModule` | `/api/v1/images/quality-check` | `POST` | Multipart/Form: `image: binary` | `ImageQualityResultDto` (`qualityStatus: ACCEPTABLE | RECAPTURE_REQUIRED`, `blurScore`, `lightingScore`) | `RolesGuard('HEALTH_WORKER')` | Client-side Canvas fallback when offline; verified by backend upon sync |
| `ReferralTrackingPage.tsx` (`/health-worker/referrals`) | View outbound community referrals | `ReferralsModule` | `/api/v1/referrals/my-outbound` | `GET` | Query: `?status=ALL` | `ReferralListItemDto[]` | `RolesGuard('HEALTH_WORKER')`, `VillageScopeGuard` | Cached in IndexedDB |
| `FollowUpQueuePage.tsx` (`/health-worker/follow-ups`) | View due recalls & log visits | `FollowUpModule` | `/api/v1/follow-ups` | `GET` / `PATCH` | `UpdateFollowUpDto` (`followUpId`, `status`, `notes`) | `FollowUpRecordDto` | `RolesGuard('HEALTH_WORKER')`, `VillageScopeGuard` | Queued in `sync_queue` if offline |
| `OfflineSyncHubPage.tsx` (`/health-worker/sync`) | Click "Flush All Records" | `OfflineSyncModule` | `/api/v1/sync/batch` | `POST` | `BatchSyncSubmissionDto` (`submissionId`, `idempotencyKey`, `items[]`) | `BatchSyncResultDto` (`syncedCount`, `failedCount`, `serverAcknowledgements[]`, `conflicts[]`) | `RolesGuard('HEALTH_WORKER')`, `JwtAuthGuard` | Performs actual batch synchronization with server |

---

## 3. Medical Officer & Clinical Review Workflows

| Frontend Component & Route | UI Action / Trigger | Backend Module | Endpoint | Method | Request DTO | Response DTO | Auth & Scoping Rules | Offline Behavior |
|---|---|---|---|---|---|---|---|---|
| `DoctorDashboard.tsx` (`/doctor`) | Page mount / triage count load | `DoctorReviewModule` | `/api/v1/doctor/dashboard` | `GET` | None | `DoctorDashboardStatsDto` (`newCasesCount`, `underReviewCount`, `referralsDue`) | `RolesGuard('DOCTOR', 'SPECIALIST')`, `FacilityScopeGuard` | Cached read-only |
| `DoctorCasesPage.tsx` (`/doctor/cases`) | Filter case queue by priority / status | `DoctorReviewModule` | `/api/v1/doctor/cases` | `GET` | Query: `?priority=HIGH_PRIORITY&status=NEW` | `DoctorCaseSummaryDto[]` | `RolesGuard('DOCTOR', 'SPECIALIST')`, `FacilityScopeGuard` | Cached read-only |
| `DoctorCaseDetailPage.tsx` (`/doctor/cases/:id`) | Open case details & multi-view images | `DoctorReviewModule` | `/api/v1/doctor/cases/:screeningId` | `GET` | Path param: `screeningId` | `DoctorCaseDetailDto` (Full clinical intake, image presigned URLs, non-clinical AI panel) | `RolesGuard('DOCTOR', 'SPECIALIST')`, `FacilityScopeGuard` | Requires presigned image URLs (Online preferred) |
| `DoctorCaseDetailPage.tsx` (AI Panel) | Trigger non-clinical AI inspection demo | `AiResearchModule` | `/api/v1/ai/inspect-demonstration` | `POST` | `TriggerAiDemoDto` (`screeningId`, `imageId`) | `AiDemonstrationResponseDto` (`researchLabel`, `score: null`, `warning`, `modelVersion`) | `RolesGuard('DOCTOR', 'HEALTH_WORKER')`, Strictly non-clinical | Mock fallback if AI service unavailable (HTTP 503) |
| `DoctorCaseDetailPage.tsx` (Assessment Form) | Doctor inputs independent observations & signs | `DoctorReviewModule` | `/api/v1/clinical-reviews` | `POST` | `SubmitClinicalReviewDto` (`screeningId`, `observations`, `cardinalSigns[]`, `category`, `decision`, `doctorRegNo`) | `ClinicalReviewRecordDto` (`reviewId`, `signedAt`, `doctorName`) | `RolesGuard('DOCTOR')`, Mandatory Clinician Signature | Must be online to sign official medical observation |
| `DoctorCaseDetailPage.tsx` (Referral Button) | Dispatch specialist referral to hospital | `ReferralsModule` | `/api/v1/referrals` | `POST` | `CreateReferralDto` (`screeningId`, `patientId`, `targetFacility`, `specialty`, `priority`, `clinicalRationale`) | `ReferralCreatedDto` (`referralId: REF-YYYY-XXXX`, `status: SENT`) | `RolesGuard('DOCTOR')`, Requires valid signed ClinicalReview | Requires live network connectivity |
| `DoctorTelemedicinePage.tsx` (`/doctor/telemedicine`) | Join encrypted teleconsultation session | `TelemedicineModule` | `/api/v1/telemedicine/session/:id` | `GET` / `POST` | `JoinSessionDto` (`role`, `participantId`) | `TelemedSessionTokenDto` (`webrtcToken`, `roomName`, `isEncrypted: true`) | `RolesGuard('DOCTOR', 'SPECIALIST')`, Verified Patient Care Relationship | Live network required |

---

## 4. Hospital, Diagnostics & Patient Navigation Workflows

| Frontend Component & Route | UI Action / Trigger | Backend Module | Endpoint | Method | Request DTO | Response DTO | Auth & Scoping Rules | Offline Behavior |
|---|---|---|---|---|---|---|---|---|
| `HospitalDashboard.tsx` (`/hospital`) | Page mount / referral stats | `HospitalModule` | `/api/v1/hospital/dashboard` | `GET` | None | `HospitalDashboardDto` (`inboundCount`, `todayAppointments`, `pendingBiopsies`) | `RolesGuard('HOSPITAL_STAFF')`, `FacilityScopeGuard` | Cached read-only |
| `InboundReferralsPage.tsx` (`/hospital/referrals`) | Accept referral & allocate specialist | `ReferralsModule` | `/api/v1/hospital/referrals/:id/accept` | `PATCH` | `AcceptReferralDto` (`assignedSpecialistId`, `priority`, `notes`) | `ReferralUpdatedDto` (`status: ACCEPTED`) | `RolesGuard('HOSPITAL_STAFF')`, Facility matches target facility | Requires live network |
| `SpecialistAppointmentsPage.tsx` (`/hospital/appointments`) | Schedule / reschedule specialist OPD visit | `AppointmentsModule` | `/api/v1/appointments` | `POST` / `PATCH` | `ScheduleAppointmentDto` (`referralId`, `date`, `timeSlot`, `clinicRoom`, `specialistId`) | `AppointmentDto` (`appointmentId: APT-YYYY-XXXX`, `status: CONFIRMED`) | `RolesGuard('HOSPITAL_STAFF')`, Indian Standard Time (IST) aware | Requires live network |
| `BiopsyTrackerPage.tsx` (`/hospital/investigations`) | Update 5-stage biopsy pipeline | `InvestigationsModule` | `/api/v1/investigations/:id/status` | `PATCH` | `UpdateInvestigationStatusDto` (`status`, `pathologistName`, `reportSummary`, `histologyFindings`) | `InvestigationDto` (`status`, `updatedAt`) | `RolesGuard('HOSPITAL_STAFF', 'SPECIALIST')`, Biopsy report upload | Requires live network |
| `PatientNavigationPage.tsx` (`/hospital/navigation`) | Log tribal navigation touchpoint (Ashram lodging, transit) | `HospitalModule` | `/api/v1/hospital/navigation-logs` | `POST` | `CreateNavigationLogDto` (`patientId`, `pillar: TRANSIT | LODGING | INTERPRETER | COUNSELING`, `notes`) | `NavigationLogDto` (`id`, `loggedAt`) | `RolesGuard('HOSPITAL_STAFF')` | Can be queued offline if desk connectivity drops |

---

## 5. District Administration & Health Governance Workflows

| Frontend Component & Route | UI Action / Trigger | Backend Module | Endpoint | Method | Request DTO | Response DTO | Auth & Scoping Rules | Offline Behavior |
|---|---|---|---|---|---|---|---|---|
| `AdminDashboard.tsx` (`/admin`) | District overview metrics | `AdministrationModule` | `/api/v1/admin/overview` | `GET` | Query: `?district=Alluri+Sitharama+Raju` | `DistrictOverviewDto` (`totalScreened`, `saturationPct`, `suspiciousRate`, `activeStaff`) | `RolesGuard('ADMIN')`, District-level scoping | Online preferred |
| `CoverageMapPage.tsx` (`/admin/map`) | Mandal / habitation screening coverage map | `AdministrationModule` | `/api/v1/admin/coverage-map` | `GET` | Query: `?mandal=G.+Madugula` | `MandalCoverageDto[]` (Aggregated statistics only; **Zero individual PHI**) | `RolesGuard('ADMIN')`, Privacy filter enforced | Online preferred |
| `ProgrammeAnalyticsPage.tsx` (`/admin/reports`) | Epidemiological charts (gutkha, reverse smoking trends) | `ReportsModule` | `/api/v1/admin/analytics/habits` | `GET` | Query: `?dateRange=6M` | `HabitAnalyticsDto` (`monthlyScreenings[]`, `habitPrevalence`) | `RolesGuard('ADMIN')`, Aggregate data only | Online preferred |
| `ProgrammeAnalyticsPage.tsx` (Export CSV) | Export de-identified research dataset | `ReportsModule` | `/api/v1/admin/reports/export-csv` | `GET` | Query: `?format=csv` | CSV Stream (`text/csv` with de-identified aggregate columns) | `RolesGuard('ADMIN')`, Audit event recorded | Online preferred |
| `SystemHealthPage.tsx` (`/admin/system`) | Sub-centre sync telemetry & edge pings | `AdministrationModule` | `/api/v1/admin/system-health` | `GET` | None | `SystemHealthTelemetryDto` (`gatewayStatus`, `subCentreSyncs[]`, `activeQueues`) | `RolesGuard('ADMIN')` | Online preferred |
| `StaffManagementPage.tsx` (`/admin/users`) | Activate/deactivate health workers, allocate villages | `UsersModule` | `/api/v1/users` | `GET` / `PATCH` | `UpdateUserAssignmentDto` (`userId`, `status`, `assignedVillages[]`) | `UserAccountDto` | `RolesGuard('ADMIN')`, Privileged action logged | Online preferred |

---

## 6. Patient Access & Physical Health Card Workflows

| Frontend Component & Route | UI Action / Trigger | Backend Module | Endpoint | Method | Request DTO | Response DTO | Auth & Scoping Rules | Offline Behavior |
|---|---|---|---|---|---|---|---|---|
| `HealthCardPreviewPage.tsx` (`/patient/card-preview`) | Load card data for printing | `PatientCardsModule` | `/api/v1/patients/:id/card` | `GET` | Path param: `patientId` | `HealthCardDto` (`cardSerial`, `patientId`, `name`, `nameTe`, `habitation`, `qrReferenceToken`) | `RolesGuard('PATIENT', 'HEALTH_WORKER', 'DOCTOR')` | Cached in IndexedDB for immediate offline printing |
| `HealthCardPreviewPage.tsx` (Re-issue card) | Re-issue lost card with new serial | `PatientCardsModule` | `/api/v1/cards/:cardId/replace` | `POST` | `ReplaceCardDto` (`reason: LOST | DAMAGED`, `issuerName`) | `HealthCardDto` (New serial generated; old serial marked `REPLACED`) | `RolesGuard('HEALTH_WORKER', 'ADMIN')` | Queued in `sync_queue` if offline |
| `CaregiverAccessPage.tsx` (`/patient/caregiver`) | Add / revoke authorized family caregiver | `CaregiversModule` | `/api/v1/patients/:id/caregivers` | `POST` / `PATCH` | `AuthorizeCaregiverDto` (`fullName`, `relationship`, `phone`, `canViewRecords`) | `CaregiverRecordDto` (`status: ACTIVE | REVOKED`) | `RolesGuard('PATIENT', 'HEALTH_WORKER')`, Documented consent | Queued in `sync_queue` if offline |
| `CareJourneyTimelinePage.tsx` (`/patient/journey`) | View longitudinal continuum of care | `PatientModule` | `/api/v1/patients/:id/journey` | `GET` | Path param: `patientId` | `CareJourneyTimelineDto` (Doorstep screening -> MO review -> Specialist OPD -> Biopsy) | Authorized staff or authenticated caregiver | Cached in IndexedDB |
