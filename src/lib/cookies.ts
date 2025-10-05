import { Location } from '@/types/location';

// Cookie names
const CURRENT_LOCATION_COOKIE = 'aircast-current-location';
const SAVED_LOCATIONS_COOKIE = 'aircast-saved-locations';

// Cookie options
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds
const COOKIE_PATH = '/';

// Helper to safely parse JSON
function safeJsonParse<T>(str: string | undefined | null): T | null {
  if (!str) return null;
  try {
    return JSON.parse(str) as T;
  } catch {
    return null;
  }
}

// Client-side cookie functions
export function getLocationCookieClient(): Location | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split('; ');
  const cookie = cookies.find((c) =>
    c.startsWith(`${CURRENT_LOCATION_COOKIE}=`)
  );

  if (!cookie) return null;

  const value = cookie.split('=')[1];
  return safeJsonParse<Location>(decodeURIComponent(value));
}

export function setLocationCookieClient(location: Location | null): void {
  if (typeof document === 'undefined') return;

  if (!location) {
    document.cookie = `${CURRENT_LOCATION_COOKIE}=; path=${COOKIE_PATH}; max-age=0`;
    return;
  }

  const value = encodeURIComponent(JSON.stringify(location));
  document.cookie = `${CURRENT_LOCATION_COOKIE}=${value}; path=${COOKIE_PATH}; max-age=${COOKIE_MAX_AGE}`;
}

export function getSavedLocationsCookieClient(): Location[] {
  if (typeof document === 'undefined') return [];

  const cookies = document.cookie.split('; ');
  const cookie = cookies.find((c) =>
    c.startsWith(`${SAVED_LOCATIONS_COOKIE}=`)
  );

  if (!cookie) return [];

  const value = cookie.split('=')[1];
  return safeJsonParse<Location[]>(decodeURIComponent(value)) || [];
}

export function setSavedLocationsCookieClient(locations: Location[]): void {
  if (typeof document === 'undefined') return;

  // Limit to 10 locations
  const limitedLocations = locations.slice(0, 10);

  const value = encodeURIComponent(JSON.stringify(limitedLocations));
  document.cookie = `${SAVED_LOCATIONS_COOKIE}=${value}; path=${COOKIE_PATH}; max-age=${COOKIE_MAX_AGE}`;
}

// Server-side cookie functions (using headers)
export function getLocationCookieServer(
  cookieHeader: string | null
): Location | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split('; ');
  const cookie = cookies.find((c) =>
    c.startsWith(`${CURRENT_LOCATION_COOKIE}=`)
  );

  if (!cookie) return null;

  const value = cookie.split('=')[1];
  return safeJsonParse<Location>(decodeURIComponent(value));
}

export function getSavedLocationsCookieServer(
  cookieHeader: string | null
): Location[] {
  if (!cookieHeader) return [];

  const cookies = cookieHeader.split('; ');
  const cookie = cookies.find((c) =>
    c.startsWith(`${SAVED_LOCATIONS_COOKIE}=`)
  );

  if (!cookie) return [];

  const value = cookie.split('=')[1];
  return safeJsonParse<Location[]>(decodeURIComponent(value)) || [];
}
