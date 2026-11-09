"""
FastAPI Micro-service for Aarogya Drishti Frontline Image Quality Assessment
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import base64
from quality_checker import assess_image_quality

app = FastAPI(
    title="Aarogya Drishti Image Quality Service",
    description="Frontline oral mucosal image blur, lighting, and glare verification worker",
    version="1.0.0",
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

@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": "aarogya-image-quality-opencv",
        "version": "1.0.0",
    }

@app.post("/quality-check")
async def check_quality(
    payload: Optional[QualityCheckRequest] = None,
    file: Optional[UploadFile] = File(None),
):
    image_bytes = None
    filename = "image.jpg"

    if file:
        image_bytes = await file.read()
        filename = file.filename or filename
    elif payload and payload.imageBase64:
        try:
            # Handle potential data URL prefix
            data = payload.imageBase64
            if "," in data:
                data = data.split(",")[1]
            image_bytes = base64.b64decode(data)
            filename = payload.filename or filename
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid base64 payload: {str(e)}")

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="No image provided. Supply either multipart file or imageBase64 payload.",
        )

    result = assess_image_quality(image_bytes, filename=filename)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
