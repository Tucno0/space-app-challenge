import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { i18n } from '../i18n-config';
import { createLocaleCookie, resolveLocale } from './lib/locale-detection';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if pathname already has a locale
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Detect locale for root path or paths without locale
  const detectedLocale = resolveLocale(request.headers);

  // Redirect to locale path
  const newUrl = new URL(`/${detectedLocale}${pathname}`, request.url);

  // Copy search params
  newUrl.search = request.nextUrl.search;

  const response = NextResponse.redirect(newUrl);

  // Set locale cookie
  response.headers.set('Set-Cookie', createLocaleCookie(detectedLocale));

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for:
    // - /api (API routes)
    // - /_next (Next.js internals)
    // - /favicon.ico, /sitemap.xml, /robots.txt (static files)
    // - Files with extensions (e.g., .svg, .png, .jpg, etc.)
    '/((?!api|_next|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
};
