'use client';

import { useState } from 'react';
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

export default function SettingsPage() {
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
    toast.success('Preferences saved successfully');
  };

  const handleAudienceChange = (audience: AudienceType) => {
    setAudienceType(audience);
    toast.success(`Profile updated to ${audience}`);
  };

  const handleAddLocation = (location: string) => {
    if (!savedLocations.includes(location)) {
      setSavedLocations([...savedLocations, location]);
      toast.success('Location added to saved locations');
    }
  };

  const handleRemoveLocation = (location: string) => {
    setSavedLocations(savedLocations.filter((l) => l !== location));
    toast.success('Location removed');
  };

  const handleExportData = () => {
    toast.success('Data export started - this feature is coming soon!');
  };

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-lg">
          Manage your preferences and account settings
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="preferences" className="space-y-6">
        <TabsList>
          <TabsTrigger value="preferences" className="gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="locations" className="gap-2">
            <MapPin className="h-4 w-4" />
            Locations
          </TabsTrigger>
          <TabsTrigger value="data" className="gap-2">
            <Download className="h-4 w-4" />
            Data
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
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Optional - Sign in to sync across devices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name (Optional)</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                />
              </div>
              <Button>Save Account Info</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Locations</CardTitle>
              <CardDescription>
                Quickly access air quality data for your favorite locations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Add New Location</Label>
                <LocationAutocomplete onLocationSelect={handleAddLocation} />
              </div>

              <div className="space-y-2">
                <Label>Your Saved Locations</Label>
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
                        Remove
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
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Manage your air quality data and privacy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Export Your Data</h4>
                <p className="text-sm text-muted-foreground">
                  Download all your saved locations, preferences, and alert
                  history
                </p>
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-medium">Clear Local Data</h4>
                <p className="text-sm text-muted-foreground">
                  Remove all locally stored data from this browser
                </p>
                <Button variant="outline" className="text-destructive">
                  Clear All Data
                </Button>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-medium">Privacy</h4>
                <p className="text-sm text-muted-foreground">
                  AirCast respects your privacy. We only collect data necessary
                  to provide air quality information. Location data is only used
                  when you explicitly request it and is not stored on our
                  servers.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
