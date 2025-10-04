'use client';

import Link from 'next/link';
import { Satellite, Globe, Radio } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { locale, dictionary: dict } = useLanguage();

  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">{dict.footer.about}</h3>
            <p className="text-sm text-muted-foreground">
              {dict.footer.aboutText}
            </p>
          </div>

          {/* Data Sources */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">{dict.footer.dataSources}</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Satellite className="h-4 w-4" />
                <a
                  href="https://tempo.si.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NASA TEMPO
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Radio className="h-4 w-4" />
                <a
                  href="https://pandora.gsfc.nasa.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pandora Network
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Globe className="h-4 w-4" />
                <a
                  href="https://openaq.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OpenAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">{dict.footer.quickLinks}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href={`/${locale}`}
                  className="hover:text-foreground transition-colors"
                >
                  {dict.footer.dashboard}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/forecast`}
                  className="hover:text-foreground transition-colors"
                >
                  {dict.footer.forecast}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/map`}
                  className="hover:text-foreground transition-colors"
                >
                  {dict.footer.interactiveMap}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/sources`}
                  className="hover:text-foreground transition-colors"
                >
                  {dict.footer.dataSources}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">{dict.footer.information}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="hover:text-foreground transition-colors"
                >
                  {dict.footer.aboutLink}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="hover:text-foreground transition-colors"
                >
                  {dict.footer.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/terms`}
                  className="hover:text-foreground transition-colors"
                >
                  {dict.footer.terms}
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/nasa/spaceapps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  {dict.footer.spaceApps}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>
              © {currentYear} {dict.footer.copyright}
            </p>
            <p className="text-xs">{dict.footer.dataProvided}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
