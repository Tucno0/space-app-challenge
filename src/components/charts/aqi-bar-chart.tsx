'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  LabelList,
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

interface AQIBarData {
  date: string;
  aqi: number;
  category: AQICategory;
  quality: string;
}

interface AQIBarChartProps {
  predictions: AQIBarData[];
  title?: string;
  description?: string;
}

export function AQIBarChart({
  predictions,
  title = 'Daily AQI Values',
  description,
}: AQIBarChartProps) {
  // Format date to short format (MM/DD)
  const chartData = predictions.map((p) => {
    const date = new Date(p.date);
    const formattedDate = `${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;

    return {
      date: formattedDate,
      aqi: Math.round(p.aqi * 10) / 10,
      category: p.category,
      quality: p.quality,
    };
  });

  // Calculate dynamic Y-axis domain to emphasize differences
  const aqiValues = chartData.map((d) => d.aqi);
  const minAQI = Math.min(...aqiValues);
  const maxAQI = Math.max(...aqiValues);
  const range = maxAQI - minAQI;

  // Add padding to the range (20% on each side)
  const padding = Math.max(range * 0.2, 5); // At least 5 units of padding
  const yAxisMin = Math.max(0, Math.floor(minAQI - padding));
  const yAxisMax = Math.ceil(maxAQI + padding);

  const config = {
    aqi: {
      label: 'AQI',
      color: 'hsl(217, 91%, 60%)', // Blue color
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
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                className="text-xs"
                domain={[yAxisMin, yAxisMax]}
                label={{
                  value: 'AQI Value',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: 12 },
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, props) => {
                      const payload = props.payload;
                      return (
                        <div className="space-y-1">
                          <div className="font-semibold">AQI: {value}</div>
                          <div className="text-xs text-muted-foreground">
                            {payload.quality}
                          </div>
                        </div>
                      );
                    }}
                  />
                }
              />
              <Bar
                dataKey="aqi"
                radius={[4, 4, 0, 0]}
                fill="hsl(217, 91%, 60%)"
              >
                <LabelList
                  dataKey="aqi"
                  position="top"
                  className="fill-foreground text-xs font-semibold"
                  formatter={(value: number) => value.toFixed(1)}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
