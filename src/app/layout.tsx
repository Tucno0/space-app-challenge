import type { Metadata } from 'next';
import { Geist_Mono, Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { TRPCReactProvider } from '@/trpc/client';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AirCast - Real-Time Air Quality Monitoring',
  description:
    'Monitor air quality in real-time with data from NASA TEMPO satellite, Pandora, and OpenAQ networks. Get personalized alerts and forecasts.',
  keywords: [
    'air quality',
    'AQI',
    'NASA TEMPO',
    'pollution',
    'weather',
    'health',
  ],
  authors: [{ name: 'AirCast Team' }],
  openGraph: {
    title: 'AirCast - Real-Time Air Quality Monitoring',
    description:
      'Monitor air quality in real-time with NASA satellite and ground station data',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistMono.variable} ${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 w-full">{children}</main>
              <Footer />
            </div>
            <Toaster position="top-right" richColors />
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
