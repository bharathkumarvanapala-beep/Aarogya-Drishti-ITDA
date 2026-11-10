# 🖥️ Aarogya Drishti – Pretrained MedGemma Baseline: Environment Report

> **Workspace**: `AAROGYA-AI-WORKSPACE/`  
> **Evaluation Date**: November 9, 2026  
> **Target Model**: `google/medgemma-1.5-4b-it`  
> **Evaluation Phase**: Phase 10 – Pretrained Baseline Verification  

---

## 1. Host System & Hardware Configuration

| Component | Host System Value | MedGemma 1.5 4B Technical Requirement | Feasibility Status |
|---|---|---|---|
| **Operating System** | Windows 11 Pro (10.0.26200 AMD64) | Linux / WSL2 / Windows 11 | Compatible |
| **Processor / Architecture** | Intel x86_64 Multi-Core CPU | Multi-Core CPU (x86_64) | Compatible |
| **Total Physical RAM** | 15.75 GB | $\ge 16\text{ GB}$ | Marginal |
| **Available Physical RAM** | **2.63 GB** (at test time) | $\ge 12\text{ GB}$ available for CPU load | ❌ **BLOCKER: Insufficient RAM** |
| **Discrete GPU / VRAM** | **None (No NVIDIA discrete GPU)** | NVIDIA CUDA GPU with $\ge 12\text{ GB}$ VRAM | ❌ **BLOCKER: No CUDA GPU** |
| **CUDA Acceleration** | `torch.cuda.is_available() == False` | CUDA 12.1 or 12.4 | ❌ **CUDA Unavailable** |

---

## 2. Python & Machine Learning Stack

| Package | Installed Version | Required Version | Status |
|---|---|---|---|
| **Python** | `3.14.7` (Windows AMD64) | `3.10` – `3.12` recommended | Functional for scripts; lacks CUDA wheels |
| **PyTorch** | `2.15.0+cpu` | $\ge 2.2.0$ | CPU-only build |
| **Torchvision** | `0.29.2+cpu` | $\ge 0.17.0$ | CPU-only build |
| **Transformers** | `5.22.2` | $\ge 4.49.0$ | ✅ Compatible with Gemma-3/SigLIP |
| **Hugging Face Hub** | `2.4.0` | $\ge 0.23.0$ | ✅ Compatible |
| **PIL / Pillow** | `13.0.0` | $\ge 10.0.0$ | ✅ Compatible |
| **OpenCV** | `5.0.0` | $\ge 4.8.0$ | ✅ Compatible |
| **Scikit-Learn** | `1.9.1` | $\ge 1.4.0$ | ✅ Compatible |
| **BitsAndBytes** | `NOT INSTALLED` | $\ge 0.43.0$ | Requires Linux/CUDA |
| **PEFT** | `NOT INSTALLED` | $\ge 0.11.0$ | Target for Phase 11 |

---

## 3. Hugging Face Access & Weight Storage Audit

1. **Local Weight Storage (`model_weights/pretrained/`)**:
   - Status: **Empty (`[]`)**.
   - No local weights (`model.safetensors`, `config.json`, or `tokenizer.json`) are present in the local workspace directory.

2. **Hugging Face Cache (`~/.cache/huggingface/hub/`)**:
   - Directory: `models--google--medgemma-1.5-4b-it` exists.
   - Content: Contains only a 40-byte commit reference (`refs/main`).
   - Weight Snapshots: **0 bytes**. No snapshot files are downloaded in the local cache.

3. **Hugging Face Authentication Status**:
   - Token configured: `False` (`huggingface_hub.get_token()` returned `None`).
   - Online Access Probe Result:
     ```
     OSError: You are trying to access a gated repo.
     Make sure to have access to it at https://huggingface.co/google/medgemma-1.5-4b-it.
     401 Client Error.
     Cannot access gated repo for url https://huggingface.co/google/medgemma-1.5-4b-it/.../config.json
     Access to model google/medgemma-1.5-4b-it is restricted.
     You must have access to it and be authenticated to access it. Please log in.
     ```

---

## 4. Technical Conclusion

Genuine local model inference for `google/medgemma-1.5-4b-it` on the local host machine is **technically blocked** due to:
1. **HTTP 401 Authentication Gate**: Missing user agreement and `HF_TOKEN` authentication on Hugging Face.
2. **Absence of Local Model Weights**: No cached weights on local disk.
3. **Hardware Constraints**: Absence of CUDA GPU acceleration and insufficient available system memory ($2.63\text{ GB}$ available vs $\ge 8.5\text{ GB}$ required for 4B parameters in BF16).

