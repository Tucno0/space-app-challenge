'use client';

import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCard } from '@/components/alerts/alert-card';
import { AlertConfigForm } from '@/components/alerts/alert-config-form';
import { AudienceSelector } from '@/components/forms/audience-selector';
import { mockAlertPreferences } from '@/lib/mock-data/alerts-data';
import { AlertPreferences, AudienceType } from '@/types/alert';
import { toast } from 'sonner';
import { Bell, Settings, User } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useLocationStore } from '@/hooks/use-location-store';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

export default function AlertsPage() {
  const { dictionary: dict } = useTranslation();
  const currentLocation = useLocationStore((state) => state.currentLocation);
  const trpc = useTRPC();

  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [preferences, setPreferences] =
    useState<AlertPreferences>(mockAlertPreferences);

  // Fetch active alerts based on current location
  const alertsQuery = useQuery(
    trpc.alerts.getActiveAlerts.queryOptions(
      {
        lat: currentLocation?.coordinates.lat ?? 0,
        lon: currentLocation?.coordinates.lon ?? 0,
        locationName: currentLocation?.name,
      },
      {
        enabled: !!currentLocation,
        refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
        staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
      }
    )
  );

  // Transform alert data (convert date strings to Date objects)
  const transformedAlerts = useMemo(() => {
    if (!alertsQuery.data) return [];

    return alertsQuery.data.map((alert) => ({
      ...alert,
      timestamp: new Date(alert.timestamp),
      expiresAt: alert.expiresAt ? new Date(alert.expiresAt) : undefined,
    }));
  }, [alertsQuery.data]);

  // Filter out dismissed alerts
  const alerts = useMemo(() => {
    return transformedAlerts.filter(
      (alert) => !dismissedIds.includes(alert.id)
    );
  }, [transformedAlerts, dismissedIds]);

  const handleDismissAlert = (id: string) => {
    setDismissedIds([...dismissedIds, id]);
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
            {activeAlerts.length > 0 && !alertsQuery.isLoading && (
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
          {alertsQuery.isLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : activeAlerts.length === 0 ? (
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
