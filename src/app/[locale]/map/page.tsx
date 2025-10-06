'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapControls } from '@/components/map/map-controls';
import { MapLegend } from '@/components/map/map-legend';
import { LocationAutocomplete } from '@/components/location/location-autocomplete';
import { CurrentLocationButton } from '@/components/location/current-location-button';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DataSourceBadge } from '@/components/data/data-source-badge';
import { useTranslation } from '@/hooks/use-translation';
import { useLocationStore } from '@/hooks/use-location-store';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Info } from 'lucide-react';

const AirQualityMap = dynamic(
  () =>
    import('@/components/map/air-quality-map').then((mod) => mod.AirQualityMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[600px] bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    ),
  }
);

export default function MapPage() {
  const { dictionary: dict } = useTranslation();
  const currentLocation = useLocationStore((state) => state.currentLocation);
  const isLocationLoading = useLocationStore((state) => state.isLoading);
  const trpc = useTRPC();

  // Use current location from store, fallback to LA coordinates
  const defaultCenter: [number, number] = currentLocation
    ? [currentLocation.coordinates.lat, currentLocation.coordinates.lon]
    : [34.0522, -118.2437];

  const [center, setCenter] = useState<[number, number]>(defaultCenter);
  const [zoom, setZoom] = useState(6);
  const [mapBounds, setMapBounds] = useState({
    south: -90,
    west: -180,
    north: 90,
    east: 180,
  });
  const [layers, setLayers] = useState([
    { id: 'aqi', name: 'Air Quality Index', enabled: true },
    { id: 'stations', name: 'Ground Stations', enabled: true },
    { id: 'events', name: 'Air Quality Events', enabled: false },
  ]);

  // Calculate bounds based on center and zoom level
  const calculateBounds = (center: [number, number], zoom: number) => {
    // Approximate calculation based on zoom level
    // Lower zoom = larger area
    const latRange = 180 / Math.pow(2, zoom - 1);
    const lonRange = 360 / Math.pow(2, zoom - 1);

    return {
      south: Math.max(-90, center[0] - latRange / 2),
      west: Math.max(-180, center[1] - lonRange / 2),
      north: Math.min(90, center[0] + latRange / 2),
      east: Math.min(180, center[1] + lonRange / 2),
    };
  };

  // Update bounds when center or zoom changes
  useEffect(() => {
    const newBounds = calculateBounds(center, zoom);
    setMapBounds(newBounds);
  }, [center, zoom]);

  // Update center when location changes
  useEffect(() => {
    if (currentLocation) {
      setCenter([
        currentLocation.coordinates.lat,
        currentLocation.coordinates.lon,
      ]);
    }
  }, [currentLocation]);

  // Fetch stations based on map bounds
  const mapStationsQuery = useQuery(
    trpc.airQuality.getMapStations.queryOptions(
      {
        bounds: mapBounds,
      },
      {
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      }
    )
  );

  const handleLayerToggle = (layerId: string, enabled: boolean) => {
    setLayers(
      layers.map((layer) =>
        layer.id === layerId ? { ...layer, enabled } : layer
      )
    );
  };

  // Use real stations from WAQI API, fallback to mock data
  const aqiMarkers =
    mapStationsQuery.data && mapStationsQuery.data.length > 0
      ? mapStationsQuery.data
      : Object.values(mockLocationAQI).map((data, index) => ({
          id: index,
          lat: data.aqi.location.lat,
          lon: data.aqi.location.lon,
          aqi: data.aqi.value,
          name: data.aqi.location.name,
        }));

  const activeStations = mockGroundStations.filter(
    (s) => s.status === 'active'
  );

  console.log('🗺️ Map Stations:', {
    boundsQuery: mapBounds,
    isLoading: mapStationsQuery.isLoading,
    stationCount: mapStationsQuery.data?.length ?? 0,
    usingRealData: mapStationsQuery.data && mapStationsQuery.data.length > 0,
  });

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            {dict.map.title}
          </h1>
          <p className="text-muted-foreground text-lg">{dict.map.subtitle}</p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2 max-w-xl">
          <div className="flex-1">
            <LocationAutocomplete />
          </div>
          <CurrentLocationButton size="default" />
        </div>

        {/* Location Prompt Alert */}
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-300">
            <span className="font-medium">{dict.map.selectLocationPrompt}</span>
          </AlertDescription>
        </Alert>
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
              <CardTitle className="text-sm">
                {dict.footer.dataSources}
              </CardTitle>
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
              <CardTitle className="text-sm">{dict.map.stations}</CardTitle>
              <CardDescription className="text-xs">
                {mapStationsQuery.isLoading
                  ? 'Loading stations...'
                  : `${aqiMarkers.length} monitoring stations`}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-2">
              {mapStationsQuery.isLoading ? (
                <div className="text-xs text-muted-foreground">
                  Loading air quality stations...
                </div>
              ) : aqiMarkers.length > 0 ? (
                <>
                  {aqiMarkers.slice(0, 5).map((station) => (
                    <div key={station.id} className="text-xs space-y-1">
                      <div className="flex items-start justify-between">
                        <span className="font-medium">{station.name}</span>
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5"
                          style={{
                            backgroundColor:
                              station.aqi <= 50
                                ? '#00E400'
                                : station.aqi <= 100
                                ? '#FFFF00'
                                : station.aqi <= 150
                                ? '#FF7E00'
                                : station.aqi <= 200
                                ? '#FF0000'
                                : station.aqi <= 300
                                ? '#8F3F97'
                                : '#7E0023',
                            color: station.aqi > 100 ? 'white' : 'black',
                          }}
                        >
                          AQI {station.aqi}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground text-[11px]">
                        Real-time data from WAQI
                      </div>
                    </div>
                  ))}
                  {aqiMarkers.length > 5 && (
                    <div className="text-xs text-muted-foreground text-center pt-2">
                      +{aqiMarkers.length - 5} more stations
                    </div>
                  )}
                </>
              ) : (
                <div className="text-xs text-muted-foreground">
                  No stations found in this area
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{dict.sources.coverage}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  TEMPO {dict.sources.coverage}
                </span>
                <span className="font-semibold">
                  {dict.sources.greaterNorthAmerica}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {dict.sources.temporalResolution}
                </span>
                <span className="font-semibold">
                  {dict.sources.hourlyDaylight}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {dict.sources.spatialResolution}
                </span>
                <span className="font-semibold">{dict.sources.cityLevel}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
