'use client';

import { useState, useDeferredValue, useRef } from 'react';
import { Search, Loader2, MapPin } from 'lucide-react';
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
  PopoverAnchor,
} from '@/components/ui/popover';
import { useLocationStore } from '@/hooks/use-location-store';
import { geoDBCityToLocation } from '@/types/location';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';

interface LocationAutocompleteProps {
  placeholder?: string;
}

export function LocationAutocomplete({
  placeholder = 'Search for a city...',
}: LocationAutocompleteProps) {
  const trpc = useTRPC();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const inputRef = useRef<HTMLInputElement>(null);

  const setCurrentLocation = useLocationStore(
    (state) => state.setCurrentLocation
  );

  // Query cities from GeoDB API - only when there's a search term
  const { data: cities, isLoading } = useQuery({
    ...trpc.cities.searchCities.queryOptions({
      query: deferredSearch,
      limit: 10,
      offset: 0,
    }),
    enabled: deferredSearch.length > 0,
  });

  const handleSelectCity = (cityId: number) => {
    const selectedCity = cities?.find((city) => city.id === cityId);
    if (selectedCity) {
      const location = geoDBCityToLocation(selectedCity);
      setCurrentLocation(location);
      setSearch('');
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (value.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
          <Input
            ref={inputRef}
            value={search}
            onChange={handleInputChange}
            onFocus={() => {
              if (search.length > 0) {
                setOpen(true);
              }
            }}
            placeholder={placeholder}
            className="pl-9 w-full"
          />
          {isLoading && search.length > 0 && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground pointer-events-none z-10" />
          )}
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="p-0 w-[var(--radix-popover-anchor-width)]"
        align="start"
        side="bottom"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command shouldFilter={false}>
          <CommandList className="max-h-[300px]">
            {search.length === 0 ? (
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                Start typing to search for cities...
              </CommandEmpty>
            ) : isLoading ? (
              <div className="p-2 space-y-2">
                {/* Skeleton loaders */}
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-md animate-pulse"
                  >
                    <div className="h-4 w-4 bg-muted rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-center gap-2 py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Searching cities...
                  </span>
                </div>
              </div>
            ) : cities && cities.length > 0 ? (
              <CommandGroup heading="Cities" className="p-2">
                {cities.map((city) => (
                  <CommandItem
                    key={city.id}
                    value={city.id.toString()}
                    onSelect={() => handleSelectCity(city.id)}
                    className="cursor-pointer rounded-md px-2 py-3 aria-selected:bg-accent transition-colors"
                  >
                    <MapPin className="mr-3 h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-medium truncate text-sm">
                        {city.name}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {city.region && `${city.region}, `}
                        {city.country}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandEmpty className="py-8 text-center">
                <div className="flex flex-col items-center gap-2">
                  <MapPin className="h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    No cities found for &quot;{search}&quot;
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Try a different search term
                  </p>
                </div>
              </CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
