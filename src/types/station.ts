import { PollutantReading } from './air-quality';

export type StationType = 'pandora' | 'openaq' | 'tempo' | 'tolnet';

export interface GroundStation {
  id: string;
  name: string;
  type: StationType;
  location: {
    lat: number;
    lon: number;
    elevation: number;
    address?: string;
  };
  status: 'active' | 'inactive' | 'maintenance';
  pollutantsMonitored: string[];
  lastReading?: Date;
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
  operator: string;
  installDate: Date;
}

export interface StationReading {
  stationId: string;
  timestamp: Date;
  pollutants: PollutantReading[];
  meteorology?: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    pressure: number;
  };
  dataQuality: number;
}

export interface StationNetwork {
  type: StationType;
  name: string;
  description: string;
  stations: GroundStation[];
  coverage: {
    countries: string[];
    totalStations: number;
  };
  dataFrequency: string;
  website: string;
}
