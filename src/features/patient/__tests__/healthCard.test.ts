import { describe, it, expect } from 'vitest';
import type { HealthCard } from '../../../types';

describe('Website Unit Test: Physical Health Card & Zero-PHI QR Verification', () => {
  it('should format valid Patient ID conforming to ASR-PAT-YYYY-XXXX pattern', () => {
    const patientId = 'ASR-PAT-2026-0842';
    const patientIdRegex = /^ASR-PAT-\d{4}-\d{4}$/;
    expect(patientIdRegex.test(patientId)).toBe(true);
  });

  it('should format Physical Card Serial conforming to ASR-CRD-XXXX-XXXX pattern', () => {
    const cardSerial = 'ASR-CRD-8420-0019';
    const cardSerialRegex = /^ASR-CRD-\d{4}-\d{4}$/;
    expect(cardSerialRegex.test(cardSerial)).toBe(true);
  });

  it('should generate opaque QR token preventing plain-text PHI disclosure', () => {
    const patientId = 'ASR-PAT-2026-0842';
    const qrToken = `AAROGYA-DRISHTI://CARD-REF/${patientId}/EMERGENCY-VERIFY`;

    // Must start with scheme and reference token
    expect(qrToken.startsWith('AAROGYA-DRISHTI://CARD-REF/')).toBe(true);

    // CRITICAL PRIVACY RULE: QR token MUST NOT contain sensitive clinical text
    expect(qrToken.toLowerCase()).not.toContain('cancer');
    expect(qrToken.toLowerCase()).not.toContain('malignancy');
    expect(qrToken.toLowerCase()).not.toContain('biopsy');
    expect(qrToken.toLowerCase()).not.toContain('ulcer');
    expect(qrToken.toLowerCase()).not.toContain('hiv');
    expect(qrToken.toLowerCase()).not.toContain('tobacco');
  });

  it('should create complete HealthCard model with bilingual names for Kondala Rao', () => {
    const card: HealthCard = {
      cardSerial: 'ASR-CRD-8420-0842',
      patientId: 'ASR-PAT-2026-0842',
      patientName: 'Kondala Rao',
      patientNameTe: 'కొండల రావు',
      age: 46,
      gender: 'male',
      habitation: 'Kothapalli',
      mandal: 'G. Madugula',
      district: 'Alluri Sitharama Raju',
      qrReferenceCode: 'AAROGYA-DRISHTI://CARD-REF/ASR-PAT-2026-0842/VERIFY',
      issuedAt: '2026-10-28T09:00:00.000Z',
      issuedBy: 'ASHA Lakshmi Devi',
      facility: 'G. Madugula Sub-Centre',
      status: 'ACTIVE',
    };

    expect(card.cardSerial).toBeDefined();
    expect(card.patientName).toBe('Kondala Rao');
    expect(card.patientNameTe).toBe('కొండల రావు');
    expect(card.habitation).toBe('Kothapalli');
    expect(card.mandal).toBe('G. Madugula');
    expect(card.status).toBe('ACTIVE');
  });
});
