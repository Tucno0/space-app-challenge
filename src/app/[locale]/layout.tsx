import { Geist_Mono, Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { cookies } from 'next/headers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { TRPCReactProvider } from '@/trpc/client';
import { LanguageProvider } from '@/contexts/language-context';
import { LocationStoreProvider } from '@/providers/location-store-provider';
import { LocationInitializer } from '@/components/location/location-initializer';
import { getDictionary } from '@/lib/get-dictionary';
import { generatePageMetadata } from '@/lib/metadata';
import {
  getLocationCookieServer,
  getSavedLocationsCookieServer,
} from '@/lib/cookies';
import { i18n, type Locale } from '../../../i18n-config';
import '../globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata(locale as Locale, 'home');
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as Locale);

  // Read location data from cookies
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const currentLocation = getLocationCookieServer(cookieHeader);
  const savedLocations = getSavedLocationsCookieServer(cookieHeader);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistMono.variable} ${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider locale={locale as Locale} dictionary={dictionary}>
            <TRPCReactProvider>
              <LocationStoreProvider
                initialCurrentLocation={currentLocation}
                initialSavedLocations={savedLocations}
              >
                <LocationInitializer />
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-1 w-full">{children}</main>
                  <Footer />
                </div>
                <Toaster position="top-right" richColors />
              </LocationStoreProvider>
            </TRPCReactProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
