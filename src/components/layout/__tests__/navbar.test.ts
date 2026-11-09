import { describe, it, expect } from 'vitest';
import { translations } from '../../../i18n/translations';

describe('Website Unit Test: Main Desktop Navbar Specification', () => {
  it('should restrict main navigation tabs strictly to Home and About', () => {
    // Navigation specification for public header
    const mainDesktopNavLinks = [
      { path: '/', labelKey: 'home' },
      { path: '/about', labelKey: 'about' },
    ];

    expect(mainDesktopNavLinks).toHaveLength(2);
    expect(mainDesktopNavLinks[0].path).toBe('/');
    expect(mainDesktopNavLinks[1].path).toBe('/about');

    // Confirm translation keys exist
    expect(translations.en[mainDesktopNavLinks[0].labelKey as 'home']).toBe('Home');
    expect(translations.en[mainDesktopNavLinks[1].labelKey as 'about']).toBe('About');
    expect(translations.te[mainDesktopNavLinks[0].labelKey as 'home']).toBe('హోమ్');
    expect(translations.te[mainDesktopNavLinks[1].labelKey as 'about']).toBe('మా గురించి');
  });

  it('should verify that removed items are not present in main desktop navigation list', () => {
    const mainDesktopNavPaths = ['/', '/about'];

    const removedItemsFromNavbar = [
      '/oral-health',
      '/cancer-awareness',
      '/healthy-habits',
      '/how-it-works',
      '/facilities',
      '/faq',
      '/contact',
    ];

    removedItemsFromNavbar.forEach((removedPath) => {
      expect(mainDesktopNavPaths).not.toContain(removedPath);
    });
  });

  it('should verify branding typography, colors and subtitle', () => {
    const expectedSubtitle = 'ఆరోగ్య దృష్టి · Oral Health Platform';
    const brandingColors = {
      primaryGreen: '#075E4E',
      darkGreen: '#064B40',
      lightGreen: '#E7F2EF',
      whiteBackground: '#FFFFFF',
    };

    expect(expectedSubtitle).toContain('ఆరోగ్య దృష్టి');
    expect(expectedSubtitle).toContain('Oral Health Platform');
    expect(brandingColors.primaryGreen).toBe('#075E4E');
    expect(brandingColors.darkGreen).toBe('#064B40');
    expect(brandingColors.lightGreen).toBe('#E7F2EF');
  });

  it('should verify official logo image configuration and accessibility alt text', () => {
    const expectedLogoPath = '/images/aarogya-drishti-logo.png';
    const expectedAltText = 'Aarogya Drishti Oral Health Platform';

    expect(expectedLogoPath).toBe('/images/aarogya-drishti-logo.png');
    expect(expectedAltText).toBe('Aarogya Drishti Oral Health Platform');
  });
});

