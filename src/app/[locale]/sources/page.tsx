import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Satellite, Radio, Globe, ExternalLink } from 'lucide-react';
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
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>{dict.sources.attributionText}</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>{dict.sources.attributionList.tempo}</li>
            <li>{dict.sources.attributionList.pandora}</li>
            <li>{dict.sources.attributionList.tolnet}</li>
            <li>{dict.sources.attributionList.openaq}</li>
            <li>{dict.sources.attributionList.epa}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
