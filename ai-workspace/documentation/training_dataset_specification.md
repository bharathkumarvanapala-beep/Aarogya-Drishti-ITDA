# 📋 Aarogya Drishti: MedGemma 1.5 4B Training Dataset Specification

> **Target Model**: `google/medgemma-1.5-4b-it` (Multimodal Image-Text Foundation Model)  
> **Modality**: High-resolution intraoral clinical photography + Structured text instruction  
> **Cohort**: 2,791 validated original clinical photographs across 678 unique patient cohorts  
> **Format**: Multimodal instruction-tuning JSONL (train, validation, test)  
> **Compliance**: Health AI Developer Foundations (HAI-DEF) non-diagnostic CDS guidelines  

---

## 1. Input Multimodal Tokenization

The MedGemma processor requires synchronized vision-language token sequences:

```
<start_of_turn>user
<image>
Analyze this oral photograph for mucosal abnormalities, anatomical landmarks, and signs of Oral Potentially Malignant Disorders (OPMD) or malignancy. Provide a structured clinical assessment including: 1. Anatomical Location, 2. Observed Visual Characteristics, 3. Differential Considerations, 4. Level of Clinical Concern, and 5. Recommended Action.<end_of_turn>
<start_of_turn>model
### 1. Anatomical Location
[Anatomical mucosal subsite]

### 2. Observed Visual Characteristics
[Mucosal color, margin definition, induration signs]

### 3. Differential Considerations
[ICD-10 clinical considerations]

### 4. Level of Clinical Concern
[Tier 1 High Priority vs Tier 3 Routine]

### 5. Recommended Action
[Clinical examination, habit cessation, and biopsy guidance]<end_of_turn>
```

---

## 2. Partition Summary & Class Balance

| Split | Patient Count | Total Images | Normal | Variation | Benign | OPMD | Malignancy Suspected |
|---|---|---|---|---|---|---|---|
| **Train** | 472 | **1,941** | 1,488 | 131 | 114 | 85 | 123 |
| **Validation** | 100 | **433** | 339 | 24 | 24 | 19 | 27 |
| **Test** | 106 | **417** | 318 | 24 | 27 | 21 | 27 |
| **Total** | **678** | **2,791** | **2,145** | **179** | **165** | **125** | **177** |

---

## 3. Class Imbalance Mitigation Strategy

- **Imbalance Ratio**: $1:17.2$ between OPMD ($n=125$) and Normal ($n=2,145$); $1:12.1$ between Malignancy ($n=177$) and Normal.
- **Weighted Cross-Entropy Loss**: Inverse frequency class weighting applied during cross-entropy loss computation:
  $$w_c = \frac{N_{\text{total}}}{K \cdot N_c}$$
- **Focal Loss Option**: $\gamma=2.0, \alpha=0.25$ implemented for hard-example mining of faint keratotic mucosal borders.

---

## 4. Verification Check

- **Corrupted Images**: **0 / 2,791** ($0.0\%$).
- **Patient Leakage**: **0 / 678** ($0.0\%$ overlap).
- **Invented Missing Data**: **0** instances.
- **Application Repository**: `Aarogya-Drishti-ITDA` untouched.

