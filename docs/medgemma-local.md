# MedGemma development integration

The health-worker desktop and mobile menus link to `/health-worker/medgemma` below Guided Screening. The page is marked under development.

`ai-service/medgemma_service.py` and its original tests were imported from branch `b`, commit `6019960db9e77db7a6d6025978bfd83f1a552082`. This implementation uses deterministic heuristics; it does not load MedGemma weights. The local adapter explicitly reports `modelLoaded: false`. Use synthetic data only.

Install `ai-service/requirements-demo.txt` into `.local/medgemma-venv`, then run `powershell -File scripts/start-medgemma.ps1`. This starts the demo on loopback port 8002 and the existing quality service on 8001. Start the existing NestJS backend and Vite frontend normally. Vite proxies `/medgemma` to port 8002. This integration is local-only; hosted deployments need an authenticated backend proxy before enabling uploads.

Real model inference remains future work and requires model loading, authorized model weights, and validation. No patient records are written by this demo.
