'use client';

import { useState } from 'react';
import { Locate, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentLocation } from '@/lib/geolocation';
import { DEFAULT_LOCATION } from '@/lib/default-location';
import { toast } from 'sonner';
import { useLocationStore } from '@/hooks/use-location-store';
import { geoDBCityToLocation } from '@/types/location';
import { useTRPC } from '@/trpc/client';
import { useQueryClient } from '@tanstack/react-query';

interface CurrentLocationButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function CurrentLocationButton({
  variant = 'outline',
  size = 'default',
}: CurrentLocationButtonProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const setCurrentLocation = useLocationStore(
    (state) => state.setCurrentLocation
  );

  const handleGetLocation = async () => {
    setIsLoading(true);
    try {
      // Force a fresh location request, bypassing cache
      // This will always prompt the user for permission if not granted
      const result = await getCurrentLocation({ forceRefresh: true });
      const { lat, lon } = result.coordinates;

      // Fetch city information from GeoDB API using queryClient.fetchQuery
      const city = await queryClient.fetchQuery(
        trpc.cities.getCityByCoordinates.queryOptions({
          lat,
          lon,
          radius: 50,
        })
      );

      // Convert to Location type and save
      const location = geoDBCityToLocation(city);
      setCurrentLocation(location);

      toast.success(`Location detected: ${location.city}, ${location.country}`);
    } catch (error) {
      // If location fails, fallback to Lima
      console.log('Location detection failed, using default location:', error);
      setCurrentLocation(DEFAULT_LOCATION);

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to get location';

      toast.error(
        `${errorMessage}. Showing data for ${DEFAULT_LOCATION.name}, ${DEFAULT_LOCATION.country}.`,
        {
          duration: 6000,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleGetLocation}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Locate className="h-4 w-4" />
      )}
      {size !== 'icon' && (
        <span className="hidden sm:inline">
          {isLoading ? 'Detecting...' : 'Use My Location'}
        </span>
      )}
    </Button>
  );
}
