export type AQICategory =
  | 'good'
  | 'moderate'
  | 'unhealthy-sensitive'
  | 'unhealthy'
  | 'very-unhealthy'
  | 'hazardous';

export type PollutantType =
  | 'o3'
  | 'no2'
  | 'so2'
  | 'formaldehyde'
  | 'pm25'
  | 'pm10';

export interface AQIReading {
  value: number;
  category: AQICategory;
  primaryPollutant: PollutantType;
  timestamp: Date;
  location: {
    lat: number;
    lon: number;
    name: string;
  };
}

export interface PollutantReading {
  type: PollutantType;
  value: number;
  unit: string;
  aqi: number;
  timestamp: Date;
}

export interface AirQualityData {
  aqi: AQIReading;
  pollutants: PollutantReading[];
  dataSource: 'tempo' | 'pandora' | 'openaq' | 'combined';
  lastUpdated: Date;
}

export interface HealthRecommendation {
  category: AQICategory;
  general: string;
  sensitive: string;
  elderly: string;
  children: string;
  athletes: string;
}
