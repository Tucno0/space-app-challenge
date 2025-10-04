'use client';

import {
  Bar,
  BarChart,
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
import { PollutantReading } from '@/types/air-quality';
import { getPollutantName } from '@/lib/aqi-calculator';
import { getAQIColor } from '@/lib/color-scales';

interface PollutantBreakdownProps {
  pollutants: PollutantReading[];
  title?: string;
  description?: string;
}

export function PollutantBreakdown({
  pollutants,
  title = 'Pollutant Levels',
  description,
}: PollutantBreakdownProps) {
  const chartData = pollutants.map((p) => ({
    name: getPollutantName(p.type),
    aqi: p.aqi,
    fill: getAQIColor(p.aqi),
  }));

  const config = {
    aqi: {
      label: 'AQI',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                className="text-xs"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tickLine={false} axisLine={false} className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="aqi" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
