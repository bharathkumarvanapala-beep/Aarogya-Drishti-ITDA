"""
Aarogya Drishti - MedGemma 1.5 4B AI Workspace
Preprocessing: Oral Image Normalization & Enhancement Pipeline
"""

import os
import cv2
import numpy as np
from PIL import Image
from typing import Tuple, Optional, Dict, Any

class OralImagePreprocessor:
    """
    Standardizes oral intraoral photography for MedGemma 1.5 4B multimodal processing.
    Includes CLAHE contrast normalization, mucosal color alignment, resolution standardization,
    and metadata (EXIF) de-identification.
    """

    def __init__(
        self,
        target_size: Tuple[int, int] = (448, 448),
        clahe_clip_limit: float = 2.0,
        clahe_grid_size: Tuple[int, int] = (8, 8)
    ):
        self.target_size = target_size
        self.clahe_clip_limit = clahe_clip_limit
        self.clahe_grid_size = clahe_grid_size
        self.clahe = cv2.createCLAHE(
            clipLimit=self.clahe_clip_limit,
            tileGridSize=self.clahe_grid_size
        )

    def apply_clahe(self, image_bgr: np.ndarray) -> np.ndarray:
        """
        Applies Contrast Limited Adaptive Histogram Equalization on the Luminance (L) channel
        of LAB color space to enhance mucosal vascularity and lesion borders without color distortion.
        """
        lab = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        l_clahe = self.clahe.apply(l)
        enhanced_lab = cv2.merge((l_clahe, a, b))
        return cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2BGR)

    def resize_with_pad(
        self,
        image_bgr: np.ndarray,
        target_size: Optional[Tuple[int, int]] = None
    ) -> Tuple[np.ndarray, Dict[str, Any]]:
        """
        Resizes image preserving original aspect ratio and pads borders to target size.
        """
        target_w, target_h = target_size or self.target_size
        h, w = image_bgr.shape[:2]

        scale = min(target_w / w, target_h / h)
        new_w = int(w * scale)
        new_h = int(h * scale)

        resized = cv2.resize(image_bgr, (new_w, new_h), interpolation=cv2.INTER_AREA)

        pad_w = target_w - new_w
        pad_h = target_h - new_h

        pad_top = pad_h // 2
        pad_bottom = pad_h - pad_top
        pad_left = pad_w // 2
        pad_right = pad_w - pad_left

        padded = cv2.copyMakeBorder(
            resized,
            pad_top, pad_bottom, pad_left, pad_right,
            borderType=cv2.BORDER_CONSTANT,
            value=[0, 0, 0]
        )

        metadata = {
            "original_size": (w, h),
            "scale": scale,
            "padding": (pad_left, pad_top, pad_right, pad_bottom)
        }
        return padded, metadata

    def sanitize_exif(self, image_path: str, output_path: str) -> None:
        """
        Loads an image, strips all EXIF tags, GPS metadata, and device identifiers
        to ensure strict HIPAA/DPDP patient privacy compliance.
        """
        with Image.open(image_path) as img:
            data = list(img.getdata())
            clean_img = Image.new(img.mode, img.size)
            clean_img.putdata(data)
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            clean_img.save(output_path, "JPEG", quality=95)

    def preprocess_for_inference(
        self,
        image_input: Any,
        enhance: bool = True
    ) -> Tuple[Image.Image, Dict[str, Any]]:
        """
        End-to-end preprocessing pipeline for MedGemma multimodal processor.
        Accepts file path, PIL Image, or numpy array. Returns standardized PIL RGB Image.
        """
        if isinstance(image_input, str):
            image_bgr = cv2.imread(image_input)
            if image_bgr is None:
                raise ValueError(f"Could not load image from {image_input}")
        elif isinstance(image_input, Image.Image):
            image_bgr = cv2.cvtColor(np.array(image_input), cv2.COLOR_RGB2BGR)
        elif isinstance(image_input, np.ndarray):
            if len(image_input.shape) == 3 and image_input.shape[2] == 3:
                image_bgr = image_input
            else:
                raise ValueError("Numpy image array must have shape (H, W, 3)")
        else:
            raise TypeError("Unsupported image input type")

        orig_h, orig_w = image_bgr.shape[:2]

        # Contrast enhancement
        processed_bgr = self.apply_clahe(image_bgr) if enhance else image_bgr

        # Resize with padding
        standardized_bgr, pad_meta = self.resize_with_pad(processed_bgr, self.target_size)

        # Convert to RGB PIL Image
        rgb = cv2.cvtColor(standardized_bgr, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(rgb)

        meta = {
            "original_resolution": f"{orig_w}x{orig_h}",
            "standardized_resolution": f"{self.target_size[0]}x{self.target_size[1]}",
            "clahe_applied": enhance,
            "padding_metadata": pad_meta
        }
        return pil_img, meta

