import { AQICategory } from '@/types/air-quality';

export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return '#00E400';
  if (aqi <= 100) return '#FFFF00';
  if (aqi <= 150) return '#FF7E00';
  if (aqi <= 200) return '#FF0000';
  if (aqi <= 300) return '#8F3F97';
  return '#7E0023';
}

export function getAQICategoryColor(category: AQICategory): string {
  const colors: Record<AQICategory, string> = {
    good: '#00E400',
    moderate: '#FFFF00',
    'unhealthy-sensitive': '#FF7E00',
    unhealthy: '#FF0000',
    'very-unhealthy': '#8F3F97',
    hazardous: '#7E0023',
  };
  return colors[category];
}

export function getAQITextColor(aqi: number): string {
  // Return white text for darker backgrounds
  if (aqi > 150) return '#FFFFFF';
  // Return black text for lighter backgrounds
  return '#000000';
}

export function getAQICategoryTextColor(category: AQICategory): string {
  if (
    category === 'unhealthy' ||
    category === 'very-unhealthy' ||
    category === 'hazardous'
  ) {
    return '#FFFFFF';
  }
  return '#000000';
}

export function getAQIGradient(aqiValues: number[]): string {
  const colors = aqiValues.map((aqi) => getAQIColor(aqi));
  return `linear-gradient(to right, ${colors.join(', ')})`;
}

export function getMapLayerColor(
  value: number,
  min: number,
  max: number
): string {
  // Normalize value to 0-500 AQI scale
  const normalized = ((value - min) / (max - min)) * 500;
  return getAQIColor(normalized);
}
