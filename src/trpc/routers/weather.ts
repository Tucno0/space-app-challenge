import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { TRPCError } from '@trpc/server';
import type {
  OpenWeatherOneCallResponse,
  ICAPredictForecastResponse,
} from '@/types/api-responses';
import type { WeatherData } from '@/types/weather';

const OPENWEATHERMAP_API_URL = process.env.OPENWEATHERMAP_API_URL;
const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const ICA_PREDICT_API_URL = process.env.ICA_PREDICT_API_URL;

if (!OPENWEATHERMAP_API_KEY) {
  console.warn('OPENWEATHERMAP_API_KEY is not set in environment variables');
}

if (!ICA_PREDICT_API_URL) {
  console.warn('ICA_PREDICT_API_URL is not set in environment variables');
}

// Helper function to convert Kelvin to Celsius
function kelvinToCelsius(kelvin: number): number {
  return Math.round((kelvin - 273.15) * 10) / 10;
}

// Helper function to convert m/s to km/h
function msToKmh(ms: number): number {
  return Math.round(ms * 3.6 * 10) / 10;
}

// Helper function to transform OpenWeather response to WeatherData
function transformOpenWeatherResponse(
  data: OpenWeatherOneCallResponse
): WeatherData {
  const current = data.current;
  const weather = current.weather[0];

  return {
    timestamp: new Date(current.dt * 1000),
    temperature: kelvinToCelsius(current.temp),
    feelsLike: kelvinToCelsius(current.feels_like),
    humidity: current.humidity,
    pressure: current.pressure,
    windSpeed: msToKmh(current.wind_speed),
    windDirection: current.wind_deg,
    windGust: current.wind_gust ? msToKmh(current.wind_gust) : undefined,
    visibility: current.visibility,
    uvIndex: current.uvi,
    cloudCover: current.clouds,
    precipitation: current.rain?.['1h'] || current.snow?.['1h'] || 0,
    conditions: weather.description,
    icon: weather.icon,
  };
}

export const weatherRouter = createTRPCRouter({
  getCurrentWeather: baseProcedure
    .input(
      z.object({
        lat: z.number().min(-90).max(90),
        lon: z.number().min(-180).max(180),
      })
    )
    .query(async ({ input }) => {
      if (!OPENWEATHERMAP_API_KEY || !OPENWEATHERMAP_API_URL) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'OpenWeatherMap API key not configured',
        });
      }

      const { lat, lon } = input;

      try {
        // Build URL with parameters
        // Exclude minutely, hourly, daily, and alerts to reduce response size
        const params = new URLSearchParams({
          lat: lat.toString(),
          lon: lon.toString(),
          appid: OPENWEATHERMAP_API_KEY,
          exclude: 'minutely,hourly,daily,alerts',
        });

        const url = `${OPENWEATHERMAP_API_URL}?${params}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `OpenWeatherMap API error: ${response.status} ${response.statusText}`,
          });
        }

        const data = (await response.json()) as OpenWeatherOneCallResponse;

        if (!data.current) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No weather data found for this location',
          });
        }

        console.log('Successfully fetched data from OpenWeatherMap API');
        return transformOpenWeatherResponse(data);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to fetch weather data',
        });
      }
    }),

  // Get weather forecast from IQA Predict API (Ayacucho only)
  getForecast: baseProcedure.query(async () => {
    if (!ICA_PREDICT_API_URL) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'IQA Predict API URL not configured',
      });
    }

    try {
      const url = `${ICA_PREDICT_API_URL}/weather/forecast`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        cache: 'no-store', // Ensure fresh data
      });

      if (!response.ok) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `IQA Predict API error: ${response.status} ${response.statusText}`,
        });
      }

      const data = (await response.json()) as ICAPredictForecastResponse;

      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No forecast data available',
        });
      }

      console.log(
        `Successfully fetched ${data.length} days of forecast from IQA Predict API`
      );

      // Transform the data to include proper types and structure
      return data.map((item) => ({
        date: item.date,
        temperature: Math.round(item.temperature_celsius * 10) / 10,
        dewpoint: Math.round(item.dewpoint_celsius * 10) / 10,
        pressure: Math.round(item.pressure_hpa * 10) / 10,
        windSpeed: Math.round(item.wind_speed * 3.6 * 10) / 10, // Convert m/s to km/h
        precipitation: Math.round(item.precipitation_mm * 10) / 10,
      }));
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch forecast data',
      });
    }
  }),
});
