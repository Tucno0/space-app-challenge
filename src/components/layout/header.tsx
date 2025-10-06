'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Cloud, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationSelector } from '@/components/location/location-selector';
import { CurrentLocationButton } from '@/components/location/current-location-button';
import { ThemeToggle } from './theme-toggle';
import { Navigation } from './navigation';
import { LanguageSwitcher } from './language-switcher';
import { useLanguage } from '@/contexts/language-context';

export function Header() {
  const { locale } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="rounded-lg bg-primary p-1.5">
            <Cloud className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">IQA Predict</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Navigation />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2">
            <LocationSelector />
            <CurrentLocationButton />
          </div>

          <LanguageSwitcher />
          <ThemeToggle />

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            <Navigation mobile onNavigate={() => setMobileMenuOpen(false)} />
            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <LocationSelector />
                </div>
                <CurrentLocationButton variant="outline" size="default" />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
