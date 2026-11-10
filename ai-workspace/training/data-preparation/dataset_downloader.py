"""
Oral Lesion Dataset Downloader and Preprocessor
Dataset: HRruiH/Dataset-of-oral-mucosal-diseases
Academic Publication: BMC Oral Health 26, 169 (2026)
License: Apache-2.0
"""

import os
import sys
import json
import time
import zipfile
import hashlib
import urllib.request
from pathlib import Path
from collections import Counter

DATASET_URL = "https://huggingface.co/datasets/HRruiH/Dataset-of-oral-mucosal-diseases/resolve/main/mouth_data.zip"

CATEGORY_MAPPING = {
    "1": "Normal",
    "2": "OLK", # Oral Leukoplakia (White Plaques)
    "3": "OLP", # Oral Lichen Planus (Red & White Patches)
    "4": "OSF", # Oral Submucous Fibrosis
    "5": "OCA"  # Oral Cancer (Squamous Cell Carcinoma / Malignant Ulcers)
}

CATEGORY_NAMES = {
    "Normal": "Healthy Oral Tissue",
    "OLK": "Oral Leukoplakia (White Plaque / OPMD)",
    "OLP": "Oral Lichen Planus (Red Patch / OPMD)",
    "OSF": "Oral Submucous Fibrosis (Fibrous Bands / OPMD)",
    "OCA": "Oral Cancer (Malignant Lesion / Carcinoma)"
}

def compute_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def download_file(url, target_path):
    print(f"Downloading from {url} to {target_path}...")
    target_path = Path(target_path)
    target_path.parent.mkdir(parents=True, exist_ok=True)
    
    start_time = time.time()
    req = urllib.request.Request(url, headers={"User-Agent": "AarogyaDrishti-Pipeline/1.0"})
    
    with urllib.request.urlopen(req) as resp, open(target_path, "wb") as out_file:
        total_size = int(resp.headers.get("Content-Length", 0))
        downloaded = 0
        chunk_size = 1024 * 1024 # 1 MB chunks
        last_print = 0

        while True:
            chunk = resp.read(chunk_size)
            if not chunk:
                break
            out_file.write(chunk)
            downloaded += len(chunk)
            
            # Print progress every 5%
            if total_size > 0:
                pct = int((downloaded / total_size) * 100)
                if pct - last_print >= 5:
                    elapsed = time.time() - start_time
                    speed_mb = (downloaded / (1024 * 1024)) / (elapsed + 0.001)
                    print(f"  Progress: {pct}% ({downloaded / (1024*1024):.1f}/{total_size / (1024*1024):.1f} MB) at {speed_mb:.1f} MB/s")
                    last_print = pct

    print(f"Download complete in {time.time() - start_time:.1f}s!")

def extract_zip(zip_path, extract_to):
    print(f"Extracting {zip_path} to {extract_to}...")
    extract_to = Path(extract_to)
    extract_to.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_to)
    print("Extraction complete.")

def main():
    base_dir = Path(__file__).resolve().parent
    downloads_dir = base_dir / "downloads"
    data_dir = base_dir / "data"
    
    zip_path = downloads_dir / "mouth_data.zip"
    extracted_data_dir = data_dir / "mouth_data"
    
    # Check if data is already extracted
    if not extracted_data_dir.exists():
        if not zip_path.exists():
            download_file(DATASET_URL, zip_path)
        extract_zip(zip_path, data_dir)
    else:
        print(f"Data already extracted at {extracted_data_dir}")

    # Inspect images and labels
    print("\nInspecting dataset files and labels...")
    all_files = list(extracted_data_dir.rglob("*.jpg")) + list(extracted_data_dir.rglob("*.png")) + list(extracted_data_dir.rglob("*.jpeg"))
    print(f"Total image files discovered: {len(all_files)}")
    
    category_counts = Counter()
    records = []
    
    for f in all_files:
        cat = f.parent.name
        category_counts[cat] += 1
        records.append({
            "filename": f.name,
            "path": str(f.relative_to(base_dir)),
            "category": cat,
            "category_name": CATEGORY_NAMES.get(cat, cat)
        })

    print("\nCategory distribution:")
    for cat, count in sorted(category_counts.items()):
        print(f"  {cat} ({CATEGORY_NAMES.get(cat, 'Unknown')}): {count} images")

    # Save initial metadata index
    index_file = data_dir / "dataset_manifest.json"
    with open(index_file, "w") as out:
        json.dump({
            "dataset": "HRruiH/Dataset-of-oral-mucosal-diseases",
            "license": "Apache-2.0",
            "paper": "BMC Oral Health 26, 169 (2026)",
            "doi": "10.1186/s12903-025-07582-y",
            "total_images": len(all_files),
            "classes": sorted(list(category_counts.keys())),
            "counts": dict(category_counts),
            "records": records
        }, out, indent=2)

    print(f"\nManifest successfully written to {index_file}")

if __name__ == "__main__":
    main()

