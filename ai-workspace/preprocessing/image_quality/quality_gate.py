"""
Aarogya Drishti - MedGemma 1.5 4B AI Workspace
Preprocessing: Frontline Intraoral Image Quality Gate (OpenCV)
"""

import cv2
import numpy as np
from typing import Dict, Any, Tuple

class OralImageQualityGate:
    """
    Automated pre-inference quality gate to prevent garbage-in / hallucination.
    Evaluates:
    1. Focus / Motion blur via Laplacian variance.
    2. Illumination adequacy (underexposure / overexposure).
    3. Specular mucosal glare / saturation ratio.
    """

    def __init__(
        self,
        min_laplacian_var: float = 80.0,
        min_brightness: float = 40.0,
        max_brightness: float = 230.0,
        max_glare_ratio: float = 0.12,
        min_resolution: Tuple[int, int] = (640, 480)
    ):
        self.min_laplacian_var = min_laplacian_var
        self.min_brightness = min_brightness
        self.max_brightness = max_brightness
        self.max_glare_ratio = max_glare_ratio
        self.min_resolution = min_resolution

    def evaluate_image(self, image_bgr: np.ndarray) -> Dict[str, Any]:
        """
        Executes complete quality screening and returns detailed metrics with pass/fail decision.
        """
        h, w = image_bgr.shape[:2]
        gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)

        # 1. Resolution Check
        res_pass = (w >= self.min_resolution[0] and h >= self.min_resolution[1])

        # 2. Focus Sharpness (Laplacian Variance)
        laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
        focus_score = min(100.0, max(0.0, (laplacian_var / 250.0) * 100.0))
        focus_pass = laplacian_var >= self.min_laplacian_var

        # 3. Illumination / Brightness
        mean_brightness = float(np.mean(gray))
        illum_pass = (self.min_brightness <= mean_brightness <= self.max_brightness)

        # 4. Specular Glare / Flash Saturation
        glare_mask = gray >= 250
        glare_ratio = float(np.count_nonzero(glare_mask) / (h * w))
        glare_pass = glare_ratio <= self.max_glare_ratio

        # Aggregate Decision
        rejection_reasons = []
        if not res_pass:
            rejection_reasons.append(f"Resolution too low ({w}x{h} < {self.min_resolution[0]}x{self.min_resolution[1]})")
        if not focus_pass:
            rejection_reasons.append(f"Image blurred or out of focus (Laplacian {laplacian_var:.1f} < {self.min_laplacian_var})")
        if not illum_pass:
            rejection_reasons.append(f"Improper lighting: mean brightness {mean_brightness:.1f} not in [{self.min_brightness}, {self.max_brightness}]")
        if not glare_pass:
            rejection_reasons.append(f"Excessive mucosal glare ({glare_ratio*100:.1f}% > {self.max_glare_ratio*100:.1f}%)")

        is_acceptable = len(rejection_reasons) == 0

        return {
            "acceptable": is_acceptable,
            "overall_status": "PASS" if is_acceptable else "REJECT",
            "resolution": f"{w}x{h}",
            "laplacian_variance": round(laplacian_var, 2),
            "focus_score": round(focus_score, 1),
            "mean_brightness": round(mean_brightness, 2),
            "glare_percentage": round(glare_ratio * 100, 2),
            "rejection_reasons": rejection_reasons,
            "recommendation": (
                "Quality verified. Proceed with MedGemma multimodal analysis."
                if is_acceptable
                else f"Retake intraoral photograph: {'; '.join(rejection_reasons)}."
            )
        }

