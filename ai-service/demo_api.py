"""Explicitly labelled branch-b research demo; this does not run model weights."""
import base64
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from medgemma_service import analyze_clinical_features

app = FastAPI(title="MedGemma development demo")

class Request(BaseModel):
    imageBase64: str = Field(max_length=8_000_000)
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
