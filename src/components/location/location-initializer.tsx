'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useLocationStore } from '@/hooks/use-location-store';
import { getCurrentLocation } from '@/lib/geolocation';
import { geoDBCityToLocation } from '@/types/location';
import { useTRPC } from '@/trpc/client';
import { useQueryClient } from '@tanstack/react-query';

export function LocationInitializer() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [hasInitialized, setHasInitialized] = useState(false);

  const currentLocation = useLocationStore((state) => state.currentLocation);
  const setCurrentLocation = useLocationStore(
    (state) => state.setCurrentLocation
  );
  const setIsLoading = useLocationStore((state) => state.setIsLoading);

  useEffect(() => {
    // Only run once
    if (hasInitialized) return;
    setHasInitialized(true);

    // If we already have a location from cookies, still try to update it
    const initializeLocation = async () => {
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

        // Only show success if we didn't have a location before
        if (!currentLocation) {
          toast.success(
            `Location detected: ${location.name}, ${location.country}`
          );
        }
      } catch (error) {
        // If geolocation fails and we don't have a location, inform the user
        if (!currentLocation) {
          toast.info(
            'Location access denied. Please search for your city manually.',
            {
              duration: 5000,
            }
          );
        }

        console.error('Location detection error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeLocation();
  }, [
    hasInitialized,
    currentLocation,
    setCurrentLocation,
    setIsLoading,
    trpc.cities.getCityByCoordinates,
    queryClient,
  ]);

  // This component doesn't render anything
  return null;
}
