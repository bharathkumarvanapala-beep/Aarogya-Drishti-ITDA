"""
Aarogya Drishti - Oral Mucosal Classifier Training
Fine-tunes MobileNetV3-Small on curated oral lesion dataset for real multimodal inference.
"""

import json
import os
import time
from pathlib import Path
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
import torchvision.transforms as T
import torchvision.models as models
from PIL import Image

WORKSPACE_DIR = Path("C:/Users/AI PC/Desktop/hackathon/AAROGYA-AI-WORKSPACE")
DATASET_DIR = WORKSPACE_DIR / "datasets/curated-multimodal"
IMAGES_DIR = DATASET_DIR / "images"
TRAIN_JSONL = DATASET_DIR / "train.jsonl"
VAL_JSONL = DATASET_DIR / "val.jsonl"

TARGET_MODEL_PATH = Path("C:/Users/AI PC/Documents/aarogya/Aarogya-Drishti-ITDA/ai-service/oral_classifier_best.pt")
TARGET_META_PATH = Path("C:/Users/AI PC/Documents/aarogya/Aarogya-Drishti-ITDA/ai-service/classifier_meta.json")

CLASSES = ["normal", "benign", "variation", "opmd", "malignancy_suspected"]
CLASS_TO_IDX = {c: i for i, c in enumerate(CLASSES)}

class OralDataset(Dataset):
    def __init__(self, records, transform=None):
        self.records = records
        self.transform = transform

    def __len__(self):
        return len(self.records)

    def __getitem__(self, idx):
        item = self.records[idx]
        img_name = os.path.basename(item["image_path"])
        full_path = IMAGES_DIR / img_name
        try:
            image = Image.open(full_path).convert("RGB")
        except Exception:
            image = Image.new("RGB", (224, 224), color=(200, 100, 100))
        
        if self.transform:
            image = self.transform(image)
        
        label = CLASS_TO_IDX.get(item["category"], 0)
        return image, torch.tensor(label, dtype=torch.long)

def load_balanced_records(jsonl_path, max_normal=350):
    records = []
    normal_count = 0
    with open(jsonl_path, "r", encoding="utf-8") as f:
        for line in f:
            item = json.loads(line)
            cat = item.get("category")
            if cat not in CLASS_TO_IDX:
                continue
            img_name = os.path.basename(item["image_path"])
            if not (IMAGES_DIR / img_name).exists():
                continue
            
            if cat == "normal":
                if normal_count >= max_normal:
                    continue
                normal_count += 1
            records.append(item)
    return records

def train():
    print("[*] Loading dataset records...")
    train_records = load_balanced_records(TRAIN_JSONL, max_normal=350)
    val_records = load_balanced_records(VAL_JSONL, max_normal=100)
    print(f"[*] Train samples: {len(train_records)}, Val samples: {len(val_records)}")

    train_tf = T.Compose([
        T.Resize((224, 224)),
        T.RandomHorizontalFlip(),
        T.ColorJitter(brightness=0.15, contrast=0.15, saturation=0.15),
        T.ToTensor(),
        T.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    val_tf = T.Compose([
        T.Resize((224, 224)),
        T.ToTensor(),
        T.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    train_loader = DataLoader(OralDataset(train_records, train_tf), batch_size=32, shuffle=True, num_workers=0)
    val_loader = DataLoader(OralDataset(val_records, val_tf), batch_size=32, shuffle=False, num_workers=0)

    print("[*] Initializing MobileNetV3-Small backbone...")
    model = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)
    
    # Freeze initial feature extractor layers for fast training
    for param in model.features[:8].parameters():
        param.requires_grad = False
    
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(in_features, len(CLASSES))

    criterion = nn.CrossEntropyLoss(label_smoothing=0.08)
    optimizer = torch.optim.AdamW(filter(lambda p: p.requires_grad, model.parameters()), lr=1e-3, weight_decay=1e-4)

    epochs = 4
    best_val_acc = 0.0

    print(f"[*] Starting model training for {epochs} epochs...")
    for epoch in range(1, epochs + 1):
        start_t = time.time()
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0

        for imgs, labels in train_loader:
            optimizer.zero_grad()
            outputs = model(imgs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * imgs.size(0)
            preds = outputs.argmax(dim=1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)

        train_acc = correct / max(total, 1)
        epoch_loss = running_loss / max(total, 1)

        # Validation
        model.eval()
        val_correct = 0
        val_total = 0
        with torch.no_grad():
            for imgs, labels in val_loader:
                outputs = model(imgs)
                preds = outputs.argmax(dim=1)
                val_correct += (preds == labels).sum().item()
                val_total += labels.size(0)

        val_acc = val_correct / max(val_total, 1)
        dur = round(time.time() - start_t, 1)
        print(f"Epoch {epoch}/{epochs} ({dur}s) - Train Loss: {epoch_loss:.4f}, Train Acc: {train_acc:.3f}, Val Acc: {val_acc:.3f}")

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            TARGET_MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
            torch.save(model.state_dict(), TARGET_MODEL_PATH)
            meta = {
                "architecture": "MobileNetV3-Small (Oral Mucosal Fine-Tuned)",
                "classes": CLASSES,
                "val_accuracy": float(val_acc),
                "trained_epochs": epoch,
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
                "weights_path": str(TARGET_MODEL_PATH)
            }
            with open(TARGET_META_PATH, "w") as f:
                json.dump(meta, f, indent=2)
            print(f"  [+] Saved new best model to {TARGET_MODEL_PATH} (Val Acc: {val_acc:.3f})")

    print("[*] Model training completed successfully!")

if __name__ == "__main__":
    train()

