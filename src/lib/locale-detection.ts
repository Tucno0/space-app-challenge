import { i18n, Locale } from '../../i18n-config';

const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

// Map of country codes to preferred locales
const COUNTRY_LOCALE_MAP: Record<string, Locale> = {
  // Spanish-speaking countries
  ES: 'es', // Spain
  MX: 'es', // Mexico
  AR: 'es', // Argentina
  CO: 'es', // Colombia
  CL: 'es', // Chile
  PE: 'es', // Peru
  VE: 'es', // Venezuela
  EC: 'es', // Ecuador
  GT: 'es', // Guatemala
  CU: 'es', // Cuba
  BO: 'es', // Bolivia
  DO: 'es', // Dominican Republic
  HN: 'es', // Honduras
  PY: 'es', // Paraguay
  SV: 'es', // El Salvador
  NI: 'es', // Nicaragua
  CR: 'es', // Costa Rica
  PA: 'es', // Panama
  UY: 'es', // Uruguay
  GQ: 'es', // Equatorial Guinea
};

/**
 * Detect locale from Vercel Geo-IP headers
 */
export function detectLocaleFromGeoIP(headers: Headers): Locale | null {
  const country = headers.get('x-vercel-ip-country');

  if (country && COUNTRY_LOCALE_MAP[country]) {
    return COUNTRY_LOCALE_MAP[country];
  }

  return null;
}

/**
 * Parse Accept-Language header to extract preferred locale
 */
export function detectLocaleFromBrowser(
  acceptLanguage: string | null
): Locale | null {
  if (!acceptLanguage) return null;

  // Parse Accept-Language header (e.g., "en-US,en;q=0.9,es;q=0.8")
  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [locale, qValue] = lang.trim().split(';q=');
      const quality = qValue ? parseFloat(qValue) : 1.0;
      return { locale: locale.split('-')[0].toLowerCase(), quality };
    })
    .sort((a, b) => b.quality - a.quality);

  // Find first matching locale
  for (const { locale } of languages) {
    if (i18n.locales.includes(locale as Locale)) {
      return locale as Locale;
    }
  }

  return null;
}

/**
 * Get locale from cookie
 */
export function getLocaleFromCookie(
  cookieHeader: string | null
): Locale | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  const locale = cookies[LOCALE_COOKIE_NAME];

  if (locale && i18n.locales.includes(locale as Locale)) {
    return locale as Locale;
  }

  return null;
}

/**
 * Resolve locale with priority: cookie > geo-IP > browser > default
 */
export function resolveLocale(headers: Headers): Locale {
  // 1. Check cookie (saved preference)
  const cookieLocale = getLocaleFromCookie(headers.get('cookie'));
  if (cookieLocale) return cookieLocale;

  // 2. Check Geo-IP
  const geoLocale = detectLocaleFromGeoIP(headers);
  if (geoLocale) return geoLocale;

  // 3. Check browser language
  const browserLocale = detectLocaleFromBrowser(headers.get('accept-language'));
  if (browserLocale) return browserLocale;

  // 4. Default
  return i18n.defaultLocale;
}

/**
 * Create Set-Cookie header for locale
 */
export function createLocaleCookie(locale: Locale): string {
  return `${LOCALE_COOKIE_NAME}=${locale}; Path=/; Max-Age=${
    60 * 60 * 24 * 365
  }; SameSite=Lax`;
}

/**
 * Check if locale is valid
 */
export function isValidLocale(locale: string): locale is Locale {
  return i18n.locales.includes(locale as Locale);
}
