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

export default function SourcesPage() {
  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Data Sources</h1>
        <p className="text-muted-foreground text-lg">
          Learn about the scientific instruments and networks that power AirCast
        </p>
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
            <Badge>Primary Data Source</Badge>
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
              <div className="text-sm font-medium">Coverage</div>
              <div className="text-sm text-muted-foreground">
                Greater North America
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Temporal Resolution</div>
              <div className="text-sm text-muted-foreground">
                Hourly during daylight
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Spatial Resolution</div>
              <div className="text-sm text-muted-foreground">
                ~10 km at city-level
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Key Pollutants</div>
              <div className="text-sm text-muted-foreground">
                O₃, NO₂, SO₂, HCHO, aerosols
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Orbit</div>
              <div className="text-sm text-muted-foreground">Geostationary</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Launch Date</div>
              <div className="text-sm text-muted-foreground">April 2023</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a
                href="https://tempo.si.edu"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn More <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://asdc.larc.nasa.gov/project/TEMPO"
                target="_blank"
                rel="noopener noreferrer"
              >
                Access Data <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ground Station Networks */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Ground Station Networks</h2>
        <p className="text-muted-foreground">
          Ground-based monitoring stations provide validation and complementary
          measurements to satellite data.
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
                      {network.coverage.totalStations} stations
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
                    <span className="text-muted-foreground">Coverage</span>
                    <span className="font-medium">
                      {network.coverage.countries.join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Data Frequency
                    </span>
                    <span className="font-medium">{network.dataFrequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Total Stations
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
                    Visit Website <ExternalLink className="ml-2 h-4 w-4" />
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
          <CardTitle>Data Processing & Methodology</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-semibold mb-1">Data Integration</h4>
              <p className="text-muted-foreground">
                AirCast combines satellite observations from NASA TEMPO with
                ground-based measurements from Pandora, TolNet, and OpenAQ
                networks to provide comprehensive air quality assessments.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Quality Assurance</h4>
              <p className="text-muted-foreground">
                All data undergoes rigorous quality control procedures.
                Satellite retrievals are validated against ground-based
                measurements to ensure accuracy. Data quality flags are applied
                to all observations.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">AQI Calculation</h4>
              <p className="text-muted-foreground">
                Air Quality Index values are calculated following EPA standards
                using measured concentrations of key pollutants including ozone,
                nitrogen dioxide, sulfur dioxide, and particulate matter.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Forecast Models</h4>
              <p className="text-muted-foreground">
                Forecasts are generated using historical data patterns, current
                observations, and meteorological forecasts. Machine learning
                models help predict pollution transport and dispersion.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attribution */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Data Attribution & Licensing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            All data sources used in AirCast are publicly available and open
            access. We acknowledge:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>NASA TEMPO mission and the Atmospheric Science Data Center</li>
            <li>NASA Pandora Project at Goddard Space Flight Center</li>
            <li>TolNet - Tropospheric Ozone Lidar Network</li>
            <li>OpenAQ and contributing data providers worldwide</li>
            <li>U.S. EPA for AQI methodology and health guidelines</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
