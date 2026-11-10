"""
Aarogya Drishti - MedGemma 1.5 4B AI Workspace
Preprocessing: Image Integrity, Quality, EXIF & Resolution Audit Suite
"""

import os
import hashlib
import json
from collections import Counter
from typing import Dict, Any, List, Tuple
from PIL import Image, ExifTags
import cv2
import numpy as np

class ImageAuditor:
    """
    Performs comprehensive verification of medical intraoral photography:
    - Byte integrity and corrupted stream detection
    - SHA-256 exact duplication tracking
    - Resolution and aspect ratio profiling
    - OpenCV Laplacian focus sharpness variance
    - Exposure and specular glare computation
    - EXIF metadata and privacy leakage inspection
    """

    def __init__(self, target_size: Tuple[int, int] = (448, 448)):
        self.target_size = target_size

    def compute_sha256(self, file_path: str) -> str:
        sha256 = hashlib.sha256()
        with open(file_path, "rb") as f:
            while chunk := f.read(65536):
                sha256.update(chunk)
        return sha256.hexdigest()

    def audit_single_image(self, file_path: str) -> Dict[str, Any]:
        result = {
            "file_path": file_path,
            "filename": os.path.basename(file_path),
            "valid": False,
            "corrupted": False,
            "sha256": None,
            "format": None,
            "dimensions": None,
            "aspect_ratio": None,
            "color_mode": None,
            "channels": 0,
            "laplacian_variance": 0.0,
            "mean_brightness": 0.0,
            "glare_percentage": 0.0,
            "has_exif": False,
            "exif_tags_count": 0,
            "exif_keys": [],
            "error": None
        }

        # 1. Byte existence and hash
        if not os.path.exists(file_path) or os.path.getsize(file_path) == 0:
            result["error"] = "File missing or zero bytes"
            result["corrupted"] = True
            return result

        try:
            result["sha256"] = self.compute_sha256(file_path)
        except Exception as e:
            result["error"] = f"Hashing error: {e}"
            result["corrupted"] = True
            return result

        # 2. PIL Verification
        try:
            with Image.open(file_path) as img:
                img.verify()
        except Exception as e:
            result["error"] = f"PIL verify failed: {e}"
            result["corrupted"] = True
            return result

        # 3. Decode Pixel Buffer with PIL
        try:
            with Image.open(file_path) as img:
                result["format"] = img.format
                w, h = img.size
                result["dimensions"] = (w, h)
                result["aspect_ratio"] = round(w / h, 3) if h > 0 else 0
                result["color_mode"] = img.mode

                # EXIF Inspection
                exif_data = img.getexif()
                if exif_data and len(exif_data) > 0:
                    result["has_exif"] = True
                    result["exif_tags_count"] = len(exif_data)
                    result["exif_keys"] = [ExifTags.TAGS.get(k, str(k)) for k in list(exif_data.keys())[:5]]
        except Exception as e:
            result["error"] = f"PIL decode failed: {e}"
            result["corrupted"] = True
            return result

        # 4. OpenCV Verification & Image Quality
        try:
            cv_img = cv2.imread(file_path)
            if cv_img is None:
                result["error"] = "OpenCV imread returned None"
                result["corrupted"] = True
                return result

            result["channels"] = cv_img.shape[2] if len(cv_img.shape) == 3 else 1

            gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
            lap_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
            result["laplacian_variance"] = round(lap_var, 2)

            mean_bright = float(np.mean(gray))
            result["mean_brightness"] = round(mean_bright, 2)

            glare_mask = gray >= 250
            glare_ratio = float(np.count_nonzero(glare_mask) / (w * h))
            result["glare_percentage"] = round(glare_ratio * 100, 2)

            result["valid"] = True
        except Exception as e:
            result["error"] = f"OpenCV quality analysis failed: {e}"
            result["corrupted"] = True

        return result

    def audit_directory(self, image_dir: str) -> Dict[str, Any]:
        """Audits all images in a directory and returns summary metrics."""
        image_files = [
            os.path.join(image_dir, f)
            for f in os.listdir(image_dir)
            if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))
        ]

        total_files = len(image_files)
        valid_files = 0
        corrupted_files = 0
        hash_dict = {}
        duplicates = []
        formats = Counter()
        resolutions = Counter()
        exif_found_count = 0
        sharpness_list = []
        brightness_list = []
        glare_list = []

        detailed_results = []

        for idx, fpath in enumerate(image_files, 1):
            info = self.audit_single_image(fpath)
            detailed_results.append(info)

            if info["valid"]:
                valid_files += 1
                formats[info["format"]] += 1
                resolutions[info["dimensions"]] += 1
                sharpness_list.append(info["laplacian_variance"])
                brightness_list.append(info["mean_brightness"])
                glare_list.append(info["glare_percentage"])

                if info["has_exif"]:
                    exif_found_count += 1

                sha = info["sha256"]
                if sha in hash_dict:
                    duplicates.append((fpath, hash_dict[sha]))
                else:
                    hash_dict[sha] = fpath
            else:
                corrupted_files += 1

        summary = {
            "total_images_scanned": total_files,
            "valid_images": valid_files,
            "corrupted_images": corrupted_files,
            "unique_images": len(hash_dict),
            "duplicate_count": len(duplicates),
            "duplicates": duplicates,
            "formats_breakdown": dict(formats),
            "top_10_resolutions": resolutions.most_common(10),
            "exif_metadata_present_count": exif_found_count,
            "mean_laplacian_sharpness": round(float(np.mean(sharpness_list)), 2) if sharpness_list else 0.0,
            "mean_brightness": round(float(np.mean(brightness_list)), 2) if brightness_list else 0.0,
            "mean_glare_percentage": round(float(np.mean(glare_list)), 2) if glare_list else 0.0,
            "quality_status": "EXCELLENT" if corrupted_files == 0 and len(duplicates) == 0 else "WARNING"
        }
        return summary, detailed_results

