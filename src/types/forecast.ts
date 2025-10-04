import { AQICategory, PollutantType } from './air-quality';

export interface HourlyForecast {
  timestamp: Date;
  aqi: number;
  category: AQICategory;
  primaryPollutant: PollutantType;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  confidence: number;
}

export interface DailyForecast {
  date: Date;
  aqiMin: number;
  aqiMax: number;
  aqiAvg: number;
  category: AQICategory;
  primaryPollutant: PollutantType;
  hourly: HourlyForecast[];
  summary: string;
}

export interface ForecastData {
  location: {
    name: string;
    lat: number;
    lon: number;
  };
  generatedAt: Date;
  daily: DailyForecast[];
  alerts: string[];
}
