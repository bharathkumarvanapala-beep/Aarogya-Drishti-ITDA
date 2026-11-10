# Login integration delivery and verification

Status: implementation and preview verification in progress; production cutover and real email delivery remain pending. Do not interpret the preview as the updated live authentication service.

## Role and permission matrix

| Role | Dashboard | Record scope | Capabilities |
|---|---|---|---|
| ASHA / ANM / community health worker | /health-worker | Assigned facility and village, owned cases | Registration, consent, history, photographs, quality, submission, follow-up |
| Medical Officer | /doctor | Assigned source facility and village | Review, observations, referral, investigation and clinical decisions |
| Specialist | /specialist | Explicitly referred participant at referral facility | Referred cases, appointments, consultation, investigations and simulated reports |
| Navigator | /navigator | Explicit referral assignment and referral facility | Appointments, attendance/missed visits, follow-up; no images/history or clinical reports |
| District Admin | /admin | Aggregate care reporting; authorized staff administration | Mandal/worker/referral/appointment statistics and account assignments; no individual care-record access |

Existing patient/family routes remain, with explicit patient/caregiver relationships. Public worker requests remain pending until an administrator verifies and assigns them. The original signup screenshot therefore does not justify bypassing approval.

## Implemented corrections

See LOGIN_AUDIT.md for baseline evidence. Replaced public demo-password login and static MFA; removed placeholder password acceptance; introduced real TOTP with encrypted secrets and persistent replay checks; private hashed expiring reset tokens; single-use reset and refresh; session revocation; database-derived role/scope on every authenticated request; HttpOnly browser cookies; origin checks; persistent login throttling and lockout; restricted public registration; audited administrator assignments; server-enforced specialist/navigator restrictions; validated referral directory; distinct role destinations; centralized bilingual authentication/navigation; redesigned responsive portal. Raw authentication queries explicitly qualify the configured schema to avoid reused pool connection search paths.

The additive migration is backend/prisma/migrations/20261109_auth_hardening/migration.sql. It adds MFA replay/enrollment fields and an attempt counter table. The existing eight production accounts were preserved; no care records were deleted or reseeded. The authorized admin recovery email was updated with an audit entry.

## Executed checks

| Check | Observed result |
|---|---|
| Frontend regression | 17 files, 80 tests passed |
| Backend existing unit suite | 20 tests passed |
| Isolated real PostgreSQL auth, TOTP and care suites | 20 tests passed after the final schema-query adjustment |
| Real local HTTP session check | Six passed: token-free cookie response; profile; admin API denied to worker; foreign Origin denied; missing mutation header denied; logout revocation |
| Production frontend/backend build | Passed; frontend bundle-size warning remains |
| Desktop browser English/Telugu | Deployed preview loaded; language switch and translated form observed |
| Mobile/device | Responsive CSS exists; browser viewport override did not produce requested mobile dimensions; not verified on Android |
| Dependencies | Frontend audit clean; backend production audit zero high/critical, six moderate; development advisories remain |
| Email | Delivery mocked in automated tests; real Gmail delivery not yet verified |

Raw local reports: output/auth-test-results.json, output/backend-unit-results.json, output/http-session-results.json. Tests cover valid/invalid/unknown login, inactive/pending accounts, expiry, role routing, patient/facility isolation, recovery/reset/enrollment, logout, translation key parity, API failures, persistence, independent sessions, refresh replay and privileged MFA replay. Not all five role journeys have been exercised in the live browser.

## Known limitations and release gates

- SMTP_PASSWORD is absent in both the linked project's CLI list and its settings-page search despite the user's report that it was saved. The secret-entry form is open for the user. No recovery email has been sent.
- Production still runs the previous frontend/backend release. Do not cut over privileged MFA until recovery delivery and owner enrollment are ready.
- Actual camera/microphone, two-party video across networks, TURN service and real Android/Telugu wrapping are not verified. Signaling access and persistence are tested. Recording is disabled.
- Active care flow uses encrypted PostgreSQL photographs. Auxiliary S3 endpoints require separate storage configuration and have not been fully exercised.
- Clinical workflow labels are partly centralized; legacy screens and some clinical status/event fields still expose English technical labels. No claim of complete application-wide translation.
- Account list is capped at 200. Multi-district tenancy and multi-facility clinical assignment require additional modeling; the present pilot is one district with a primary facility per account.
- Old care records without source/referral facility IDs would require a separately reviewed backfill. Current production care table was empty when inspected.
- Synthetic demonstration only. AI output remains nonclinical with null score, and manual care continues without AI. No claim of clinical validation or complete handbook/security certification.

## Local setup

Install root and backend dependencies with npm ci. Configure backend DATABASE_URL, independent JWT_SECRET/JWT_REFRESH_SECRET, stable CARE_KEY_BASE64 (32 random bytes encoded as base64), CORS_ORIGIN and APP_ORIGIN. Keep secrets in ignored environment files. Never rotate the care encryption key without a data/key migration. For local HTTP use NODE_ENV=development; production must use HTTPS with Secure cookies.

Run npm run build in backend and root. Start backend with npm run start:dev; start the frontend with its Vite dev command and same-origin proxy pointed at the backend. Apply reviewed migrations to a backed-up database; never use db push/reset against production. For the current additive change, scripts/apply-auth-migration.cjs requires CONFIRM_AUTH_MIGRATION=yes and DATABASE_URL.

Run frontend npm test -- --run and backend npm test -- --runInBand. scripts/test-auth-isolated.cjs creates a uniquely named disposable schema using backend/.env.vercel, runs the real-database tests, then removes only that test schema. It needs permission to create/drop its own schema; use a dedicated test database where possible.

## Synthetic accounts

No public password list. Administrators create synthetic worker, MO, specialist, navigator and admin accounts through Staff Management, assign the correct facility/villages, and register owner-controlled recovery emails. Use private recovery to set passwords and enroll authenticators. Public requests cannot nominate privileged roles. Existing seeded account passwords were not overwritten. Legacy seed scripts require CONFIRM_SYNTHETIC_SEED=yes and a private DEMO_SEED_PASSWORD of at least 12 characters and are for isolated synthetic databases only; never run them against live data.

## Deployment

Vercel projects: aarogya-drishti (frontend), aarogya-drishti-api (Nest), aarogya-drishti-quality (Python quality). Root vercel.json proxies /api to the backend. Configure backend Production SMTP_HOST=smtp.gmail.com, SMTP_USER and SMTP_FROM as the authorized sender, SMTP_PASSWORD as a secret, APP_ORIGIN as the frontend HTTPS origin, CORS_ORIGIN matching it, JWT_EXPIRES_IN=15m, ALLOW_DEMO_AUTH_FALLBACK=false, and existing database/encryption/signing secrets.

After mail configuration, build and deploy backend with vercel deploy --prod from backend, then frontend from root. Verify health, cookie login/refresh/logout, roles, reset mail and owner-completed MFA on the production domain. Environment edits require a redeployment to affect running functions. Preserve prior Vercel deployment IDs for rollback. Do not roll back the stable encryption key. Complete the remaining release gates before claiming full delivery.

