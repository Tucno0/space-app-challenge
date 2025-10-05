'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { createLocationStore } from '@/stores/location-store';
import type { Location } from '@/types/location';

export type LocationStoreApi = ReturnType<typeof createLocationStore>;

export const LocationStoreContext = createContext<LocationStoreApi | undefined>(
  undefined
);

export interface LocationStoreProviderProps {
  children: ReactNode;
  initialCurrentLocation?: Location | null;
  initialSavedLocations?: Location[];
}

export const LocationStoreProvider = ({
  children,
  initialCurrentLocation,
  initialSavedLocations,
}: LocationStoreProviderProps) => {
  const storeRef = useRef<LocationStoreApi | null>(null);

  if (!storeRef.current) {
    storeRef.current = createLocationStore({
      currentLocation: initialCurrentLocation ?? null,
      savedLocations: initialSavedLocations ?? [],
      isLoading: false,
    });
  }

  return (
    <LocationStoreContext.Provider value={storeRef.current}>
      {children}
    </LocationStoreContext.Provider>
  );
};

export const useLocationStoreContext = () => {
  const locationStoreContext = useContext(LocationStoreContext);

  if (!locationStoreContext) {
    throw new Error(
      'useLocationStoreContext must be used within LocationStoreProvider'
    );
  }

  return locationStoreContext;
};
