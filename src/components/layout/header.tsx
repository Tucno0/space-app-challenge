'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Cloud, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationSelector } from '@/components/location/location-selector';
import { CurrentLocationButton } from '@/components/location/current-location-button';
import { ThemeToggle } from './theme-toggle';
import { Navigation } from './navigation';

export function Header() {
  const [location, setLocation] = useState('Los Angeles, CA');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLocationDetected = (lat: number, lon: number) => {
    // In a real app, reverse geocode to get location name
    setLocation(`${lat.toFixed(2)}, ${lon.toFixed(2)}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-lg bg-primary p-1.5">
            <Cloud className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">AirCast</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Navigation />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2">
            <LocationSelector
              currentLocation={location}
              onLocationChange={setLocation}
              savedLocations={['Los Angeles, CA', 'New York, NY']}
            />
            <CurrentLocationButton
              onLocationDetected={handleLocationDetected}
            />
          </div>

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
              <LocationSelector
                currentLocation={location}
                onLocationChange={(loc) => {
                  setLocation(loc);
                  setMobileMenuOpen(false);
                }}
                savedLocations={['Los Angeles, CA', 'New York, NY']}
              />
              <CurrentLocationButton
                onLocationDetected={(lat, lon) => {
                  handleLocationDetected(lat, lon);
                  setMobileMenuOpen(false);
                }}
                variant="outline"
                size="default"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
