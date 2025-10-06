'use client';

import { AQICard } from '@/components/air-quality/aqi-card';
import { PollutantCard } from '@/components/air-quality/pollutant-card';
import { HealthRecommendation } from '@/components/air-quality/health-recommendation';
import dynamic from 'next/dynamic';
import { MapLegend } from '@/components/map/map-legend';
import { StatCard } from '@/components/data/stat-card';
import { AlertCard } from '@/components/alerts/alert-card';
import { mockLocationAQI } from '@/lib/mock-data/air-quality-data';
import { Wind, Droplets, Gauge, TrendingUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslation } from '@/hooks/use-translation';
import { useLocationStore } from '@/hooks/use-location-store';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { DashboardSkeleton } from '@/components/data/dashboard-skeleton';
import { ErrorDisplay } from '@/components/data/error-display';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AirQualityMap = dynamic(
  () =>
    import('@/components/map/air-quality-map').then((mod) => mod.AirQualityMap),
  {
    ssr: false,
    loading: () => {
      return (
        <div className="flex items-center justify-center h-[400px] bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      );
    },
  }
);

export default function HomePage() {
  const { dictionary: dict, locale } = useTranslation();
  const currentLocation = useLocationStore((state) => state.currentLocation);
  const isLocationLoading = useLocationStore((state) => state.isLoading);
  const trpc = useTRPC();

  // Fetch air quality data
  const airQualityQuery = useQuery(
    trpc.airQuality.getCurrentAirQuality.queryOptions(
      {
        lat: currentLocation?.coordinates.lat ?? 0,
        lon: currentLocation?.coordinates.lon ?? 0,
      },
      {
        enabled: !!currentLocation,
        staleTime: 0,
      }
    )
  );

  // Fetch weather data
  const weatherQuery = useQuery(
    trpc.weather.getCurrentWeather.queryOptions(
      {
        lat: currentLocation?.coordinates.lat ?? 0,
        lon: currentLocation?.coordinates.lon ?? 0,
      },
      {
        enabled: !!currentLocation,
        staleTime: 0,
      }
    )
  );

  // Fetch map stations in visible area
  // Calculate bounds based on current location (approximate 300km radius)
  const getMapBounds = (lat: number, lon: number) => {
    const radiusDegrees = 3; // Approximately 300-330km
    return {
      south: Math.max(-90, lat - radiusDegrees),
      west: Math.max(-180, lon - radiusDegrees),
      north: Math.min(90, lat + radiusDegrees),
      east: Math.min(180, lon + radiusDegrees),
    };
  };

  const mapStationsQuery = useQuery(
    trpc.airQuality.getMapStations.queryOptions(
      {
        bounds: currentLocation
          ? getMapBounds(
              currentLocation.coordinates.lat,
              currentLocation.coordinates.lon
            )
          : { south: -90, west: -180, north: 90, east: 180 },
      },
      {
        enabled: !!currentLocation,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      }
    )
  );

  // Fetch active alerts for current location
  const alertsQuery = useQuery(
    trpc.alerts.getActiveAlerts.queryOptions(
      {
        lat: currentLocation?.coordinates.lat ?? 0,
        lon: currentLocation?.coordinates.lon ?? 0,
        locationName: currentLocation?.name,
      },
      {
        enabled: !!currentLocation,
        staleTime: 2 * 60 * 1000, // Cache for 2 minutes
      }
    )
  );

  // Get recent alerts (top 2) and transform dates
  const recentAlerts =
    alertsQuery.data
      ?.map((alert) => ({
        ...alert,
        timestamp: new Date(alert.timestamp),
        expiresAt: alert.expiresAt ? new Date(alert.expiresAt) : undefined,
      }))
      .slice(0, 2) || [];

  // Show loading skeleton when location is initializing or data is loading
  if (isLocationLoading || (!currentLocation && !airQualityQuery.data)) {
    return <DashboardSkeleton />;
  }

  // Show loading skeleton when queries are loading
  if (
    currentLocation &&
    (airQualityQuery.isLoading || weatherQuery.isLoading)
  ) {
    return <DashboardSkeleton />;
  }

  // Show error state if queries failed
  if (airQualityQuery.isError || weatherQuery.isError) {
    return (
      <div className="container py-8">
        <ErrorDisplay
          title={dict.errors?.loadingFailed || 'Failed to load data'}
          message={
            airQualityQuery.error?.message ||
            weatherQuery.error?.message ||
            'Please try again later'
          }
          onRetry={() => {
            airQualityQuery.refetch();
            weatherQuery.refetch();
          }}
        />
      </div>
    );
  }

  // Extract data from queries and transform date strings to Date objects
  const airQualityData = airQualityQuery.data
    ? {
        ...airQualityQuery.data,
        aqi: {
          ...airQualityQuery.data.aqi,
          timestamp: new Date(airQualityQuery.data.aqi.timestamp),
        },
        pollutants: airQualityQuery.data.pollutants.map((p) => ({
          ...p,
          timestamp: new Date(p.timestamp),
        })),
        lastUpdated: new Date(airQualityQuery.data.lastUpdated),
      }
    : undefined;

  const weatherData = weatherQuery.data
    ? {
        ...weatherQuery.data,
        timestamp: new Date(weatherQuery.data.timestamp),
      }
    : undefined;

  // Fallback to default coordinates if no data
  const mapCenter: [number, number] = currentLocation
    ? [currentLocation.coordinates.lat, currentLocation.coordinates.lon]
    : [34.0522, -118.2437];

  // Use real stations from WAQI API, fallback to mock data if no real data
  const mapMarkers =
    mapStationsQuery.data && mapStationsQuery.data.length > 0
      ? mapStationsQuery.data
      : Object.values(mockLocationAQI).map((data) => ({
          lat: data.aqi.location.lat,
          lon: data.aqi.location.lon,
          aqi: data.aqi.value,
          name: data.aqi.location.name,
        }));

  return (
    <div className="container py-8 space-y-8">
      {/* Hero Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">{dict.home.title}</h1>
        <p className="text-muted-foreground text-lg">{dict.home.subtitle}</p>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - AQI Card */}
        <div className="lg:col-span-1">
          <AQICard data={airQualityData!} showDetails />
        </div>

        {/* Middle Column - Quick Stats */}
        <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
          <StatCard
            title={dict.stats.temperature}
            value={`${weatherData?.temperature}°C`}
            subtitle={`${dict.stats.feelsLike} ${weatherData?.feelsLike}°C`}
            icon={TrendingUp}
          />
          <StatCard
            title={dict.stats.windSpeed}
            value={`${weatherData?.windSpeed} km/h`}
            subtitle={
              weatherData?.windDirection !== undefined
                ? `${
                    ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][
                      Math.round(weatherData.windDirection / 45) % 8
                    ]
                  } ${dict.stats.swDirection.replace('SW', '')}`
                : dict.stats.swDirection
            }
            icon={Wind}
          />
          <StatCard
            title={dict.stats.humidity}
            value={`${weatherData?.humidity}%`}
            subtitle={
              weatherData && weatherData.humidity < 30
                ? 'Dry'
                : weatherData && weatherData.humidity > 70
                ? 'Humid'
                : dict.stats.comfortable
            }
            icon={Droplets}
          />
          <StatCard
            title={dict.stats.pressure}
            value={`${weatherData?.pressure} hPa`}
            subtitle={
              weatherData && weatherData.pressure < 1000
                ? 'Low'
                : weatherData && weatherData.pressure > 1020
                ? 'High'
                : dict.stats.normal
            }
            icon={Gauge}
          />
        </div>
      </div>

      {/* Pollutants Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">{dict.home.pollutantLevels}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {airQualityData!.pollutants.map((pollutant) => (
            <PollutantCard key={pollutant.type} pollutant={pollutant} compact />
          ))}
        </div>
      </div>

      {/* Map Section */}
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{dict.home.interactiveMap}</h2>
              <Link href={`/${locale}/map`}>
                <Button variant="outline">{dict.home.fullScreenMap}</Button>
              </Link>
            </div>

            {/* Location Prompt Alert */}
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-300">
                <span className="font-medium">
                  {dict.map.selectLocationPrompt}
                </span>
              </AlertDescription>
            </Alert>

            <AirQualityMap
              center={mapCenter}
              zoom={6}
              height="400px"
              markers={mapMarkers}
            />
          </div>
        </div>
        <div className="lg:col-span-1">
          <MapLegend />
        </div>
      </div>

      {/* Health Recommendations */}
      <HealthRecommendation category={airQualityData!.aqi.category} />

      {/* Recent Alerts */}
      {recentAlerts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{dict.home.recentAlerts}</h2>
            <Link href={`/${locale}/alerts`}>
              <Button variant="outline">{dict.home.viewAllAlerts}</Button>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {recentAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="rounded-lg bg-primary/5 border border-primary/20 p-8 text-center space-y-4">
        <h3 className="text-2xl font-bold">{dict.home.ctaTitle}</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {dict.home.ctaDescription}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href={`/${locale}/forecast`}>
            <Button size="lg">{dict.home.viewForecast}</Button>
          </Link>
          <Link href={`/${locale}/alerts`}>
            <Button size="lg" variant="outline">
              {dict.home.configureAlerts}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
