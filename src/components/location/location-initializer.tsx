'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useLocationStore } from '@/hooks/use-location-store';
import {
  getCurrentLocation,
  checkGeolocationPermission,
} from '@/lib/geolocation';
import { DEFAULT_LOCATION } from '@/lib/default-location';
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
  const isLoading = useLocationStore((state) => state.isLoading);

  useEffect(() => {
    // Only run once
    if (hasInitialized) return;
    setHasInitialized(true);

    // If we already have a location from cookies, don't initialize
    if (currentLocation) {
      console.log('✅ Using saved location:', currentLocation.name);
      return;
    }

    const initializeLocation = async () => {
      console.log('🔄 Starting location initialization...');
      setIsLoading(true);

      try {
        // Check permission status first
        const permission = await checkGeolocationPermission();
        console.log('📍 Geolocation permission status:', permission);

        // If permission was previously denied or unsupported, use default location immediately
        if (permission === 'denied' || permission === 'unsupported') {
          console.log(
            '⚠️ Permission denied/unsupported, using default location:',
            DEFAULT_LOCATION.name
          );
          setCurrentLocation(DEFAULT_LOCATION);
          setIsLoading(false);

          if (permission === 'denied') {
            toast.info(
              `Location access denied. Showing data for ${DEFAULT_LOCATION.name}, ${DEFAULT_LOCATION.country}.`,
              { duration: 6000 }
            );
          }
          return;
        }

        // Try to get current geolocation (will prompt if permission is 'prompt')
        console.log('🌍 Requesting geolocation...');
        const result = await getCurrentLocation({
          forceRefresh: true,
          timeout: 8000,
        });
        const { lat, lon } = result.coordinates;

        console.log('✅ Geolocation received:', lat, lon);

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
        setIsLoading(false);

        console.log('✅ Location set:', location.name);
        toast.success(
          `Location detected: ${location.name}, ${location.country}`
        );
      } catch (error) {
        // If geolocation fails, use default location (Lima)
        console.error(
          '❌ Location detection failed, using default location:',
          error
        );

        // ALWAYS set default location on error
        setCurrentLocation(DEFAULT_LOCATION);
        setIsLoading(false);

        const errorMessage =
          error instanceof Error ? error.message : 'Location access denied';

        toast.info(
          `${errorMessage}. Showing data for ${DEFAULT_LOCATION.name}, ${DEFAULT_LOCATION.country}.`,
          {
            duration: 6000,
          }
        );
      }
    };

    // Execute initialization and ensure we always have a location
    initializeLocation().catch((error) => {
      console.error('❌ Critical error in location initialization:', error);
      // Failsafe: if everything fails, still set Lima
      setCurrentLocation(DEFAULT_LOCATION);
      setIsLoading(false);
    });
  }, [
    hasInitialized,
    currentLocation,
    setCurrentLocation,
    setIsLoading,
    trpc.cities.getCityByCoordinates,
    queryClient,
  ]);

  // Failsafe timeout: if we're still loading after 15 seconds, force Lima
  useEffect(() => {
    if (!isLoading || currentLocation) return;

    const timeoutId = setTimeout(() => {
      console.warn(
        '⏱️ Location initialization timeout - forcing default location'
      );
      if (!currentLocation) {
        setCurrentLocation(DEFAULT_LOCATION);
        setIsLoading(false);
        toast.info(
          `Using default location: ${DEFAULT_LOCATION.name}, ${DEFAULT_LOCATION.country}`,
          { duration: 5000 }
        );
      }
    }, 15000); // 15 second timeout

    return () => clearTimeout(timeoutId);
  }, [isLoading, currentLocation, setCurrentLocation, setIsLoading]);

  // This component doesn't render anything
  return null;
}
