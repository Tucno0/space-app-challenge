import { AirQualityEvent, getEventIcon } from '@/lib/mock-data/events-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, TrendingUp } from 'lucide-react';
import { formatSmartDate } from '@/lib/date-formatters';

interface EventCardProps {
  event: AirQualityEvent;
}

export function EventCard({ event }: EventCardProps) {
  const severityColors = {
    low: 'bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-100',
    medium:
      'bg-yellow-100 dark:bg-yellow-950 text-yellow-900 dark:text-yellow-100',
    high: 'bg-orange-100 dark:bg-orange-950 text-orange-900 dark:text-orange-100',
    critical: 'bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-100',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getEventIcon(event.type)}</span>
              <CardTitle className="text-lg">{event.title}</CardTitle>
            </div>
            <CardDescription className="flex items-center gap-2 flex-wrap">
              <Badge
                className={severityColors[event.severity]}
                variant="secondary"
              >
                {event.severity.toUpperCase()}
              </Badge>
              <span className="flex items-center gap-1 text-xs">
                <MapPin className="h-3 w-3" />
                {event.location.name}
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{event.description}</p>

        <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg">
          <div>
            <div className="text-xs text-muted-foreground">
              Current AQI Impact
            </div>
            <div className="text-lg font-semibold">
              {event.expectedAQIImpact.current}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">
              Peak AQI Expected
            </div>
            <div className="text-lg font-semibold flex items-center gap-1">
              {event.expectedAQIImpact.peak}
              <TrendingUp className="h-4 w-4 text-red-500" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-medium">Impacted Areas:</div>
          <div className="flex flex-wrap gap-1">
            {event.impactedAreas.map((area) => (
              <Badge key={area} variant="outline" className="text-xs">
                {area}
              </Badge>
            ))}
          </div>
        </div>

        {event.updates.length > 0 && (
          <div className="space-y-2 border-t pt-3">
            <div className="text-xs font-medium">Latest Update:</div>
            <div className="flex items-start gap-2">
              <Clock className="h-3 w-3 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">
                  {formatSmartDate(event.updates[0].timestamp)}
                </p>
                <p className="text-sm">{event.updates[0].message}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>Sources:</span>
          {event.sources.map((source, index) => (
            <span key={source}>
              {source}
              {index < event.sources.length - 1 && ', '}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
