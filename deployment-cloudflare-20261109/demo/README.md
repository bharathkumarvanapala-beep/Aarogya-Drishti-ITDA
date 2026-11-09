# Isolated synthetic demonstration backend

Setup creates a new random-named PostgreSQL database and restricted owner role. It refuses an existing state directory and never migrates existing patient records. Seven source-defined demonstration personas are seeded with synthetic names, reserved example.invalid emails, and no phone numbers. The original database, encryption key, source, configuration, and running backend remain separate.

Runtime secrets and the independent care encryption key are under .local/isolated-demo-20261109, with Windows ACL inheritance removed and access granted to the current user and SYSTEM. Never publish that directory.

Start from the project root with node deployment-cloudflare-20261109/demo/start.cjs. Backend listens only on 127.0.0.1:4201. Separate JWT secrets prevent original sessions being accepted. All auxiliary external service endpoints are disabled by pointing to unused loopback port1, so older S3/AI/OpenCV-dependent features are unavailable in this demonstration. Active care photos use the existing local image-processing implementation and isolated PostgreSQL.

The backend runs in development mode for demonstration MFA. This is not production-ready. Only synthetic information may be entered. The demo gateway must point to4201, never the original4100 backend.

Verification: node deployment-cloudflare-20261109/demo/verify.cjs 1 verifies one expected Synthetic Demo Patient case created by the separate smoke check, seven accounts, zero legacy patient-table records, restricted role, login, care listing, and a separate key. Use0 before creating that synthetic case. This test does not create care records.
