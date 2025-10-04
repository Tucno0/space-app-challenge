import 'server-only';
import type { Locale } from '../../i18n-config';

// Dictionary type - will be used for type safety
const dictionaries = {
  en: () => import('../../locales/en.json').then((module) => module.default),
  es: () => import('../../locales/es.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  try {
    return dictionaries[locale]?.() ?? dictionaries.en();
  } catch (error) {
    console.error(`Failed to load dictionary for locale: ${locale}`, error);
    return dictionaries.en();
  }
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
