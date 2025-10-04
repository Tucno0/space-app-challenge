import type { Metadata } from 'next';
import type { Locale } from '../../i18n-config';
import { getDictionary } from '@/lib/get-dictionary';

export async function generatePageMetadata(
  locale: Locale,
  pageKey: keyof typeof import('../../locales/en.json')['metadata']
): Promise<Metadata> {
  const dict = await getDictionary(locale);
  const pageMetadata = dict.metadata[pageKey];

  return {
    title: pageMetadata.title,
    description: pageMetadata.description,
    openGraph: {
      title: pageMetadata.title,
      description: pageMetadata.description,
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageMetadata.title,
      description: pageMetadata.description,
    },
    alternates: {
      languages: {
        en: `/en`,
        es: `/es`,
      },
    },
  };
}
