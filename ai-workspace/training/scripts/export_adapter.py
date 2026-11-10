
"""
Aarogya Drishti - MedGemma 1.5 4B AI Workspace
Export & Merge Utility: Merges LoRA Adapter into Standalone Base Model
Supports high-throughput serving with vLLM, TGI, or FastAPI
"""

import os
import sys
import json
import argparse
import logging
from typing import Dict, Any, Optional

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("MedGemmaExporter")

def parse_args():
    parser = argparse.ArgumentParser(description="Export and Merge MedGemma LoRA Adapter")
    parser.add_argument("--base_model_id", type=str, default="google/medgemma-1.5-4b-it", help="Base model Hugging Face ID")
    parser.add_argument("--adapter_dir", type=str, default="model_weights/fine_tuned/medgemma-oral-lora", help="Path to saved LoRA adapter")
    parser.add_argument("--output_dir", type=str, default="model_weights/fine_tuned/medgemma-1.5-4b-oral-merged", help="Output directory for merged model")
    parser.add_argument("--merge", action="store_true", help="Merge adapter weights into base model (requires GPU/RAM)")
    parser.add_argument("--dry_run", action="store_true", help="Validate adapter files without performing weight merge")
    return parser.parse_args()

def validate_adapter_directory(adapter_dir: str) -> Dict[str, Any]:
    """Inspects adapter directory for required Hugging Face PEFT files."""
    # Resolve candidate paths
    candidates = [
        adapter_dir,
        os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), adapter_dir)
    ]
    resolved_dir = None
    for c in candidates:
        if os.path.exists(c):
            resolved_dir = c
            break

    if not resolved_dir:
        return {"valid": False, "error": f"Adapter directory does not exist: {adapter_dir}"}

    files = os.listdir(resolved_dir)
    has_config = "adapter_config.json" in files
    has_weights = any("adapter_model" in f for f in files)

    config_data = {}
    if has_config:
        try:
            with open(os.path.join(adapter_dir, "adapter_config.json"), "r", encoding="utf-8") as f:
                config_data = json.load(f)
        except Exception as e:
            logger.warning(f"Could not parse adapter_config.json: {e}")

    return {
        "valid": has_config and has_weights,
        "has_adapter_config": has_config,
        "has_adapter_weights": has_weights,
        "adapter_files": files,
        "base_model_name_or_path": config_data.get("base_model_name_or_path"),
        "peft_type": config_data.get("peft_type", "LORA"),
        "r": config_data.get("r"),
        "lora_alpha": config_data.get("lora_alpha"),
        "target_modules": config_data.get("target_modules")
    }

def main():
    args = parse_args()
    logger.info("Initializing MedGemma Adapter Exporter...")

    adapter_status = validate_adapter_directory(args.adapter_dir)
    logger.info(f"Adapter directory status: {adapter_status['valid']}")

    if not adapter_status["valid"]:
        logger.warning(f"Adapter validation notice: {adapter_status.get('error', 'Incomplete adapter files')}")
        logger.info("Pre-flight export manifest created for post-training pipeline.")

    export_manifest = {
        "export_utility": "Aarogya Drishti MedGemma Exporter v1.0",
        "base_model": args.base_model_id,
        "adapter_directory": args.adapter_dir,
        "target_output_directory": args.output_dir,
        "merge_requested": args.merge,
        "adapter_validation": adapter_status,
        "serving_compatibility": {
            "peft_standalone": True,
            "vllm_supported": True,
            "fastapi_integration": True,
            "huggingface_pipeline": True
        }
    }

    manifest_path = os.path.join("deployment", "export_manifest.json")
    os.makedirs("deployment", exist_ok=True)
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(export_manifest, f, indent=2)
    logger.info(f"Export manifest saved to {manifest_path}")

    if args.dry_run or not args.merge:
        logger.info("Dry-run/Metadata mode completed. To perform full weight merging, launch with --merge on a GPU host.")
        return

    # Full weight merge (on GPU host)
    import torch
    from transformers import AutoProcessor, AutoModelForImageTextToText
    from peft import PeftModel

    logger.info(f"Loading base model: {args.base_model_id} in bfloat16...")
    base_model = AutoModelForImageTextToText.from_pretrained(
        args.base_model_id,
        torch_dtype=torch.bfloat16,
        device_map="auto",
        trust_remote_code=True
    )
    processor = AutoProcessor.from_pretrained(args.base_model_id, trust_remote_code=True)

    logger.info(f"Loading and attaching LoRA adapter: {args.adapter_dir}...")
    peft_model = PeftModel.from_pretrained(base_model, args.adapter_dir)

    logger.info("Merging LoRA weights into base model parameters...")
    merged_model = peft_model.merge_and_unload()

    logger.info(f"Saving merged standalone model to: {args.output_dir}...")
    os.makedirs(args.output_dir, exist_ok=True)
    merged_model.save_pretrained(args.output_dir)
    processor.save_pretrained(args.output_dir)

    logger.info("Export and merge successfully completed!")

if __name__ == "__main__":
    main()

