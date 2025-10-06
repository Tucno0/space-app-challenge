import { Coordinates } from '@/types/location';

export interface GeolocationResult {
  coordinates: Coordinates;
  accuracy: number;
}

export interface GeolocationOptions {
  /**
   * Force a fresh location request, bypassing any cached location
   * Default: false (uses cache up to 5 minutes)
   */
  forceRefresh?: boolean;
  /**
   * Timeout in milliseconds for the geolocation request
   * Default: 10000 (10 seconds)
   */
  timeout?: number;
}

/**
 * Get the current location from the browser's geolocation API
 * @param options - Configuration options for the geolocation request
 * @returns Promise with coordinates and accuracy
 * @throws Error if geolocation is not supported, denied, or times out
 */
export async function getCurrentLocation(
  options: GeolocationOptions = {}
): Promise<GeolocationResult> {
  const { forceRefresh = false, timeout = 10000 } = options;

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          coordinates: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        // Provide more specific error messages based on error code
        let errorMessage = 'Unable to get your location';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              'Location access denied. Please enable location permissions in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }

        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout,
        // If forceRefresh is true, set maximumAge to 0 to force a new request
        // Otherwise, cache for 5 minutes to avoid repeated prompts
        maximumAge: forceRefresh ? 0 : 300000,
      }
    );
  });
}

/**
 * Check if the browser supports geolocation
 */
export function isGeolocationSupported(): boolean {
  return 'geolocation' in navigator;
}

/**
 * Check the current permission state for geolocation
 * Returns 'granted', 'denied', 'prompt', or 'unsupported'
 */
export async function checkGeolocationPermission(): Promise<
  'granted' | 'denied' | 'prompt' | 'unsupported'
> {
  if (!isGeolocationSupported()) {
    return 'unsupported';
  }

  // Check if Permissions API is available
  if (!navigator.permissions || !navigator.permissions.query) {
    // Permissions API not available, we can't check status
    return 'prompt';
  }

  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state as 'granted' | 'denied' | 'prompt';
  } catch (error) {
    // If query fails, assume prompt
    console.warn('Could not query geolocation permission:', error);
    return 'prompt';
  }
}

export function calculateDistance(
  point1: Coordinates,
  point2: Coordinates
): number {
  // Haversine formula to calculate distance in kilometers
  const R = 6371; // Earth's radius in km
  const dLat = toRad(point2.lat - point1.lat);
  const dLon = toRad(point2.lon - point1.lon);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) *
      Math.cos(toRad(point2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
}

export function isValidCoordinates(coords: Coordinates): boolean {
  return (
    coords.lat >= -90 &&
    coords.lat <= 90 &&
    coords.lon >= -180 &&
    coords.lon <= 180
  );
}

export function getBoundingBox(
  center: Coordinates,
  radiusKm: number
): { north: number; south: number; east: number; west: number } {
  const latDelta = radiusKm / 111; // 1 degree latitude ≈ 111 km
  const lonDelta = radiusKm / (111 * Math.cos(toRad(center.lat)));

  return {
    north: center.lat + latDelta,
    south: center.lat - latDelta,
    east: center.lon + lonDelta,
    west: center.lon - lonDelta,
  };
}
