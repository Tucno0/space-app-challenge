'use client';

import {
  MapPin,
  ChevronDown,
  Star,
  X,
  Bookmark,
  Search,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useLocationStore } from '@/hooks/use-location-store';
import { geoDBCityToLocation } from '@/types/location';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState, useDeferredValue } from 'react';

export function LocationSelector() {
  const trpc = useTRPC();
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);

  const currentLocation = useLocationStore((state) => state.currentLocation);
  const savedLocations = useLocationStore((state) => state.savedLocations);
  const setCurrentLocation = useLocationStore(
    (state) => state.setCurrentLocation
  );
  const addSavedLocation = useLocationStore((state) => state.addSavedLocation);
  const removeSavedLocation = useLocationStore(
    (state) => state.removeSavedLocation
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
      toast.success(`Location set to ${location.city}, ${location.country}`);
    }
  };

  const handleSaveCurrentLocation = () => {
    if (!currentLocation) {
      toast.error('No location selected');
      return;
    }

    const alreadySaved = savedLocations.some(
      (loc) => loc.id === currentLocation.id
    );

    if (alreadySaved) {
      toast.info('Location already saved');
      return;
    }

    if (savedLocations.length >= 10) {
      toast.error('Maximum 10 saved locations reached');
      return;
    }

    addSavedLocation(currentLocation);
    toast.success('Location saved');
  };

  const handleRemoveSavedLocation = (
    e: React.MouseEvent,
    locationId: string
  ) => {
    e.stopPropagation();
    removeSavedLocation(locationId);
    toast.success('Location removed');
  };

  const displayName = currentLocation
    ? `${currentLocation.city}, ${currentLocation.country}`
    : 'Select Location';

  const isCurrentLocationSaved = currentLocation
    ? savedLocations.some((loc) => loc.id === currentLocation.id)
    : false;

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 min-w-[180px]">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline max-w-[200px] truncate">
              {displayName}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50 ml-auto" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Select Location</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Search Input */}
          <div className="px-2 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cities..."
                className="pl-9 h-9"
              />
              {isLoading && search.length > 0 && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground pointer-events-none" />
              )}
            </div>
          </div>

          {/* Search Results */}
          {search.length > 0 && (
            <>
              <div className="max-h-[200px] overflow-y-auto">
                {isLoading ? (
                  <div className="p-2 space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2 rounded-md animate-pulse"
                      >
                        <div className="h-4 w-4 bg-muted rounded-full flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-muted rounded w-3/4" />
                          <div className="h-2 bg-muted rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : cities && cities.length > 0 ? (
                  <div className="p-1">
                    {cities.map((city) => (
                      <DropdownMenuItem
                        key={city.id}
                        onClick={() => handleSelectCity(city.id)}
                        className="cursor-pointer rounded-md px-2 py-2"
                      >
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-medium truncate text-sm">
                            {city.name}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {city.region && `${city.region}, `}
                            {city.country}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No cities found
                  </div>
                )}
              </div>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Saved Locations */}
          {savedLocations.length > 0 && (
            <>
              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal flex items-center justify-between">
                <span>Saved Locations ({savedLocations.length}/10)</span>
              </DropdownMenuLabel>
              <div className="max-h-[150px] overflow-y-auto">
                {savedLocations.map((location) => {
                  const isActive = currentLocation?.id === location.id;
                  return (
                    <DropdownMenuItem
                      key={location.id}
                      onClick={() => setCurrentLocation(location)}
                      className={`flex items-center justify-between ${
                        isActive ? 'bg-accent' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Star className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate text-sm">
                          {location.city}, {location.country}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 flex-shrink-0"
                        onClick={(e) =>
                          handleRemoveSavedLocation(e, location.id)
                        }
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </DropdownMenuItem>
                  );
                })}
              </div>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Save Current Location Button */}
          {currentLocation && !isCurrentLocationSaved && (
            <>
              <DropdownMenuItem onClick={handleSaveCurrentLocation}>
                <Bookmark className="h-4 w-4 mr-2" />
                Save Current Location
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Help Text */}
          {search.length === 0 && savedLocations.length === 0 && (
            <div className="px-2 py-4 text-center text-xs text-muted-foreground">
              Search for a city above to get started
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
