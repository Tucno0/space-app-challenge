import { Alert as AlertType } from '@/types/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  Info,
  AlertCircle,
  XCircle,
  MapPin,
  Clock,
} from 'lucide-react';
import { formatSmartDate } from '@/lib/date-formatters';
import { cn } from '@/lib/utils';

interface AlertCardProps {
  alert: AlertType;
  onDismiss?: (id: string) => void;
}

const severityConfig = {
  info: {
    icon: Info,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-950',
  },
  danger: {
    icon: AlertCircle,
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-950',
  },
  critical: {
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-950',
  },
};

export function AlertCard({ alert, onDismiss }: AlertCardProps) {
  const config = severityConfig[alert.severity];
  const Icon = config.icon;

  return (
    <Card
      className={cn(config.bg, 'border-l-4')}
      style={{
        borderLeftColor: config.color.replace('text-', ''),
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Icon className={cn('h-5 w-5 mt-0.5', config.color)} />
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-base">{alert.title}</CardTitle>
                <Badge variant="outline" className="capitalize">
                  {alert.type.replace('-', ' ')}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-3 text-xs flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {alert.location.name}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatSmartDate(alert.timestamp)}
                </span>
              </CardDescription>
            </div>
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDismiss(alert.id)}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm">{alert.message}</p>

        {alert.aqiValue && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Current AQI:</span>
            <span className="font-semibold">{alert.aqiValue}</span>
          </div>
        )}

        {alert.recommendations.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <h4 className="text-sm font-medium">Recommendations:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {alert.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {alert.expiresAt && (
          <p className="text-xs text-muted-foreground pt-2">
            Expires {formatSmartDate(alert.expiresAt)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
