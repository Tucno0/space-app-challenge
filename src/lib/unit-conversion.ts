export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type SpeedUnit = 'kmh' | 'mph' | 'ms';
export type DistanceUnit = 'km' | 'miles';

export function convertTemperature(
  value: number,
  from: TemperatureUnit,
  to: TemperatureUnit
): number {
  if (from === to) return value;

  if (from === 'celsius' && to === 'fahrenheit') {
    return (value * 9) / 5 + 32;
  }
  if (from === 'fahrenheit' && to === 'celsius') {
    return ((value - 32) * 5) / 9;
  }

  return value;
}

export function convertSpeed(
  value: number,
  from: SpeedUnit,
  to: SpeedUnit
): number {
  if (from === to) return value;

  // Convert to m/s first
  let ms = value;
  if (from === 'kmh') ms = value / 3.6;
  if (from === 'mph') ms = value * 0.44704;

  // Convert from m/s to target
  if (to === 'ms') return ms;
  if (to === 'kmh') return ms * 3.6;
  if (to === 'mph') return ms * 2.23694;

  return value;
}

export function convertDistance(
  value: number,
  from: DistanceUnit,
  to: DistanceUnit
): number {
  if (from === to) return value;

  if (from === 'km' && to === 'miles') {
    return value * 0.621371;
  }
  if (from === 'miles' && to === 'km') {
    return value * 1.60934;
  }

  return value;
}

export function formatTemperature(
  value: number,
  unit: TemperatureUnit = 'celsius'
): string {
  const symbol = unit === 'celsius' ? '°C' : '°F';
  return `${Math.round(value)}${symbol}`;
}

export function formatSpeed(value: number, unit: SpeedUnit = 'kmh'): string {
  const units = { kmh: 'km/h', mph: 'mph', ms: 'm/s' };
  return `${Math.round(value)} ${units[unit]}`;
}

export function formatDistance(
  value: number,
  unit: DistanceUnit = 'km'
): string {
  if (unit === 'km') {
    if (value < 1) return `${Math.round(value * 1000)}m`;
    return `${value.toFixed(1)}km`;
  }
  if (value < 0.1) return `${Math.round(value * 5280)}ft`;
  return `${value.toFixed(1)}mi`;
}

export function formatPressure(hpa: number): string {
  return `${Math.round(hpa)} hPa`;
}

export function formatHumidity(percentage: number): string {
  return `${Math.round(percentage)}%`;
}
