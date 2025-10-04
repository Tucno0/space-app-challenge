import { ForecastData, DailyForecast, HourlyForecast } from '@/types/forecast';
import { getAQICategory } from '../aqi-calculator';

function generateHourlyForecasts(
  baseAQI: number,
  day: number
): HourlyForecast[] {
  return Array.from({ length: 24 }, (_, hour) => {
    const hourVariation = Math.sin(((hour - 6) / 12) * Math.PI) * 15;
    const aqi = Math.max(0, Math.min(300, baseAQI + hourVariation));
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() + day);
    timestamp.setHours(hour, 0, 0, 0);

    return {
      timestamp,
      aqi: Math.round(aqi),
      category: getAQICategory(aqi),
      primaryPollutant: aqi > 100 ? 'o3' : 'no2',
      temperature: 20 + Math.sin(((hour - 6) / 12) * Math.PI) * 8,
      humidity: 60 + Math.sin(((hour + 3) / 12) * Math.PI) * 20,
      windSpeed: 10 + Math.random() * 10,
      windDirection: 180 + Math.random() * 60,
      confidence: 0.85 - day * 0.1,
    };
  });
}

function generateDailyForecast(baseAQI: number, day: number): DailyForecast {
  const hourly = generateHourlyForecasts(baseAQI, day);
  const aqiValues = hourly.map((h) => h.aqi);
  const date = new Date();
  date.setDate(date.getDate() + day);
  date.setHours(0, 0, 0, 0);

  const aqiMin = Math.min(...aqiValues);
  const aqiMax = Math.max(...aqiValues);
  const aqiAvg = aqiValues.reduce((a, b) => a + b, 0) / aqiValues.length;

  const summaries = [
    'Moderate air quality. Unusually sensitive people should consider reducing prolonged outdoor exertion.',
    'Good air quality. Air pollution poses little or no risk.',
    'Unhealthy for sensitive groups. Consider limiting outdoor activities.',
    'Air quality expected to improve by afternoon.',
    'Morning smog expected. Air quality should improve after noon.',
  ];

  return {
    date,
    aqiMin: Math.round(aqiMin),
    aqiMax: Math.round(aqiMax),
    aqiAvg: Math.round(aqiAvg),
    category: getAQICategory(aqiAvg),
    primaryPollutant: aqiAvg > 100 ? 'o3' : 'no2',
    hourly,
    summary: summaries[day % summaries.length],
  };
}

export const mockForecastData: ForecastData = {
  location: {
    name: 'Los Angeles, CA',
    lat: 34.0522,
    lon: -118.2437,
  },
  generatedAt: new Date(),
  daily: [
    generateDailyForecast(85, 0),
    generateDailyForecast(92, 1),
    generateDailyForecast(78, 2),
    generateDailyForecast(95, 3),
    generateDailyForecast(88, 4),
    generateDailyForecast(72, 5),
    generateDailyForecast(68, 6),
  ],
  alerts: [
    'Ozone levels expected to reach unhealthy levels between 2-6 PM',
    'Air quality may be impacted by wildfire smoke from the north',
  ],
};

export function getForecastForLocation(locationName: string): ForecastData {
  const baseAQIs: Record<string, number> = {
    'Los Angeles': 85,
    'New York': 55,
    'Mexico City': 145,
    Chicago: 65,
    Houston: 75,
  };

  const baseAQI = baseAQIs[locationName] || 70;

  return {
    location: {
      name: locationName,
      lat: 34.0522,
      lon: -118.2437,
    },
    generatedAt: new Date(),
    daily: Array.from({ length: 7 }, (_, i) =>
      generateDailyForecast(baseAQI + (Math.random() - 0.5) * 20, i)
    ),
    alerts: [],
  };
}
