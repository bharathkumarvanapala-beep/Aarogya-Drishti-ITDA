# Login and integration audit — baseline, 9 November 2026

Reference: docs/reference/AAROHAN_Aarogya_Drishti_Detailed_Open_Book_Developer_Handbook_2026.pdf, 13 pages. Relevant sections: 6 data invariants; 7 APIs; 10 bilingual/offline; 11 role restrictions; 12 security; 13 testing. Stack: React 19/TypeScript/Vite, NestJS 10/Prisma/PostgreSQL, Python FastAPI/OpenCV. Existing deployment is three Vercel projects plus Neon. No replacement project is planned.

## Confirmed findings from source and live checks

| Finding | Location | Cause / impact | Planned correction |
|---|---|---|---|
| Public demonstration passwords and verification code | PortalLoginPage.tsx; AuthProvider.tsx | Publicly reusable credentials and static MFA | Remove public credentials; real TOTP with per-user secret |
| Password verifier accepts known password set for a placeholder hash | backend/src/auth/password.service.ts | Backdoor branch accepts multiple passwords | Argon2id verification only |
| Public password recovery returns resetToken | backend/src/auth/auth.service.ts forgotPassword | Anyone can obtain a reset capability for an account | Hash tokens; private email delivery; single-use transactional reset |
| Reset does not revoke existing sessions | same, resetPassword | Compromised sessions survive reset | Revoke sessions atomically |
| Refresh tokens are checked but never consumed | same, refreshTokens | Rotation claim is false; replay possible | Atomic consume and replacement |
| Session writes swallow database failures | same, generateTokensForUser | Success can be returned without persistent session | Fail closed |
| Client sets user role from selected portal | src/context/AuthProvider.tsx | Browser profile is not derived exclusively from server | Server profile and /me hydration |
| Bearer token and cached profile in localStorage | same; careApi.ts; ConnectedAdminPage.tsx | Script-readable long-lived token; stale profile trusted on reload | HttpOnly cookies; server session validation |
| Public registration accepts clinician/navigator roles and village assignment | backend/src/auth/auth.service.ts register | User can nominate privileged role/scope, though approval is still required | Only unassigned pending worker requests; admin-controlled roles/facilities |
| Privileged MFA is a fixed set of codes | auth.service.ts verifyMfa | Not a second factor; replay tracking only process-local | TOTP + persistent single-use timestep |
| Specialist inherits village-wide doctor access | care.service.ts allowed | Specialist can access non-referred cases in assigned village | Explicit referral assignment |
| Navigator receives clinical images/history | care.service.ts get/list | More data than coordination requires | Redacted navigator projection |
| Referral recipient is a hardcoded UUID | care.service.ts REVIEW | Real approved staff cannot be selected dynamically | Validated directory of eligible assigned staff |
| Multiple dashboard routes render same workflow | src/app/router.tsx | Role headings and destination semantics are not distinct | Five role destinations over shared working workflow |
| Several old dashboard components are unmounted | router.tsx vs features directories | Legacy duplicated mock screens remain | Preserve files; document active route map |
| Authentication strings mixed between English and Telugu | AuthProvider.tsx and PortalLoginPage.tsx | No centralized complete login dictionary | Central dictionary for all auth forms/errors |
| New signup is pending, not lost | Live API and Staff Management | Approval is required by current design | Preserve approval gate, improve onboarding |
| Browser prompt caused unusable privileged login | prior live browser verification | Native pop-up dependency | Already replaced with in-page form; extend to real MFA |

## Not verified / external dependencies

No claim of real Android-device testing, TURN traversal, clinical approval, email delivery, or complete production security certification. S3 auxiliary endpoints are not configured on current host. The active care workflow stores encrypted photographs in PostgreSQL. AI is a mock research output with null score; it does not diagnose. Database must remain intact; additive changes only, no reset or destructive schema push. Existing patient/family routes are retained alongside the five staff roles.

## Requirements ledger

Phases 1–10 are all in scope. Final delivery must include the updated portal, server/client code, additive migrations, API/role matrix, private synthetic-account provisioning, redirects, executed test report, fixed issues, limitations, and local/deployment runbook. Unverified requirements will remain explicitly marked, not reported as passed.
