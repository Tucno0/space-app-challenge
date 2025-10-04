import { AirQualityData } from '@/types/air-quality';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AQIBadge } from './aqi-badge';
import { getAQICategoryLabel } from '@/lib/aqi-calculator';
import { formatLastUpdated } from '@/lib/date-formatters';
import { MapPin, Clock } from 'lucide-react';

interface AQICardProps {
  data: AirQualityData;
  showDetails?: boolean;
}

export function AQICard({ data, showDetails = true }: AQICardProps) {
  const { aqi, lastUpdated, dataSource } = data;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">Air Quality Index</CardTitle>
            <CardDescription className="flex items-center gap-1.5 text-xs">
              <MapPin className="h-3 w-3" />
              {aqi.location.name}
            </CardDescription>
          </div>
          <AQIBadge value={aqi.value} category={aqi.category} size="lg" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="text-4xl font-bold">{aqi.value}</div>
          <div className="text-sm text-muted-foreground">
            {getAQICategoryLabel(aqi.category)}
          </div>
        </div>

        {showDetails && (
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Primary Pollutant</span>
              <span className="font-medium">
                {aqi.primaryPollutant.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Data Source</span>
              <span className="font-medium capitalize">{dataSource}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Updated {formatLastUpdated(lastUpdated)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
