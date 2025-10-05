'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Preferences {
  units: 'metric' | 'imperial';
  language: 'en' | 'es';
  theme: 'light' | 'dark' | 'system';
  dataRefreshInterval: number;
  showWeatherData: boolean;
  showStationMarkers: boolean;
}

interface PreferencesFormProps {
  initialPreferences: Preferences;
  onSave: (preferences: Preferences) => void;
}

export function PreferencesForm({
  initialPreferences,
  onSave,
}: PreferencesFormProps) {
  const [preferences, setPreferences] =
    useState<Preferences>(initialPreferences);

  const handleSave = () => {
    onSave(preferences);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Preferences</CardTitle>
        <CardDescription>Customize your ICA Predict experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Units</Label>
            <Select
              value={preferences.units}
              onValueChange={(value: 'metric' | 'imperial') =>
                setPreferences({ ...preferences, units: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (°C, km/h, km)</SelectItem>
                <SelectItem value="imperial">Imperial (°F, mph, mi)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Language</Label>
            <Select
              value={preferences.language}
              onValueChange={(value: 'en' | 'es') =>
                setPreferences({ ...preferences, language: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Theme</Label>
            <Select
              value={preferences.theme}
              onValueChange={(value: 'light' | 'dark' | 'system') =>
                setPreferences({ ...preferences, theme: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data Refresh Interval</Label>
            <Select
              value={preferences.dataRefreshInterval.toString()}
              onValueChange={(value) =>
                setPreferences({
                  ...preferences,
                  dataRefreshInterval: parseInt(value),
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="300">5 minutes</SelectItem>
                <SelectItem value="600">10 minutes</SelectItem>
                <SelectItem value="900">15 minutes</SelectItem>
                <SelectItem value="1800">30 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Weather Data</Label>
              <p className="text-sm text-muted-foreground">
                Display temperature, wind, etc.
              </p>
            </div>
            <Switch
              checked={preferences.showWeatherData}
              onCheckedChange={(showWeatherData) =>
                setPreferences({ ...preferences, showWeatherData })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Station Markers</Label>
              <p className="text-sm text-muted-foreground">
                Display ground stations on map
              </p>
            </div>
            <Switch
              checked={preferences.showStationMarkers}
              onCheckedChange={(showStationMarkers) =>
                setPreferences({ ...preferences, showStationMarkers })
              }
            />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}
