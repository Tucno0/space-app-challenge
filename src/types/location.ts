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
