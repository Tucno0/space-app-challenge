'use client';

import { AQICard } from '@/components/air-quality/aqi-card';
import { PollutantCard } from '@/components/air-quality/pollutant-card';
import { HealthRecommendation } from '@/components/air-quality/health-recommendation';
import dynamic from 'next/dynamic';
import { MapLegend } from '@/components/map/map-legend';
import { StatCard } from '@/components/data/stat-card';
import { AlertCard } from '@/components/alerts/alert-card';
import {
  mockCurrentAirQuality,
  mockLocationAQI,
} from '@/lib/mock-data/air-quality-data';
import { mockAlerts } from '@/lib/mock-data/alerts-data';
import { Wind, Droplets, Gauge, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslation } from '@/hooks/use-translation';
import { useLocationStore } from '@/hooks/use-location-store';

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

  const airQualityData = mockCurrentAirQuality;
  const recentAlerts = mockAlerts.slice(0, 2);

  // Use current location from store for map center, fallback to mock data
  const mapCenter: [number, number] = currentLocation
    ? [currentLocation.coordinates.lat, currentLocation.coordinates.lon]
    : [airQualityData.aqi.location.lat, airQualityData.aqi.location.lon];

  const mapMarkers = Object.values(mockLocationAQI).map((data) => ({
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
          <AQICard data={airQualityData} showDetails />
        </div>

        {/* Middle Column - Quick Stats */}
        <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
          <StatCard
            title={dict.stats.temperature}
            value="22°C"
            subtitle={`${dict.stats.feelsLike} 23°C`}
            icon={TrendingUp}
          />
          <StatCard
            title={dict.stats.windSpeed}
            value="15 km/h"
            subtitle={dict.stats.swDirection}
            icon={Wind}
          />
          <StatCard
            title={dict.stats.humidity}
            value="65%"
            subtitle={dict.stats.comfortable}
            icon={Droplets}
          />
          <StatCard
            title={dict.stats.pressure}
            value="1013 hPa"
            subtitle={dict.stats.normal}
            icon={Gauge}
          />
        </div>
      </div>

      {/* Pollutants Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">{dict.home.pollutantLevels}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {airQualityData.pollutants.map((pollutant) => (
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
      <HealthRecommendation category={airQualityData.aqi.category} />

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
