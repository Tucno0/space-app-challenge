import Link from 'next/link';
import { Satellite, Globe, Radio } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">About AirCast</h3>
            <p className="text-sm text-muted-foreground">
              Real-time air quality monitoring powered by NASA&apos;s TEMPO
              satellite and ground station networks.
            </p>
          </div>

          {/* Data Sources */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Data Sources</h3>
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
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/forecast"
                  className="hover:text-foreground transition-colors"
                >
                  Forecast
                </Link>
              </li>
              <li>
                <Link
                  href="/map"
                  className="hover:text-foreground transition-colors"
                >
                  Interactive Map
                </Link>
              </li>
              <li>
                <Link
                  href="/sources"
                  className="hover:text-foreground transition-colors"
                >
                  Data Sources
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Information</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/about"
                  className="hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/nasa/spaceapps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  NASA Space Apps
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>
              © {currentYear} AirCast. Built for NASA Space Apps Challenge 2025.
            </p>
            <p className="text-xs">
              Data provided by NASA TEMPO, Pandora, OpenAQ, and other public
              sources.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
