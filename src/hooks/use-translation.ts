'use client';

import { useLanguage } from '@/contexts/language-context';

/**
 * Hook to access translations in client components
 * Returns the dictionary and locale
 */
export function useTranslation() {
  const { dictionary, locale } = useLanguage();

  // Helper function to get nested translation values
  const t = (key: string): string => {
    const keys = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = dictionary;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return {
    t,
    dictionary,
    locale,
  };
}

// Type-safe translation accessor
export type TranslationKey = string;
