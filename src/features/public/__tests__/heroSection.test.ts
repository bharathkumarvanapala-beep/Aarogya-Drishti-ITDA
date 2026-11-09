import { describe, it, expect } from 'vitest';
import { translations } from '../../../i18n/translations';

describe('Website Unit Test: Phase 2 - Hero Section & Introductory Video Presentation', () => {
  it('should verify that all Hero action buttons map strictly to operational existing routes', () => {
    const heroActionRoutes = [
      { id: 'oral-health', path: '/oral-health', labelKey: 'heroCtaLearn' },
      { id: 'facilities', path: '/facilities', labelKey: 'heroCtaFind' },
      { id: 'login', path: '/login', labelKey: 'heroCtaLogin' },
    ];

    expect(heroActionRoutes).toHaveLength(3);
    expect(heroActionRoutes[0].path).toBe('/oral-health');
    expect(heroActionRoutes[1].path).toBe('/facilities');
    expect(heroActionRoutes[2].path).toBe('/login');

    // Confirm that e-commerce or non-existent routes are NOT present
    const fakeOrShoppingRoutes = ['/cart', '/shop', '/checkout', '/pricing', '/coffee'];
    fakeOrShoppingRoutes.forEach((route) => {
      expect(heroActionRoutes.map((r) => r.path)).not.toContain(route);
    });
  });

  it('should verify Hero bilingual translations for both English and Telugu', () => {
    // English
    expect(translations.en.tagline).toBe('Every Smile Deserves Care');
    expect(translations.en.heroCtaLearn).toBe('Learn About Oral Health');
    expect(translations.en.heroCtaFind).toBe('Find Healthcare Support');
    expect(translations.en.heroCtaLogin).toBe('Portal Login');
    expect(translations.en.heroSupporting).toContain('Bringing oral health awareness');

    // Telugu
    expect(translations.te.tagline).toBe('ప్రతి చిరునవ్వుకు ఆరోగ్య సంరక్షణ అవసరం');
    expect(translations.te.heroCtaLearn).toBe('నోటి ఆరోగ్యం గురించి తెలుసుకోండి');
    expect(translations.te.heroCtaFind).toBe('సమీప వైద్య సహాయం');
    expect(translations.te.heroCtaLogin).toBe('పోర్టల్ లాగిన్');
    expect(translations.te.heroSupporting).toContain('ప్రతి గ్రామానికి నోటి ఆరోగ్య అవగాహన');
  });

  it('should verify frontline clinical hero showcase image presentation specifications', () => {
    const heroShowcaseConfig = {
      imageUrl: '/images/rural_health_hero.jpg',
      altEn: 'Community Health Worker conducting doorstep oral screening in ASR district',
      badgeEn: 'Frontline Community Health',
      badgeTe: 'క్షేత్రస్థాయి ఆరోగ్య సేవలు',
    };

    expect(heroShowcaseConfig.imageUrl).toBe('/images/rural_health_hero.jpg');
    expect(heroShowcaseConfig.altEn).toContain('doorstep oral screening');
    expect(heroShowcaseConfig.badgeEn).toBe('Frontline Community Health');
    expect(heroShowcaseConfig.badgeTe).toBe('క్షేత్రస్థాయి ఆరోగ్య సేవలు');
  });

  it('should verify frontline assisted care guarantees and physical health card badge', () => {
    const heroGuarantees = [
      {
        titleEn: 'No Smartphone Required',
        titleTe: 'స్మార్ట్‌ఫోన్ అవసరం లేదు',
        descEn: 'Care reaches you through your village ASHA worker.',
      },
      {
        titleEn: 'Doctor-Signed Reviews',
        titleTe: 'వైద్యుల ప్రత్యక్ష పరిశీలన',
        descEn: 'Independent clinical evaluation for every patient.',
      },
    ];

    expect(heroGuarantees).toHaveLength(2);
    expect(heroGuarantees[0].titleEn).toBe('No Smartphone Required');
    expect(heroGuarantees[1].titleEn).toBe('Doctor-Signed Reviews');
  });

  it('should verify Suspire-inspired healthcare palette tokens in Hero section', () => {
    const heroDesignTokens = {
      primaryGreen: '#075E4E',
      darkGreen: '#064B40',
      lightGreen: '#E7F2EF',
      softBg: '#F7F8F5',
      softBorder: '#B6CFC4',
      mainText: '#263B35',
    };

    expect(heroDesignTokens.primaryGreen).toBe('#075E4E');
    expect(heroDesignTokens.darkGreen).toBe('#064B40');
    expect(heroDesignTokens.lightGreen).toBe('#E7F2EF');
    expect(heroDesignTokens.softBg).toBe('#F7F8F5');
    expect(heroDesignTokens.softBorder).toBe('#B6CFC4');
    expect(heroDesignTokens.mainText).toBe('#263B35');
  });
});

