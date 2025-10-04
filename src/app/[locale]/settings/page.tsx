'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PreferencesForm } from '@/components/forms/preferences-form';
import { AudienceSelector } from '@/components/forms/audience-selector';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LocationAutocomplete } from '@/components/location/location-autocomplete';
import { Settings, User, MapPin, Download } from 'lucide-react';
import { AudienceType } from '@/types/alert';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/use-translation';

export default function SettingsPage() {
  const { dictionary: dict } = useTranslation();
  const [preferences, setPreferences] = useState({
    units: 'metric' as 'metric' | 'imperial',
    language: 'en' as 'en' | 'es',
    theme: 'system' as 'light' | 'dark' | 'system',
    dataRefreshInterval: 900,
    showWeatherData: true,
    showStationMarkers: true,
  });

  const [audienceType, setAudienceType] = useState<AudienceType>('general');
  const [savedLocations, setSavedLocations] = useState([
    'Los Angeles, CA',
    'New York, NY',
  ]);

  const handleSavePreferences = (newPreferences: typeof preferences) => {
    setPreferences(newPreferences);
    toast.success(dict.settings.preferencesSaved);
  };

  const handleAudienceChange = (audience: AudienceType) => {
    setAudienceType(audience);
    toast.success(`${dict.settings.profileUpdated} ${audience}`);
  };

  const handleAddLocation = (location: string) => {
    if (!savedLocations.includes(location)) {
      setSavedLocations([...savedLocations, location]);
      toast.success(dict.settings.locationAdded);
    }
  };

  const handleRemoveLocation = (location: string) => {
    setSavedLocations(savedLocations.filter((l) => l !== location));
    toast.success(dict.settings.locationRemoved);
  };

  const handleExportData = () => {
    toast.success(dict.settings.dataExportStarted);
  };

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          {dict.settings.title}
        </h1>
        <p className="text-muted-foreground text-lg">
          {dict.settings.subtitle}
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="preferences" className="space-y-6">
        <TabsList>
          <TabsTrigger value="preferences" className="gap-2">
            <Settings className="h-4 w-4" />
            {dict.settings.preferences}
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            {dict.settings.profile}
          </TabsTrigger>
          <TabsTrigger value="locations" className="gap-2">
            <MapPin className="h-4 w-4" />
            {dict.settings.locations}
          </TabsTrigger>
          <TabsTrigger value="data" className="gap-2">
            <Download className="h-4 w-4" />
            {dict.settings.data}
          </TabsTrigger>
        </TabsList>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <PreferencesForm
            initialPreferences={preferences}
            onSave={handleSavePreferences}
          />
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <AudienceSelector
            selected={audienceType}
            onChange={handleAudienceChange}
          />

          <Card>
            <CardHeader>
              <CardTitle>{dict.settings.accountInfo}</CardTitle>
              <CardDescription>
                {dict.settings.accountInfoDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{dict.settings.nameOptional}</Label>
                <Input id="name" placeholder={dict.settings.namePlaceholder} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{dict.settings.emailOptional}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={dict.settings.emailPlaceholder}
                />
              </div>
              <Button>{dict.settings.saveAccountInfo}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{dict.settings.savedLocations}</CardTitle>
              <CardDescription>
                {dict.settings.savedLocationsDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{dict.settings.addNewLocation}</Label>
                <LocationAutocomplete onLocationSelect={handleAddLocation} />
              </div>

              <div className="space-y-2">
                <Label>{dict.settings.yourSavedLocations}</Label>
                <div className="space-y-2">
                  {savedLocations.map((location) => (
                    <div
                      key={location}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{location}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLocation(location)}
                      >
                        {dict.common.remove}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{dict.settings.dataManagement}</CardTitle>
              <CardDescription>
                {dict.settings.dataManagementDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">{dict.settings.exportYourData}</h4>
                <p className="text-sm text-muted-foreground">
                  {dict.settings.exportDescription}
                </p>
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="mr-2 h-4 w-4" />
                  {dict.common.exportData}
                </Button>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-medium">{dict.settings.clearLocalData}</h4>
                <p className="text-sm text-muted-foreground">
                  {dict.settings.clearDataDescription}
                </p>
                <Button variant="outline" className="text-destructive">
                  {dict.settings.clearAllData}
                </Button>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-medium">{dict.settings.privacy}</h4>
                <p className="text-sm text-muted-foreground">
                  {dict.settings.privacyText}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
