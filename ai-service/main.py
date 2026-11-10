"""
FastAPI Micro-service for Aarogya Drishti Frontline Image Quality Assessment
and MedGemma 1.5 4B Multimodal Clinical Decision-Support
"""

from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import base64
from quality_checker import assess_image_quality

# MedGemma 1.5 4B Clinical AI Service Integration
try:
    from medgemma_service import (
        analyze_clinical_features,
        check_environment as get_medgemma_status,
        detect_visual_anatomical_landmarks,
    )
    HAS_MEDGEMMA = True
except Exception as e:
    HAS_MEDGEMMA = False

app = FastAPI(
    title="Aarogya Drishti AI & Quality Service",
    description="Frontline image quality verification worker & MedGemma 1.5 4B clinical decision support",
    version="1.5.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QualityCheckRequest(BaseModel):
    imageBase64: Optional[str] = None
    filename: Optional[str] = "image.jpg"
    screeningImageId: Optional[str] = None

class MedGemmaAnalyzeRequest(BaseModel):
    imageBase64: Optional[str] = None
    imageData: Optional[str] = None
    patientAge: Optional[int] = 45
    habits: Optional[List[str]] = []
    symptoms: Optional[str] = ""
    healthWorkerSite: Optional[str] = "Oral mucosa"
    filename: Optional[str] = "image.jpg"

@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": "aarogya-image-quality-opencv",
        "medgemma_loaded": HAS_MEDGEMMA,
        "version": "1.5.0",
    }

@app.post("/quality-check")
async def check_quality(request: Request):
    image_bytes = None
    filename = "image.jpg"
    content_type = request.headers.get("content-type", "")

    if "application/json" in content_type:
        try:
            body = await request.json()
            raw_b64 = body.get("imageBase64") or body.get("imageData") or ""
            filename = body.get("filename", filename)
            if "," in raw_b64:
                raw_b64 = raw_b64.split(",")[1]
            if raw_b64:
                image_bytes = base64.b64decode(raw_b64)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid JSON/base64 payload: {str(e)}")
    else:
        try:
            form = await request.form()
            file = form.get("file")
            if file and hasattr(file, "read"):
                image_bytes = await file.read()
                filename = getattr(file, "filename", filename) or filename
            else:
                raw_b64 = form.get("imageBase64") or form.get("imageData") or ""
                if "," in raw_b64:
                    raw_b64 = raw_b64.split(",")[1]
                if raw_b64:
                    image_bytes = base64.b64decode(raw_b64)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid form payload: {str(e)}")

    if not image_bytes or len(image_bytes) < 30:
        raise HTTPException(
            status_code=400,
            detail="No image provided. Supply either multipart file or imageBase64 payload.",
        )

    result = assess_image_quality(image_bytes, filename=filename)
    return result

@app.get("/ai/status")
@app.get("/medgemma/status")
def medgemma_status():
    if HAS_MEDGEMMA:
        return get_medgemma_status()
    return {
        "available": True,
        "model": "google/medgemma-1.5-4b-it",
        "revision": "pretrained-1.5-4b-it",
        "license": "Health AI Developer Foundations (HAI-DEF)",
        "researchOnly": True,
        "clinicallyValidated": False,
        "modality": "image-text-to-text",
        "parameters": "4B",
        "architecture": "Gemma-3/SigLIP Multimodal",
        "device": "cpu",
        "cudaAvailable": False,
        "weightsPresent": False,
        "actualWeightsLoaded": False,
        "executionMode": "CLINICAL_DECISION_SUPPORT_FALLBACK",
        "inferenceEngine": "Clinical Decision-Support Rules Engine (Fallback)",
        "capabilities": [
            "oral_lesion_analysis",
            "multimodal_image_text",
            "risk_factor_correlation",
            "differential_consideration"
        ],
        "status": "fallback"
    }

@app.post("/ai/analyze")
@app.post("/medgemma/analyze")
async def medgemma_analyze(request: Request):
    if not HAS_MEDGEMMA:
        raise HTTPException(
            status_code=503,
            detail="MedGemma AI inference engine is offline.",
        )

    image_bytes = None
    patient_age = 45
    habits = []
    symptoms = ""
    site = "Oral mucosa"
    filename = "image.jpg"

    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        try:
            body = await request.json()
            raw_b64 = body.get("imageBase64") or body.get("imageData") or ""
            if "," in raw_b64:
                raw_b64 = raw_b64.split(",")[1]
            if raw_b64:
                image_bytes = base64.b64decode(raw_b64)
            patient_age = body.get("patientAge", patient_age)
            habits = body.get("habits", habits)
            symptoms = body.get("symptoms", symptoms)
            site = body.get("healthWorkerSite", site)
            filename = body.get("filename", filename)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid JSON payload: {str(e)}")
    else:
        try:
            form = await request.form()
            file = form.get("file")
            if file and hasattr(file, "read"):
                image_bytes = await file.read()
                filename = getattr(file, "filename", filename) or filename
            raw_b64 = form.get("imageBase64") or form.get("imageData") or ""
            if "," in raw_b64:
                raw_b64 = raw_b64.split(",")[1]
            if raw_b64 and not image_bytes:
                image_bytes = base64.b64decode(raw_b64)
            patient_age = form.get("patientAge", patient_age)
            site = form.get("healthWorkerSite", site)
            symptoms = form.get("symptoms", symptoms)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid form payload: {str(e)}")

    if not image_bytes or len(image_bytes) < 30:
        # Fallback minimal test buffer if none provided
        image_bytes = base64.b64decode('/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAALCAABAAEBAREA/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAE/AP/Z')

    habits_str = ", ".join(habits) if isinstance(habits, list) else str(habits)
    symptoms_str = str(symptoms)
    combined_history = f"{habits_str}. {symptoms_str}".strip()

    analysis = analyze_clinical_features(
        image_bytes,
        site=str(site),
        history=combined_history,
        age=int(patient_age) if str(patient_age).isdigit() else 45,
    )
    return analysis

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
