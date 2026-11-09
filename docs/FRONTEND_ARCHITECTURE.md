# AAROGYA DRISHTI — Frontend Architecture Specification
**Document Version:** 1.0.0 (Phase 0 Architecture)  
**System:** AAROGYA DRISHTI Community Healthcare Platform  
**Target Environment:** Mobile-First Responsive Web (Budget Android Chrome + Modern Desktop)

---

## 1. Architectural Principles

1. **Modular Feature-Sliced Organization:**
   Source code is partitioned by domain feature rather than by arbitrary file types. Each feature encapsulates its components, hooks, services, and types.

2. **Clean Separation of Concerns:**
   - **Presentation Layer:** Pure React components styled via TailwindCSS using the official Nature Theme tokens.
   - **Application State & Context:** Lightweight React Contexts for Authentication/Session, Language/i18n, and Offline Sync State.
   - **Service & Data Access Layer:** Clear TypeScript service interfaces (`IPatientService`, `IScreeningService`, `IAIService`, `ISyncService`) backed currently by structured mock implementations with synthetic data, ready for seamless switchover to FastAPI REST endpoints later.
   - **Persistence Layer:** Client-side local storage using `idb` (IndexedDB wrapper) for draft screenings and sync queue.

3. **Strict Non-Clinical AI Boundary:**
   The AI service adapter is isolated in `src/services/ai/`. It enforces mock/research contracts that explicitly reject medical diagnosis or confidence scoring, requiring human clinician sign-off at all times.

---

## 2. Layered Architecture Diagram

```
+------------------------------------------------------------------------+
|                     PRESENTATION / UI LAYER                            |
|  +--------------------+  +--------------------+  +------------------+  |
|  |   Public Website   |  | Frontline Portals  |  | Clinical Portals |  |
|  | (Landing, Edu, FAQ)|  | (HW, Patient, Card)|  | (MO, Hosp, Admin)|  |
|  +--------------------+  +--------------------+  +------------------+  |
|  +------------------------------------------------------------------+  |
|  |                 Shared Design System Primitives                  |  |
|  |     (Buttons, Cards, Badges, Modals, Tables, Forms, Layouts)     |  |
|  +------------------------------------------------------------------+  |
+------------------------------------------------------------------------+
                                    |
+------------------------------------------------------------------------+
|                 APPLICATION & STATE MANAGEMENT LAYER                   |
|  +-------------------+  +-------------------+  +--------------------+  |
|  |   Auth / Session  |  |   i18n (EN / TE)  |  | Offline Sync Queue |  |
|  |      Context      |  |      Context      |  |      Context       |  |
|  +-------------------+  +-------------------+  +--------------------+  |
+------------------------------------------------------------------------+
                                    |
+------------------------------------------------------------------------+
|                      SERVICE ABSTRACTION LAYER                         |
|  +-----------------+ +-----------------+ +--------------------------+  |
|  | Patient Service | |Screening Service| | Image Quality Checker    |  |
|  +-----------------+ +-----------------+ +--------------------------+  |
|  +-----------------+ +-----------------+ +--------------------------+  |
|  | AI Mock Adapter | | Referral Service| | Appointments & Biopsy    |  |
|  +-----------------+ +-----------------+ +--------------------------+  |
+------------------------------------------------------------------------+
                  |                                     |
+----------------------------------+   +---------------------------------+
|       LOCAL PERSISTENCE          |   |     FUTURE BACKEND ADAPTER      |
|  +-----------------------------+ |   |  +----------------------------+ |
|  | IndexedDB (Drafts & Queue)  | |   |  | FastAPI REST Client        | |
|  +-----------------------------+ |   |  | (Endpoints & JWT Auth)     | |
|  | localStorage (Prefs & Lang) | |   |  +----------------------------+ |
+----------------------------------+   +---------------------------------+
```

---

## 3. Directory Layout Specification

