import React from 'react';
import { Languages } from 'lucide-react';
import { useTranslation } from '../../i18n';

export interface LanguageSwitcherProps {
  variant?: 'pill' | 'button' | 'compact';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'pill',
  className = '',
}) => {
  const { language, setLanguage, toggleLanguage } = useTranslation();

  if (variant === 'compact') {
    return (
      <button
        onClick={toggleLanguage}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-forest-200 bg-white/90 text-forest-900 hover:bg-forest-100 transition-colors ${className}`}
        title={language === 'en' ? 'తెలుగులోకి మార్చండి' : 'Switch to English'}
        aria-label="Toggle language"
      >
        <Languages className="w-3.5 h-3.5 text-forest-700" />
        <span>{language === 'en' ? 'తెలుగు' : 'English'}</span>
      </button>
    );
  }

  return (
    <div
      className={`inline-flex items-center p-1 rounded-xl bg-forest-100/70 border border-forest-200/80 shadow-sm ${className}`}
      role="group"
      aria-label="Language selection"
    >
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all min-h-[36px] ${
          language === 'en'
            ? 'bg-forest-900 text-white shadow-sm'
            : 'text-ink-muted hover:text-ink hover:bg-white/40'
        }`}
        aria-pressed={language === 'en'}
      >
        English
      </button>

      <button
        onClick={() => setLanguage('te')}
        className={`px-3.5 py-1.5 text-xs sm:text-sm font-telugu font-semibold rounded-lg transition-all min-h-[36px] ${
          language === 'te'
            ? 'bg-forest-900 text-white shadow-sm'
            : 'text-ink-muted hover:text-ink hover:bg-white/40'
        }`}
        aria-pressed={language === 'te'}
      >
        తెలుగు
      </button>
    </div>
  );
};
