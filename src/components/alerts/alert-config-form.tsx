'use client';

import { useState } from 'react';
import { AlertPreferences, AudienceType } from '@/types/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface AlertConfigFormProps {
  preferences: AlertPreferences;
  onSave: (preferences: AlertPreferences) => void;
}

const audienceTypes: { value: AudienceType; label: string }[] = [
  { value: 'general', label: 'General Public' },
  { value: 'sensitive', label: 'Sensitive Groups' },
  { value: 'elderly', label: 'Elderly' },
  { value: 'children', label: 'Children' },
  { value: 'athletes', label: 'Athletes' },
  { value: 'outdoor-workers', label: 'Outdoor Workers' },
];

export function AlertConfigForm({
  preferences: initialPreferences,
  onSave,
}: AlertConfigFormProps) {
  const [preferences, setPreferences] =
    useState<AlertPreferences>(initialPreferences);

  const handleSave = () => {
    onSave(preferences);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert Preferences</CardTitle>
        <CardDescription>
          Configure when and how you receive air quality alerts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Receive air quality notifications
              </p>
            </div>
            <Switch
              checked={preferences.enabled}
              onCheckedChange={(enabled) =>
                setPreferences({ ...preferences, enabled })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Audience Type</Label>
            <Select
              value={preferences.audienceType}
              onValueChange={(value) =>
                setPreferences({
                  ...preferences,
                  audienceType: value as AudienceType,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {audienceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Alerts will be tailored to your audience type
            </p>
          </div>

          <div className="space-y-3">
            <Label>AQI Alert Threshold: {preferences.thresholds.aqi}</Label>
            <Slider
              value={[preferences.thresholds.aqi]}
              onValueChange={([aqi]) =>
                setPreferences({
                  ...preferences,
                  thresholds: { ...preferences.thresholds, aqi },
                })
              }
              min={0}
              max={200}
              step={10}
              className="py-4"
            />
            <p className="text-xs text-muted-foreground">
              Get notified when AQI exceeds this value
            </p>
          </div>

          <div className="space-y-2">
            <Label>Notification Methods</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Push Notifications</span>
                <Switch
                  checked={preferences.notificationMethods.push}
                  onCheckedChange={(push) =>
                    setPreferences({
                      ...preferences,
                      notificationMethods: {
                        ...preferences.notificationMethods,
                        push,
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Notifications</span>
                <Switch
                  checked={preferences.notificationMethods.email}
                  onCheckedChange={(email) =>
                    setPreferences({
                      ...preferences,
                      notificationMethods: {
                        ...preferences.notificationMethods,
                        email,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {preferences.quietHours && (
            <div className="space-y-2">
              <Label>Quiet Hours</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="quiet-start" className="text-xs">
                    Start
                  </Label>
                  <Input
                    id="quiet-start"
                    type="time"
                    value={preferences.quietHours.start}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        quietHours: {
                          ...preferences.quietHours!,
                          start: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="quiet-end" className="text-xs">
                    End
                  </Label>
                  <Input
                    id="quiet-end"
                    type="time"
                    value={preferences.quietHours.end}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        quietHours: {
                          ...preferences.quietHours!,
                          end: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                No notifications during these hours
              </p>
            </div>
          )}
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}
