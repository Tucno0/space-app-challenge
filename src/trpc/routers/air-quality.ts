import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { TRPCError } from '@trpc/server';
import type {
  IQAirResponse,
  WAQIResponse,
  IQAPredictAQIResponse,
} from '@/types/api-responses';
import type { AirQualityData, PollutantType } from '@/types/air-quality';
import { getAQICategory } from '@/lib/aqi-calculator';

const AIRVISUAL_API_URL = process.env.AIRVISUAL_API_URL;
const AIRVISUAL_API_KEY = process.env.AIRVISUAL_API_KEY;
const WAQI_API_URL = process.env.WAQI_API_URL;
const WAQI_API_KEY = process.env.WAQI_API_KEY;
const ICA_PREDICT_API_URL = process.env.ICA_PREDICT_API_URL;

if (!AIRVISUAL_API_KEY) {
  console.warn('AIRVISUAL_API_KEY is not set in environment variables');
}

if (!WAQI_API_KEY) {
  console.warn('WAQI_API_KEY is not set in environment variables');
}

if (!ICA_PREDICT_API_URL) {
  console.warn('ICA_PREDICT_API_URL is not set in environment variables');
}

// Helper function to transform IQAir response to AirQualityData
function transformIQAirResponse(
  data: IQAirResponse['data'],
  lat: number,
  lon: number
): AirQualityData {
  const pollution = data.current.pollution;
  const aqiValue = pollution.aqius;

  // Map IQAir pollutant codes to our types
  const pollutantMap: Record<string, PollutantType> = {
    p2: 'pm25',
    p1: 'pm10',
    o3: 'o3',
    n2: 'no2',
    s2: 'so2',
  };

  const primaryPollutant = pollutantMap[pollution.mainus] || 'pm25';

  // Create pollutants array - IQAir doesn't provide detailed pollutant values
  // So we'll create a minimal set based on the primary pollutant
  const pollutants = [
    {
      type: primaryPollutant,
      value: aqiValue,
      unit:
        primaryPollutant === 'pm25' || primaryPollutant === 'pm10'
          ? 'µg/m³'
          : 'ppb',
      aqi: aqiValue,
      timestamp: new Date(pollution.ts),
    },
  ];

  return {
    aqi: {
      value: aqiValue,
      category: getAQICategory(aqiValue),
      primaryPollutant: primaryPollutant,
      timestamp: new Date(pollution.ts),
      location: {
        lat,
        lon,
        name: `${data.city}, ${data.state || data.country}`,
      },
    },
    pollutants,
    dataSource: 'combined' as const,
    lastUpdated: new Date(pollution.ts),
  };
}

// Helper function to transform WAQI response to AirQualityData
function transformWAQIResponse(
  data: WAQIResponse['data'],
  lat: number,
  lon: number
): AirQualityData {
  const aqiValue = data.aqi;

  // Map WAQI pollutant codes to our types
  const pollutantMap: Record<string, PollutantType> = {
    pm25: 'pm25',
    pm10: 'pm10',
    o3: 'o3',
    no2: 'no2',
    so2: 'so2',
  };

  const primaryPollutant = pollutantMap[data.dominentpol] || 'pm25';

  // Create pollutants array from WAQI iaqi data
  const pollutants = [];

  if (data.iaqi.pm25) {
    pollutants.push({
      type: 'pm25' as PollutantType,
      value: data.iaqi.pm25.v,
      unit: 'µg/m³',
      aqi: data.iaqi.pm25.v,
      timestamp: new Date(data.time.s),
    });
  }

  if (data.iaqi.pm10) {
    pollutants.push({
      type: 'pm10' as PollutantType,
      value: data.iaqi.pm10.v,
      unit: 'µg/m³',
      aqi: data.iaqi.pm10.v,
      timestamp: new Date(data.time.s),
    });
  }

  if (data.iaqi.o3) {
    pollutants.push({
      type: 'o3' as PollutantType,
      value: data.iaqi.o3.v,
      unit: 'ppb',
      aqi: data.iaqi.o3.v,
      timestamp: new Date(data.time.s),
    });
  }

  if (data.iaqi.no2) {
    pollutants.push({
      type: 'no2' as PollutantType,
      value: data.iaqi.no2.v,
      unit: 'ppb',
      aqi: data.iaqi.no2.v,
      timestamp: new Date(data.time.s),
    });
  }

  if (data.iaqi.so2) {
    pollutants.push({
      type: 'so2' as PollutantType,
      value: data.iaqi.so2.v,
      unit: 'ppb',
      aqi: data.iaqi.so2.v,
      timestamp: new Date(data.time.s),
    });
  }

  return {
    aqi: {
      value: aqiValue,
      category: getAQICategory(aqiValue),
      primaryPollutant: primaryPollutant,
      timestamp: new Date(data.time.s),
      location: {
        lat,
        lon,
        name: data.city.name,
      },
    },
    pollutants,
    dataSource: 'openaq' as const,
    lastUpdated: new Date(data.time.s),
  };
}

