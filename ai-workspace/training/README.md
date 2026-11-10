# Aarogya Drishti Training Pipeline

## Components
1. `medgemma-training/`: Google Colab QLoRA Fine-Tuning pipeline for `google/medgemma-1.5-4b-it`.
2. `data-preparation/`: Patient-stratified split generator and dataset ingestion scripts.
3. `oral-classifier-training/`: Specialized oral image classifier (EfficientNet-B0 / ConvNeXt).
4. `quality-model-training/`: Deterministic image quality assessment (IQA) configuration.

## Hardware Requirements
- MedGemma 1.5 4B QLoRA fine-tuning: Run on Google Colab GPU (T4 / A100 / L4).
- Specialized Classifier: Trainable on Colab or local GPU.
- Image Quality Assessment: CPU deterministic inference (<10ms).
