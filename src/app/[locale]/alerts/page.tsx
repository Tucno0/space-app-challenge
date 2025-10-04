'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCard } from '@/components/alerts/alert-card';
import { AlertConfigForm } from '@/components/alerts/alert-config-form';
import { AudienceSelector } from '@/components/forms/audience-selector';
import { mockAlerts, mockAlertPreferences } from '@/lib/mock-data/alerts-data';
import { AlertPreferences, AudienceType } from '@/types/alert';
import { toast } from 'sonner';
import { Bell, Settings, User } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function AlertsPage() {
  const { dictionary: dict } = useTranslation();
  const [alerts, setAlerts] = useState(mockAlerts);
  const [preferences, setPreferences] =
    useState<AlertPreferences>(mockAlertPreferences);

  const handleDismissAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
    toast.success(dict.alerts.dismissed);
  };

  const handleSavePreferences = (newPreferences: AlertPreferences) => {
    setPreferences(newPreferences);
    toast.success(dict.alerts.preferencesSaved);
  };

  const handleAudienceChange = (audience: AudienceType) => {
    setPreferences({ ...preferences, audienceType: audience });
    toast.success(`${dict.alerts.profileChanged} ${audience}`);
  };

  const activeAlerts = alerts.filter(
    (a) => !a.expiresAt || a.expiresAt > new Date()
  );
  const pastAlerts = alerts.filter(
    (a) => a.expiresAt && a.expiresAt <= new Date()
  );

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          {dict.alerts.title}
        </h1>
        <p className="text-muted-foreground text-lg">{dict.alerts.subtitle}</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active" className="gap-2">
            <Bell className="h-4 w-4" />
            {dict.alerts.activeAlerts}
            {activeAlerts.length > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
                {activeAlerts.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            {dict.alerts.settings}
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            {dict.alerts.profile}
          </TabsTrigger>
        </TabsList>

        {/* Active Alerts */}
        <TabsContent value="active" className="space-y-4">
          {activeAlerts.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/50">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {dict.alerts.noAlerts}
              </h3>
              <p className="text-sm text-muted-foreground">
                {dict.alerts.noAlertsDescription}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {activeAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onDismiss={handleDismissAlert}
                />
              ))}
            </div>
          )}

          {pastAlerts.length > 0 && (
            <div className="space-y-4 pt-8">
              <h2 className="text-xl font-semibold">
                {dict.alerts.pastAlerts}
              </h2>
              <div className="grid gap-4 opacity-60">
                {pastAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Alert Settings */}
        <TabsContent value="settings">
          <AlertConfigForm
            preferences={preferences}
            onSave={handleSavePreferences}
          />
        </TabsContent>

        {/* Profile Selection */}
        <TabsContent value="profile">
          <AudienceSelector
            selected={preferences.audienceType}
            onChange={handleAudienceChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
