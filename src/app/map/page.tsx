'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapControls } from '@/components/map/map-controls';
import { MapLegend } from '@/components/map/map-legend';
import { LocationAutocomplete } from '@/components/location/location-autocomplete';
import { CurrentLocationButton } from '@/components/location/current-location-button';

// Importación dinámica del mapa para evitar errores de SSR con Leaflet
const AirQualityMap = dynamic(
  () =>
    import('@/components/map/air-quality-map').then((mod) => mod.AirQualityMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[600px] bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">Cargando mapa interactivo...</p>
      </div>
    ),
  }
);
import { mockLocationAQI } from '@/lib/mock-data/air-quality-data';
import { mockGroundStations } from '@/lib/mock-data/stations-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataSourceBadge } from '@/components/data/data-source-badge';

export default function MapPage() {
  const [center, setCenter] = useState<[number, number]>([34.0522, -118.2437]);
  const [zoom, setZoom] = useState(6);
  const [layers, setLayers] = useState([
    { id: 'aqi', name: 'Air Quality Index', enabled: true },
    { id: 'stations', name: 'Ground Stations', enabled: true },
    { id: 'events', name: 'Air Quality Events', enabled: false },
  ]);

  const handleLayerToggle = (layerId: string, enabled: boolean) => {
    setLayers(
      layers.map((layer) =>
        layer.id === layerId ? { ...layer, enabled } : layer
      )
    );
  };

  const handleLocationSelect = (location: string) => {
    // In real app, geocode the location
    console.log('Selected location:', location);
  };

  const handleLocationDetected = (lat: number, lon: number) => {
    setCenter([lat, lon]);
    setZoom(10);
  };

  const aqiMarkers = Object.values(mockLocationAQI).map((data) => ({
    lat: data.aqi.location.lat,
    lon: data.aqi.location.lon,
    aqi: data.aqi.value,
    name: data.aqi.location.name,
  }));

  const activeStations = mockGroundStations.filter(
    (s) => s.status === 'active'
  );

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Interactive Air Quality Map
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore real-time air quality data across North America
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2 max-w-xl">
          <div className="flex-1">
            <LocationAutocomplete onLocationSelect={handleLocationSelect} />
          </div>
          <CurrentLocationButton
            onLocationDetected={handleLocationDetected}
            size="default"
          />
        </div>
      </div>

      {/* Map Grid */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Map */}
        <div className="lg:col-span-3 space-y-4">
          <AirQualityMap
            center={center}
            zoom={zoom}
            height="600px"
            markers={
              layers.find((l) => l.id === 'aqi')?.enabled ? aqiMarkers : []
            }
            onLocationChange={(lat, lon) => {
              console.log('Map clicked:', lat, lon);
            }}
          />

          {/* Data Source Attribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Data Sources</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <DataSourceBadge source="tempo" />
              <DataSourceBadge source="pandora" />
              <DataSourceBadge source="openaq" />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Map Controls */}
          <MapControls layers={layers} onLayerToggle={handleLayerToggle} />

          {/* Legend */}
          <MapLegend />

          {/* Station Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Ground Stations</CardTitle>
              <CardDescription className="text-xs">
                {activeStations.length} active stations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {activeStations.slice(0, 5).map((station) => (
                <div key={station.id} className="text-xs space-y-1">
                  <div className="flex items-start justify-between">
                    <span className="font-medium">{station.name}</span>
                    <Badge variant="outline" className="text-[10px] h-5">
                      {station.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground text-[11px]">
                    {station.location.address}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Coverage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">TEMPO Coverage</span>
                <span className="font-semibold">North America</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Update Frequency</span>
                <span className="font-semibold">Hourly</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Spatial Resolution
                </span>
                <span className="font-semibold">~10 km</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
