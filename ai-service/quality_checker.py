"""
AAROGYA DRISHTI (ఆరోగ్య దృష్టి)
Frontline Oral Mucosal Image Quality Verification Engine (OpenCV)
Detects blur variance, lighting histogram defects, specular mucosal glare, and resolution.
Returns plain-language bilingual instructions (Telugu and English).
"""

import cv2
import numpy as np
from typing import Dict, Any, Tuple

# Quality Assessment Thresholds
MIN_SHARPNESS_LAPLACIAN = 100.0   # Below 100 indicates out-of-focus or motion blur
MIN_BRIGHTNESS = 45.0            # Below 45 indicates underexposed / dark oral cavity
MAX_BRIGHTNESS = 215.0           # Above 215 indicates washed out / overexposed
MAX_GLARE_RATIO = 0.08           # Max 8% pixels allowed at specular glare intensity (>250)
TARGET_MIN_WIDTH = 1280          # Minimum baseline width
TARGET_MIN_HEIGHT = 720          # Minimum baseline height

def assess_image_quality(image_bytes: bytes, filename: str = "image.jpg") -> Dict[str, Any]:
    """
    Evaluates image quality metrics using OpenCV:
    1. Laplacian Variance for blur detection
    2. Mean Grayscale Intensity for exposure checking
    3. High-intensity pixel fraction for specular glare
    4. Resolution check
    """
    # Decode image from memory
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if image is None:
        return {
            "verdict": "RECAPTURE_REQUIRED",
            "sharpnessScore": 0.0,
            "brightnessScore": 0.0,
            "glareScore": 0.0,
            "resolution": "0x0",
            "automatedFeedbackEn": "Failed to decode image. Please recapture with clinical camera.",
            "automatedFeedbackTe": "చిత్రం ప్రాసెస్ చేయలేకపోయాము. దయచేసి మళ్లీ ఫోటో తీయండి.",
            "issues": ["DECODE_ERROR"]
        }

    height, width = image.shape[:2]
    resolution = f"{width}x{height}"

    # Convert to grayscale for optical measurements
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # 1. Laplacian blur variance: var(Laplacian(gray))
    laplacian = cv2.Laplacian(gray, cv2.CV_64F)
    sharpness_score = float(laplacian.var())

    # 2. Exposure / Brightness: Mean pixel intensity
    brightness_score = float(np.mean(gray))

    # 3. Specular Glare: Proportion of saturated pixels (>250)
    glare_pixels = np.sum(gray >= 250)
    total_pixels = gray.size
    glare_score = float(glare_pixels / total_pixels) if total_pixels > 0 else 0.0

    # Evaluate against clinical thresholds
    issues = []
    feedbacks_en = []
    feedbacks_te = []

    # Check blur
    if sharpness_score < MIN_SHARPNESS_LAPLACIAN:
        issues.append("BLURRY")
        feedbacks_en.append(
            f"Image is blurry (sharpness: {round(sharpness_score, 1)} < {MIN_SHARPNESS_LAPLACIAN}). Hold camera steady 5-8 cm from oral lesion and tap to focus."
        )
        feedbacks_te.append(
            "చిత్రం మసకగా ఉంది. దయచేసి కెమెరాను స్థిరంగా 5-8 సెం.మీ దూరంలో ఉంచి ఫోకస్ చేయండి."
        )

    # Check underexposure
    if brightness_score < MIN_BRIGHTNESS:
        issues.append("UNDEREXPOSED")
        feedbacks_en.append(
            f"Lighting is too dark (brightness: {round(brightness_score, 1)} < {MIN_BRIGHTNESS}). Turn on clinical torch or examination light."
        )
        feedbacks_te.append(
            "వెలుతురు చాలా తక్కువగా ఉంది. దయచేసి టార్చ్ లైట్ లేదా ఎగ్జామినేషన్ లైట్ ఆన్ చేయండి."
        )
    # Check overexposure
    elif brightness_score > MAX_BRIGHTNESS:
        issues.append("OVEREXPOSED")
        feedbacks_en.append(
            f"Image is overexposed/washed out (brightness: {round(brightness_score, 1)} > {MAX_BRIGHTNESS}). Increase distance from torch."
        )
        feedbacks_te.append(
            "కాంతి ఎక్కువగా ఉండటం వల్ల చిత్రం తెల్లగా వచ్చింది. టార్చ్ దూరాన్ని కొద్దిగా పెంచండి."
        )

    # Check specular glare
    if glare_score > MAX_GLARE_RATIO:
        issues.append("SPECULAR_GLARE")
        feedbacks_en.append(
            f"Excessive specular glare on oral mucosa ({round(glare_score * 100, 1)}% > 8%). Angle camera slightly to eliminate flash reflection."
        )
        feedbacks_te.append(
            "నోటి శ్లేష్మంపై కాంతి ప్రతిబింబం ఎక్కువగా ఉంది. ప్రతిబింబం తగ్గించడానికి కెమెరా కోణాన్ని కొద్దిగా మార్చండి."
        )

    # Check resolution
    if width < TARGET_MIN_WIDTH or height < TARGET_MIN_HEIGHT:
        issues.append("LOW_RESOLUTION")
        feedbacks_en.append(
            f"Resolution ({resolution}) is below minimum recommended standard (1920x1440)."
        )
        feedbacks_te.append(
            "చిత్రం రిజల్యూషన్ సిఫార్సు చేసిన పరిమాణం కంటే తక్కువగా ఉంది."
        )

    # Determine overall verdict
    is_acceptable = len(issues) == 0
    verdict = "ACCEPTABLE" if is_acceptable else "RECAPTURE_REQUIRED"

    if is_acceptable:
        feedback_en = "Image quality is acceptable. Clear focus and adequate oral illumination."
        feedback_te = "చిత్రం నాణ్యత ఆమోదయోగ్యంగా ఉంది. స్పష్టమైన ఫోకస్ మరియు సరిపడా వెలుతురు ఉంది."
    else:
        feedback_en = " | ".join(feedbacks_en)
        feedback_te = " | ".join(feedbacks_te)

    return {
        "verdict": verdict,
        "sharpnessScore": round(sharpness_score, 2),
        "brightnessScore": round(brightness_score, 2),
        "glareScore": round(glare_score, 4),
        "resolution": resolution,
        "automatedFeedbackEn": feedback_en,
        "automatedFeedbackTe": feedback_te,
        "issues": issues,
    }
