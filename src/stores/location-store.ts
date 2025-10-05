import { createStore } from 'zustand/vanilla';
import type { Location } from '@/types/location';
import {
  setLocationCookieClient,
  setSavedLocationsCookieClient,
} from '@/lib/cookies';

export interface LocationState {
  currentLocation: Location | null;
  savedLocations: Location[];
  isLoading: boolean;
}

export interface LocationActions {
  setCurrentLocation: (location: Location | null) => void;
  addSavedLocation: (location: Location) => void;
  removeSavedLocation: (locationId: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  initializeFromCookies: (
    currentLocation: Location | null,
    savedLocations: Location[]
  ) => void;
}

export type LocationStore = LocationState & LocationActions;

export const createLocationStore = (initState: Partial<LocationState> = {}) => {
  const DEFAULT_STATE: LocationState = {
    currentLocation: null,
    savedLocations: [],
    isLoading: false,
  };

  return createStore<LocationStore>()((set) => ({
    ...DEFAULT_STATE,
    ...initState,

    setCurrentLocation: (location) => {
      set({ currentLocation: location });
      // Persist to cookie
      setLocationCookieClient(location);
    },

    addSavedLocation: (location) => {
      set((state) => {
        // Check if location already exists
        const exists = state.savedLocations.some(
          (loc) => loc.id === location.id
        );
        if (exists) {
          return state;
        }

        // Limit to 10 locations
        const updatedLocations = [...state.savedLocations, location].slice(
          0,
          10
        );

        // Persist to cookie
        setSavedLocationsCookieClient(updatedLocations);

        return { savedLocations: updatedLocations };
      });
    },

    removeSavedLocation: (locationId) => {
      set((state) => {
        const updatedLocations = state.savedLocations.filter(
          (loc) => loc.id !== locationId
        );

        // Persist to cookie
        setSavedLocationsCookieClient(updatedLocations);

        return { savedLocations: updatedLocations };
      });
    },

    setIsLoading: (isLoading) => {
      set({ isLoading });
    },

    initializeFromCookies: (currentLocation, savedLocations) => {
      set({ currentLocation, savedLocations });
    },
  }));
};
