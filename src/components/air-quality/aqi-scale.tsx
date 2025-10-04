import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AQICategory } from '@/types/air-quality';
import { getAQICategoryLabel, getAQIRange } from '@/lib/aqi-calculator';
import {
  getAQICategoryColor,
  getAQICategoryTextColor,
} from '@/lib/color-scales';

interface AQIScaleProps {
  currentAQI?: number;
  showLabels?: boolean;
}

const categories: AQICategory[] = [
  'good',
  'moderate',
  'unhealthy-sensitive',
  'unhealthy',
  'very-unhealthy',
  'hazardous',
];

export function AQIScale({ currentAQI, showLabels = true }: AQIScaleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AQI Scale</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((category) => {
          const range = getAQIRange(category);
          const label = getAQICategoryLabel(category);
          const backgroundColor = getAQICategoryColor(category);
          const textColor = getAQICategoryTextColor(category);
          const isCurrentCategory =
            currentAQI !== undefined &&
            currentAQI >= range.min &&
            currentAQI <= range.max;

          return (
            <div
              key={category}
              className="flex items-center gap-3 p-3 rounded-lg transition-all"
              style={{
                backgroundColor,
                color: textColor,
                opacity:
                  currentAQI !== undefined && !isCurrentCategory ? 0.5 : 1,
                border: isCurrentCategory ? `2px solid ${textColor}` : 'none',
              }}
            >
              <div className="flex-1">
                <div className="font-semibold">{label}</div>
                {showLabels && (
                  <div className="text-xs opacity-90">
                    {range.min}-{range.max === 500 ? '500+' : range.max}
                  </div>
                )}
              </div>
              {isCurrentCategory && currentAQI !== undefined && (
                <div className="text-2xl font-bold">{currentAQI}</div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
