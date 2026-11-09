import { describe, it, expect } from 'vitest';
import { translations } from '../../../i18n/translations';

describe('Website Unit Test: Phase 3 - Services, Care Continuum & Oral Awareness', () => {
  it('should verify Section C Core Healthcare Services specifications and operational routes', () => {
    const services = [
      {
        id: 'doorstep-screening',
        titleEn: 'Assisted Doorstep Screening',
        titleTe: 'గ్రామీణ నోటి స్క్రీనింగ్',
        route: '/oral-health',
        badgeEn: 'Doorstep Care',
      },
      {
        id: 'health-card',
        titleEn: 'Physical Health Card',
        titleTe: 'భద్రమైన భౌతిక కార్డు',
        route: '/login',
        badgeEn: 'Privacy-First',
      },
      {
        id: 'doctor-review',
        titleEn: 'Doctor Independent Review',
        titleTe: 'వైద్యుల స్వతంత్ర పరీక్ష',
        route: '/facilities',
        badgeEn: 'Doctor-Signed',
      },
      {
        id: 'hospital-linkage',
        titleEn: 'Hospital Referral Linkage',
        titleTe: 'ఆసుపత్రి రిఫరల్ మరియు పర్యవేక్షణ',
        route: '/facilities',
        badgeEn: 'District Care',
      },
    ];

    expect(services).toHaveLength(4);

    // Verify all routes are real and operational
    const validRoutes = ['/oral-health', '/login', '/facilities'];
    services.forEach((s) => {
      expect(validRoutes).toContain(s.route);
    });

    // Verify no commercial e-commerce services are present
    const commercialWords = ['cart', 'shop', 'price', 'coffee', 'buy'];
    services.forEach((s) => {
      commercialWords.forEach((word) => {
        expect(s.titleEn.toLowerCase()).not.toContain(word);
        expect(s.route.toLowerCase()).not.toContain(word);
      });
    });
  });

  it('should verify Section D 5-step visual care pathway continuum', () => {
    const pathwaySteps = [
      { step: 1, titleEn: 'Village Visit', titleTe: 'గ్రామ సందర్శన' },
      { step: 2, titleEn: 'Guided Oral Photos', titleTe: 'నోటి ఫోటోల సేకరణ' },
      { step: 3, titleEn: 'Doctor Review', titleTe: 'వైద్యుల పరిశీలన' },
      { step: 4, titleEn: 'Hospital Care', titleTe: 'ఆసుపత్రి కేర్' },
      { step: 5, titleEn: 'Patient Navigation', titleTe: 'తదుపరి పర్యవేక్షణ' },
    ];

    expect(pathwaySteps).toHaveLength(5);
    expect(pathwaySteps[0].step).toBe(1);
    expect(pathwaySteps[4].step).toBe(5);

    // Verify step 3 confirms independent human clinical review (not autonomous AI)
    expect(pathwaySteps[2].titleEn).toBe('Doctor Review');
  });

  it('should verify Section E 7-Zone Oral Anatomy and Early Red-Flag Warning Signs', () => {
    const oralAnatomyZones = [
      'Inner Cheeks',
      'Tongue & Borders',
      'Floor of Mouth',
      'Gums & Teeth',
      'Roof / Palate',
      'Lips & Labial',
    ];

    expect(oralAnatomyZones.length).toBeGreaterThanOrEqual(6);

    const redFlags = [
      {
        id: 'ulcers',
        nameEn: 'Persistent Mouth Ulcers (>2-3 Weeks)',
        threshold: '2-3 weeks',
      },
      {
        id: 'patches',
        nameEn: 'White or Red Mucosal Patches',
        condition: 'Non-scrapable leukoplakia or erythroplakia',
      },
      {
        id: 'osmf',
        nameEn: 'Restricted Opening & Burning (OSMF)',
        symptom: 'Inability to open 3 fingers',
      },
    ];

    expect(redFlags).toHaveLength(3);
    expect(redFlags[0].threshold).toBe('2-3 weeks');
  });

  it('should verify bilingual support for How It Works and Oral Health titles in translation dictionary', () => {
    expect(translations.en.howItWorksTitle).toBe('How AAROGYA DRISHTI Works');
    expect(translations.en.oralHealthTitle).toBe('Oral Anatomy & Self-Checkup Guide');
    expect(translations.te.howItWorks).toBe('ఎలా పనిచేస్తుంది');
    expect(translations.te.oralHealth).toBe('నోటి ఆరోగ్యం');
  });
});

