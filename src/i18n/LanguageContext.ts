import { createContext } from 'react';
import type { Language } from '../types';
import type { TranslationKey } from './translations';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey, fallback?: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
