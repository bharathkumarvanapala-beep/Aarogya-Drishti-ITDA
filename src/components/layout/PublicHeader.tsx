import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, ArrowLeft } from 'lucide-react';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { Button } from '../common/Button';
import { useTranslation } from '../../i18n';

export const PublicHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, t } = useTranslation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on Escape key press for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Main Desktop Navigation: ONLY Home and About.
  // Dynamic single-language label based on active language:
  const navLinks = [
    { path: '/', label: t('home') },
    { path: '/about', label: t('about') },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#B6CFC4]/30 shadow-[0_2px_12px_rgba(7,94,78,0.04)] transition-all select-none">
      {/* Top ITDA Paderu Banner */}
      <div className="bg-[#064B40] text-white py-1.5 px-4 text-xs font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t('itdaBanner')}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px] text-[#E7F2EF]/90 font-mono">
            <span>Alluri Sitharama Raju District • ITDA Paderu</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex items-center">
            {/* Go to Previous Arrow (visible when navigated away from Home) */}
            {location.pathname !== '/' && (
              <button
                type="button"
                onClick={() => {
                  if (window.history.state && window.history.state.idx > 0) {
                    navigate(-1);
                  } else {
                    navigate('/');
                  }
                }}
                className="mr-2 sm:mr-3 p-2 sm:p-2.5 rounded-xl text-[#064B40] bg-[#E7F2EF] hover:bg-[#d8ece7] border border-[#075E4E]/25 transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#075E4E] cursor-pointer group shadow-sm shrink-0"
                aria-label={language === 'te' ? 'మునుపటి పేజీకి వెళ్లండి' : 'Go to previous page'}
                title={language === 'te' ? 'మునుపటి పేజీకి వెళ్లండి' : 'Go to previous page'}
              >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </button>
            )}

            {/* Left: Official Aarogya Drishti Brand Logo Image & Subtitle */}
            <Link
              to="/"
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#075E4E] rounded-xl p-1 no-underline hover:no-underline"
              aria-label="AAROGYA DRISHTI Home"
            >
              <div className="relative flex items-center justify-center shrink-0">
                <img
                  src="/images/aarogya-drishti-logo.png"
                  alt="Aarogya Drishti Oral Health Platform"
                  className="h-10 sm:h-12 w-auto max-w-[48px] sm:max-w-[56px] object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/aarogya-drishti-logo.svg';
                  }}
                />
              </div>
              <div className="no-underline">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#064B40] block leading-tight no-underline">
                  AAROGYA DRISHTI
                </span>
                <span className="text-xs font-telugu text-[#075E4E] font-semibold block -mt-0.5 no-underline">
                  {language === 'te' ? 'ఆరోగ్య దృష్టి · నోటి ఆరోగ్య వేదిక' : 'ఆరోగ్య దృష్టి · Oral Health Platform'}
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Main Navigation Tabs (Home, About - single language, no underlines) */}
          <nav
            className="hidden md:flex items-center gap-3"
            role="navigation"
            aria-label="Main Desktop Navigation"
          >
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all no-underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-[#075E4E] ${
                    active
                      ? 'bg-[#E7F2EF] text-[#064B40] font-bold shadow-sm'
                      : 'text-[#263B35] hover:text-[#075E4E] hover:bg-[#E7F2EF]/60 font-semibold'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="no-underline">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Language Selector & Portal Login Button */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher variant="pill" />
            <Link
              to="/login"
              className="focus:outline-none focus:ring-2 focus:ring-[#075E4E] rounded-xl no-underline hover:no-underline"
            >
              <Button
                variant="primary"
                size="sm"
                icon={LogIn}
                className="bg-[#075E4E] hover:bg-[#064B40] text-white shadow-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
              >
                {t('login')}
              </Button>
            </Link>
          </div>

          {/* Mobile View: Hamburger Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-[#064B40] hover:bg-[#E7F2EF] min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#075E4E] transition-colors"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="md:hidden bg-white border-b border-[#B6CFC4]/40 px-4 pt-3 pb-6 space-y-4 shadow-lg"
          role="navigation"
          aria-label="Mobile Navigation"
        >
          {/* Nav Links: Home & About */}
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-semibold flex items-center justify-between no-underline hover:no-underline transition-colors focus:outline-none focus:ring-2 focus:ring-[#075E4E] ${
                    active
                      ? 'bg-[#E7F2EF] text-[#064B40] font-bold shadow-sm'
                      : 'text-[#263B35] hover:bg-[#E7F2EF]/50'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="no-underline">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Language Selection & Portal Login for Mobile */}
          <div className="pt-3 border-t border-[#B6CFC4]/30 flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-[#263B35]">
                {language === 'te' ? 'భాష ఎంపిక:' : 'Language / భాష:'}
              </span>
              <LanguageSwitcher variant="pill" />
            </div>

            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full focus:outline-none focus:ring-2 focus:ring-[#075E4E] rounded-xl no-underline hover:no-underline"
            >
              <Button
                variant="primary"
                fullWidth
                size="lg"
                icon={LogIn}
                className="bg-[#075E4E] hover:bg-[#064B40] text-white shadow-sm font-semibold rounded-xl"
              >
                {t('login')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
