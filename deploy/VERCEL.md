# Vercel deployment

Frontend: https://aarogya-drishti.vercel.app
Backend: https://aarogya-drishti-api.vercel.app
Image quality: https://aarogya-drishti-quality.vercel.app

The three Vercel projects are deployed from the root, backend, and ai-service directories respectively. PostgreSQL is the dedicated Neon free-plan resource aarogya-drishti in Singapore. Only seven synthetic accounts were initialized; local records were not migrated.

The backend requires DATABASE_URL, CARE_KEY_BASE64 (stable 32-byte base64 encryption key), JWT_SECRET, JWT_REFRESH_SECRET, CORS_ORIGIN, and OPENCV_SERVICE_URL. Secrets are held in Vercel. Preserve CARE_KEY_BASE64 across redeployments. Runtime NODE_ENV is staging because the existing MFA flow supports demonstration codes only; ALLOW_DEMO_AUTH_FALLBACK is false.

Deploy each project with `npx vercel deploy --prod` from its directory. GitHub automatic deployment is not connected: Vercel could not access the repository.

This is a hosted demonstration, not a complete clinical production deployment. The older S3 upload endpoints still require private S3-compatible storage. No separate AI research server is present in the repository. The active care workflow uses encrypted PostgreSQL image storage and its existing demonstration analysis. Video signaling is now stored in PostgreSQL, but TURN relay service is not configured. Production MFA remains unimplemented. Do not use real patient records.

Validation: five care integration tests passed against isolated test schemas in Neon, including cross-instance signaling and the complete synthetic care workflow. Public endpoint and portal verification results are recorded in the deployment chat.
