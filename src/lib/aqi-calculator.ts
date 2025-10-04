import { AQICategory } from '@/types/air-quality';

export function getAQICategory(aqi: number): AQICategory {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy-sensitive';
  if (aqi <= 200) return 'unhealthy';
  if (aqi <= 300) return 'very-unhealthy';
  return 'hazardous';
}

// This is a placeholder - actual translations are done in components using dictionary
export function getAQICategoryLabel(category: AQICategory): string {
  // Map category to translation key pattern
  const keyMap: Record<AQICategory, string> = {
    good: 'good',
    moderate: 'moderate',
    'unhealthy-sensitive': 'unhealthySensitive',
    unhealthy: 'unhealthy',
    'very-unhealthy': 'veryUnhealthy',
    hazardous: 'hazardous',
  };
  return keyMap[category];
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

// Returns translation key for pollutant name
export function getPollutantName(type: string): string {
  return type.toLowerCase();
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
