# 🚀 Google Colab 1-Click Fine-Tuning Walkthrough: MedGemma 1.5 4B Oral QLoRA

> **Model**: `google/medgemma-1.5-4b-it` (Multimodal Image-Text Foundation Model)  
> **Target GPU**: Free Google Colab **NVIDIA T4 (15.8 GB VRAM)** or paid L4/A100  
> **Bundle Package**: `Aarogya_Drishti_Colab_FineTuning_Bundle.zip` (555.57 MB)  
> **Execution Mode**: 4-Bit NormalFloat4 (NF4) QLoRA ($r=16, \alpha=32$)  

---

## 1. Prerequisites (Hugging Face Model Access)

1. Navigate to the official gated repository: [https://huggingface.co/google/medgemma-1.5-4b-it](https://huggingface.co/google/medgemma-1.5-4b-it).
2. Log into your Hugging Face account and accept the **Google Health AI Developer Foundations (HAI-DEF) Terms of Use**.
3. Generate a read-access token at [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).

---

## 2. Launching in Google Colab (Step-by-Step)

### Step 2.1: Open Notebook in Google Colab
1. Go to [Google Colab](https://colab.research.google.com/).
2. Click **Upload** and upload `MedGemma_1_5_4B_Oral_FineTuning_Colab.ipynb` from `training/notebooks/` (or extracted from the bundle).
3. In Colab, navigate to **Runtime > Change runtime type**:
   - Hardware accelerator: **T4 GPU** (or A100 / L4 if available).
   - Click **Save**.

### Step 2.2: Upload Dataset Bundle
In Colab Cell 1, upload or copy `Aarogya_Drishti_Colab_FineTuning_Bundle.zip`:

```python
# Upload directly via Colab UI or from Google Drive:
from google.colab import drive
drive.mount('/content/drive')

# Copy and unzip:
!unzip -q /content/drive/MyDrive/Aarogya_Drishti_Colab_FineTuning_Bundle.zip -d /content/workspace
%cd /content/workspace
```

### Step 2.3: Authenticate Hugging Face
Execute the login cell:
```python
from huggingface_hub import login
login("hf_your_token_here")
```

### Step 2.4: Execute Cell-by-Cell Fine-Tuning
The notebook handles:
1. **Environment Installation**: Installs `transformers>=4.49.0`, `peft>=0.14.0`, `bitsandbytes>=0.45.0`, `accelerate>=1.2.0`.
2. **Model Loading in 4-Bit NF4**: Loads base 4.2B parameters using $\approx 3.8\text{ GB}$ VRAM.
3. **LoRA Adapter Attachment**: Attaches trainable rank-16 adapters to projection layers (`q_proj`, `v_proj`, `k_proj`, `o_proj`, `gate_proj`, `up_proj`, `down_proj`). Trainable parameters: $\approx 18\text{ M}$ ($<0.5\%$ of model).
4. **Data Collator**: Tokenizes `<image>` embeddings alongside conversational clinical prompts with assistant loss masking.
5. **Training Execution**: Runs 3 epochs (batch size 2, gradient accumulation 8, cosine schedule, learning rate $2 \times 10^{-4}$).
6. **Adapter Saving**: Automatically saves adapter weights to `/content/drive/MyDrive/Aarogya_Drishti_MedGemma/medgemma_oral_adapter`.

---

## 3. Post-Training Validation & Export

After training finishes, the notebook executes:
1. **Zero-Leakage Test Cohort Benchmark**: Runs inference across the 417 independent test images.
2. **Clinical Safety Verification**: Confirms `score: null` is output, ICD-10 differentials are included, and scalpel biopsy recommendations are attached.
3. **Download Adapter**: Download the `medgemma_oral_adapter` folder ($\approx 75\text{ MB}$) and place it into `AAROGYA-AI-WORKSPACE/model_weights/fine_tuned/medgemma-oral-lora`.

