# Google Colab GPU Fine-Tuning Guide

## Workflow
1. Upload `datasets/curated-multimodal/train.jsonl`, `val.jsonl`, `test.jsonl` and `images/` to Google Drive.
2. Open `training/medgemma-training/Aarogya_Drishti_MedGemma_Oral_Fine_Tuning.ipynb` in Google Colab.
3. Select GPU Runtime (T4, A100, or L4).
4. Enter Hugging Face Token with access to `google/medgemma-1.5-4b-it`.
5. Execute training cells; monitor loss curves.
6. Export LoRA adapter weights to `checkpoints/`.
