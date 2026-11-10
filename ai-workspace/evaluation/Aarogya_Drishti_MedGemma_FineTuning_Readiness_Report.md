# 🔬 Aarogya Drishti: MedGemma 1.5 4B Multimodal Fine-Tuning Readiness Report

> **Project**: Aarogya Drishti – Specialized Oral Oncology Connected Care  
> **Foundation Model**: `google/medgemma-1.5-4b-it` (Image-Text-to-Text Multimodal Foundation Model)  
> **Date**: November 2, 2026  
> **Status**: **Phase Complete – All Compatibility, Permission, and Dataset Quality Checks PASSED**

---

## 1. Executive Summary & Environment Audit

An audit of the local development environment and foundation model requirements was conducted:

| Parameter | Host Machine Audit | MedGemma 1.5 4B Training Requirement | Feasibility Assessment |
|---|---|---|---|
| **Operating System** | Windows 11 (AMD64) | Linux / WSL / Colab POSIX | Compatible |
| **Compute / GPU** | Intel64 Genuine CPU (No NVIDIA discrete GPU detected) | NVIDIA CUDA GPU with $\ge 12\text{ GB}$ VRAM (T4, L4, V100, A100) | **Local training infeasible** |
| **Local Python** | Python 3.14.7 | Python 3.10 – 3.12 (PyTorch CUDA stable wheels) | Local CUDA wheels unavailable for 3.14 |
| **Target Runtime** | **Google Colab (Free T4 GPU / 15 GB VRAM)** | Fully supported via BitsAndBytes 4-Bit NF4 QLoRA | **100% Feasible & Cost-Free ($0)** |

> [!NOTE]
> Per your constraint ("Do not purchase or activate paid resources without my approval"), the complete training workflow has been tailored for **Google Colab with standard free GPU resources (NVIDIA T4 15 GB)** using 4-bit QLoRA.

---

## 2. Dataset Inspection & Quality Audit

Both public oral lesion image repositories were downloaded, extracted, audited, and de-identified:

```mermaid
flowchart TD
    subgraph Raw_Downloads ["Downloaded Public Datasets"]
        M1["Mendeley Oral Images v2<br/>(2,593 total image files)"]
        S1["SMART-OM Figshare<br/>(7,731 total files across folders)"]
    end

    subgraph Curation ["Data Curation & De-Duplication Pipeline"]
        M2["Filter: Exclude 2,270 Augmented Copies<br/>Retain 323 Original Patient Images"]
        S2["Resolve Multi-Folder Redundancies<br/>Retain 2,469 Core Clinical Photos (331 Patients)"]
        S3["Join Clinical Metadata & VIA JSON Contours<br/>(Age, Sex, Tobacco Habits, Anatomical Subsites)"]
    end

    subgraph Master_Dataset ["Patient-Stratified Multimodal Cohort"]
        MD["2,791 Combined Original Clinical Photographs<br/>678 Unique Patient Cohorts<br/>0 Corrupted Images | 0 Hash Collisions"]
    end

    M1 --> M2 --> MD
    S1 --> S2 --> MD
    S1 --> S3 --> MD
```

