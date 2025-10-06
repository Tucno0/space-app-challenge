'use client';

import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DailyForecastChart } from '@/components/charts/daily-forecast-chart';
import { MetricDisplay } from '@/components/data/metric-display';
import { CardSkeleton } from '@/components/data/loading-skeleton';
import { ErrorDisplay } from '@/components/data/error-display';
import {
  Wind,
  Droplets,
  Thermometer,
  Gauge,
  CloudRain,
  Info,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTranslation } from '@/hooks/use-translation';

export default function ForecastPage() {
  const { dictionary: dict } = useTranslation();
  const trpc = useTRPC();

  // Fetch weather forecast from IQA Predict API (Ayacucho only)
  const forecastQuery = useQuery(trpc.weather.getForecast.queryOptions());

  // Show loading state
  if (forecastQuery.isLoading) {
    return (
      <div className="container py-8 space-y-8">
        <CardSkeleton />
        <CardSkeleton />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  // Show error state
  if (forecastQuery.error) {
    return (
      <div className="container py-8">
        <ErrorDisplay
          title="Failed to load forecast"
          message={forecastQuery.error.message}
          onRetry={() => forecastQuery.refetch()}
        />
      </div>
    );
  }

  const forecast = forecastQuery.data || [];

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          {dict.forecast.title}
        </h1>
        <p className="text-muted-foreground text-lg">
          Ayacucho, Peru - {dict.forecast.subtitle}
        </p>
      </div>

      {/* Important Notice */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Note</AlertTitle>
        <AlertDescription>
          This forecast is specifically for Ayacucho, Peru, powered by IQA
          Predict AI prediction model.
        </AlertDescription>
      </Alert>

      {/* Weather Forecast Chart */}
      <DailyForecastChart
        forecasts={forecast}
        title={dict.forecast.weekTrend}
        description="5-day weather forecast showing temperature, dewpoint, wind speed, and precipitation"
      />

      {/* Daily Details Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {forecast.map((day, index) => {
          const date = new Date(day.date);
          const dayName =
            index === 0
              ? dict.forecast.today
              : date.toLocaleDateString('en', { weekday: 'long' });
          const formattedDate = date.toLocaleDateString('en', {
            month: 'short',
            day: 'numeric',
          });

          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{dayName}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {formattedDate}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay
                    label={dict.stats.temperature}
                    value={day.temperature}
                    unit="°C"
                    icon={Thermometer}
                  />
                  <MetricDisplay
                    label="Dewpoint"
                    value={day.dewpoint}
                    unit="°C"
                    icon={Droplets}
                  />
                  <MetricDisplay
                    label={dict.stats.windSpeed}
                    value={day.windSpeed}
                    unit="km/h"
                    icon={Wind}
                  />
                  <MetricDisplay
                    label={dict.stats.pressure}
                    value={day.pressure}
                    unit="hPa"
                    icon={Gauge}
                  />
                  <MetricDisplay
                    label="Precipitation"
                    value={day.precipitation}
                    unit="mm"
                    icon={CloudRain}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>About This Forecast</CardTitle>
          <CardDescription>
            Data source and methodology information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Data Source</h4>
            <p className="text-sm text-muted-foreground">
              Weather forecasts are provided by the IQA Predict API, using
              advanced machine learning models trained on historical weather
              patterns specific to Ayacucho, Peru.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Forecast Parameters</h4>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>
                <strong>Temperature:</strong> Daily average temperature in
                Celsius
              </li>
              <li>
                <strong>Dewpoint:</strong> Temperature at which air becomes
                saturated with moisture
              </li>
              <li>
                <strong>Pressure:</strong> Atmospheric pressure in hectopascals
                (hPa)
              </li>
              <li>
                <strong>Wind Speed:</strong> Average wind speed in kilometers
                per hour
              </li>
              <li>
                <strong>Precipitation:</strong> Expected rainfall in millimeters
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Update Frequency</h4>
            <p className="text-sm text-muted-foreground">
              Forecasts are updated daily and provide predictions for the next 5
              days.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
