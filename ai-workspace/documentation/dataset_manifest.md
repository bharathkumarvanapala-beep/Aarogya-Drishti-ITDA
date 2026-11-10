# 📦 Aarogya Drishti: Curated Multimodal Dataset Manifest

> **Cohort**: Specialized Oral Cavity Screening Dataset  
> **Total Unique Patients**: 678 Subjects  
> **Total Original Clinical Photographs**: 2,791 Images  
> **Partition Scheme**: Strict Patient-Level Stratified (70% Train / 15% Val / 15% Test)  
> **Zero-Leakage Assurance**: **Verified (0 Patient Overlap, 0 Image Hash Collisions)**  

---

## 1. Source Repositories & Licences

| Source Dataset | DOI / Identifier | Licence | Original Clinical Images | De-identified Subjects |
|---|---|---|---|---|
| **Mendeley Oral Images v2** | `10.17632/mhjyrn35p4.2` | **CC BY 4.0** | 323 images | 347 patients (nominal) |
| **SMART-OM Figshare** | `10.6084/m9.figshare.31341790` | **CC BY 4.0** | 2,469 images | 331 patients (`SMITA00001`–`SMITA00331`) |
| **Combined Cohort** | — | **CC BY 4.0** | **2,791 original images** | **678 unique patient cohorts** |

### Data Quality Rules Enforced:
1. **Exclusion of Synthetic Augmentations**: Mendeley v2 contains 2,270 artificially rotated/scaled copies. All 2,270 copies were **strictly excluded** to prevent synthetic data from artificially inflating validation/test metrics.
2. **Exclusion of Duplicates**: Multi-folder copies across task annotation directories in SMART-OM were resolved to canonical source images.
3. **EXIF De-identification**: All image headers stripped of camera serials, timestamps, and geolocation tags.

---

## 2. Clinical Category Breakdown

| Category Code | Clinical Definition | Examples | Total Original Images |
|---|---|---|---|
| `normal` | Healthy oral mucosa with intact epithelial barrier | Dorsum of tongue, hard palate, uninflamed buccal mucosa | 2,145 |
| `variation` | Non-pathological anatomical variants | Leukoedema, Fordyce granules, fissured tongue, torus | 179 |
| `benign` | Non-malignant reactive or inflammatory lesions | Irritation fibroma, traumatic ulcer, candidiasis, aphthous | 165 |
| `opmd` | Oral Potentially Malignant Disorders (High Risk) | Leukoplakia, erythroplakia, oral submucous fibrosis (OSMF) | 125 |
| `malignancy_suspected` | Advanced / invasive carcinoma | Oral squamous cell carcinoma (OSCC), exophytic fungating mass | 177 |
| **Total** | — | — | **2,791** |

---

## 3. Patient-Level Partition Distribution

To prevent **patient data leakage** (where different photos of the same patient appear in both training and test sets, artificially inflating metrics), partitioning is performed strictly at the **independent patient cohort level**:

| Split | Patient Count | Total Images | Normal | Variation | Benign | OPMD | Malignancy Suspected |
|---|---|---|---|---|---|---|---|
| **Train (70%)** | 472 | **1,941** | 1,488 | 131 | 114 | 85 | 123 |
| **Validation (15%)** | 100 | **433** | 339 | 24 | 24 | 19 | 27 |
| **Test (15%)** | 106 | **417** | 318 | 24 | 27 | 21 | 27 |
| **Total** | **678** | **2,791** | **2,145** | **179** | **165** | **125** | **177** |

---

## 4. Multi-Attribute Clinical Metadata

Each curated sample in `datasets/curated-multimodal/*.jsonl` integrates:

1. **Demographic Features**: Patient age, biological sex, geographic habitation.
2. **Habit & Exposure History**:
   - Chewing tobacco / gutkha / khaini / zarda frequency and years of habit.
   - Bidi and cigarette smoking packs/day and duration.
   - Reverse chutta smoking (endophytic hot ember inside mouth — prevalent in northern Andhra/ASR tribal areas).
   - Alcohol intake frequency.
3. **Clinical Symptoms & Signs**:
   - Duration of lesion ($< 2$ weeks vs $> 3$ weeks persistent).
   - Burning sensation on consuming spicy food.
   - Inter-incisal mouth opening (measured in fingers: $1, 2, 3$ or mm).
   - Presence of induration, bleeding on touch, or neck lymphadenopathy.
4. **Biopsy & Ground Truth Correlation**:
   - Clinical consensus classification verified by oral medicine and oncology specialists.
   - Histopathological dysplasia grading where biopsy was conducted.

