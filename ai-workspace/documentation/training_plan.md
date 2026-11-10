# 📋 Aarogya Drishti: MedGemma 1.5 4B Training Plan

> **Model**: `google/medgemma-1.5-4b-it` (Multimodal Foundation Model)  
> **Task**: Visual-Clinical Decision Support for Oral Mucosal Lesions & OPMD  
> **Environment**: Google Colab (Free T4 GPU / 15 GB VRAM) or Cloud GPU (NVIDIA L4 / A10G)  
> **Methodology**: 4-Bit Parameter-Efficient Fine-Tuning (QLoRA)  

---

## 1. Executive Strategy

Aarogya Drishti deploys **MedGemma 1.5 4B IT**, an image-text multimodal foundation model combining a SigLIP vision transformer with a Gemma-3 language model.

Rather than fine-tuning all 4.2 billion parameters (which would require $>48\text{ GB}$ VRAM and risk catastrophic forgetting of medical knowledge), we employ **4-bit NormalFloat4 (NF4) QLoRA**. This reduces frozen base model memory to $\approx 3.8\text{ GB}$ while training low-rank adapter matrices ($r=16, \alpha=32$) representing $<1\%$ of total parameters.

---

## 2. LoRA / QLoRA Hyperparameter Configuration

```json
{
  "quantization": {
    "load_in_4bit": true,
    "bnb_4bit_quant_type": "nf4",
    "bnb_4bit_use_double_quant": true,
    "bnb_4bit_compute_dtype": "bfloat16"
  },
  "lora": {
    "r": 16,
    "lora_alpha": 32,
    "lora_dropout": 0.05,
    "target_modules": [
      "q_proj", "k_proj", "v_proj", "o_proj",
      "gate_proj", "up_proj", "down_proj"
    ]
  },
  "optimization": {
    "num_train_epochs": 3,
    "per_device_train_batch_size": 2,
    "gradient_accumulation_steps": 8,
    "effective_batch_size": 16,
    "learning_rate": 0.0002,
    "lr_scheduler_type": "cosine",
    "warmup_ratio": 0.03,
    "weight_decay": 0.01,
    "max_grad_norm": 0.3,
    "gradient_checkpointing": true
  }
}
```

---

## 3. Multimodal Instruction Schema

Each training instance pairs an intraoral clinical photograph with multimodal clinical context and receives a structured 5-part assessment:

### User Prompt:
```
<image>
Analyze this oral photograph for mucosal abnormalities, anatomical landmarks, and signs of 
Oral Potentially Malignant Disorders (OPMD) or malignancy. 
Provide a structured clinical assessment including: 
1. Anatomical Location
2. Observed Visual Characteristics
3. Differential Considerations
4. Level of Clinical Concern
5. Recommended Action
```

### Assistant Response:
```markdown
### 1. Anatomical Location
Right buccal mucosa, extending along occlusal line adjacent to mandibular second molar.

### 2. Observed Visual Characteristics
Homogeneous, thick white plaque with sharp margins, wrinkled parchment-like surface, 
and absence of deep induration or surface ulceration.

### 3. Differential Considerations
Oral Leukoplakia (ICD-10: K13.21), Tobacco Pouch Keratosis (ICD-10: K13.7), 
Chronic Hyperplastic Candidiasis (ICD-10: B37.0).

### 4. Level of Clinical Concern
Tier 1: High Priority - Non-scrapable chronic keratotic plaque with high transformation risk.

### 5. Recommended Action
Prompt in-person evaluation by Medical Officer. Digital bimanual palpation, habit cessation 
support, and diagnostic scalpel biopsy if persistent past 14 days.
```

---

## 4. Training Progression & Checkpoint Governance

1. **Epoch 1**: Adaptation of SigLIP-Gemma projection tokens to intraoral photographic lighting, mucosal vascularity, and oral cavity anatomical landmarks.
2. **Epoch 2**: Convergence on habit-risk correlations (associating decades of chewing tobacco/gutkha with transformation potential).
3. **Epoch 3**: Refinement of structured bilingual diagnostic reasoning and calibration of clinical triage levels.
4. **Checkpoint Retention**:
   - Validation evaluation performed at the end of each epoch.
   - Best checkpoint retained based on minimum validation loss (`eval_loss`).
   - Checkpoint directory: `training/checkpoints/` (top 2 checkpoints preserved).

---

## 5. Clinical Safety & Guardrails Enforcement

- **`score: null` Constraint**: The model is explicitly trained to omit pseudo-exact percentage scores (e.g., "87% risk"). Triage is categorized into qualitative clinical tiers (Tier 1 High Priority vs Tier 3 Routine).
- **Mandatory Biopsy Notice**: Every output referencing suspicious or OPMD lesions must include the explicit clinical instruction for biopsy.
- **Doctor Authority**: The prompt and system context reinforce that the Medical Officer retains complete diagnostic and management authority.

