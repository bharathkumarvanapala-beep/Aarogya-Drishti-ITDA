# AAROGYA DRISHTI — Frontend Engineering Handover Document
**Project Title:** AAROGYA DRISHTI (ఆరోగ్య దృష్టి) — *Every Smile Deserves Care* | ప్రతి చిరునవ్వుకు ఆరోగ్య సంరక్షణ అవసరం  
**Target Environment:** Alluri Sitharama Raju (ASR) District, Andhra Pradesh (ITDA Paderu)  
**Document Version:** 1.0.0 (Final Delivery Handover)  
**Authors / Maintainers:** Frontend Engineering & Health Systems Architecture Team  
**Hackathon:** AAROHAN Hackathon 2026 Problem Statement Implementation  

---

## 1. Executive Summary & Purpose

**AAROGYA DRISHTI** is a community-first, offline-ready oral healthcare, early cancer detection, telemedicine, and referral coordination Progressive Web Application (PWA). It is purpose-built for tribal and rural communities in the Eastern Ghats of Andhra Pradesh, specifically targeting the 11 mandals administered by the Integrated Tribal Development Agency (ITDA) Paderu in Alluri Sitharama Raju (ASR) District.

The application serves five primary stakeholders through role-tailored workflows:
1. **Rural & Tribal Citizens / Caregivers** — Physical health cards, assisted access without smartphone dependency, longitudinal care journey tracking.
2. **Frontline Health Workers (ASHAs / ANMs / CHOs)** — Offline-capable patient registration, habit questionnaires, guided 5-view oral camera with real-time blur/lighting QA, and sync queue.
3. **Medical Officers (PHCs / CHCs)** — High-resolution clinical triage, isolated AI research demonstration panel, independent clinical diagnosis form, teleconsultation suite, and specialist referral dispatch.
4. **District Hospital & Cancer Centres** — Inbound referral triage, OPD appointments, biopsy tracking pipeline, and tribal patient navigation (language interpreters, transit vans, Ashram lodging).
5. **District Health Administration (ITDA Paderu)** — Habitation coverage map, habit epidemiology analytics (reverse chutta smoking, gutkha chewing), and edge sync telemetry.

---

## 2. Repository Directory Structure

