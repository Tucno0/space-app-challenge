import {
  WeatherData,
  WeatherForecast,
  AtmosphericConditions,
} from '@/types/weather';

export const mockCurrentWeather: WeatherData = {
  timestamp: new Date(),
  temperature: 22,
  feelsLike: 23,
  humidity: 65,
  pressure: 1013,
  windSpeed: 15,
  windDirection: 225,
  windGust: 22,
  visibility: 10,
  uvIndex: 6,
  cloudCover: 35,
  precipitation: 0,
  conditions: 'Partly Cloudy',
  icon: 'partly-cloudy-day',
};

export const mockWeatherForecast: WeatherForecast[] = Array.from(
  { length: 24 },
  (_, hour) => {
    const baseTemp = 18;
    const tempVariation = Math.sin(((hour - 6) / 12) * Math.PI) * 6;

    return {
      timestamp: new Date(Date.now() + hour * 3600000),
      temperature: baseTemp + tempVariation,
      humidity: 60 + Math.sin(((hour + 3) / 12) * Math.PI) * 15,
      windSpeed: 10 + Math.random() * 8,
      windDirection: 200 + Math.random() * 90,
      precipitation: hour > 15 && hour < 20 ? Math.random() * 2 : 0,
      conditions:
        hour > 15 && hour < 20
          ? 'Light Rain'
          : hour < 7 || hour > 18
          ? 'Clear'
          : 'Partly Cloudy',
    };
  }
);

export const mockAtmosphericConditions: AtmosphericConditions = {
  inversionLayer: true,
  inversionHeight: 500,
  mixingLayerHeight: 1200,
  stability: 'stable',
  ventilationIndex: 2500,
};

export const weatherIconMap: Record<string, string> = {
  Clear: '☀️',
  'Partly Cloudy': '⛅',
  Cloudy: '☁️',
  Overcast: '☁️',
  'Light Rain': '🌧️',
  Rain: '🌧️',
  'Heavy Rain': '⛈️',
  Thunderstorm: '⛈️',
  Snow: '🌨️',
  Fog: '🌫️',
  Hazy: '🌫️',
};

export function getWeatherIcon(conditions: string): string {
  return weatherIconMap[conditions] || '☀️';
}

export function getWindDirection(degrees: number): string {
  const directions = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function getUVIndexCategory(uv: number): string {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very High';
  return 'Extreme';
}
