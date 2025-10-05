import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { citiesRouter } from './cities';
import { airQualityRouter } from './air-quality';
import { weatherRouter } from './weather';
import { alertsRouter } from './alerts';

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  cities: citiesRouter,
  airQuality: airQualityRouter,
  weather: weatherRouter,
  alerts: alertsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
