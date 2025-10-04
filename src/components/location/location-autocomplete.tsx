'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface LocationAutocompleteProps {
  onLocationSelect: (location: string) => void;
  placeholder?: string;
}

const mockLocations = [
  'Los Angeles, CA, USA',
  'New York, NY, USA',
  'Chicago, IL, USA',
  'Houston, TX, USA',
  'Phoenix, AZ, USA',
  'Philadelphia, PA, USA',
  'San Antonio, TX, USA',
  'San Diego, CA, USA',
  'Dallas, TX, USA',
  'Mexico City, Mexico',
  'Toronto, ON, Canada',
  'Vancouver, BC, Canada',
];

export function LocationAutocomplete({
  onLocationSelect,
  placeholder = 'Search for a location...',
}: LocationAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredLocations = mockLocations.filter((location) =>
    location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="pl-9"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 w-[var(--radix-popover-trigger-width)]"
        align="start"
      >
        <Command>
          <CommandList>
            <CommandEmpty>No locations found.</CommandEmpty>
            <CommandGroup>
              {filteredLocations.map((location) => (
                <CommandItem
                  key={location}
                  value={location}
                  onSelect={() => {
                    onLocationSelect(location);
                    setSearch(location);
                    setOpen(false);
                  }}
                >
                  {location}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
