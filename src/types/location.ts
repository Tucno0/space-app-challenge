export interface Coordinates {
  lat: number;
  lon: number;
}

export interface Location {
  id: string;
  name: string;
  city: string;
  state?: string;
  country: string;
  coordinates: Coordinates;
  timezone: string;
  population?: number;
}

export interface LocationSearchResult {
  id: string;
  displayName: string;
  location: Location;
  relevance: number;
}

export interface SavedLocation extends Location {
  savedAt: Date;
  nickname?: string;
}

// GeoDB Cities API types
export interface GeoDBCity {
  id: number;
  wikiDataId: string;
  type: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  latitude: number;
  longitude: number;
  population: number;
}

export interface GeoDBSearchResponse {
  data: GeoDBCity[];
  metadata: {
    currentOffset: number;
    totalCount: number;
  };
}

// Helper function to convert GeoDB API response to Location type
export function geoDBCityToLocation(city: GeoDBCity): Location {
  return {
    id: city.id.toString(),
    name: city.name,
    city: city.name,
    state: city.region,
    country: city.country,
    coordinates: {
      lat: city.latitude,
      lon: city.longitude,
    },
    timezone: 'UTC', // GeoDB doesn't provide timezone, would need separate API
    population: city.population,
  };
}
