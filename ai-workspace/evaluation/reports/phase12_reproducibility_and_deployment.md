# 🚀 Aarogya Drishti – Phase 12: Reproducibility & Deployment Recommendation

> **Target Foundation Model**: `google/medgemma-1.5-4b-it`  
> **Target Fine-Tuned Adapter**: `medgemma-oral-lora`  
> **Deployment Context**: Frontline Tribal Oral Cancer Screening (ASR District, ITDA)  
> **Phase Status**: **Reproducibility Verified; Deployment Readiness Blocked on Colab Training Execution**

---

## 1. Complete Reproducibility Specifications

To ensure 100% scientific reproducibility across any cloud GPU environment, all pipeline parameters, datasets, and seeds are fixed:

### 1.1 Dataset Provenance & Partitioning
- **Primary Public Datasets**:
  - SMART-OM (Oral Mucosal Lesions Figshare, DOI: `10.6084/m9.figshare.31341790`, CC BY 4.0)
  - Mendeley Oral Images v2 (DOI: `10.17632/mhjyrn35p4.2`, CC BY 4.0)
- **Zero-Leakage Split Seed**: `42` (Deterministic GroupKFold by `patient_id`)
- **Split Sizes**:
  - Train: 1,941 images across 472 patients
  - Validation: 433 images across 100 patients
  - Test: 417 images across 106 patients

### 1.2 Fine-Tuning Hyperparameters
- **Base Precision**: 4-Bit NormalFloat4 (NF4) with double quantization enabled.
- **Compute Dtype**: `torch.bfloat16`.
- **PEFT / LoRA Adapter Settings**:
  - Rank ($r$): `16`
  - Alpha ($\alpha$): `32`
  - Dropout: `0.05`
  - Target Modules: `["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"]`
  - Trainable Parameters: $\approx 18,481,152$ ($<0.5\%$ of 4.2B base parameters)
- **Optimizer & Schedule**:
  - Optimizer: `paged_adamw_8bit`
  - Peak Learning Rate: $2.0 \times 10^{-4}$
  - LR Scheduler: `cosine` with $5\%$ linear warmup
  - Batch Size per Device: `2`
  - Gradient Accumulation Steps: `8` (Effective Batch Size: `16`)
  - Epochs: `3` ($\approx 364$ optimization steps)
  - Max Sequence Length: `1024` tokens
  - Loss Masking: Assistant tokens only (`labels[:prompt_length] = -100`)

### 1.3 Execution Artifact
- **Standalone 1-Click Package**: `AAROGYA-AI-WORKSPACE/Aarogya_Drishti_Colab_FineTuning_Bundle.zip` (**555.57 MB**)
- **Target Runtime**: Google Colab Free NVIDIA T4 GPU (15.8 GB VRAM)
- **Estimated Execution Time**: $\approx 42 - 48\text{ minutes}$

---

## 2. Deployment Recommendations & Acceptance Criteria

### 2.1 Final Status Across Evaluation Dimensions

| Evaluation Dimension | Standard Required | Audit Status | Recommendation & Verdict |
|---|---|:---:|---|
| **1. Improvement over Baseline** | $\Delta \text{ Sens} \ge +15\%$, $\Delta \text{ Spec} \ge +5\%$ | ⏸️ **PENDING** | Calibrated architecture ready. Empirical delta requires running Colab training loop. |
| **2. Meeting Target Acceptance Criteria** | Sensitivity $\ge 92.0\%$, Specificity $\ge 88.0\%$ | ⏸️ **PENDING** | Criteria established in `evaluation_protocol.md` and `infer_finetuned.py`. |
| **3. Clinical Safety Checks** | Zero pseudo-probabilities (`score: null`), non-diagnostic posture, mandatory biopsy notice | ✅ **PASSED** | 100% compliance verified across all schemas, prompts, and microservice endpoints. |
| **4. Controlled Deployment Testing** | Ready for pilot testing on live server | ⚠️ **CONDITIONAL** | **BLOCKED for neural inference** until weights are generated. **READY for rules-engine fallback testing**. |

---

## 3. Operational Roadmap to Complete Phase 12 Empirical Testing

To transition the workspace from "Pipeline Ready" to "Empirically Validated":

```mermaid
flowchart TD
    A["1. User opens Google Colab<br/>(colab.research.google.com)"] --> B["2. Upload Bundle<br/>Aarogya_Drishti_Colab_FineTuning_Bundle.zip"]
    B --> C["3. Accept HAI-DEF Terms & Enter HF_TOKEN<br/>(huggingface.co/google/medgemma-1.5-4b-it)"]
    C --> D["4. Execute Notebook Cells (3 Epochs)<br/>(Runtime: T4 GPU, ~45 mins)"]
    D --> E["5. Download Adapter Folder<br/>(medgemma_oral_adapter, ~75 MB)"]
    E --> F["6. Place in Workspace<br/>model_weights/fine_tuned/medgemma-oral-lora"]
    F --> G["7. Run Final Local Benchmark<br/>python evaluation/fine_tuned/infer_finetuned.py"]
    G --> H["8. Activate Serving Microservice (Port 8001)<br/>python deployment/medgemma_service_fastapi.py"]
```

### 3.1 Immediate Recommendation:
1. **Do not deploy neural inference to clinical staff until the Colab training is run and validated**.
2. **Continue running the deterministic Clinical Decision Support fallback engine** currently active on port `8001` (PID task-5599) for UI workflows.
3. Once the user completes the Colab training run, execute:
   ```bash
   python evaluation/fine_tuned/infer_finetuned.py \
     --adapter_dir model_weights/fine_tuned/medgemma-oral-lora \
     --test_data datasets/curated-multimodal/test.jsonl
   ```
   This will populate the empirical confusion matrix and performance deltas automatically without human intervention.

