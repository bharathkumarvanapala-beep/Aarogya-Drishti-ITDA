# Aarogya Drishti Oral Datasets

## Overview
This directory contains verified, patient-stratified clinical oral photography datasets formatted for MedGemma 1.5 4B fine-tuning and specialised oral lesion classification.

## Directory Layout
- `curated-multimodal/`:
  - `images/`: 2,791 curated unaugmented images (zero patient leakage verified).
  - `train.jsonl`: 1,941 training records across 472 distinct patients.
  - `val.jsonl`: 433 validation records across 100 distinct patients.
  - `test.jsonl`: 417 test records across 106 distinct patients.
  - `dataset_summary.json`: Detailed split metadata and category breakdowns.
- `manifests/`: Dataset provenance, SHA-256 integrity hashes, patient ID maps.
- `raw-sources/`:
  - `mendeley-oral-images/`: CC BY 4.0 licensed lesion images (OSCC, Leukoplakia, Lichen Planus).
  - `smart-om/`: CC BY-NC 4.0 licensed normal mucosa and mucositis reference dataset.

## Licensing & Attribution
- Mendeley Oral Dataset: CC BY 4.0
- SMART-OM Dataset: CC BY-NC 4.0
