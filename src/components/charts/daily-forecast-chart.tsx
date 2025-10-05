'use client';

import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
  Bar,
  ComposedChart,
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

interface DailyForecastData {
  date: string;
  temperature: number;
  dewpoint: number;
  pressure: number;
  windSpeed: number;
  precipitation: number;
}

interface DailyForecastChartProps {
  forecasts: DailyForecastData[];
  title?: string;
  description?: string;
}

export function DailyForecastChart({
  forecasts,
  title = '5-Day Weather Forecast',
  description,
}: DailyForecastChartProps) {
  // Format date to short format (MM/DD)
  const chartData = forecasts.map((f) => {
    const date = new Date(f.date);
    const formattedDate = `${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;

    return {
      date: formattedDate,
      temperature: Math.round(f.temperature * 10) / 10,
      dewpoint: Math.round(f.dewpoint * 10) / 10,
      pressure: Math.round(f.pressure),
      windSpeed: Math.round(f.windSpeed * 10) / 10,
      precipitation: Math.round(f.precipitation * 10) / 10,
    };
  });

  const config = {
    temperature: {
      label: 'Temperature (°C)',
      color: 'hsl(var(--chart-1))',
    },
    dewpoint: {
      label: 'Dewpoint (°C)',
      color: 'hsl(var(--chart-2))',
    },
    windSpeed: {
      label: 'Wind Speed (km/h)',
      color: 'hsl(var(--chart-3))',
    },
    precipitation: {
      label: 'Precipitation (mm)',
      color: 'hsl(var(--chart-4))',
    },
    pressure: {
      label: 'Pressure (hPa)',
      color: 'hsl(var(--chart-5))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                className="text-xs"
                label={{
                  value: 'Temperature (°C) / Wind (km/h)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: 12 },
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                className="text-xs"
                label={{
                  value: 'Precipitation (mm)',
                  angle: 90,
                  position: 'insideRight',
                  style: { fontSize: 12 },
                }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temperature"
                name="Temperature (°C)"
                stroke="hsl(var(--chart-1))"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="dewpoint"
                name="Dewpoint (°C)"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="windSpeed"
                name="Wind Speed (km/h)"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Bar
                yAxisId="right"
                dataKey="precipitation"
                name="Precipitation (mm)"
                fill="hsl(var(--chart-4))"
                opacity={0.6}
                radius={[4, 4, 0, 0]}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
