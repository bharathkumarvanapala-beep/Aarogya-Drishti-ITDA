# Authentication and account API

Base path: `/api/v1`. Browser clients use the frontend same-origin `/api` proxy, `credentials: include`, and `X-Session-Mode: cookie`. Mutation requests must originate from the configured CORS origin. Cookies are HttpOnly, SameSite=Strict, Secure outside local development, scoped to `/api/v1`. Cookie-mode responses omit bearer tokens. Non-browser clients may use bearer tokens, stored securely by that client.

| Method and route | Input / behavior | Access |
|---|---|---|
| POST /auth/register | Worker request; name, phone, email, password and confirmation; pending and unassigned | Public; no privileged role |
| POST /auth/login | username (also email/phone/professional ID), password, optional rememberMe | Public; approved active account only |
| POST /auth/mfa/verify | mfaSessionToken, totpCode | Signed short-lived challenge plus real TOTP |
| GET /auth/me | Current database profile and assignments | Active session |
| POST /auth/refresh | Browser refresh cookie, or refreshToken | Rotates once; replay rejected |
| POST /auth/logout | Current refresh cookie or refreshToken | Revokes current session; clears browser cookies |
| POST /auth/forgot-password | identifier | Generic response; private email; no reset token returned |
| POST /auth/mfa/setup | token from private reset link | Initial privileged enrollment only; existing MFA secret never returned |
| POST /auth/reset-password | token, newPassword, confirmPassword, mfaCode if required | 15-minute single-use capability; revokes sessions |
| GET /auth/admin/registrations?status=ALL | Up to 200 accounts; default pending | District/Super admin |
| PATCH /auth/admin/registrations/:id/status | action APPROVE/REJECT/SUSPEND | Admin; no self-status changes; facility required for approval |
| GET /auth/admin/directory | Active facilities, villages and assignable roles | Admin |
| POST /auth/admin/accounts | username, fullName, email, role, facilityId, villageIds | Admin; random unusable initial password; owner uses recovery |
| PATCH /auth/admin/accounts/:id/assignments | role, facilityId, villageIds | Admin; no self-role change; revokes existing sessions |
| POST /auth/admin/accounts/:id/mfa-enrollment | Empty body | Admin; no self reset; private enrollment URI, audit and session revocation |

Never log or publish reset links, session cookies, authenticator enrollment keys or enrollment URIs. Account creation does not automatically send mail. Privileged new-account enrollment URIs must be delivered privately to the verified owner. No static MFA code is accepted. Access tokens expire after 15 minutes by default; refresh sessions after seven days. Without Remember Me, browser cookies are session cookies.

The care workflow uses `/care/cases`, per-case actions, an approved-staff directory, private per-case consultation signaling, and aggregate `/care/summary`. Record access is checked on the server before returning case content or accepting actions. Standard Swagger reference remains at backend `/api/docs`.
