import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Satellite,
  Radio,
  Globe,
  ExternalLink,
  Cloud,
  Flame,
  MapPin,
} from 'lucide-react';
import { stationNetworks } from '@/lib/mock-data/stations-data';
import { Button } from '@/components/ui/button';
import { getDictionary } from '@/lib/get-dictionary';
import type { PageProps } from '@/types/locale';

export default async function SourcesPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          {dict.sources.title}
        </h1>
        <p className="text-muted-foreground text-lg">{dict.sources.subtitle}</p>
      </div>

      {/* NASA TEMPO Satellite */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <Satellite className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">NASA TEMPO</CardTitle>
                <CardDescription>
                  Tropospheric Emissions: Monitoring of Pollution
                </CardDescription>
              </div>
            </div>
            <Badge>{dict.sources.primarySource}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            TEMPO is NASA&apos;s first Earth Venture Instrument mission,
            providing unprecedented hourly daytime observations of air quality
            across North America. Launched in 2023, it measures atmospheric
            composition from geostationary orbit.
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <div className="text-sm font-medium">{dict.sources.coverage}</div>
              <div className="text-sm text-muted-foreground">
                {dict.sources.greaterNorthAmerica}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">
                {dict.sources.temporalResolution}
              </div>
              <div className="text-sm text-muted-foreground">
                {dict.sources.hourlyDaylight}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">
                {dict.sources.spatialResolution}
              </div>
              <div className="text-sm text-muted-foreground">
                {dict.sources.cityLevel}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">
                {dict.sources.keyPollutants}
              </div>
              <div className="text-sm text-muted-foreground">
                O₃, NO₂, SO₂, HCHO, aerosols
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">{dict.sources.orbit}</div>
              <div className="text-sm text-muted-foreground">
                {dict.sources.geostationary}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">
                {dict.sources.launchDate}
              </div>
              <div className="text-sm text-muted-foreground">
                {dict.sources.april2023}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a
                href="https://tempo.si.edu"
                target="_blank"
                rel="noopener noreferrer"
              >
                {dict.common.learnMore}{' '}
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://asdc.larc.nasa.gov/project/TEMPO"
                target="_blank"
                rel="noopener noreferrer"
              >
                {dict.common.accessData}{' '}
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-Time Data Sources */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          Real-Time Air Quality & Weather Data
        </h2>
        <p className="text-muted-foreground">
          Current implementation uses the following APIs for real-time air
          quality monitoring, weather conditions, and environmental alerts.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* IQAir */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-500/10 p-3">
                    <Globe className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle>IQAir (AirVisual)</CardTitle>
                    <CardDescription>Air Quality Data Provider</CardDescription>
                  </div>
                </div>
                <Badge variant="outline">Primary</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                IQAir provides real-time air quality data from thousands of
                monitoring stations worldwide. Used as the primary source for
                current AQI values and pollutant concentrations.
              </p>

              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coverage</span>
                  <span className="font-medium">Global</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Update Frequency
                  </span>
                  <span className="font-medium">Real-time</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data Points</span>
                  <span className="font-medium">
                    AQI, PM2.5, PM10, O3, NO2, SO2
                  </span>
                </div>
              </div>

              <Button variant="outline" className="w-full" asChild>
                <a
                  href="https://www.iqair.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* WAQI */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-500/10 p-3">
                    <Globe className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <CardTitle>WAQI</CardTitle>
                    <CardDescription>
                      World Air Quality Index Project
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline">Fallback & Map</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                WAQI aggregates air quality data from over 30,000 monitoring
                stations in 2,000+ cities worldwide. Used for map markers and as
                fallback when IQAir is unavailable.
              </p>

              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coverage</span>
                  <span className="font-medium">Global (30,000+ stations)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Update Frequency
                  </span>
                  <span className="font-medium">Hourly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Features</span>
                  <span className="font-medium">Map API, Historical Data</span>
                </div>
              </div>

              <Button variant="outline" className="w-full" asChild>
                <a
                  href="https://waqi.info"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* OpenWeatherMap */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-sky-500/10 p-3">
                  <Cloud className="h-6 w-6 text-sky-500" />
                </div>
                <div>
                  <CardTitle>OpenWeatherMap</CardTitle>
                  <CardDescription>Weather & Climate Data</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                OpenWeatherMap provides comprehensive weather data including
                temperature, humidity, wind speed, pressure, and atmospheric
                conditions that affect air quality.
              </p>

              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coverage</span>
                  <span className="font-medium">Global</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">API Version</span>
                  <span className="font-medium">One Call API 3.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data Points</span>
                  <span className="font-medium">
                    Temp, Wind, Humidity, Pressure, UV
                  </span>
                </div>
              </div>

              <Button variant="outline" className="w-full" asChild>
                <a
                  href="https://openweathermap.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* NASA FIRMS */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-orange-500/10 p-3">
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <CardTitle>NASA FIRMS</CardTitle>
                  <CardDescription>
                    Fire Information for Resource Management
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                NASA FIRMS provides near real-time active fire data from
                satellite imagery (VIIRS 375m). Used to detect wildfires and
                generate smoke quality alerts.
              </p>

              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coverage</span>
                  <span className="font-medium">Global</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resolution</span>
                  <span className="font-medium">375m (VIIRS)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Update Frequency
                  </span>
                  <span className="font-medium">Near Real-Time (NRT)</span>
                </div>
              </div>

              <Button variant="outline" className="w-full" asChild>
                <a
                  href="https://firms.modaps.eosdis.nasa.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* GeoDB Cities */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-500/10 p-3">
                  <MapPin className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <CardTitle>GeoDB Cities</CardTitle>
                  <CardDescription>Location & City Search</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                GeoDB Cities API provides comprehensive city and location data
                for search functionality. Enables users to find any city
                worldwide with coordinates.
              </p>

              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coverage</span>
                  <span className="font-medium">Global Cities</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Provider</span>
                  <span className="font-medium">RapidAPI</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Features</span>
                  <span className="font-medium">
                    Search, Coordinates, Population
                  </span>
                </div>
              </div>

              <Button variant="outline" className="w-full" asChild>
                <a
                  href="https://rapidapi.com/wirefreethought/api/geodb-cities"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Ground Station Networks */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{dict.sources.groundStations}</h2>
        <p className="text-muted-foreground">
          {dict.sources.groundDescription}
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {stationNetworks.map((network) => (
            <Card key={network.type}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-muted p-2">
                    {network.type === 'openaq' ? (
                      <Globe className="h-5 w-5" />
                    ) : (
                      <Radio className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <CardTitle>{network.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {network.coverage.totalStations} {dict.sources.stations}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {network.description}
                </p>

                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {dict.sources.coverage}
                    </span>
                    <span className="font-medium">
                      {network.coverage.countries.join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {dict.sources.dataFrequency}
                    </span>
                    <span className="font-medium">{network.dataFrequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {dict.sources.totalStations}
                    </span>
                    <span className="font-medium">
                      {network.coverage.totalStations}
                    </span>
                  </div>
                </div>

                <Button variant="outline" className="w-full" asChild>
                  <a
                    href={network.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {dict.sources.visitWebsite}{' '}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Methodology */}
      <Card>
        <CardHeader>
          <CardTitle>{dict.sources.methodology}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-semibold mb-1">
                {dict.sources.dataIntegration}
              </h4>
              <p className="text-muted-foreground">
                {dict.sources.dataIntegrationText}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">
                {dict.sources.qualityAssurance}
              </h4>
              <p className="text-muted-foreground">
                {dict.sources.qualityAssuranceText}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">
                {dict.sources.aqiCalculation}
              </h4>
              <p className="text-muted-foreground">
                {dict.sources.aqiCalculationText}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">
                {dict.sources.forecastModels}
              </h4>
              <p className="text-muted-foreground">
                {dict.sources.forecastModelsText}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attribution */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>{dict.sources.attribution}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>{dict.sources.attributionText}</p>

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Current Data Sources:
              </h4>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <strong>IQAir (AirVisual):</strong> Real-time air quality data
                  from global monitoring stations
                </li>
                <li>
                  <strong>WAQI:</strong> World Air Quality Index Project -
                  30,000+ monitoring stations worldwide
                </li>
                <li>
                  <strong>OpenWeatherMap:</strong> Weather data and atmospheric
                  conditions (One Call API 3.0)
                </li>
                <li>
                  <strong>NASA FIRMS:</strong> Fire Information for Resource
                  Management System (VIIRS 375m)
                </li>
                <li>
                  <strong>GeoDB Cities (RapidAPI):</strong> City search and
                  location data
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Future Integration (NASA Data):
              </h4>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>{dict.sources.attributionList.tempo}</li>
                <li>{dict.sources.attributionList.pandora}</li>
                <li>{dict.sources.attributionList.tolnet}</li>
                <li>{dict.sources.attributionList.openaq}</li>
                <li>{dict.sources.attributionList.epa}</li>
              </ul>
            </div>
          </div>

          <p className="text-xs pt-2 border-t">
            <strong>Note:</strong> This application is developed for the NASA
            Space Apps Challenge 2025. All data sources are properly attributed
            and used in accordance with their respective terms of service and
            licensing agreements.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
