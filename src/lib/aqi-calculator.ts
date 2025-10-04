import { AQICategory } from '@/types/air-quality';

export function getAQICategory(aqi: number): AQICategory {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy-sensitive';
  if (aqi <= 200) return 'unhealthy';
  if (aqi <= 300) return 'very-unhealthy';
  return 'hazardous';
}

export function getAQICategoryLabel(category: AQICategory): string {
  const labels: Record<AQICategory, string> = {
    good: 'Good',
    moderate: 'Moderate',
    'unhealthy-sensitive': 'Unhealthy for Sensitive Groups',
    unhealthy: 'Unhealthy',
    'very-unhealthy': 'Very Unhealthy',
    hazardous: 'Hazardous',
  };
  return labels[category];
}

export function getAQIRange(category: AQICategory): {
  min: number;
  max: number;
} {
  const ranges: Record<AQICategory, { min: number; max: number }> = {
    good: { min: 0, max: 50 },
    moderate: { min: 51, max: 100 },
    'unhealthy-sensitive': { min: 101, max: 150 },
    unhealthy: { min: 151, max: 200 },
    'very-unhealthy': { min: 201, max: 300 },
    hazardous: { min: 301, max: 500 },
  };
  return ranges[category];
}

export function calculatePollutantAQI(concentration: number): number {
  // Simplified AQI calculation - in production, use EPA breakpoints
  // This is a placeholder for demonstration
  // TODO: Implement full EPA AQI calculation with proper breakpoints

  // Return simplified calculation
  return Math.min(Math.floor(concentration * 2), 500);
}

export function getPollutantName(type: string): string {
  const names: Record<string, string> = {
    o3: 'Ozone',
    no2: 'Nitrogen Dioxide',
    so2: 'Sulfur Dioxide',
    formaldehyde: 'Formaldehyde',
    pm25: 'PM2.5',
    pm10: 'PM10',
  };
  return names[type] || type.toUpperCase();
}

export function getPollutantUnit(type: string): string {
  const units: Record<string, string> = {
    o3: 'ppb',
    no2: 'ppb',
    so2: 'ppb',
    formaldehyde: 'ppb',
    pm25: 'µg/m³',
    pm10: 'µg/m³',
  };
  return units[type] || 'ppb';
}
