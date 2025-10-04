'use client';

import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
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
import { HourlyForecast } from '@/types/forecast';
import { formatHourOnly } from '@/lib/date-formatters';

interface ForecastChartProps {
  forecasts: HourlyForecast[];
  title?: string;
  description?: string;
}

export function ForecastChart({
  forecasts,
  title = '24-Hour Forecast',
  description,
}: ForecastChartProps) {
  const chartData = forecasts.map((f) => ({
    time: formatHourOnly(f.timestamp),
    aqi: f.aqi,
    temperature: Math.round(f.temperature),
    humidity: Math.round(f.humidity),
  }));

  const config = {
    aqi: {
      label: 'AQI',
      color: 'hsl(var(--chart-1))',
    },
    temperature: {
      label: 'Temperature (°C)',
      color: 'hsl(var(--chart-2))',
    },
    humidity: {
      label: 'Humidity (%)',
      color: 'hsl(var(--chart-3))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="aqi"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="temperature"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="humidity"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
