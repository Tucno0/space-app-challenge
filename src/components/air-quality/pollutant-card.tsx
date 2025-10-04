import { PollutantReading } from '@/types/air-quality';
import { Card, CardContent } from '@/components/ui/card';
import { getPollutantName } from '@/lib/aqi-calculator';
import { getAQIColor, getAQITextColor } from '@/lib/color-scales';
import { cn } from '@/lib/utils';

interface PollutantCardProps {
  pollutant: PollutantReading;
  compact?: boolean;
  className?: string;
}

export function PollutantCard({
  pollutant,
  compact = false,
  className,
}: PollutantCardProps) {
  const backgroundColor = getAQIColor(pollutant.aqi);
  const textColor = getAQITextColor(pollutant.aqi);

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center justify-between p-3 rounded-lg',
          className
        )}
        style={{ backgroundColor, color: textColor }}
      >
        <div className="font-medium">{getPollutantName(pollutant.type)}</div>
        <div className="text-right">
          <div className="font-bold">{pollutant.aqi}</div>
          <div className="text-xs opacity-90">
            {pollutant.value.toFixed(1)} {pollutant.unit}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            {getPollutantName(pollutant.type)}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              {pollutant.value.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">
              {pollutant.unit}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">AQI</div>
            <div
              className="px-2 py-0.5 rounded text-xs font-semibold"
              style={{ backgroundColor, color: textColor }}
            >
              {pollutant.aqi}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
