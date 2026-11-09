import sys
from pathlib import Path

# Add ai-service to path
base_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(base_dir))

from medgemma_service import analyze_clinical_features, check_environment

def test_medgemma_inference():
    status = check_environment()
    assert status['available'] is True
    assert status['model'] == 'google/medgemma-1.5-4b-it'
    print("1. check_environment OK:", status['model'])

    dummy_jpg = b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.\' \",#\x1c\x1c(7),01444\x1f\'9=82<.342\xff\xc0\x00\x11\x08\x00\x10\x00\x10\x03\x01\"\x00\x02\x11\x01\x03\x11\x01\xff\xda\x00\x0c\x03\x01\x00\x02\x11\x03\x11\x00?\x00\xbf\x00\xff\xd9'
    res = analyze_clinical_features(
        dummy_jpg,
        site='Buccal mucosa',
        history='3 weeks white keratotic lesion on left cheek with daily gutkha habit',
        age=34
    )
    assert res['model'] == 'google/medgemma-1.5-4b-it'
    assert 'basicClinicalAnswer' in res
    assert 'differentialReasoning' in res
    assert 'visualEvidence' in res
    print("2. analyze_clinical_features OK:", res['model'], '| Tier:', res.get('triageTier'))
    print("   English summary:", res['basicClinicalAnswer']['plainAnswerEn'][:80])
    print("   Telugu summary:", res['basicClinicalAnswer']['plainAnswerTe'][:80])
    print("3. ALL MEDGEMMA UNIT TESTS PASSED SUCCESSFULLY!")

if __name__ == '__main__':
    test_medgemma_inference()
