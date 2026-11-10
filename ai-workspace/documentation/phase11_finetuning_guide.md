# 📋 Aarogya Drishti – Phase 11: MedGemma 1.5 4B Fine-Tuning & Production Deployment Guide

> **Target Model**: `google/medgemma-1.5-4b-it` (Google Health AI Developer Foundations)  
> **Workspace**: `c:\Users\AI PC\Desktop\hackathon\AAROGYA-AI-WORKSPACE`  
> **Target Population**: Frontline Oral Screening for ITDA Tribal Mandals (Paderu, Rampachodavaram, Chintapalli, Alluri Sitharama Raju District)  
> **Compute Target**: NVIDIA T4 GPU (Free Google Colab, 15.8 GB VRAM) / NVIDIA L4 (Cloud)  
> **Status**: **Phase 11 Production-Ready Pipeline & Colab Execution Bundle Complete**

---

## 1. Executive Summary & Objective

Phase 11 completes the end-to-end machine learning engineering lifecycle for **Google MedGemma 1.5 4B IT** oral lesion screening:
1. **Pre-flight & Zero-Leakage Dataset Packaging**: 2,791 high-resolution oral photographs categorized into 5 clinical classes (`normal`, `variation`, `benign`, `opmd`, `malignancy_suspected`) partitioned with strict patient-level isolation into Train (1,941), Val (433), and Test (417) splits.
2. **1-Click Free Colab Execution Bundle**: Generated `Aarogya_Drishti_Colab_FineTuning_Bundle.zip` (555.57 MB) containing all datasets, manifests, configs, and interactive Jupyter notebook `MedGemma_1_5_4B_Oral_FineTuning_Colab.ipynb`.
3. **PEFT / 4-Bit QLoRA Architecture**: Memory-efficient NormalFloat4 (NF4) quantization utilizing $\approx 3.8\text{ GB}$ base VRAM with trainable LoRA adapter rank $r=16, \alpha=32$ across attention and MLP projection layers ($\approx 18\text{ M}$ parameters, $<0.5\%$ of model).
4. **Adapter Export & Merge Engine**: [`export_adapter.py`](file:///c:/Users/AI%20PC/Desktop/hackathon/AAROGYA-AI-WORKSPACE/training/scripts/export_adapter.py) for validating adapter artifacts and merging LoRA weights into standalone base checkpoints for vLLM / TGI.
5. **Zero-Leakage Benchmark Suite**: [`infer_finetuned.py`](file:///c:/Users/AI%20PC/Desktop/hackathon/AAROGYA-AI-WORKSPACE/evaluation/fine_tuned/infer_finetuned.py) for evaluating sensitivity, specificity, anatomical concordance, and clinical safety compliance across 417 held-out clinical cases.
6. **Resilient Production Serving Microservice**: [`medgemma_service_fastapi.py`](file:///c:/Users/AI%20PC/Desktop/hackathon/AAROGYA-AI-WORKSPACE/deployment/medgemma_service_fastapi.py) on port `8001` with automated GPU generation and zero-downtime Clinical Decision-Support fallback.

---

## 2. Directory Taxonomy & Artifacts

```
AAROGYA-AI-WORKSPACE/
├── Aarogya_Drishti_Colab_FineTuning_Bundle.zip   # 555.57 MB 1-click execution package
├── datasets/
│   ├── curated-multimodal/
│   │   ├── train.jsonl                          # 1,941 samples (472 patients)
│   │   ├── val.jsonl                            # 433 samples (100 patients)
│   │   ├── test.jsonl                           # 417 samples (106 patients)
│   │   ├── dataset_summary.json                 # Patient and class distribution metadata
│   │   └── images/                              # 2,791 curated oral clinical images
│   ├── manifests/
│   │   ├── master_dataset_manifest.json/.md     # Unified provenance and clinical citations
│   │   ├── smart_om_manifest.json/.md           # SMART-OM (Figshare 10.6084/m9.figshare.31341790)
│   │   └── mendeley_manifest.json/.md           # Mendeley v2 (10.17632/mhjyrn35p4.2)
│   └── annotated/
│       ├── structured_annotations.jsonl         # 2,791 gold-standard records
│       └── annotation_schema.json               # Clinical data contract
├── training/
│   ├── notebooks/
│   │   └── MedGemma_1_5_4B_Oral_FineTuning_Colab.ipynb
│   ├── configs/
│   │   └── qlora_medgemma_config.json           # LoRA rank, alpha, learning rate, target modules
│   └── scripts/
│       ├── train_medgemma_qlora.py              # PyTorch + PEFT training loop with label masking
│       ├── prepare_colab_bundle.py              # Bundle generation script
│       └── export_adapter.py                    # Adapter export and merge utility
├── evaluation/
│   ├── baseline/
│   │   ├── baseline_evaluation_report.md        # Pretrained baseline evaluation audit
│   │   ├── environment_report.md                # Host hardware audit
│   │   ├── failure_cases.md                     # Pretrained zero-shot limitations
│   │   ├── inference_results.json               # Zero-shot output log
│   │   └── metrics.json                         # Baseline performance metrics
│   ├── fine_tuned/
│   │   ├── infer_finetuned.py                   # 417-test-sample benchmark runner
│   │   └── compare_models.py                    # Baseline vs Fine-tuned comparison
│   ├── metrics/
│   │   └── evaluator.py                         # Sensitivity, Specificity, F1, ECE, Safety
│   └── reports/
│       └── model_comparison_report.md           # Clinical comparison report
├── deployment/
│   ├── medgemma_service_fastapi.py              # Production FastAPI server (port 8001)
│   ├── deployment_config.json                   # Port, host, CORS, model paths
│   ├── Dockerfile                               # CUDA 12.1 + PyTorch production container
│   ├── docker-compose.ai.yml                    # Multi-container orchestration
│   └── export_manifest.json                     # Standalone model export schema
└── documentation/
    ├── phase11_finetuning_guide.md              # This comprehensive engineering manual
    ├── colab_training_walkthrough.md            # Step-by-step Colab tutorial
    ├── deployment_guide.md                      # Production deployment and API reference
    ├── training_plan.md                         # Full training strategy
    ├── dataset_manifest.md                      # Dataset manifest details
    ├── evaluation_protocol.md                   # Clinical metric formulas and protocols
    └── CLINICAL_DECISION_SUPPORT_SAFETY.md      # Safety, ethics, and regulatory guardrails
```

---

## 3. The 1-Click Google Colab Fine-Tuning Workflow

### 3.1 Why Colab T4?
- **Base Model Parameters**: 4.2 Billion (multimodal SigLIP vision encoder + Gemma-2 2B language decoder).
- **Host Limitations**: Local host is Windows 11 CPU with 2.63 GB available physical RAM (attempting local weight loading produces Windows Memory Manager `STATUS_NO_MEMORY` crash).
- **Colab T4 Hardware**: NVIDIA T4 GPU provides **15.8 GB VRAM** and 12.7 GB system RAM, entirely free of charge.
- **VRAM Budget with 4-Bit NF4**:
  - Base 4-bit model: $\approx 3.8\text{ GB}$
  - Vision encoder (bfloat16): $\approx 0.8\text{ GB}$
  - LoRA trainable adapter ($r=16$): $\approx 0.08\text{ GB}$
  - Gradient checkpoints & activations (batch size 2): $\approx 4.2\text{ GB}$
  - Optimizer states (paged AdamW 8-bit): $\approx 1.2\text{ GB}$
  - **Total Peak VRAM**: $\approx 10.08\text{ GB} \le 15.8\text{ GB}$ (Comfortable $36\%$ headroom).

### 3.2 Step-by-Step Training Execution
1. **Model Authorization**:
   - Visit [Hugging Face: google/medgemma-1.5-4b-it](https://huggingface.co/google/medgemma-1.5-4b-it).
   - Sign the Google Health AI Developer Foundations (HAI-DEF) Terms of Use.
   - Obtain user Access Token (`HF_TOKEN`) from `https://huggingface.co/settings/tokens`.
2. **Launch Colab**:
   - Open [Google Colab](https://colab.research.google.com).
   - Set Runtime to **T4 GPU** (`Runtime > Change runtime type > T4 GPU`).
   - Upload `AAROGYA-AI-WORKSPACE/training/notebooks/MedGemma_1_5_4B_Oral_FineTuning_Colab.ipynb`.
3. **Upload Dataset Bundle**:
   - Upload `AAROGYA-AI-WORKSPACE/Aarogya_Drishti_Colab_FineTuning_Bundle.zip` (555.57 MB) to Google Drive or directly to the Colab session.
   - Run unzipping cell:
     ```python
     !unzip -q Aarogya_Drishti_Colab_FineTuning_Bundle.zip -d /content/workspace
     %cd /content/workspace
     ```
4. **Authenticate & Run**:
   - Provide `HF_TOKEN` when prompted by `huggingface_hub.login()`.
   - Execute all cells sequentially.
   - The script trains for 3 epochs ($\approx 45\text{ minutes}$ on T4) with automatic checkpointing and cosine learning rate decay.
5. **Adapter Collection**:
   - Download the saved adapter directory `medgemma_oral_adapter` ($\approx 75\text{ MB}$).
   - Copy to local workspace at `AAROGYA-AI-WORKSPACE/model_weights/fine_tuned/medgemma-oral-lora`.

---

## 4. Fine-Tuning Loss Masking & Data Collator Design

In standard causal language modeling, computing loss over prompt tokens causes the model to overfit on input phrasing rather than diagnostic reasoning. 

In `train_medgemma_qlora.py`, conversational tokenization uses **assistant-only loss masking**:
- The prompt prefix `<start_of_turn>user\n<image>\n{clinical_prompt}<end_of_turn>\n<start_of_turn>model\n` is tokenized, and its target labels are filled with `-100` (PyTorch CrossEntropyLoss ignore index).
- Only the tokens in the structured 5-part assistant response are assigned active token targets:
  ```python
  labels = input_ids.clone()
  labels[:prompt_length] = -100  # Mask out user instruction and image embedding tokens
  labels[labels == pad_token_id] = -100  # Mask out padding tokens
  ```
This ensures 100% of gradient updates optimize clinical lesion descriptions, differential considerations, triage urgency, and scalpel biopsy recommendations.

---

## 5. Post-Training Clinical Evaluation Protocol

Once weights are loaded, [`infer_finetuned.py`](file:///c:/Users/AI%20PC/Desktop/hackathon/AAROGYA-AI-WORKSPACE/evaluation/fine_tuned/infer_finetuned.py) runs an automated clinical audit on the 417-sample held-out test cohort:

| Metric | Target Acceptance Criteria | Clinical Rationale |
|---|---|---|
| **High-Risk Sensitivity (OPMD + Malignancy)** | $\ge 92.0\%$ | Critical for early detection; false negatives in rural tribal areas lead to late-stage presentation. |
| **Normal Specificity** | $\ge 88.0\%$ | Prevents unnecessary anxiety and burden on secondary referral hospitals (District Hospital Paderu). |
| **Macro F1-Score** | $\ge 0.85$ | Balanced performance across all 5 classes despite dataset class imbalance. |
| **Balanced Accuracy** | $\ge 0.88$ | Accounts for minority classes (OPMD: 125 images, Suspicious: 177 images). |
| **Anatomical Concordance** | $\ge 95.0\%$ | Prediction must correspond to the correct oral landmark (buccal mucosa, tongue, floor of mouth). |
| **Diagnostic Score Policy** | `score: null` ($100\%$ compliance) | Replaces deceptive pseudo-probabilities with qualitative triage tiers. |
| **Mandatory Biopsy Notice** | $100\%$ on suspected lesions | Flags mandatory requirement for histopathological confirmation via scalpel biopsy. |

---

## 6. Adapter Export & Standalone Merge Utility

To deploy MedGemma with dedicated inference engines (such as vLLM, TensorRT-LLM, or Hugging Face Text Generation Inference):

```bash
# Validate adapter weights and create export manifest
python training/scripts/export_adapter.py --dry_run

# Merge LoRA weights into standalone base model (executed on GPU host)
python training/scripts/export_adapter.py --merge \
  --base_model_id google/medgemma-1.5-4b-it \
  --adapter_dir model_weights/fine_tuned/medgemma-oral-lora \
  --output_dir model_weights/fine_tuned/medgemma-1.5-4b-oral-merged
```

The resulting merged weights directory contains complete self-contained SafeTensors files requiring zero PEFT dependencies at runtime.

---

## 7. Production Microservice & API Endpoints

The FastAPI microservice in `deployment/medgemma_service_fastapi.py` operates on port `8001`:

### 7.1 Key Endpoints
- `GET /health` / `GET /ai/status`: Reports service telemetry, loaded adapter, GPU/CPU runtime, and HAI-DEF safety status.
- `POST /quality-check`: Evaluates uploaded oral photo using OpenCV Laplacian variance (focus sharpness $\ge 100.0$), brightness range ($40.0 - 220.0$), and mucosal glare threshold ($\le 15\%$).
- `POST /ai/analyze`: Accepts image base64, patient age, tobacco/betel nut habits, symptoms, and anatomical site. Returns structured 5-part assessment in English and Telugu (`assessment_te`).

### 7.2 Zero-Downtime Fallback Guarantee
If CUDA GPU or model weights are unavailable, the microservice automatically activates the **Deterministic Clinical Decision-Support Rules Engine**. This ensures:
- Frontline health workers in tribal villages never receive a `500 Internal Server Error`.
- Every screening receives valid, structured triage, habit-cessation counseling, and doctor referral guidance.
- Strict telemetry headers flag whether inference was generated by `medgemma-1.5-4b-it+lora` or `clinical_cds_rules_engine`.

---

## 8. Frontend Integration Status & Next Action

In Phase 6, the MedGemma AI frontend integration was developed on branch `feature/medgemma-integration` in repository `Aarogya-Drishti-ITDA`:
- **Vite Web UI**: Running at `http://127.0.0.1:3000`.
- **AI Microservice**: Running at `http://127.0.0.1:8001`.
- **Router Connection**: In `src/app/router.tsx`, clinical routes were previously aliased to `<CareWorkflowPage />`. Connecting `/health-worker/screening/camera` and `/doctor/cases/:id` to active MedGemma components and adding the navigation item to `SidebarNavigation.tsx` will surface the complete interface to frontline health workers and Medical Officers.

