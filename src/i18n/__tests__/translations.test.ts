import { describe, it, expect } from 'vitest';
import { translations } from '../translations';

describe('Website Unit Test: Bilingual Translation & Localization (i18n)', () => {
  it('should have complete dictionaries for both English (en) and Telugu (te)', () => {
    expect(translations).toBeDefined();
    expect(translations.en).toBeDefined();
    expect(translations.te).toBeDefined();
  });

  it('should maintain core brand and identity in English and Telugu', () => {
    expect(translations.en.appName).toBe('AAROGYA DRISHTI');
    expect(translations.en.appNameTe).toBe('ఆరోగ్య దృష్టి');
    expect(translations.en.tagline).toBe('Every Smile Deserves Care');
    expect(translations.en.taglineTe).toBe('ప్రతి చిరునవ్వుకు ఆరోగ్య సంరక్షణ అవసరం');
  });

  it('should contain valid Telugu script characters in Telugu dictionary', () => {
    // Telugu Unicode block is \u0C00 - \u0C7F
    const teluguRegex = /[\u0C00-\u0C7F]/;
    expect(teluguRegex.test(translations.te.appNameTe)).toBe(true);
    expect(teluguRegex.test(translations.te.home)).toBe(true);
    expect(teluguRegex.test(translations.te.screening)).toBe(true);
  });

  it('should provide parity for navigation and clinical workflow actions', () => {
    const requiredKeys = [
      'home',
      'about',
      'oralHealth',
      'cancerAwareness',
      'facilities',
      'login',
      'logout',
      'dashboard',
      'patients',
      'registerPatient',
      'screening',
      'uploadImage',
      'referrals',
      'offlineSync',
      'save',
      'submit',
      'back',
    ];

    for (const key of requiredKeys) {
      expect(translations.en[key as keyof typeof translations.en], `Missing EN key: ${key}`).toBeDefined();
      expect(translations.te[key as keyof typeof translations.te], `Missing TE key: ${key}`).toBeDefined();
      expect(typeof translations.en[key as keyof typeof translations.en]).toBe('string');
      expect(typeof translations.te[key as keyof typeof translations.te]).toBe('string');
    }
  });

  it('should include ITDA Paderu community banner in both languages', () => {
    expect(translations.en.itdaBanner).toContain('Integrated Tribal Development Agency (ITDA), Paderu');
    expect(translations.te.itdaBanner).toContain('పాడేరు');
    expect(translations.te.itdaBanner).toContain('ITDA');
  });
});
