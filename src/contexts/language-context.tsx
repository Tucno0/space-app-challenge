'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { Locale } from '../../i18n-config';
import type { Dictionary } from '@/lib/get-dictionary';

interface LanguageContextType {
  locale: Locale;
  dictionary: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
  locale: Locale;
  dictionary: Dictionary;
}

export function LanguageProvider({
  children,
  locale,
  dictionary,
}: LanguageProviderProps) {
  return (
    <LanguageContext.Provider value={{ locale, dictionary }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
