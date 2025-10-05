import { useStore } from 'zustand';
import { useLocationStoreContext } from '@/providers/location-store-provider';
import type { LocationStore } from '@/stores/location-store';

export function useLocationStore<T>(selector: (store: LocationStore) => T): T {
  const locationStoreContext = useLocationStoreContext();

  if (!locationStoreContext) {
    throw new Error(
      'useLocationStore must be used within LocationStoreProvider'
    );
  }

  return useStore(locationStoreContext, selector);
}
