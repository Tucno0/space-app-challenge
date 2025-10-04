import { AirQualityData, PollutantReading } from '@/types/air-quality';
import { getAQICategory } from '../aqi-calculator';

export const mockCurrentAirQuality: AirQualityData = {
  aqi: {
    value: 85,
    category: getAQICategory(85),
    primaryPollutant: 'o3',
    timestamp: new Date(),
    location: {
      lat: 34.0522,
      lon: -118.2437,
      name: 'Los Angeles, CA',
    },
  },
  pollutants: [
    {
      type: 'o3',
      value: 68,
      unit: 'ppb',
      aqi: 85,
      timestamp: new Date(),
    },
    {
      type: 'no2',
      value: 45,
      unit: 'ppb',
      aqi: 42,
      timestamp: new Date(),
    },
    {
      type: 'so2',
      value: 12,
      unit: 'ppb',
      aqi: 15,
      timestamp: new Date(),
    },
    {
      type: 'formaldehyde',
      value: 8,
      unit: 'ppb',
      aqi: 28,
      timestamp: new Date(),
    },
    {
      type: 'pm25',
      value: 25,
      unit: 'µg/m³',
      aqi: 78,
      timestamp: new Date(),
    },
  ],
  dataSource: 'combined',
  lastUpdated: new Date(),
};

export const mockLocationAQI: Record<string, AirQualityData> = {
  'los-angeles': {
    aqi: {
      value: 85,
      category: 'moderate',
      primaryPollutant: 'o3',
      timestamp: new Date(),
      location: { lat: 34.0522, lon: -118.2437, name: 'Los Angeles, CA' },
    },
    pollutants: [
      { type: 'o3', value: 68, unit: 'ppb', aqi: 85, timestamp: new Date() },
      { type: 'no2', value: 45, unit: 'ppb', aqi: 42, timestamp: new Date() },
      {
        type: 'pm25',
        value: 25,
        unit: 'µg/m³',
        aqi: 78,
        timestamp: new Date(),
      },
    ],
    dataSource: 'tempo',
    lastUpdated: new Date(),
  },
  'new-york': {
    aqi: {
      value: 45,
      category: 'good',
      primaryPollutant: 'no2',
      timestamp: new Date(),
      location: { lat: 40.7128, lon: -74.006, name: 'New York, NY' },
    },
    pollutants: [
      { type: 'o3', value: 35, unit: 'ppb', aqi: 40, timestamp: new Date() },
      { type: 'no2', value: 38, unit: 'ppb', aqi: 45, timestamp: new Date() },
      {
        type: 'pm25',
        value: 12,
        unit: 'µg/m³',
        aqi: 35,
        timestamp: new Date(),
      },
    ],
    dataSource: 'combined',
    lastUpdated: new Date(),
  },
  'mexico-city': {
    aqi: {
      value: 165,
      category: 'unhealthy',
      primaryPollutant: 'pm25',
      timestamp: new Date(),
      location: { lat: 19.4326, lon: -99.1332, name: 'Mexico City, Mexico' },
    },
    pollutants: [
      { type: 'o3', value: 92, unit: 'ppb', aqi: 125, timestamp: new Date() },
      { type: 'no2', value: 78, unit: 'ppb', aqi: 95, timestamp: new Date() },
      {
        type: 'pm25',
        value: 85,
        unit: 'µg/m³',
        aqi: 165,
        timestamp: new Date(),
      },
    ],
    dataSource: 'openaq',
    lastUpdated: new Date(),
  },
};

export function generateHourlyAQI(
  baseAQI: number,
  hours: number
): PollutantReading[] {
  return Array.from({ length: hours }, (_, i) => {
    const variation = Math.sin(i / 4) * 20;
    return {
      type: 'o3',
      value: baseAQI + variation,
      unit: 'ppb',
      aqi: Math.max(0, Math.min(500, baseAQI + variation)),
      timestamp: new Date(Date.now() + i * 3600000),
    };
  });
}
