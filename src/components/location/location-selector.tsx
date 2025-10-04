'use client';
import { MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LocationSelectorProps {
  currentLocation: string;
  onLocationChange: (location: string) => void;
  savedLocations?: string[];
}

const popularLocations = [
  'Los Angeles, CA',
  'New York, NY',
  'Chicago, IL',
  'Houston, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
  'San Antonio, TX',
  'San Diego, CA',
  'Dallas, TX',
  'San Jose, CA',
];

export function LocationSelector({
  currentLocation,
  onLocationChange,
  savedLocations = [],
}: LocationSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <MapPin className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLocation}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Select Location</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {savedLocations.length > 0 && (
          <>
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Saved Locations
            </DropdownMenuLabel>
            {savedLocations.map((location) => (
              <DropdownMenuItem
                key={location}
                onClick={() => onLocationChange(location)}
                className={currentLocation === location ? 'bg-accent' : ''}
              >
                {location}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          Popular Cities
        </DropdownMenuLabel>
        {popularLocations.map((location) => (
          <DropdownMenuItem
            key={location}
            onClick={() => onLocationChange(location)}
            className={currentLocation === location ? 'bg-accent' : ''}
          >
            {location}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
