import base64
import json
import urllib.request
from pathlib import Path

img_path = Path("C:/Users/AI PC/Downloads/B Market _ Fresh Local Products_files/2.webp")
with open(img_path, "rb") as f:
    b64 = base64.b64encode(f.read()).decode("utf-8")

payload = {
    "imageBase64": f"data:image/webp;base64,{b64}",
    "site": "Right Buccal Mucosa",
    "history": "Non-scrapable thick white patch on right buccal mucosa for > 3 weeks; mild burning sensation with spicy food.",
    "age": 46,
    "patientName": "Kondala Rao"
}

data = json.dumps(payload).encode("utf-8")
req = urllib.request.Request(
    "http://127.0.0.1:8002/analyze",
    data=data,
    headers={"Content-Type": "application/json"}
)

try:
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read().decode("utf-8"))
        print("=== LIVE API RESPONSE (STATUS 200 OK) ===")
        print("Mode:", result.get("mode"))
        print("Model Loaded:", result.get("modelLoaded"))
        print("Quality Verdict:", result.get("qualityVerdict"))
        
        findings = result.get("findings", {})
        print("Model Name:", findings.get("model"))
        print("Inference Source:", findings.get("inferenceSource"))
        print("Actual Weights Loaded:", findings.get("actualWeightsLoaded"))
        print("Actual Model Executed:", findings.get("actualModelGenerateExecuted"))
        print("Model Confidence:", findings.get("modelConfidence"))
        print("Model Probabilities:", findings.get("modelProbabilities"))
        print("Standard Category:", findings.get("standardCategory"))
        print("Standard Category Title:", findings.get("standardCategoryTitle"))
        
        basic = findings.get("basicClinicalAnswer", {})
        print("\nHero Category (En):", basic.get("heroCategoryEn"))
        print("Hero Category (Te):", basic.get("heroCategoryTe"))
        print("Primary Condition:", basic.get("primaryCondition"))
        print("Triage Urgency:", basic.get("triageUrgency"))
        print("Plain Answer (En):", basic.get("plainAnswerEn"))
        
        vis = findings.get("visualEvidence", {})
        print("\nVisual Evidence Disagreement:", vis.get("hasDisagreement"))
        print("Model Visual Site:", vis.get("modelVisualSite"))
        print("Health Worker Site:", vis.get("healthWorkerProvidedSite"))
        print("Discrepancy Notice:", vis.get("discrepancyNotice"))
        print("Visible Characteristics:")
        for vc in vis.get("visibleCharacteristics", []):
            print("  *", vc)

except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code, e.read().decode("utf-8"))
except Exception as e:
    print("Error:", e)
