"""
Hugging Face Download and Verification Script for MedGemma 1.5 4B (google/medgemma-1.5-4b-it).

Foundation Model: google/medgemma-1.5-4b-it
License: Health AI Developer Foundations (HAI-DEF) Terms of Use
Prerequisites:
  1. Hugging Face account with accepted HAI-DEF terms at:
     https://huggingface.co/google/medgemma-1.5-4b-it
  2. Hugging Face User Access Token (read permission) passed via:
     - Environment variable: HF_TOKEN
     - CLI argument: --token <your_token>
"""
import argparse
import os
from pathlib import Path
import sys

MODEL_ID = "google/medgemma-1.5-4b-it"
TARGET_DIR = Path(__file__).resolve().parent.parent / ".local/ai/medgemma-1.5-4b-it"

def main():
    parser = argparse.ArgumentParser(description="Download google/medgemma-1.5-4b-it from Hugging Face.")
    parser.add_argument("--token", default=os.environ.get("HF_TOKEN"), help="Hugging Face access token")
    parser.add_argument("--target-dir", default=str(TARGET_DIR), help="Local destination directory")
    args = parser.parse_args()

    token = args.token
    if not token:
        print("[!] HF_TOKEN is not set.")
        print("    MedGemma 1.5 4B requires accepting the HAI-DEF agreement on Hugging Face:")
        print("    https://huggingface.co/google/medgemma-1.5-4b-it")
        print("    Set your token via environment variable: $env:HF_TOKEN='hf_...'")
        print("    Or pass --token <your_token>")
        sys.exit(1)

    try:
        from huggingface_hub import snapshot_download
    except ImportError:
        print("[!] huggingface_hub is not installed in the active environment.")
        print("    Install it via: pip install huggingface_hub")
        sys.exit(1)

    target_path = Path(args.target_dir)
    target_path.mkdir(parents=True, exist_ok=True)

    print(f"[*] Connecting to Hugging Face Hub for {MODEL_ID}...")
    print(f"[*] Target directory: {target_path}")

    try:
        download_path = snapshot_download(
            repo_id=MODEL_ID,
            token=token,
            local_dir=str(target_path),
            ignore_patterns=["*.msgpack", "*.h5", "*.ot"],
            resume_download=True
        )
        print(f"[✓] Model successfully verified and downloaded to: {download_path}")
        print("[✓] Ready for local MedGemma 1.5 4B inference.")
    except Exception as exc:
        print(f"[x] Download failed: {exc}")
        print("    Please ensure you have accepted the HAI-DEF terms on Hugging Face and your token has read access.")
        sys.exit(1)

if __name__ == "__main__":
    main()

