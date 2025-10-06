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
  Tooltip,
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
import type { AQICategory } from '@/types/air-quality';

interface AQIPredictionData {
  date: string;
  aqi: number;
  category: AQICategory;
  quality: string;
  pollutants: {
    no2: number;
    co: number;
    o3: number;
    so2: number;
  };
  aerosolIndex: number;
}

interface AQIPredictionChartProps {
  predictions: AQIPredictionData[];
  title?: string;
  description?: string;
}

export function AQIPredictionChart({
  predictions,
  title = '7-Day AQI Forecast',
  description,
}: AQIPredictionChartProps) {
  // Format date to short format (MM/DD)
  const chartData = predictions.map((p) => {
    const date = new Date(p.date);
    const formattedDate = `${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;

    return {
      date: formattedDate,
      aqi: Math.round(p.aqi * 10) / 10,
      no2: Math.round(p.pollutants.no2 * 10) / 10,
      co: Math.round(p.pollutants.co * 10) / 10,
      o3: Math.round((p.pollutants.o3 / 1000) * 10) / 10, // Convert to thousands for readability
      so2: Math.round(p.pollutants.so2 * 10) / 10,
      aerosolIndex: Math.round(p.aerosolIndex * 100) / 100,
    };
  });

  const config = {
    aqi: {
      label: 'AQI',
      color: 'hsl(var(--chart-1))',
    },
    no2: {
      label: 'NO₂ (µg/m³)',
      color: 'hsl(var(--chart-2))',
    },
    co: {
      label: 'CO (mg/m³)',
      color: 'hsl(var(--chart-3))',
    },
    o3: {
      label: 'O₃ (×1000 µg/m³)',
      color: 'hsl(var(--chart-4))',
    },
    so2: {
      label: 'SO₂ (µg/m³)',
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
                  value: 'AQI / Contaminantes',
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
                  value: 'O₃ (×1000 µg/m³)',
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
                dataKey="aqi"
                name="AQI"
                stroke="hsl(var(--chart-1))"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="no2"
                name="NO₂ (µg/m³)"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="co"
                name="CO (mg/m³)"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Bar
                yAxisId="right"
                dataKey="o3"
                name="O₃ (×1000 µg/m³)"
                fill="hsl(var(--chart-4))"
                opacity={0.6}
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="so2"
                name="SO₂ (µg/m³)"
                stroke="hsl(var(--chart-5))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
