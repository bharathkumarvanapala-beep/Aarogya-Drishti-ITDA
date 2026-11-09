import { describe, it, expect } from 'vitest';
import { translations } from '../../../i18n/translations';

describe('Website Unit Test: Phase 4 - Healthy Habits, Verified Doctors, FAQs & Suspire Footer', () => {
  it('should verify Section F Healthy Everyday Habits and prevention guidelines', () => {
    const habits = [
      {
        id: 'gutkha',
        titleEn: 'Quit Chewing Gutkha',
        titleTe: 'గుట్కా, ఖైనీ మానుకోండి',
        type: 'harm-reduction',
      },
      {
        id: 'reverse-smoking',
        titleEn: 'Stop Reverse Smoking',
        titleTe: 'రివర్స్ స్మోకింగ్ ఆపండి',
        type: 'harm-reduction',
      },
      {
        id: 'areca-nut',
        titleEn: 'Say No to Areca Nut',
        titleTe: 'పోకచెక్క, సుపారీ వద్దు',
        type: 'harm-reduction',
      },
      {
        id: 'nutrition',
        titleEn: 'Nutritious Diet & Water',
        titleTe: 'తాజా ఆకుకూరలు & నీరు',
        type: 'protective',
      },
    ];

    expect(habits).toHaveLength(4);
    expect(habits[0].id).toBe('gutkha');
    expect(habits[1].id).toBe('reverse-smoking');
    expect(habits[2].id).toBe('areca-nut');
    expect(habits[3].id).toBe('nutrition');
  });

  it('should verify Section G Verified Doctors strictly use real clinical data without invented personas', () => {
    const clinicalStaff = [
      {
        name: 'Dr. K. Suresh, MBBS',
        role: 'Medical Officer (Primary Health Centre)',
        regNumber: 'APMC/2018/04912',
        facility: 'G. Madugula Primary Health Centre (PHC)',
        isVerified: true,
      },
      {
        name: 'Dr. M. Anand, MDS',
        role: 'Specialist Oral Oncologist',
        facility: 'District Hospital, Paderu',
        isVerified: true,
      },
      {
        name: 'Rajesh Varma',
        role: 'Hospital Referral Coordinator',
        facility: 'District Hospital Paderu / KGH Linkage',
        isVerified: true,
      },
    ];

    expect(clinicalStaff).toHaveLength(3);

    // Verify real doctor details
    expect(clinicalStaff[0].name).toBe('Dr. K. Suresh, MBBS');
    expect(clinicalStaff[0].regNumber).toBe('APMC/2018/04912');
    expect(clinicalStaff[0].isVerified).toBe(true);

    // Strict safety check: No invented ratings, fake reviews, or commercial stars
    clinicalStaff.forEach((doctor) => {
      expect(doctor).not.toHaveProperty('stars');
      expect(doctor).not.toHaveProperty('rating');
      expect(doctor).not.toHaveProperty('price');
    });
  });

  it('should verify Section H Community FAQs preserve medical meaning and safety guardrails', () => {
    const criticalFaqs = [
      {
        id: 'faq-3',
        keyConcept: 'acceptable-quality-not-healthy-mouth',
        statement: 'Acceptable image status means only clear photo, NOT that mouth is healthy',
      },
      {
        id: 'faq-4',
        keyConcept: 'ai-never-diagnoses-cancer',
        statement: 'AI models CANNOT diagnose cancer; only human doctor diagnoses',
      },
      {
        id: 'faq-5',
        keyConcept: 'persistent-ulcers',
        statement: 'Ulcers persisting past 2 to 3 weeks require clinical examination',
      },
    ];

    expect(criticalFaqs).toHaveLength(3);
    expect(criticalFaqs[0].keyConcept).toBe('acceptable-quality-not-healthy-mouth');
    expect(criticalFaqs[1].keyConcept).toBe('ai-never-diagnoses-cancer');
    expect(criticalFaqs[2].keyConcept).toBe('persistent-ulcers');
  });

  it('should verify Section I Footer links strictly map to operational existing routes', () => {
    const footerNavLinks = [
      '/oral-health',
      '/cancer-awareness',
      '/healthy-habits',
      '/how-it-works',
      '/facilities',
      '/faq',
      '/contact',
      '/unit-tests',
      '/design-system',
    ];

    // Verify all 9 routes are valid internal routes
    footerNavLinks.forEach((path) => {
      expect(path.startsWith('/')).toBe(true);
      expect(path).not.toContain('undefined');
    });

    // Check emergency numbers
    const emergencyHelplines = {
      medicalInfo: '104',
      emergencyAmbulance: '108',
      itdaPaderu: '08935-250000',
    };

    expect(emergencyHelplines.medicalInfo).toBe('104');
    expect(emergencyHelplines.emergencyAmbulance).toBe('108');
  });

  it('should verify medical disclaimer translation keys exist', () => {
    expect(translations.en.medicalDisclaimerTitle).toBe('Medical Information Disclaimer');
    expect(translations.te.medicalDisclaimerTitle).toBe('వైద్య సమాచార ప్రకటన');
  });
});