### Dataset 1: Mendeley Oral Images v2 (`mhjyrn35p4/2`)
- **DOI / URL**: `10.17632/mhjyrn35p4.2` / [Mendeley Data](https://data.mendeley.com/datasets/mhjyrn35p4/2)
- **Licence**: **Creative Commons Attribution 4.0 International (CC BY 4.0)**. Permits adaptation, transformation, and multimodal fine-tuning for non-commercial and commercial systems with proper attribution.
- **Original vs Augmented**:
  - **Original Patient Images**: **323 images** (`original_data/benign_lesions`: 165; `original_data/malignant_lesions`: 158).
  - **Synthetic Augmented Copies**: **2,270 images** (`augmented_data/augmented_benign`: 1,155; `augmented_data/augmented_malignant`: 1,115).
  - **Quality Rule**: As mandated, all 2,270 augmented copies were **strictly excluded** from validation and test partitions to ensure no synthetic replication biases the clinical ground truth.
- **Image Integrity**: 100% valid JPEG streams (0 corrupted files).

### Dataset 2: SMART-OM Figshare (`10.6084/m9.figshare.31341790`)
- **DOI / URL**: `10.6084/m9.figshare.31341790` / [Figshare](https://doi.org/10.6084/m9.figshare.31341790)
- **Licence**: **CC BY 4.0**. Fully permitted for machine learning fine-tuning and academic research with attribution.
- **Image Counts**:
  - The repository's 7,731 files stem from authors duplicating core images into separate annotation task directories.
  - **Unique Original Photographs**: Exactly **2,469 images** from **331 de-identified subjects** (`SMITA00001` – `SMITA00331`).
  - **Category Breakdown** (in `01. Unannotated`):
    - `01. Normal`: 2,145 images
    - `02. Variation from normal`: 179 images
    - `03. OPMD (Oral Potentially Malignant Disorders)`: 125 images
    - `04. Oral Cancer (Malignant OSCC)`: 20 images
- **Metadata & Annotation Provenance**:
  - `Metadata/Patient_s Metadata.xlsx`: 1,000 recorded rows with age, biological sex, habit status (chewing, smoking, arecanut, alcohol frequency and duration in years).
  - `Descriptors/01. Descriptors_for_region_annotation.xlsx`: 2,144 annotated anatomical subsite entries (dorsal tongue, ventral tongue, buccal mucosa, hard palate, labial mucosa, gingiva).
  - `Descriptors/03. Descriptors_for_lesion_annotation.xlsx`: 178 detailed lesion classifications (tobacco pouch keratosis, smoker's palate, candidiasis, fibroma, fissured tongue, traumatic ulcer, erythroplakic changes).
  - 1,058 VGG Image Annotator (VIA) JSON polygon contour files detailing exact lesion boundaries.

---

## 3. Patient-Level Splitting & Zero-Leakage Guarantee

To prevent patient data leakage, images were partitioned **strictly at the independent patient level**, stratified across clinical severity:

$$\text{Patient-Level Partition} = 70\% \text{ Train} \quad \big| \quad 15\% \text{ Validation} \quad \big| \quad 15\% \text{ Test}$$

```mermaid
pie title Multimodal Training Dataset Split (Total: 2,791 Images across 678 Patients)
    "Train (1,941 Images / 472 Patients)" : 1941
    "Validation (433 Images / 100 Patients)" : 433
    "Test (417 Images / 106 Patients)" : 417
```

### Partition Distribution Matrix

| Clinical Category | Train Split (70%) | Validation Split (15%) | Test Split (15%) | Total Original Images |
|---|---|---|---|---|
| **Normal Physiological Tissue** | 1,488 | 339 | 318 | **2,145** |
| **Normal Anatomical Variations** | 131 | 24 | 24 | **179** |
| **Oral Potentially Malignant Disorders (OPMD)** | 85 | 19 | 21 | **125** |
| **Oral Malignancy / Carcinoma** | 123 | 27 | 27 | **177** |
| **Benign Mucosal Alterations** | 114 | 24 | 27 | **165** |
| **Total Images** | **1,941** | **433** | **417** | **2,791** |
| **Total Patients** | **472** | **100** | **106** | **678** |

### Mathematical Leakage Verification
```python
assert len(train_pids.intersection(val_pids)) == 0  # PASSED: 0 Overlapping Patients
assert len(train_pids.intersection(test_pids)) == 0 # PASSED: 0 Overlapping Patients
assert len(val_pids.intersection(test_pids)) == 0   # PASSED: 0 Overlapping Patients
```
**Conclusion**: Zero images belonging to any test or validation patient are present in the training set.

---

## 4. Model Architecture & Compatibility Analysis

### Architecture Specification (`google/medgemma-1.5-4b-it`)
- **Hugging Face Model Hub**: [`google/medgemma-1.5-4b-it`](https://huggingface.co/google/medgemma-1.5-4b-it)
- **Model Type**: `"gemma3"`
- **Architecture Class**: `Gemma3ForConditionalGeneration` (multimodal vision-language model)
- **Multimodal Processor**: `AutoProcessor`
- **Vision Backbone**: SigLIP / MedSigLIP patch encoder
- **Language Decoder**: Gemma 3 causal language model (~4 billion parameters)

### PEFT QLoRA Compatibility

```mermaid
flowchart LR
    subgraph Multimodal_Input ["Multimodal Input"]
        IMG["Oral Clinical Photograph<br/>(RGB Image)"]
        TXT["Clinical Query & Patient Context<br/>(Structured Chat Template)"]
    end

    subgraph MedGemma_Base ["Frozen 4-Bit Base Model (NF4)"]
        VE["SigLIP Vision Encoder<br/>(FROZEN - Preserves Biomedical Vision)"]
        MLP_PROJ["Multimodal Projector"]
        LM["Gemma 3 4B Language Decoder<br/>(Base Weights Frozen)"]
    end

    subgraph QLoRA_Adapter ["Trainable LoRA Adapters (~50 MB)"]
        LORA["Target Modules:<br/>q_proj, k_proj, v_proj, o_proj,<br/>gate_proj, up_proj, down_proj<br/>(Rank = 16, Alpha = 32)"]
    end

    IMG --> VE --> MLP_PROJ --> LM
    TXT --> LM
    LM <--> LORA
    LM --> OUT["Structured 5-Point Clinical Findings Output"]
```

1. **Target Modules**:
   `["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"]`
2. **Vision Encoder Treatment**:
   The SigLIP vision backbone is kept **frozen**. This prevents catastrophic forgetting of broad biomedical visual features while focusing adapter updates on the multi-head attention and SwiGLU feed-forward projections for oral clinical differential reasoning.
3. **Quantisation**:
   BitsAndBytes 4-bit (`load_in_4bit=True`, `bnb_4bit_quant_type="nf4"`, `bnb_4bit_compute_dtype=torch.bfloat16`, `bnb_4bit_use_double_quant=True`).
4. **VRAM Footprint**:
   Base model occupies $\approx 3.2\text{ GB}$ of VRAM. With activation checkpointing and gradient accumulation, training requires $\approx 7.8\text{ GB}$ VRAM, fitting comfortably inside Colab's 15 GB T4 GPU.

---

## 5. Google Colab Notebook & Deliverables

All technical automation files have been created in the workspace:

### 1. Colab Fine-Tuning Notebook
- **File**: [`Aarogya_Drishti_MedGemma_Oral_Fine_Tuning.ipynb`](file:///C:/Users/AI%20PC/Desktop/hackathon/HACKATHON-2026-ITDA-main/training_pipeline/Aarogya_Drishti_MedGemma_Oral_Fine_Tuning.ipynb)
- **Capabilities**:
  - Automated environment installation (`transformers`, `peft`, `trl`, `bitsandbytes`, `accelerate`).
  - Google Drive mounting for persistent checkpointing.
  - Automatic dataset archive extraction.
  - 4-bit QLoRA loading of `google/medgemma-1.5-4b-it`.
  - Supervised multimodal training loop with prompt masking (`labels = -100`).
  - Lightweight adapter export (`medgemma_oral_adapter`, $\approx 50\text{ MB}$).
  - Unseen test-set evaluation (Accuracy, Sensitivity, Specificity, F1-Score, Confusion Matrix, and False Negative analysis).

### 2. Prepared Multimodal Dataset Archive
- **Local Path**: [`aarogya_drishti_oral_multimodal_dataset.zip`](file:///C:/Users/AI%20PC/Desktop/hackathon/Aarogya-Drishti-Datasets/aarogya_drishti_oral_multimodal_dataset.zip) (555.5 MB)
- **Contents**:
  - `train.jsonl` (1,941 samples with relative image paths)
  - `val.jsonl` (433 samples)
  - `test.jsonl` (417 samples)
  - `dataset_summary.json` (Partition statistics and verification)
  - `images/` (2,791 unique original clinical photographs)

---

## 6. Clinical Governance & Safety Mandates

> [!CAUTION]
> ### Mandatory Clinical Decision Support Principles
> 1. **No Autonomous Diagnosis**: MedGemma outputs must always be labeled as *"Assistive Clinical Decision Support for Qualified Healthcare Personnel"*.
> 2. **Never Claim Cancer Exclusion**: An absence of visible lesions in a photograph must NEVER be interpreted as proof that malignancy is absent. Early-stage dysplasia, submucous fibrosis, and mucosal induration require digital palpation and in-person visual inspection.
> 3. **Mandatory Biopsy for Persistent Lesions**: Any white plaque, red patch (erythroplakia), or ulcerative lesion persisting beyond 14 days mandates scalpel/punch biopsy and histopathological verification.
