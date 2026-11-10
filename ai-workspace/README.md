# 🔬 Aarogya Drishti – MedGemma 1.5 4B AI Workspace

This repository houses the dedicated, independent development, fine-tuning, and clinical evaluation environment for **Google MedGemma 1.5 4B IT** (`google/medgemma-1.5-4b-it`) specialized for oral potentially malignant disorders (OPMD) and oral cavity cancer detection in tribal populations of Alluri Sitharama Raju (ASR) District.

---

## 📁 Workspace Architecture

```
AAROGYA-AI-WORKSPACE/
├── datasets/
│   ├── raw/                      # Original public dataset archives (Mendeley, SMART-OM)
│   ├── processed/                # CLAHE-enhanced & standardized images (448x448)
│   ├── annotated/                # VIA polygon contours & clinical bounding annotations
│   ├── dataset_metadata/         # Patient demographics, risk habits, and biopsy findings
│   └── curated-multimodal/       # Zero-leakage train.jsonl, val.jsonl, test.jsonl
├── preprocessing/
│   ├── image_processing/         # CLAHE enhancement, aspect-preserving pad, EXIF sanitizer
│   ├── image_quality/            # OpenCV Laplacian focus, illumination, and mucosal glare gate
│   └── data_validation/          # Schema conformance & patient-level split validator
├── training/
│   ├── notebooks/                # Google Colab T4/L4 fine-tuning notebook
│   ├── scripts/                  # 4-Bit QLoRA fine-tuning training script
│   ├── configs/                  # LoRA rank, alpha, target modules, and training hyperparameters
│   └── checkpoints/              # Model weights checkpoints and training logs
├── evaluation/
│   ├── baseline/                 # Zero-shot pretrained MedGemma evaluation runner
│   ├── fine_tuned/               # Comparison and delta performance analysis scripts
│   ├── metrics/                  # Clinical evaluation suite (Sensitivity, Specificity, F1, ECE)
│   └── reports/                  # Phase 10 Baseline & Phase 12 Fine-Tuned Clinical Validation Reports
│       ├── phase12_evaluation_report.md
│       ├── phase12_baseline_vs_finetuned_comparison.md
│       ├── phase12_confusion_matrices.json
│       ├── phase12_metrics.json
│       ├── phase12_clinical_safety_report.md
│       ├── phase12_error_analysis.md
│       └── phase12_reproducibility_and_deployment.md
├── model_weights/
│   ├── pretrained/               # Pretrained base model cache (or symlink)
│   └── fine_tuned/               # Saved PEFT / LoRA adapter checkpoints (medgemma-oral-lora)
├── deployment/                   # FastAPI microservice (port 8001), Dockerfile, and export configs
│   ├── medgemma_service_fastapi.py # Production FastAPI serving engine with fallback
│   ├── deployment_config.json    # Port, host, CORS, model paths
│   ├── Dockerfile                # CUDA 12.1 + PyTorch production container
│   ├── docker-compose.ai.yml     # Multi-container orchestration
│   └── export_manifest.json      # Standalone model export schema
├── Aarogya_Drishti_Colab_FineTuning_Bundle.zip # 555.57 MB 1-click execution package for Google Colab
└── documentation/
    ├── automated_execution_report.md # Automated Phase 12 execution preparation & status
    ├── remaining_blockers.md     # Exact hardware, token, and cloud execution blockers
    ├── phase11_finetuning_guide.md # Comprehensive Phase 11 engineering manual
    ├── colab_training_walkthrough.md # Step-by-step 1-click Colab guide
    ├── deployment_guide.md       # Microservice and frontend integration architecture
    ├── training_plan.md          # End-to-end clinical fine-tuning strategy
    ├── dataset_manifest.md       # Curated oral lesion dataset provenance and splits
    └── evaluation_protocol.md    # Metrics, safety guardrails, and validation standards
```

---

## ⚡ Hardware & Compute Requirements

| Component | Minimum Requirement | Recommended Production / Cloud Compute |
|---|---|---|
| **Inference (4-Bit QLoRA)** | 6 GB VRAM (RTX 3050, T4) | 16 GB VRAM (NVIDIA T4 or L4) |
| **Fine-Tuning (4-Bit QLoRA)** | 12 GB VRAM | 16–24 GB VRAM (Google Colab T4 / L4 / A10G) |
| **Full Precision Fine-Tuning** | 48 GB VRAM | 80 GB VRAM (NVIDIA A100 / H100) |
| **Local Host Status** | Windows 11 / AMD64 (CPU-Only) | **Pre-flight code & validation verified locally; training executes on Google Colab / Cloud GPU** |

---

## 📦 1-Click Google Colab Fine-Tuning Package

A standalone, fully self-contained bundle is ready for execution on a free Google Colab NVIDIA T4 GPU:
- **Archive**: `Aarogya_Drishti_Colab_FineTuning_Bundle.zip` (**555.57 MB**)
- **Contents**:
  - `MedGemma_1_5_4B_Oral_FineTuning_Colab.ipynb` (interactive training and evaluation notebook)
  - `qlora_medgemma_config.json` (hyperparameters and target modules)
  - `data/train.jsonl`, `data/val.jsonl`, `data/test.jsonl` (zero-leakage splits)
  - `data/images/` (all 2,791 curated and quality-checked clinical photos)
  - `requirements.txt`
- **Execution Guide**: Follow the step-by-step instructions in [`documentation/colab_training_walkthrough.md`](documentation/colab_training_walkthrough.md).

---

## 🛡️ Clinical Safety & HAI-DEF Mandates

1. **Non-Diagnostic Decision Support**: MedGemma outputs clinical descriptions, anatomical concordance, and ICD-10 differentials. It **never provides standalone medical diagnosis**.
2. **`score: null` Strictly Enforced**: Artificial pseudo-probability percentages (e.g. "87.4% cancer probability") are strictly prohibited.
3. **Medical Officer Oversight**: All outputs require validation by the Medical Officer (Dr. Suresh) before clinical action.
4. **Mandatory Biopsy Notice**: Invasive lesion suspicion mandates in-person clinical palpation, cervical lymph node staging, and confirmatory scalpel biopsy at District Hospital Paderu.

---

## 🚀 Quick Start (Pre-flight Validation & Serving)

```bash
# Verify dataset zero-leakage and schema conformance
python preprocessing/data_validation/dataset_validator.py

# Test image quality gate on sample images
python preprocessing/image_quality/quality_gate.py

# Run pre-flight training dry-run
python training/scripts/train_medgemma_qlora.py --dry_run

# Validate PEFT adapter files and generate export manifest
python training/scripts/export_adapter.py --dry_run

# Run benchmark setup and acceptance criteria evaluation
python evaluation/fine_tuned/infer_finetuned.py --dry_run

# Launch production FastAPI microservice (port 8001)
python deployment/medgemma_service_fastapi.py
```