```
aarogya-drishti/
├── docs/                                 # Architectural specifications & guides
│   ├── reference/                        # Hackathon problem statement & developer handbook
│   ├── FRONTEND_IMPLEMENTATION_PLAN.md
│   ├── FRONTEND_ARCHITECTURE.md
│   ├── ROUTE_MAP.md
│   ├── DESIGN_SYSTEM.md
│   ├── FRONTEND_TASK_TRACKER.md
│   ├── MOCK_DATA_GUIDE.md
│   └── KNOWN_LIMITATIONS.md
│
├── public/                               # Static assets and PWA artifacts
│   ├── favicon.svg
│   ├── manifest.json                     # PWA configuration
│   ├── icons/                            # App icons (192x192, 512x512)
│   └── images/                           # Curated community healthcare visual assets
│
├── src/
│   ├── app/                              # Core application bootstrap
│   │   ├── App.tsx                       # Root provider composition
│   │   ├── router.tsx                    # React Router 6 route declarations
│   │   └── providers/                    # Combined contextual providers
│   │
│   ├── components/                       # Shared UI Primitives
│   │   ├── common/                       # Buttons, Badges, Typography, Spinners
│   │   ├── layout/                       # Headers, Sidebars, MobileDrawers, Footers
│   │   ├── feedback/                     # Alerts, Modals, EmptyStates, ErrorStates
│   │   ├── forms/                        # Inputs, Selects, Checkboxes, FileUploads
│   │   └── tables/                       # Responsive data tables with pagination
│   │
│   ├── context/                          # Global state stores
│   │   ├── AuthContext.tsx               # Demo accounts & session management
│   │   ├── LanguageContext.tsx           # Bilingual English/Telugu state
│   │   └── SyncContext.tsx               # IndexedDB offline draft & sync tracking
│   │
│   ├── features/                         # Business capability slices
│   │   ├── public/                       # Landing, Awareness, Anatomy, HowItWorks, FAQ
│   │   ├── auth/                         # Role selection & demo login portal
│   │   ├── patient/                      # Assisted access info, Health Card, Patient Portal
│   │   ├── health-worker/                # HW Dashboard, Village map, Registration, Triage
│   │   ├── screening/                    # Guided intake, consent gate, symptom capture
│   │   ├── camera/                       # Oral camera viewfinder, framing guide, views
│   │   ├── image-quality/                # OpenCV mock validator (blur, light, glare)
│   │   ├── ai-research/                  # Isolated non-clinical AI demonstration UI
│   │   ├── doctor/                       # MO Case Review, diagnosis form, referral creation
│   │   ├── hospital/                     # Referral management, appointments, biopsy tracker
│   │   ├── navigation/                   # Patient navigator overdue tracking & contact log
│   │   └── admin/                        # Aggregate district dashboard & PHC monitoring
│   │
│   ├── i18n/                             # Localization system
│   │   ├── translations.ts               # Core Telugu and English dictionaries
│   │   └── useTranslation.ts             # Custom hook for localized strings
│   │
│   ├── services/                         # Business logic & mock data stores
│   │   ├── api/                          # Interface definitions (API contracts)
│   │   ├── mock/                         # Synthetic seed data & mock implementations
│   │   ├── storage/                      # IndexedDB abstraction layer (`idb`)
│   │   └── ai/                           # Isolated AI research mock adapter
│   │
│   ├── types/                            # Global TypeScript contracts
│   │   ├── index.ts                      # Common types, roles, statuses
│   │   ├── patient.ts                    # Patient, Card, Caregiver types
│   │   ├── screening.ts                  # Screening, Image, Quality, AI types
│   │   └── clinical.ts                   # Review, Referral, Appointment, Biopsy types
│   │
│   ├── styles/                           # Global styles & Tailwind configuration
│   │   └── index.css                     # Custom utility classes & font imports
│   │
│   └── main.tsx                          # Application entry point
│
├── index.html                            # HTML5 root with Telugu web fonts
├── package.json                          # Pinned dependencies
├── tailwind.config.js                    # Official Nature Theme color configuration
├── tsconfig.json                         # Strict TypeScript configuration
└── vite.config.ts                        # Vite bundler configuration
```

---

## 4. State Machine & Case Lifecycle

The platform models the longitudinal patient journey through an explicit status progression:

```
[DRAFT] (Saved on local device)
   │
   ▼ (Consent captured & signed)
[CONSENTED]
   │
   ▼ (Screening checklist & guided oral photos completed)
[SCREENED]
   │
   ▼ (Synchronized / Uploaded to queue)
[AWAITING_CLINICIAN]
   │
   ├─► (Clinician evaluates case; agrees/disagrees with research AI)
   ▼
[REVIEWED]
   │
   ├─► [NO_FURTHER_ACTION] (Routine community follow-up in 6 months)
   │
   └─► [REFERRAL_PLANNED]
          │
          ▼
       [APPOINTED] (Physical hospital or Telemedicine slot confirmed)
          │
          ▼
       [ASSESSED_AT_FACILITY]
          │
          ├─► [DIAGNOSTICS_PENDING] (Biopsy / Histopathology sample taken)
          │      │
          │      ▼
          │   [RESULT_REVIEWED] (Clinician documents verified biopsy report)
          │      │
          │      ▼
          └─► [CARE_LINKED] (Treatment plan initiated at District/Tertiary Centre)
```

**Exception states supported:** `RESCHEDULED`, `MISSED`, `DECLINED`, `LOST_CONTACT`.

---

## 5. Offline-First & Synchronization Architecture

Frontline workers in tribal habitations of Alluri Sitharama Raju district regularly experience complete cellular connectivity blackout.

1. **Client Storage:**
   - Offline screenings are saved in an IndexedDB object store (`aarogya_drafts`) using UUID client keys.
   - Images are stored locally as compressed Blobs / Data URLs during offline capture.
2. **Sync Queue:**
   - Every offline record receives an `Idempotency-Key` and sync status:
     - `SAVED_LOCAL`: Record stored on device, waiting for network.
     - `SYNCING`: Transmission in progress.
     - `SYNCED`: Acknowledged by service with timestamp.
     - `NEEDS_ATTENTION`: Validation error or conflict requiring human review.
     - `FAILED`: Network failed during transit; retryable without data loss.
3. **Resilience:**
   - Network failure never deletes unsynced forms.
   - Screenings survive browser refresh or app restart.
   - Manual "Sync Now" button allows immediate force-retry when connectivity is restored.

---

## 6. Security, Privacy & Compliance Guidelines

- **No Public PHI:** No patient names, phone numbers, or clinical photographs are accessible without authenticated role context.
- **Physical Health Card QR Security:** The QR code printed on the patient card contains **only** an opaque reference token (e.g., `urn:aarogya:ref:ASR-2026-9042`). Scanning it with a standard smartphone camera reveals no medical records. Only authorized staff logged into AAROGYA DRISHTI can retrieve the associated record.
- **Role Scoping:**
  - Health Workers can only access screenings within their assigned villages.
  - Doctors review cases assigned to their PHC queue.
  - Specialists see only explicitly referred patients.
  - District Administrators see only aggregated, anonymized metrics.