```text
c:\Users\poitd\OneDrive\Desktop\Aarogya Drishti\
├── docs/                                  # Architectural & engineering specifications
│   ├── COMPONENT_GUIDE.md                # Reusable UI component inventory
│   ├── DESIGN_SYSTEM.md                  # Color tokens, typography, glassmorphism rules
│   ├── FRONTEND_API_CONTRACT.md          # REST API specs for backend migration
│   ├── FRONTEND_ARCHITECTURE.md          # Module relationships & data flow
│   ├── FRONTEND_HANDOVER.md              # THIS HANDOVER DOCUMENT
│   ├── FRONTEND_IMPLEMENTATION_PLAN.md   # Phased delivery roadmap (Phases 0-12)
│   ├── FRONTEND_TASK_TRACKER.md          # Exhaustive task checklist
│   ├── FRONTEND_TEST_REPORT.md           # 39-route test matrix & audit outcomes
│   ├── KNOWN_LIMITATIONS.md              # Mock boundaries & non-clinical guidelines
│   ├── MOCK_DATA_GUIDE.md                # Synthetic schemas & demo scenarios
│   └── ROUTE_MAP.md                      # Comprehensive 39-route sitemap
├── public/                                # Static assets & PWA files
│   ├── images/                           # High-resolution clinical & educational visuals
│   ├── favicon.svg                       # Emerald dental tooth logo
│   ├── icon-192.png                      # PWA Home screen icon (192x192)
│   ├── icon-512.png                      # PWA Splash icon (512x512)
│   ├── manifest.json                     # PWA Web App Manifest
│   └── sw.js                             # Service Worker (Cache-First App Shell)
├── src/
│   ├── components/
│   │   ├── common/                       # Design system primitives (Alert, Badge, Button,
│   │   │                                 # Card, Input, Modal, StatCard, Table, Tabs)
│   │   └── layout/                       # Layout chrome (PortalLayout, SidebarNavigation,
│   │                                     # DashboardHeader, DemoControlBar, NotificationPanel)
│   ├── context/                          # Decoupled React state providers
│   │   ├── AuthContext.ts                # Auth context definition & role interfaces
│   │   ├── AuthProvider.tsx              # Auth state provider & mock switcher
│   │   ├── useAuth.ts                    # useAuth hook
│   │   ├── demoUsers.ts                  # Synthetic user profiles for 5 roles
│   │   ├── SyncContext.ts                # Offline sync state definition
│   │   ├── SyncProvider.tsx              # IndexedDB sync engine provider
│   │   ├── useSync.ts                    # useSync hook
│   │   └── index.ts                      # Context exports
│   ├── features/
│   │   ├── admin/                        # District Administration Portal pages & data
│   │   ├── doctor/                       # Clinical Workstation, Triage & Telemedicine
│   │   ├── healthWorker/                 # Frontline Intake, Camera & Sync Hub
│   │   ├── hospital/                     # Hospital Referral, Biopsy & Patient Navigation
│   │   ├── patient/                      # Health Card, Assisted Care & Screening History
│   │   └── public/                       # Public Website (9 educational pages)
│   ├── i18n/                             # Bilingual translation dictionary
│   │   ├── LanguageContext.ts            # Language context definition
│   │   ├── LanguageProvider.tsx          # Language state provider
│   │   ├── useLanguage.ts                # useLanguage hook
│   │   ├── translations.ts               # Complete English & Telugu strings
│   │   └── index.ts                      # i18n exports
│   ├── services/
│   │   ├── api.ts                        # Typed API mock service
│   │   └── db.ts                         # IndexedDB storage adapter (via idb)
│   ├── styles/                           # Custom CSS animations & typography
│   ├── App.tsx                           # Master Router (39 routes) & Provider root
│   ├── index.css                         # Tailwind directives & Nature theme tokens
│   └── main.tsx                          # Application bootstrap & SW registration
├── index.html                            # Semantic HTML5 template with Telugu fonts
├── package.json                          # Vite, React 19, TypeScript, Lucide, Recharts
├── tsconfig.json                         # Strict TypeScript configuration
└── vite.config.ts                        # Vite configuration
```

---

## 3. Quick Start & Development Commands

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Essential Commands (Windows PowerShell Compatible)
```powershell
# 1. Install dependencies
npm.cmd install

# 2. Start local Vite development server (Port 5173)
npm.cmd run dev

# 3. Execute full TypeScript type-check and production build
npm.cmd run build

# 4. Run Oxlint code analysis across all files
npm.cmd run lint

# 5. Preview production build locally
npm.cmd run preview
```

> [!NOTE]
> On Windows PowerShell, execute commands using `npm.cmd` and `npx.cmd`. If chaining commands, use `;` instead of POSIX `&&`.

---

## 4. Design System & Nature Theme Palette

The platform implements the official **Aarogya Nature Theme** representing the lush hills of the Eastern Ghats and sterile healthcare cleanliness.

| Token Name | Hex Code | Tailwind / CSS Variable | Primary Application |
|---|---|---|---|
| **Forest Green (Deep)** | `#075B4D` | `--color-forest` | Primary brand headers, sidebars, active items |
| **Emerald (Vibrant)** | `#087653` | `--color-emerald` | Primary buttons, active tabs, success indicators |
| **Mint / Sage Light** | `#398F72` | `--color-mint` | Secondary actions, badges, card borders |
| **Light Sage Tint** | `#E8F5EF` | `--color-sage` | Container backgrounds, table header fills |
| **Soft Jade** | `#DCEFEA` | `--color-soft-jade` | Hover highlights, subtle card accents |
| **Deep Pine** | `#173B36` | `--color-deep-pine` | High-contrast text, dark modal headers |

### Typography Stack
- **Headings & Display:** `Outfit`, sans-serif
- **Body & Data:** `Inter`, -apple-system, sans-serif
- **Telugu Script:** `Noto Sans Telugu`, sans-serif

---

## 5. Offline Persistence & Service Worker Architecture

