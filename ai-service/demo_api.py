"""
Aarogya Drishti - MedGemma 1.5 4B Clinical AI Microservice
Handles frontline oral photograph quality verification (OpenCV)
and structured multimodal clinical feature reasoning with bilingual presentation.
"""

import base64
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from medgemma_service import analyze_clinical_features, check_environment as get_medgemma_status
from quality_checker import assess_image_quality

app = FastAPI(
    title="Aarogya Drishti MedGemma Clinical AI Service",
    description="Multimodal oral mucosal screening and clinical decision support",
    version="1.5.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    imageBase64: str = Field(max_length=15_000_000, description="Base64 encoded JPEG/PNG/WebP")
    site: Optional[str] = Field(default="Right Buccal Mucosa", max_length=200)
    history: Optional[str] = Field(default="", max_length=4000)
    age: Optional[int] = Field(default=45, ge=0, le=120)
    patientName: Optional[str] = Field(default="Patient", max_length=200)
    screeningId: Optional[str] = Field(default=None, max_length=100)

@app.get('/status')
@app.get('/health')
def status():
    env_status = get_medgemma_status()
    return {
        "available": True,
        "mode": env_status.get("executionMode", "CLINICAL_DECISION_SUPPORT_FALLBACK"),
        "model": "google/medgemma-1.5-4b-it",
        "parameters": "4.2B",
        "modelLoaded": env_status.get("actualWeightsLoaded", False),
        "license": "Health AI Developer Foundations (HAI-DEF)",
        "capabilities": [
            "frontline_image_quality_opencv",
            "oral_mucosal_segmentation",
            "anatomical_concordance_verification",
            "icd10_differential_reasoning",
            "bilingual_clinical_reporting"
        ],
        "nonDiagnosticPolicy": "score: null enforced. Never diagnose cancer from a photograph alone."
    }

@app.post('/analyze')
def analyze(payload: AnalyzeRequest):
    try:
        # Strip data URL prefix if present
        raw_b64 = payload.imageBase64
        if ',' in raw_b64:
            raw_b64 = raw_b64.split(',', 1)[1]
        
        image_bytes = base64.b64decode(raw_b64, validate=True)
        if len(image_bytes) < 30:
            raise ValueError("Image payload too small or empty.")
            
        # 1. Frontline OpenCV Quality Check
        quality_result = assess_image_quality(image_bytes, filename="uploaded_oral_photo.jpg")
        
        # 2. Multimodal Clinical Analysis
        clinical_findings = analyze_clinical_features(
            photo_bytes=image_bytes,
            site=payload.site or "Right Buccal Mucosa",
            history=payload.history or "",
            age=payload.age or 45
        )
        
        # Merge OpenCV quality audit into findings
        clinical_findings["opencvQuality"] = quality_result
        if quality_result.get("verdict") == "RECAPTURE_REQUIRED":
            clinical_findings["qualityAudit"]["status"] = "Recapture Advised"
            clinical_findings["qualityAudit"]["issues"] = quality_result.get("issues", [])
            clinical_findings["poorQualityWarningTriggered"] = True

        return {
            "mode": clinical_findings.get("executionMode", "medgemma-clinical-engine"),
            "modelLoaded": clinical_findings.get("actualWeightsLoaded", False),
            "qualityVerdict": quality_result.get("verdict", "ACCEPTABLE"),
            "opencvQuality": quality_result,
            "findings": clinical_findings
        }
    except (ValueError, OSError) as exc:
        raise HTTPException(400, f"Please upload a valid JPEG, PNG, or WebP image. Error: {str(exc)}") from exc
    except Exception as exc:
        raise HTTPException(500, f"Inference processing error: {str(exc)}") from exc
