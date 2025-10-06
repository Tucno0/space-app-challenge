import type { Location } from '@/types/location';

/**
 * Default location to use when geolocation is denied or unavailable
 * Set to Lima, Peru
 */
export const DEFAULT_LOCATION: Location = {
  id: 'default-lima',
  name: 'Lima',
  city: 'Lima',
  state: 'Lima',
  country: 'Peru',
  coordinates: {
    lat: -12.0464,
    lon: -77.0428,
  },
  timezone: 'America/Lima',
  population: 9674755,
};
