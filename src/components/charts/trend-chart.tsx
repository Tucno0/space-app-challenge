'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { getAQIColor } from '@/lib/color-scales';
import { formatHourOnly } from '@/lib/date-formatters';

interface DataPoint {
  timestamp: Date;
  value: number;
  label?: string;
}

interface TrendChartProps {
  data: DataPoint[];
  title?: string;
  description?: string;
  yAxisLabel?: string;
  showGrid?: boolean;
}

export function TrendChart({
  data,
  title,
  description,
  yAxisLabel = 'AQI',
  showGrid = true,
}: TrendChartProps) {
  const chartData = data.map((point) => ({
    time: formatHourOnly(point.timestamp),
    value: point.value,
    fill: getAQIColor(point.value),
  }));

  const config = {
    value: {
      label: yAxisLabel,
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <ChartContainer config={config} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              )}
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <YAxis tickLine={false} axisLine={false} className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
