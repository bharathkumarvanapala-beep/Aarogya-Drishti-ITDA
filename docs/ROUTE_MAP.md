# AAROGYA DRISHTI — Frontend Route Map
**Document Version:** 1.0.0 (Phase 0 Route Mapping)  
**Router:** React Router v6  
**Pattern:** Role-Guarded Nested Layouts & Shared Navigation Shells

---

## 1. Route Hierarchy Overview

```
/ (Root)
│
├── Public Routes (PublicLayout)
│   ├── /                                    # Landing Page (Hero, Education, CTAs, Network)
│   ├── /about                               # Mission, Vision & ITDA Paderu Context
│   ├── /oral-health                         # Oral Anatomy & Self-Checkup Guide
│   ├── /cancer-awareness                    # Warning Signs, High-Risk Symptoms & Clinical Disclaimers
│   ├── /healthy-habits                      # Tobacco & Gutkha Cessation Support
│   ├── /how-it-works                        # Step-by-Step Community-to-Hospital Workflow
│   ├── /facilities                          # Participating PHCs, CHCs & District Hospitals
│   ├── /faq                                 # Community & Health Worker FAQs
│   └── /contact                             # Helplines & Field Support Contacts
│
├── Portal Gateway & Authentication
│   └── /login                               # Role Selection Hub & Instant Demo Account Switcher
│
├── Health Worker Portal (HealthWorkerLayout)
│   ├── /health-worker                       # Frontline Dashboard (Villages, Metrics, Map)
│   ├── /health-worker/patients              # Village Patient Directory & Records
│   ├── /health-worker/register              # Register Patient (Duplicate Warning Workflow)
│   ├── /health-worker/screening/new         # Guided Clinical Intake & Informed Consent Gate
│   ├── /health-worker/screening/:id/camera  # 5-View Oral Camera & Image Quality Checker
│   ├── /health-worker/screening/:id/ai-demo # Non-Clinical AI Research Demonstration Interface
│   ├── /health-worker/referrals             # Tracked Referrals & Appointment Statuses
│   ├── /health-worker/follow-ups            # Community Follow-Up Tasks
│   └── /health-worker/sync                  # IndexedDB Offline Drafts & Synchronization Hub
│
├── Doctor / Medical Officer Portal (DoctorLayout)
│   ├── /doctor                              # Clinical Dashboard & Case Triage Queue
│   ├── /doctor/cases                        # Filterable Screening Cases Queue
│   ├── /doctor/cases/:id                    # Longitudinal Case Review & Independent Assessment
│   ├── /doctor/referrals                    # Specialist Referral Dispatch
│   └── /doctor/telemedicine                 # Teleconsultation Video Demo Hub
│
├── Hospital & Diagnostics Portal (HospitalLayout)
│   ├── /hospital                            # Facility Referral Intake Dashboard
│   ├── /hospital/referrals                  # Referral Queue & Acceptance
│   ├── /hospital/appointments               # Specialist Clinic Appointment Manager
│   ├── /hospital/investigations             # Biopsy / Histopathology / Imaging Tracker
│   └── /hospital/navigation                 # Patient Navigator Coordination Interface
│
├── District Administration Portal (AdminLayout)
│   ├── /admin                               # District Aggregate Dashboard (ASR District)
│   ├── /admin/map                           # Geographic Mandal/Village Screening Map
│   ├── /admin/reports                       # Programme Trends, Exportable Analytics
│   ├── /admin/system                        # Device Status, Sync Queue Health, Security Logs
│   └── /admin/users                         # Role Management & Personnel Directory
│
├── Patient Access & Health Card (PatientLayout)
│   ├── /patient/card-preview                # Professional Printable Physical Health Card
│   ├── /patient/assisted-guide              # Assisted Frontline Care Pathway Guide
│   ├── /patient/portal                      # Optional Patient Self-Service Dashboard
│   ├── /patient/screenings                  # My Screenings History
│   ├── /patient/journey                     # Longitudinal Care Journey Timeline
│   └── /patient/caregiver                   # Family Caregiver Access & Revocation UI
│
└── Living Design System
    └── /design-system                       # Interactive Component Gallery & Token Showcase
```

---

## 2. Route Access Control Matrix

| Route Group | Base URL | Primary Role | Secondary Roles | Offline Usable |
|---|---|---|---|---|
| **Public** | `/` | All visitors | Any | Yes (Cached shell) |
| **Auth Hub** | `/login` | All users | Any | Yes |
| **Health Worker** | `/health-worker/*` | `health_worker` | `admin` | **Yes (Full offline capability)** |
| **Doctor / MO** | `/doctor/*` | `doctor` | `specialist`, `admin` | Partial (Read cached) |
| **Hospital** | `/hospital/*` | `hospital_coordinator`| `specialist`, `admin` | Partial |
| **Administration** | `/admin/*` | `admin` | None | Online preferred |
| **Patient / Card** | `/patient/*` | `patient` | `health_worker`, `caregiver` | Yes |
| **Design System** | `/design-system` | Developer / Reviewer | Any | Yes |

---

## 3. Route Guard & Fallback Strategy

1. **Unauthenticated Redirect:** Users attempting to access secure subpaths without an active role are gracefully guided to `/login?redirect=...`.
2. **Demo Quick Switcher:** The development shell provides a persistent bottom-corner role switcher allowing evaluators to instantaneously switch perspectives (e.g. from Health Worker -> Medical Officer -> Hospital Coordinator -> Patient) without tedious re-authentication.
3. **404 Not Found Handling:** Unmatched paths display a bilingual, helpful community recovery page directing users back to the Public Home or their active portal.
