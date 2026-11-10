"""
Aarogya Drishti - MedGemma 1.5 4B AI Workspace
Colab Bundle Packager: Assembles 1-Click Fine-Tuning Archive for Google Colab / Cloud GPU
"""

import os
import zipfile
import json
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("ColabPackager")

WORKSPACE = r"c:\Users\AI PC\Desktop\hackathon\AAROGYA-AI-WORKSPACE"
OUTPUT_ZIP = os.path.join(WORKSPACE, "Aarogya_Drishti_Colab_FineTuning_Bundle.zip")

def package_colab_bundle():
    logger.info("Assembling Google Colab Fine-Tuning Execution Bundle...")

    files_to_pack = [
        # Colab Notebook
        ("training/notebooks/MedGemma_1_5_4B_Oral_FineTuning_Colab.ipynb", "MedGemma_1_5_4B_Oral_FineTuning_Colab.ipynb"),
        # Configuration
        ("training/configs/qlora_medgemma_config.json", "qlora_medgemma_config.json"),
        # Multimodal splits
        ("datasets/curated-multimodal/train.jsonl", "data/train.jsonl"),
        ("datasets/curated-multimodal/val.jsonl", "data/val.jsonl"),
        ("datasets/curated-multimodal/test.jsonl", "data/test.jsonl"),
        ("datasets/curated-multimodal/dataset_summary.json", "data/dataset_summary.json"),
        # Manifests
        ("datasets/manifests/master_dataset_manifest.json", "data/master_dataset_manifest.json"),
        # Requirements
        ("requirements.txt", "requirements.txt")
    ]

    with zipfile.ZipFile(OUTPUT_ZIP, "w", zipfile.ZIP_DEFLATED) as zipf:
        # Pack files
        for rel_src, arcname in files_to_pack:
            full_src = os.path.join(WORKSPACE, rel_src)
            if os.path.exists(full_src):
                zipf.write(full_src, arcname)
                logger.info(f"Packed: {arcname}")
            else:
                logger.warning(f"File missing: {full_src}")

        # Pack curated images
        images_dir = os.path.join(WORKSPACE, "datasets", "curated-multimodal", "images")
        if os.path.exists(images_dir):
            count = 0
            for fname in os.listdir(images_dir):
                if fname.lower().endswith(('.jpg', '.jpeg', '.png')):
                    full_p = os.path.join(images_dir, fname)
                    zipf.write(full_p, f"data/images/{fname}")
                    count += 1
            logger.info(f"Packed {count} curated original clinical images into data/images/")

    bundle_size_mb = os.path.getsize(OUTPUT_ZIP) / (1024**2)
    logger.info(f"Colab bundle generated successfully: {OUTPUT_ZIP} ({bundle_size_mb:.2f} MB)")
    return OUTPUT_ZIP, bundle_size_mb

if __name__ == "__main__":
    package_colab_bundle()

