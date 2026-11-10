# 📋 Dataset Manifest: SMART-OM Figshare Dataset

---

## 1. Provenance & Official Source
- **Official Publisher**: Figshare
- **Contributors**: Mazumdar Shaw Medical Foundation & Manipal Academy of Higher Education
- **DOI**: [`10.6084/m9.figshare.31341790`](https://doi.org/10.6084/m9.figshare.31341790)
- **Direct Repository URL**: [https://doi.org/10.6084/m9.figshare.31341790](https://doi.org/10.6084/m9.figshare.31341790)
- **Licence**: **Creative Commons Attribution 4.0 International (CC BY 4.0)**
- **Permitted Research Use**: Fully permitted for academic, clinical decision-support, and multimodal AI fine-tuning.

---

## 2. Image Counts & File Integrity
- **Total Files in Raw Repository**: 7,731 files
- **Multi-task Duplicate Copies (Resolved)**: 5,262 copies
- **Unique Core Clinical Photographs Retained**: **2,469 images**
- **Unique Patient Cohorts**: **331 subjects** (`SMITA00001` through `SMITA00331`)
- **Corrupted Files**: **0**

---

## 3. Categories & Clinical Distribution
- **Normal Oral Mucosa (`normal`)**: 2,145 images
- **Anatomical Variations (`variation`)**: 179 images (leukoedema, Fordyce granules, fissured tongue)
- **Oral Potentially Malignant Disorders (`opmd`)**: 125 images (oral leukoplakia, erythroplakia, oral submucous fibrosis)
- **Oral Squamous Cell Carcinoma (`malignancy_suspected`)**: 20 images

---

## 4. Metadata, Annotations & Clinical Provenance
- **Patient Demographics & Habits**: `Patient_s Metadata.xlsx` details age, sex, tobacco chewing years, smoking history, and alcohol intake for 1,000 recorded patient rows.
- **Lesion Boundaries**: 1,058 VGG Image Annotator (VIA) polygon contour JSON files defining exact lesion boundaries.
- **Anatomical Subsites**: Descriptors covering dorsal/ventral tongue, buccal mucosa, hard/soft palate, gingiva, and labial mucosa.
- **Clinical Environment**: Rural and semi-urban oral cancer screening camps in southern India with specialist clinical review.

---

## 5. Dataset Limitations
- **Class Imbalance**: High proportion of normal mucosal images ($86.9\%$) relative to malignant lesions ($0.8\%$). Mitigated through patient-stratified weighted training.
- **Multi-Folder Structure**: The original archive duplicated images into task folders (`Unannotated`, `Region annotation`, `Full annotation`), requiring hash-based deduplication before training ingestion.

