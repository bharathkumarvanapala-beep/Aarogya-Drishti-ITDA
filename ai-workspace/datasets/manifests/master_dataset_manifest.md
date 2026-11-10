# 📋 Master Dataset Manifest: Aarogya Drishti Multimodal Oral Lesion Cohort

---

## 1. Overview & Dataset Union
- **Project**: Aarogya Drishti – Specialized MedGemma 1.5 4B AI Workspace
- **Total Unique Original Clinical Photographs**: **2,791 images**
- **Total Independent Patient Cohorts**: **678 subjects**
- **Integrated Sources**:
  1. Mendeley Oral Images v2: 322 original images (CC BY 4.0)
  2. SMART-OM Figshare: 2,469 core images (CC BY 4.0)
- **Licence**: **Creative Commons Attribution 4.0 International (CC BY 4.0)**

---

## 2. Category Distribution Table

| Category Code | Clinical Meaning | Image Count | Percentage | Primary Source |
|---|---|---|---|---|
| `normal` | Normal, healthy mucosal epithelium | **2,145** | 76.86% | SMART-OM |
| `variation` | Non-pathological anatomical variants | **179** | 6.41% | SMART-OM |
| `benign` | Benign reactive, traumatic, or infectious lesions | **165** | 5.91% | Mendeley v2 |
| `opmd` | Oral Potentially Malignant Disorders (High Risk) | **125** | 4.48% | SMART-OM |
| `malignancy_suspected` | Invasive oral squamous cell carcinoma (OSCC) | **177** | 6.34% | Mendeley (157) & SMART-OM (20) |
| **Total Cohort** | — | **2,791** | **100.0%** | — |

---

## 3. Patient-Stratified Zero-Leakage Partitions

| Partition Split | Patients | Images | Normal | Variation | Benign | OPMD | Malignancy Suspected |
|---|---|---|---|---|---|---|---|
| **Train (70%)** | 472 | **1,941** | 1,488 | 131 | 114 | 85 | 123 |
| **Validation (15%)** | 100 | **433** | 339 | 24 | 24 | 19 | 27 |
| **Test (15%)** | 106 | **417** | 318 | 24 | 27 | 21 | 27 |
| **Total Cohort** | **678** | **2,791** | **2,145** | **179** | **165** | **125** | **177** |

- **Zero-Leakage Assurance**: Verified through automated hash and patient identifier tracking. No patient appears in more than one partition.

---

## 4. Clinical Safety Safeguards
- **`score: null` Constraint**: No pseudo-probability percentages are provided.
- **Mandatory Biopsy Notice**: Biopsy recommendation attached to all OPMD and malignancy cases.
- **Clinical Oversight Gate**: All outputs require validation by the Medical Officer.

