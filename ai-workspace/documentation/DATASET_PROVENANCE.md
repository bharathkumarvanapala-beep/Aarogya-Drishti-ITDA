# Oral Dataset Provenance & Governance

## Datasets Included
1. **Mendeley Oral Cancer & OPMD Images**
   - Source: Mendeley Data (mhjyrn35p4)
   - License: Creative Commons Attribution 4.0 International (CC BY 4.0)
   - Scope: Oral Squamous Cell Carcinoma (OSCC), Oral Leukoplakia, Oral Lichen Planus.
2. **SMART-OM Multimodal Dataset**
   - License: Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
   - Scope: Healthy oral mucosa, Oral Mucositis, geographic tongue, normal physiological variants.

## Patient-Stratified Partitioning
- Zero patient-level data leakage: Train (472 patients), Validation (100 patients), Test (106 patients).
- Stratification performed using MD5 photographic hashing and clinical metadata IDs.
