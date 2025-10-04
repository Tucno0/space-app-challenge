import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AQICategory } from '@/types/air-quality';
import { getAQICategoryLabel, getAQIRange } from '@/lib/aqi-calculator';
import {
  getAQICategoryColor,
  getAQICategoryTextColor,
} from '@/lib/color-scales';

const categories: AQICategory[] = [
  'good',
  'moderate',
  'unhealthy-sensitive',
  'unhealthy',
  'very-unhealthy',
  'hazardous',
];

export function MapLegend() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Air Quality Index</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {categories.map((category) => {
          const range = getAQIRange(category);
          const label = getAQICategoryLabel(category);
          const backgroundColor = getAQICategoryColor(category);
          const textColor = getAQICategoryTextColor(category);

          return (
            <div
              key={category}
              className="flex items-center gap-2 text-xs p-2 rounded"
              style={{ backgroundColor, color: textColor }}
            >
              <div className="font-medium flex-1">{label}</div>
              <div className="opacity-90">
                {range.min}-{range.max === 500 ? '500+' : range.max}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
