# 📋 Dataset Manifest: Mendeley Oral Images Dataset v2

---

## 1. Provenance & Official Source
- **Official Publisher**: Mendeley Data (Elsevier)
- **DOI**: [`10.17632/mhjyrn35p4.2`](https://doi.org/10.17632/mhjyrn35p4.2)
- **Direct Repository URL**: [https://data.mendeley.com/datasets/mhjyrn35p4/2](https://data.mendeley.com/datasets/mhjyrn35p4/2)
- **Licence**: **Creative Commons Attribution 4.0 International (CC BY 4.0)**
- **Permitted Research Use**: Fully permitted for academic, commercial, and clinical AI model fine-tuning with attribution.

---

## 2. Image Counts & File Integrity
- **Total Files in Raw Download**: 2,593 images
- **Synthetic Augmented Copies (Excluded)**: 2,270 images
- **Original Clinical Photographs Retained**: **322 images**
- **Unique Patient Cohorts**: 347 (nominal case series)
- **Corrupted / Truncated Files**: **0**
- **Format**: 100% standard JPEG format

---

## 3. Categories & Clinical Labels
- **Benign Lesions (`benign`)**: 165 images (irritation fibroma, traumatic reactive changes, benign keratosis)
- **Malignant Lesions (`malignancy_suspected`)**: 157 images (histopathologically confirmed oral squamous cell carcinoma)

---

## 4. Annotation Methodology & Provenance
- Images captured using digital SLR and clinical intraoral cameras in tertiary dental and oral oncology clinics.
- Clinical ground truth established by biopsy and histopathological verification.

---

## 5. Dataset Limitations & Preprocessing Rules
- **No Augmented Copies in Validation/Test**: To prevent data leakage and metric distortion, all 2,270 augmented images were strictly filtered out.
- **Limited Patient Metadata**: Does not include granular tobacco chewing duration or systemic health history.

