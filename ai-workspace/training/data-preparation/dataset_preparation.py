"""
Oral Lesion Dataset Quality Inspection, Deduplication, and Stratified Splitting
"""

import os
import json
import random
from pathlib import Path
from collections import defaultdict, Counter

def prepare_splits(data_dir, output_dir, seed=42):
    random.seed(seed)
    data_dir = Path(data_dir)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    categories = ["Normal", "OLK", "OLP", "OSF", "OCA"]
    category_to_idx = {cat: i for i, cat in enumerate(categories)}
    
    # Category metadata
    category_info = {
        "Normal": {"label_idx": 0, "name": "Healthy Oral Tissue", "class_type": "benign"},
        "OLK": {"label_idx": 1, "name": "Oral Leukoplakia (White Plaque)", "class_type": "opmd"},
        "OLP": {"label_idx": 2, "name": "Oral Lichen Planus (Red & White)", "class_type": "opmd"},
        "OSF": {"label_idx": 3, "name": "Oral Submucous Fibrosis", "class_type": "opmd"},
        "OCA": {"label_idx": 4, "name": "Oral Cancer (Squamous Cell Carcinoma)", "class_type": "malignant"}
    }
    
    records = []
    hash_map = {}
    duplicates = []
    corrupted = []
    
    print("Scanning and validating all images...")
    
    from PIL import Image

    for cat in categories:
        cat_dir = data_dir / cat
        if not cat_dir.exists():
            print(f"Warning: Category folder {cat_dir} does not exist!")
            continue
            
        files = list(cat_dir.glob("*.jpg")) + list(cat_dir.glob("*.png")) + list(cat_dir.glob("*.jpeg"))
        print(f"  Found {len(files)} files for category {cat}")
        
        for f in files:
            try:
                # Check image opening and format integrity
                with Image.open(f) as img:
                    img.verify() # Verify file header and integrity
                
                # Reopen to read dimensions and compute hash
                with Image.open(f) as img:
                    w, h = img.size
                    mode = img.mode
                
                import hashlib
                with open(f, "rb") as fp:
                    fhash = hashlib.sha256(fp.read()).hexdigest()
                    
                if fhash in hash_map:
                    duplicates.append({"original": hash_map[fhash], "duplicate": str(f)})
                    continue # Skip exact binary duplicate
                hash_map[fhash] = str(f)
                
                records.append({
                    "id": f.stem,
                    "filename": f.name,
                    "filepath": str(f.resolve()),
                    "relative_path": str(f.relative_to(data_dir.parent)),
                    "category": cat,
                    "label": category_to_idx[cat],
                    "width": w,
                    "height": h,
                    "mode": mode,
                    "sha256": fhash
                })
            except Exception as e:
                corrupted.append({"file": str(f), "error": str(e)})

    print(f"\nTotal valid unique images: {len(records)}")
    print(f"Duplicates detected: {len(duplicates)}")
    print(f"Corrupted images: {len(corrupted)}")
    
    # Group by category for stratified splitting
    by_category = defaultdict(list)
    for r in records:
        by_category[r["category"]].append(r)
        
    train_records = []
    val_records = []
    test_records = []
    
    # 70% Train, 15% Validation, 15% Test
    for cat, items in by_category.items():
        random.shuffle(items)
        n = len(items)
        n_train = int(n * 0.70)
        n_val = int(n * 0.15)
        
        train_items = items[:n_train]
        val_items = items[n_train:n_train + n_val]
        test_items = items[n_train + n_val:]
        
        for item in train_items: item["split"] = "train"
        for item in val_items: item["split"] = "val"
        for item in test_items: item["split"] = "test"
        
        train_records.extend(train_items)
        val_records.extend(val_items)
        test_records.extend(test_items)
        
        print(f"  {cat}: {len(train_items)} train, {len(val_items)} val, {len(test_items)} test (Total: {n})")

    splits_data = {
        "metadata": {
            "source_dataset": "HRruiH/Dataset-of-oral-mucosal-diseases",
            "license": "Apache-2.0",
            "categories": categories,
            "category_info": category_info,
            "counts": {
                "total": len(records),
                "train": len(train_records),
                "val": len(val_records),
                "test": len(test_records)
            },
            "duplicates_removed": len(duplicates),
            "corrupted_removed": len(corrupted),
            "patient_separation_note": (
                "Patient identifiers are anonymized as sequential image IDs by the source dataset authors. "
                "Class-stratified splitting with fixed seed 42 preserves category balance across splits."
            )
        },
        "train": train_records,
        "val": val_records,
        "test": test_records
    }
    
    splits_file = output_dir / "splits.json"
    with open(splits_file, "w") as out:
        json.dump(splits_data, out, indent=2)
        
    print(f"\nSplits saved successfully to {splits_file}")
    return splits_data

if __name__ == "__main__":
    base_dir = Path(__file__).resolve().parent
    mouth_data_dir = base_dir / "data" / "mouth_data"
    prepare_splits(mouth_data_dir, base_dir / "data")

