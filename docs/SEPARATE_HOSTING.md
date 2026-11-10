# Separate deployment

Frontend: Netlify, using root netlify.toml. Backend: Vercel, root directory backend with NestJS framework. Python image quality and rule-based research demo: Render, configuration deploy/render-ai.yaml. Existing PostgreSQL data stays on Neon if its resource still exists.

1. Deploy the Python service using ai-service/requirements-demo.txt and uvicorn hosted_api:app --host 0.0.0.0 --port $PORT. Set REQUIRE_AI_AUTH=true and a generated private AI_SERVICE_TOKEN. Public /health is a readiness check; /research requires the token.
2. Restore the correct backend database/signing/encryption variables. For isolated demo accounts, preserve DEMO_MODE=true, CARE_SCHEMA=aarogya_demo and DATABASE_URL's matching schema; use the existing demo signing/encryption settings. Set AI_SERVICE_TOKEN to the same secret as Render, AI_RESEARCH_SERVICE_URL to the Render origin plus /research, and OPENCV_SERVICE_URL to its origin. Deploy backend/vercel.json.
3. In Netlify set BACKEND_ORIGIN to the backend HTTPS origin. Set VITE_DEMO_MODE=true only for the isolated demo. Build the root with netlify.toml. The build creates API proxy rules before the single-page-app fallback. Database keys and AI_SERVICE_TOKEN never belong in frontend variables.
4. Set backend CORS_ORIGIN and APP_ORIGIN to the actual Netlify HTTPS origin and redeploy the backend. Confirm cookies survive the Netlify proxy, all role logins work, and unauthenticated research uploads fail.

The browser now uses /api/v1/medgemma through the authenticated backend. Its upload size is limited to 1.3 MB to fit the 2 MB backend JSON limit after base64 encoding. Requests require confirmation that the image is synthetic. The Python demo does not load MedGemma weights, is not clinically validated, and is explicitly labelled rule-based. Real model inference is a separate implementation, hosting and licensing decision.

The free Render service can sleep; the backend returns an unavailable message on timeout while other care workflows remain usable. A paid plan requires the owner's approval. Hosting configuration is prepared; no deployment is claimed until authenticated account access and live verification succeed.
