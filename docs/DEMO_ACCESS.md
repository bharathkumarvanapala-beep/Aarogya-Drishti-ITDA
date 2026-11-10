# Default demonstration logins

Live demo: https://aarogya-drishti-demo.vercel.app/login

Default password for all six demonstration accounts: `Aarogya@2026`.

| Portal | Username | Alternative ID |
|---|---|---|
| Doctor | doc_suresh | APMC/2018/04912 |
| ASHA | asha_lakshmi | ASHA-GMAD-01 |
| ANM | anm_sarada | ANM-GMAD-01 |
| District Admin | admin_rajesh | admin_rajesh |
| Hospital Referral Coordinator | hrc_varma | HRC-ASR-042 |
| Specialist | specialist_priya | specialist_priya |

Use a **Quick evaluator demo** button to sign in directly, or enter a username/alternative ID and the default password in the form. The dashboard includes a **Choose another demo role** link. These are shared synthetic evaluator accounts, with no email or authenticator setup needed. Enter synthetic information only.

## Isolation and implementation

Vercel frontend project: `aarogya-drishti-demo`. Backend: `aarogya-drishti-demo-api`. Both authentication and care use the separate `aarogya_demo` PostgreSQL schema. Signing and encryption keys are independent of the main portal. Production's existing accounts, credentials, approvals and MFA configuration were not changed for this request.

`DEMO_MODE=true` alone does not disable MFA: both the database URL schema and CARE_SCHEMA must equal `aarogya_demo`, and the account must match one of the six named synthetic accounts with its exact `@demo.aarogya.invalid` email. Startup fails if demo mode points outside the isolated schema. Passwords are Argon2id hashes. All sessions still use real backend login, secure HttpOnly cookies, expiry, role restrictions and server-side logout. Newly created privileged accounts continue to require MFA.

The frontend shows defaults only when built with `VITE_DEMO_MODE=true`. The regular frontend build was checked and does not contain the default password. This demo-specific behavior follows the user's later request for accessible default demo credentials.

## Verification — 9 November 2026

- All six deployed logins passed: expected role, authenticated profile, role workspace, worker denial from account-management API, main backend rejection of demo cookies, logout and revoked-session rejection.
- Browser: the administrator's one-click demo button opened `/admin` and loaded the district statistics.
- Three isolation unit tests passed; all 80 frontend regression tests passed; frontend and backend builds passed.
- Raw results are in `output/demo-login-results.json`. Re-run with `node scripts/verify-demo-logins.cjs`.
- Main-site rollback was required after an incorrectly targeted frontend deployment command. The domain was verified restored to deployment `dpl_F7gdgrpqRo6T2dGfhSNpMrhnnBxf`. No backend or data rollback was necessary.

## Maintenance

`scripts/provision-demo.cjs` creates the initial six accounts only in an empty `aarogya_demo` schema and refuses to overwrite it. It reads the operator's ignored backend/.env.vercel and writes independent demo configuration to ignored .local/demo-api.env. Do not rerun it to reset existing accounts.

`node scripts/stage-demo.cjs` copies current source into `.local/demo-api` and `.local/demo-web` without copying local secrets. Those directories are linked to their own demo Vercel projects. Deploy from each exact directory with `npx vercel deploy --prod --yes`; verify its `.vercel/project.json` project name first. Backend requires framework `nestjs`; frontend requires VITE_DEMO_MODE=true and rewrites to the demo API domain. SMTP is not needed for these shared demo accounts; real-account email recovery remains a separate task.
