# MedGemma development integration

The desktop and mobile health-worker menus include MedGemma AI below Guided Screening, marked under development.

Imported the inference service, trained classifier weights, and class metadata from branch b commit 7136dcb. This executes a MobileNet V3 oral classifier, not Google MedGemma 4B weights. The complete branch-b workstation includes image upload, OpenCV quality checks, bilingual reports, and the branch doctor-review report view. Inference remains research-only.

Install ai-service/requirements-demo.txt in .local/medgemma-venv. Configure the same AI_SERVICE_TOKEN for Python and NestJS, AI_RESEARCH_SERVICE_URL=http://127.0.0.1:8002 and NODE_ENV=development for NestJS. scripts/start-medgemma.ps1 starts the classifier API on 8002 and quality API on 8001. Start the backend and frontend using their existing commands. The authenticated /api/v1/medgemma gateway reports classifier readiness and preserves the complete quality/report response.

Frontend and backend builds and the gateway tests were verified. Full Google MedGemma inference remains future work.

The full branch-b MedGemma inference scripts and configuration are retained in ai-workspace/MedGemma. Frontend calls use the authenticated NestJS gateway. Uploads are limited to 10 MB with a dedicated 16 MB JSON limit for this endpoint.
