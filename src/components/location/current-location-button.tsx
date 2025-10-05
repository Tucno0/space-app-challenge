'use client';

import { useState } from 'react';
import { Locate, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentLocation } from '@/lib/geolocation';
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
      // Get current geolocation
      const result = await getCurrentLocation();
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
      toast.error(
        error instanceof Error ? error.message : 'Failed to get location'
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
