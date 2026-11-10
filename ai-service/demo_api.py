"""Explicitly labelled branch-b research demo; this does not run model weights."""
import base64
import os
import secrets
from fastapi import FastAPI, HTTPException, Request as HttpRequest
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from medgemma_service import analyze_clinical_features

app = FastAPI(title="MedGemma development demo")

@app.middleware('http')
async def require_backend(request: HttpRequest, call_next):
    expected = os.environ.get('AI_SERVICE_TOKEN')
    if not expected and (os.environ.get('RENDER') or os.environ.get('REQUIRE_AI_AUTH') == 'true'):
        return JSONResponse({'detail': 'Service authentication is not configured'}, status_code=503)
    if expected and not secrets.compare_digest(request.headers.get('x-ai-service-token', ''), expected):
        return JSONResponse({'detail': 'Unauthorized'}, status_code=401)
    return await call_next(request)

class Request(BaseModel):
    imageBase64: str = Field(max_length=1_800_000)
    site: str = Field(default="", max_length=200)
    history: str = Field(default="", max_length=4000)
    age: int = Field(ge=0, le=120)

@app.get('/status')
def status():
    return {"available": True, "mode": "rule-based-demo", "modelLoaded": False}

@app.post('/analyze')
def analyze(payload: Request):
    try:
        image = base64.b64decode(payload.imageBase64.split(',')[-1], validate=True)
        result = analyze_clinical_features(image, payload.site, payload.history, payload.age)
        return {"mode": "rule-based-demo", "modelLoaded": False, "findings": result}
    except (ValueError, OSError) as exc:
        raise HTTPException(400, "Please upload a valid JPEG, PNG, or WebP image.") from exc
