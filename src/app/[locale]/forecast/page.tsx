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
import { AQIPredictionChart } from '@/components/charts/aqi-prediction-chart';
import { AQIBarChart } from '@/components/charts/aqi-bar-chart';
import { AQIBadge } from '@/components/air-quality/aqi-badge';
import { MetricDisplay } from '@/components/data/metric-display';
import { CardSkeleton } from '@/components/data/loading-skeleton';
import { ErrorDisplay } from '@/components/data/error-display';
import { Activity, Wind, Flame, AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTranslation } from '@/hooks/use-translation';

export default function ForecastPage() {
  const { dictionary: dict } = useTranslation();
  const trpc = useTRPC();

  // Fetch AQI predictions from IQA Predict API (Ayacucho only)
  const predictionsQuery = useQuery(
    trpc.airQuality.getAQIPredictions.queryOptions()
  );

  // Show loading state
  if (predictionsQuery.isLoading) {
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
  if (predictionsQuery.error) {
    return (
      <div className="container py-8">
        <ErrorDisplay
          title="Failed to load AQI predictions"
          message={predictionsQuery.error.message}
          onRetry={() => predictionsQuery.refetch()}
        />
      </div>
    );
  }

  const predictions = predictionsQuery.data || [];

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          {dict.forecast.title}
        </h1>
        <p className="text-muted-foreground text-lg">
          Ayacucho, Peru - 7-Day Air Quality Predictions
        </p>
      </div>

      {/* Important Notice */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Note</AlertTitle>
        <AlertDescription>
          This forecast is specifically for Ayacucho, Peru, powered by IQA
          Predict AI prediction model. Predictions include AQI and major air
          pollutants (NO₂, CO, O₃, SO₂).
        </AlertDescription>
      </Alert>

      {/* AQI Prediction Chart */}
      <AQIPredictionChart
        predictions={predictions}
        title="7-Day Air Quality Forecast"
        description="Predicted AQI and pollutant levels for the next 7 days"
      />

      {/* AQI Bar Chart */}
      <AQIBarChart
        predictions={predictions}
        title="Daily AQI Comparison"
        description="Air Quality Index values for each day - compare daily variations"
      />

      {/* Daily Predictions Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {predictions.map((prediction, index) => {
          const date = new Date(prediction.date);
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
                  <span className="text-base">{dayName}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {formattedDate}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* AQI Badge */}
                <div className="flex flex-col items-center gap-2 pb-4 border-b">
                  <span className="text-xs text-muted-foreground">
                    Air Quality Index
                  </span>
                  <AQIBadge
                    value={prediction.aqi}
                    category={prediction.category}
                  />
                  <span className="text-sm font-medium">
                    {prediction.quality}
                  </span>
                </div>

                {/* Pollutants */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground">
                    Pollutants
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">NO₂</div>
                      <div className="text-sm font-semibold">
                        {prediction.pollutants.no2}
                        <span className="text-xs font-normal ml-1">µg/m³</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">CO</div>
                      <div className="text-sm font-semibold">
                        {prediction.pollutants.co}
                        <span className="text-xs font-normal ml-1">mg/m³</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">O₃</div>
                      <div className="text-sm font-semibold">
                        {Math.round(prediction.pollutants.o3 / 1000)}
                        <span className="text-xs font-normal ml-1">
                          ×10³ µg/m³
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">SO₂</div>
                      <div className="text-sm font-semibold">
                        {prediction.pollutants.so2}
                        <span className="text-xs font-normal ml-1">µg/m³</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Aerosol Index */}
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      Aerosol Index
                    </span>
                    <span className="text-sm font-semibold">
                      {prediction.aerosolIndex}
                    </span>
                  </div>
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
              Air quality predictions are provided by the IQA Predict API, using
              advanced machine learning models trained on historical air quality
              patterns, meteorological data, and pollution sources specific to
              Ayacucho, Peru.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Prediction Parameters</h4>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>
                <strong>AQI (Air Quality Index):</strong> Overall air quality
                indicator from 0-500
              </li>
              <li>
                <strong>NO₂ (Nitrogen Dioxide):</strong> Traffic and industrial
                emissions (µg/m³)
              </li>
              <li>
                <strong>CO (Carbon Monoxide):</strong> Combustion byproduct
                (mg/m³)
              </li>
              <li>
                <strong>O₃ (Ozone):</strong> Ground-level ozone from
                photochemical reactions (µg/m³)
              </li>
              <li>
                <strong>SO₂ (Sulfur Dioxide):</strong> Industrial and volcanic
                emissions (µg/m³)
              </li>
              <li>
                <strong>Aerosol Index:</strong> Measure of airborne particles
                and haze
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">AQI Categories</h4>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>
                <strong>Good (0-50):</strong> Air quality is satisfactory
              </li>
              <li>
                <strong>Moderate (51-100):</strong> Acceptable for most people
              </li>
              <li>
                <strong>Unhealthy for Sensitive Groups (101-150):</strong>{' '}
                Sensitive individuals may experience health effects
              </li>
              <li>
                <strong>Unhealthy (151-200):</strong> Everyone may experience
                health effects
              </li>
              <li>
                <strong>Very Unhealthy (201-300):</strong> Health alert for
                everyone
              </li>
              <li>
                <strong>Hazardous (301+):</strong> Emergency conditions
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Update Frequency</h4>
            <p className="text-sm text-muted-foreground">
              Predictions are updated daily and provide forecasts for the next 7
              days. Models incorporate real-time meteorological data, satellite
              observations, and historical pollution patterns.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
