"""
Aarogya Drishti - MedGemma 1.5 4B AI Workspace
Preprocessing: Dataset Validator & Zero-Leakage Verifier
"""

import json
import os
from typing import Dict, List, Set, Any

class DatasetValidator:
    """
    Validates multimodal instruction-tuning datasets for MedGemma 1.5 4B.
    Enforces strict patient-level separation, schema consistency, and ground truth integrity.
    """

    REQUIRED_KEYS = {"id", "patient_id", "category", "messages"}

    def __init__(self, workspace_root: str):
        self.workspace_root = workspace_root

    def validate_split_file(self, jsonl_path: str) -> Dict[str, Any]:
        """
        Validates individual split JSONL file for schema conformance and image availability.
        """
        if not os.path.exists(jsonl_path):
            return {"valid": False, "error": f"File not found: {jsonl_path}"}

        records = []
        patient_ids = set()
        categories = {}
        missing_images = []
        invalid_format_rows = []

        with open(jsonl_path, "r", encoding="utf-8") as f:
            for idx, line in enumerate(f, 1):
                line = line.strip()
                if not line:
                    continue
                try:
                    data = json.loads(line)
                except Exception as e:
                    invalid_format_rows.append((idx, f"Invalid JSON: {e}"))
                    continue

                # Check keys
                missing = self.REQUIRED_KEYS - set(data.keys())
                if missing:
                    invalid_format_rows.append((idx, f"Missing required keys: {missing}"))
                    continue

                patient_id = data.get("patient_id")
                patient_ids.add(patient_id)

                cat = data.get("category", "unknown")
                categories[cat] = categories.get(cat, 0) + 1

                # Verify image path if present
                img_path = data.get("image_path")
                if img_path:
                    # Resolve relative to curated-multimodal or workspace
                    full_img_path = os.path.join(os.path.dirname(jsonl_path), img_path)
                    if not os.path.exists(full_img_path):
                        # Try relative to workspace
                        full_img_path = os.path.join(self.workspace_root, img_path)
                        if not os.path.exists(full_img_path):
                            missing_images.append(img_path)

                records.append(data)

        return {
            "valid": len(invalid_format_rows) == 0,
            "total_records": len(records),
            "unique_patients": len(patient_ids),
            "categories": categories,
            "patient_ids": list(patient_ids),
            "missing_images_count": len(missing_images),
            "missing_sample_images": missing_images[:5],
            "invalid_format_count": len(invalid_format_rows),
            "invalid_format_errors": invalid_format_rows[:5]
        }

    def verify_zero_patient_leakage(
        self,
        train_jsonl: str,
        val_jsonl: str,
        test_jsonl: str
    ) -> Dict[str, Any]:
        """
        Verifies that no patient appears in more than one partition (train/val/test).
        """
        train_res = self.validate_split_file(train_jsonl)
        val_res = self.validate_split_file(val_jsonl)
        test_res = self.validate_split_file(test_jsonl)

        train_patients = set(train_res.get("patient_ids", []))
        val_patients = set(val_res.get("patient_ids", []))
        test_patients = set(test_res.get("patient_ids", []))

        train_val_overlap = train_patients.intersection(val_patients)
        train_test_overlap = train_patients.intersection(test_patients)
        val_test_overlap = val_patients.intersection(test_patients)

        total_overlap = len(train_val_overlap) + len(train_test_overlap) + len(val_test_overlap)
        zero_leakage = (total_overlap == 0)

        return {
            "zero_leakage_verified": zero_leakage,
            "train_patient_count": len(train_patients),
            "val_patient_count": len(val_patients),
            "test_patient_count": len(test_patients),
            "total_unique_patients": len(train_patients | val_patients | test_patients),
            "train_val_overlap": list(train_val_overlap),
            "train_test_overlap": list(train_test_overlap),
            "val_test_overlap": list(val_test_overlap),
            "assessment": "PASSED: Strict patient-level segregation confirmed." if zero_leakage else "FAILED: Patient leakage detected across splits."
        }

