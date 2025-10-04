'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { i18n, Locale } from '../../../i18n-config';
import { useLanguage } from '@/contexts/language-context';

const languageNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
};

const languageFlags: Record<Locale, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
};

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale: currentLocale } = useLanguage();

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    // Remove current locale from pathname
    const segments = pathname.split('/').filter(Boolean);
    const currentLocaleIndex = segments.findIndex((segment) =>
      i18n.locales.includes(segment as Locale)
    );

    if (currentLocaleIndex !== -1) {
      segments[currentLocaleIndex] = newLocale;
    } else {
      segments.unshift(newLocale);
    }

    const newPath = `/${segments.join('/')}`;

    // Set cookie to persist locale preference
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${
      60 * 60 * 24 * 365
    }; SameSite=Lax`;

    router.push(newPath);
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title="Change language">
          <Languages className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {i18n.locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => switchLocale(locale)}
            className={
              locale === currentLocale ? 'bg-accent font-semibold' : ''
            }
          >
            <span className="mr-2">{languageFlags[locale]}</span>
            {languageNames[locale]}
            {locale === currentLocale && (
              <span className="ml-auto text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