export const airQualityRouter = createTRPCRouter({
  getCurrentAirQuality: baseProcedure
    .input(
      z.object({
        lat: z.number().min(-90).max(90),
        lon: z.number().min(-180).max(180),
      })
    )
    .query(async ({ input }) => {
      const { lat, lon } = input;

      // Try IQAir API first
      if (AIRVISUAL_API_KEY && AIRVISUAL_API_URL) {
        try {
          const iqairUrl = `${AIRVISUAL_API_URL}/nearest_city?lat=${lat}&lon=${lon}&key=${AIRVISUAL_API_KEY}`;

          const response = await fetch(iqairUrl, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
          });

          if (response.ok) {
            const data = (await response.json()) as IQAirResponse;

            if (data.status === 'success' && data.data) {
              console.log('Successfully fetched data from IQAir API');
              return transformIQAirResponse(data.data, lat, lon);
            }
          }

          console.warn(
            `IQAir API request failed: ${response.status} ${response.statusText}`
          );
        } catch (error) {
          console.warn('IQAir API error, attempting WAQI fallback:', error);
        }
      }

      // Fallback to WAQI API
      if (WAQI_API_KEY && WAQI_API_URL) {
        try {
          const waqiUrl = `${WAQI_API_URL}/geo:${lat};${lon}/?token=${WAQI_API_KEY}`;

          const response = await fetch(waqiUrl, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
          });

          if (!response.ok) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: `WAQI API error: ${response.status} ${response.statusText}`,
            });
          }

          const data = (await response.json()) as WAQIResponse;

          if (data.status !== 'ok' || !data.data) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'No air quality data found for this location',
            });
          }

          console.log('Successfully fetched data from WAQI API (fallback)');
          return transformWAQIResponse(data.data, lat, lon);
        } catch (error) {
          if (error instanceof TRPCError) {
            throw error;
          }

          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message:
              error instanceof Error
                ? error.message
                : 'Failed to fetch air quality data',
          });
        }
      }

      // If both APIs are unavailable
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'No air quality API keys configured',
      });
    }),

  getMapStations: baseProcedure
    .input(
      z.object({
        // Bounding box coordinates: south, west, north, east
        bounds: z.object({
          south: z.number().min(-90).max(90),
          west: z.number().min(-180).max(180),
          north: z.number().min(-90).max(90),
          east: z.number().min(-180).max(180),
        }),
      })
    )
    .query(async ({ input }) => {
      if (!WAQI_API_KEY) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'WAQI API key not configured',
        });
      }

      const { bounds } = input;

      try {
        // WAQI Map Bounds API
        // Format: latlng=south,west,north,east
        const boundsParam = `${bounds.south},${bounds.west},${bounds.north},${bounds.east}`;
        const url = `https://api.waqi.info/map/bounds/?latlng=${boundsParam}&token=${WAQI_API_KEY}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `WAQI Map API error: ${response.status} ${response.statusText}`,
          });
        }

        interface WAQIMapStation {
          uid: number;
          aqi: string | number;
          lat: number;
          lon: number;
          station: {
            name: string;
            time: string;
          };
        }

        interface WAQIMapResponse {
          status: string;
          data: WAQIMapStation[];
        }

        const data = (await response.json()) as WAQIMapResponse;

        if (data.status !== 'ok' || !data.data) {
          return [];
        }

        console.log(
          `✅ Successfully fetched ${data.data.length} stations from WAQI Map API`
        );

        // Transform to marker format
        const markers = data.data
          .map((station) => {
            // Parse AQI value (can be string or number)
            const aqiValue =
              typeof station.aqi === 'string'
                ? parseInt(station.aqi, 10)
                : station.aqi;

            // Skip invalid AQI values
            if (isNaN(aqiValue) || aqiValue < 0) {
              return null;
            }

            return {
              id: station.uid,
              lat: station.lat,
              lon: station.lon,
              aqi: aqiValue,
              name: station.station.name,
              lastUpdate: station.station.time,
            };
          })
          .filter(
            (marker): marker is NonNullable<typeof marker> => marker !== null
          );

        return markers;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to fetch map stations',
        });
      }
    }),

  // Get AQI predictions from IQA Predict API (Ayacucho only)
  getAQIPredictions: baseProcedure.query(async () => {
    if (!ICA_PREDICT_API_URL) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'IQA Predict API URL not configured',
      });
    }

    try {
      const url = `${ICA_PREDICT_API_URL}/predict`;

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

      const data = (await response.json()) as IQAPredictAQIResponse;

      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No AQI prediction data available',
        });
      }

      console.log(
        `Successfully fetched ${data.length} days of AQI predictions from IQA Predict API`
      );

      // Transform the data to include proper types and structure
      return data.map((item) => {
        // Parse date - handle both formats
        const dateStr = item.date.includes(' ')
          ? item.date.split(' ')[0]
          : item.date;

        return {
          date: dateStr,
          aqi: Math.round(item.AQI * 10) / 10,
          category: getAQICategory(item.AQI),
          quality: item.quality,
          pollutants: {
            no2: Math.round(item.NO2_ugm3 * 10) / 10,
            co: Math.round(item.CO_mgm3 * 10) / 10,
            o3: Math.round(item.O3_ugm3 * 10) / 10,
            so2: Math.round(item.SO2_ugm3 * 10) / 10,
          },
          aerosolIndex: Math.round(item.aerosol_index * 100) / 100,
        };
      });
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch AQI predictions',
      });
    }
  }),
});