### IndexedDB Storage (`src/services/db.ts`)
The application uses modern IndexedDB via the lightweight `idb` library with two dedicated object stores:
1. `aarogya_drafts` (Key: `id`) — Holds incomplete screening drafts, captured high-res image data URLs, and habit responses created while offline in remote habitations.
2. `sync_queue` (Key: `id`) — Holds completed screening submissions queued for server sync once 4G/Wi-Fi connectivity is restored at the PHC or Mandal headquarters.

### Global Sync State Machine (`src/context/SyncContext.ts`)
- `synced`: All local screenings have been uploaded to the central repository.
- `syncing`: Active batch transfer in progress.
- `saved_locally`: Unsynced drafts or queued records present in IndexedDB.
- `offline_mode`: Network unavailable; intake and camera capture persist locally.

### Service Worker (`public/sw.js`)
- Caches the App Shell (`/`, `/index.html`, `/manifest.json`, CSS/JS bundles, Lucide icons, fonts).
- Implements **Cache-First** strategy for static assets and **Network-First with Cache Fallback** for navigation requests.

---

## 6. Bilingual Internationalization (i18n)

The application provides seamless English and Telugu (తెలుగు) localization:
- Context is managed via `src/i18n/LanguageProvider.tsx`.
- Components consume translations via `const { language, setLanguage, t } = useLanguage();`.
- Keys are organized in `src/i18n/translations.ts`.
- The language toggle is permanently accessible on all public headers, portal headers, and the floating demo control bar.

### Adding New Translation Keys
1. Open `src/i18n/translations.ts`.
2. Add the key under the appropriate section in both the `en` and `te` dictionaries.
3. Access in components using `t('yourSection.yourKey')`.

---

## 7. Step-by-Step Backend Integration Roadmap

When connecting this frontend to a production FastAPI / Node.js backend:

### Step 1: Configure Environment Variables
Create `.env` in the root directory:
```env
VITE_API_BASE_URL=https://api.aarogyadrishti.in/api/v1
VITE_ENABLE_MOCK_FALLBACK=false
VITE_WEBRTC_SIGNALING_URL=wss://telemed.aarogyadrishti.in/ws
```

### Step 2: Swap `src/services/api.ts` with Axios Client
All service methods in `src/services/api.ts` have identical TypeScript interfaces to the REST specification in [`docs/FRONTEND_API_CONTRACT.md`](file:///c:/Users/poitd/OneDrive/Desktop/Aarogya%20Drishti/docs/FRONTEND_API_CONTRACT.md).
Replace mock return promises with HTTP calls:
```typescript
import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('aarogya_auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const api = {
  getDoctorCases: async () => (await client.get('/doctor/cases')).data,
  submitClinicalReview: async (id, review) => (await client.post(`/doctor/cases/${id}/review`, review)).data,
  // ... maps 1:1 to FRONTEND_API_CONTRACT.md
};
```

### Step 3: Connect Background Sync Engine
In `src/context/SyncProvider.tsx`, update `flushQueue()` to POST queued records from IndexedDB to `/api/v1/sync/batch`.

---

## 8. Clinical Safety Compliance Checklist

Future engineers must strictly uphold the following clinical safety constraints:
- [x] **Zero Fabricated Probabilities:** Never display percentage chances of malignancy (e.g. *"87% malignant"*).
- [x] **Permanent Disclaimer Banners:** Maintain the prominent bilingual banner *"NOT FOR CLINICAL USE — RESEARCH DEMONSTRATION ONLY"* on all AI screens.
- [x] **Clinician Autonomy:** Ensure AI output panels remain isolated and never auto-populate or overwrite the Medical Officer's independent clinical diagnostic fields.
- [x] **Mandatory Biopsy:** All suspected lesions must follow the histopathological referral pathway to District Hospital Paderu.

---

## 9. Sign-off & Verification Status

- **Build Status:** 🟢 `tsc -b && vite build` — 0 errors, production bundle compiled.
- **Linter Status:** 🟢 `oxlint` — 0 errors, 0 warnings across 93 files.
- **Route Status:** 🟢 40 of 40 routes verified with HTTP 200 OK.
- **Delivery Date:** 30 October 2026.

