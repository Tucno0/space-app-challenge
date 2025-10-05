import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import type { GeoDBCity, GeoDBSearchResponse } from '@/types/location';
import { TRPCError } from '@trpc/server';

const RAPID_API_KEY = process.env.RAPID_API_KEY;
const RAPID_API_HOST = 'wft-geo-db.p.rapidapi.com';
const GEODB_BASE_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo';

if (!RAPID_API_KEY) {
  console.warn('RAPID_API_KEY is not set in environment variables');
}

export const citiesRouter = createTRPCRouter({
  searchCities: baseProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(20).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      if (!RAPID_API_KEY) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'API key not configured',
        });
      }

      try {
        const params = new URLSearchParams({
          namePrefix: input.query,
          limit: input.limit.toString(),
          offset: input.offset.toString(),
          sort: '-population',
        });

        const response = await fetch(`${GEODB_BASE_URL}/cities?${params}`, {
          method: 'GET',
          headers: {
            'x-rapidapi-key': RAPID_API_KEY,
            'x-rapidapi-host': RAPID_API_HOST,
          },
        });

        if (!response.ok) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `GeoDB API error: ${response.status} ${response.statusText}`,
          });
        }

        const data = (await response.json()) as GeoDBSearchResponse;
        return data.data || [];
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            error instanceof Error ? error.message : 'Failed to search cities',
        });
      }
    }),

  getCityByCoordinates: baseProcedure
    .input(
      z.object({
        lat: z.number().min(-90).max(90),
        lon: z.number().min(-180).max(180),
        radius: z.number().min(1).max(500).default(50),
      })
    )
    .query(async ({ input }) => {
      if (!RAPID_API_KEY) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'API key not configured',
        });
      }

      try {
        const params = new URLSearchParams({
          radius: input.radius.toString(),
          limit: '1',
          sort: '-population',
        });

        // Format coordinates: +latitude-longitude or -latitude+longitude
        const latStr = input.lat >= 0 ? `+${input.lat}` : `${input.lat}`;
        const lonStr = input.lon >= 0 ? `+${input.lon}` : `${input.lon}`;

        const response = await fetch(
          `${GEODB_BASE_URL}/locations/${latStr}${lonStr}/nearbyCities?${params}`,
          {
            method: 'GET',
            headers: {
              'x-rapidapi-key': RAPID_API_KEY,
              'x-rapidapi-host': RAPID_API_HOST,
            },
          }
        );

        if (!response.ok) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `GeoDB API error: ${response.status} ${response.statusText}`,
          });
        }

        const data = (await response.json()) as GeoDBSearchResponse;

        if (!data.data || data.data.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No city found near these coordinates',
          });
        }

        return data.data[0] as GeoDBCity;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to get city by coordinates',
        });
      }
    }),
});
