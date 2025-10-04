'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ForecastChart } from '@/components/charts/forecast-chart';
import { TrendChart } from '@/components/charts/trend-chart';
import { AQIBadge } from '@/components/air-quality/aqi-badge';
import { MetricDisplay } from '@/components/data/metric-display';
import { mockForecastData } from '@/lib/mock-data/forecast-data';
import {
  formatShortDate,
  formatDayOfWeek,
  formatHourOnly,
} from '@/lib/date-formatters';
import { getAQICategoryLabel } from '@/lib/aqi-calculator';
import { Wind, Droplets, Thermometer, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ForecastPage() {
  const [selectedDay, setSelectedDay] = useState(0);
  const forecast = mockForecastData;

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Air Quality Forecast
        </h1>
        <p className="text-muted-foreground text-lg">
          {forecast.location.name} - 7-Day Forecast
        </p>
      </div>

      {/* Alerts */}
      {forecast.alerts.length > 0 && (
        <div className="space-y-4">
          {forecast.alerts.map((alert, index) => (
            <Alert key={index} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Forecast Alert</AlertTitle>
              <AlertDescription>{alert}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Daily Forecast Tabs */}
      <Tabs
        value={selectedDay.toString()}
        onValueChange={(v) => setSelectedDay(parseInt(v))}
      >
        <TabsList className="w-full justify-start overflow-x-auto">
          {forecast.daily.map((day, index) => (
            <TabsTrigger
              key={index}
              value={index.toString()}
              className="flex-col gap-1 min-w-[100px]"
            >
              <div className="text-xs">
                {index === 0 ? 'Today' : formatDayOfWeek(day.date)}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatShortDate(day.date)}
              </div>
              <AQIBadge value={day.aqiAvg} category={day.category} size="sm" />
            </TabsTrigger>
          ))}
        </TabsList>

        {forecast.daily.map((day, index) => (
          <TabsContent
            key={index}
            value={index.toString()}
            className="space-y-6 mt-6"
          >
            {/* Day Summary */}
            <Card>
              <CardHeader>
                <CardTitle>{formatDayOfWeek(day.date)} Forecast</CardTitle>
                <CardDescription>{day.summary}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      Average AQI
                    </div>
                    <div className="text-2xl font-bold">{day.aqiAvg}</div>
                    <div className="text-xs">
                      {getAQICategoryLabel(day.category)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      AQI Range
                    </div>
                    <div className="text-2xl font-bold">
                      {day.aqiMin} - {day.aqiMax}
                    </div>
                    <div className="text-xs">Min to Max</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      Primary Pollutant
                    </div>
                    <div className="text-2xl font-bold">
                      {day.primaryPollutant.toUpperCase()}
                    </div>
                    <div className="text-xs">Most significant</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      Peak Hours
                    </div>
                    <div className="text-2xl font-bold">2-6 PM</div>
                    <div className="text-xs">Highest AQI</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hourly Forecast Chart */}
            <ForecastChart
              forecasts={day.hourly}
              title="24-Hour Detailed Forecast"
              description="AQI, temperature, and humidity throughout the day"
            />

            {/* Hourly Details */}
            <Card>
              <CardHeader>
                <CardTitle>Hourly Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {day.hourly
                    .filter((_, i) => i % 3 === 0)
                    .map((hour, i) => (
                      <Card key={i} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">
                              {formatHourOnly(hour.timestamp)}
                            </span>
                            <AQIBadge
                              value={hour.aqi}
                              category={hour.category}
                              size="sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <MetricDisplay
                              label="Temperature"
                              value={Math.round(hour.temperature)}
                              unit="°C"
                              icon={Thermometer}
                            />
                            <MetricDisplay
                              label="Humidity"
                              value={Math.round(hour.humidity)}
                              unit="%"
                              icon={Droplets}
                            />
                            <MetricDisplay
                              label="Wind"
                              value={Math.round(hour.windSpeed)}
                              unit="km/h"
                              icon={Wind}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* 7-Day Trend */}
      <TrendChart
        data={forecast.daily.map((d) => ({
          timestamp: d.date,
          value: d.aqiAvg,
        }))}
        title="7-Day AQI Trend"
        description="Average daily AQI for the week ahead"
      />
    </div>
  );
}
