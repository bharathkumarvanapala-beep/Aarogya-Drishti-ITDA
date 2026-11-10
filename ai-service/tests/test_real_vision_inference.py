import sys
import json
from pathlib import Path

sys.path.insert(0, "C:/Users/AI PC/Documents/aarogya/Aarogya-Drishti-ITDA/ai-service")
import medgemma_service

img_path = Path("C:/Users/AI PC/Downloads/B Market _ Fresh Local Products_files/2.webp")
if not img_path.exists():
    print("Image not found at:", img_path)
    sys.exit(1)

with open(img_path, "rb") as f:
    photo_bytes = f.read()

res = medgemma_service.analyze_clinical_features(
    photo_bytes=photo_bytes,
    site="Right Buccal Mucosa",
    history="Non-scrapable thick white patch on right buccal mucosa for > 3 weeks; mild burning sensation with spicy food.",
    age=46
)

print("=== MODEL & INFERENCE SOURCE ===")
print("Model:", res.get("model"))
print("Revision:", res.get("revision"))
print("Inference Source:", res.get("inferenceSource"))
print("Execution Mode:", res.get("executionMode"))
print("Actual Weights Loaded:", res.get("actualWeightsLoaded"))
print("Actual Model Executed:", res.get("actualModelGenerateExecuted"))
print("Model Confidence:", res.get("modelConfidence"))
print("Model Probabilities:", res.get("modelProbabilities"))
print("Pixel Telemetry:", res.get("pixelTelemetry"))

print("\n=== ANATOMICAL AUDIT ===")
print("Site Concordance:", res.get("anatomicalSiteConcordance"))
print("Discrepancy Flag:", res.get("hasAnatomicalDiscrepancy"))
print("Detected Site:", res.get("modelDetectedSite"))
print("Discrepancy Notice:", res.get("anatomicalDiscrepancyNotice"))

print("\n=== OBSERVABLE FEATURES ===")
obs = res.get("observableFeatures", {})
for k, v in obs.items():
    print(f"  {k}: {v}")

print("\n=== PRIMARY SUSPICION / CATEGORY ===")
print("Category:", res.get("suspicionCategory"))
print("Preliminary:", res.get("preliminaryImpression"))
