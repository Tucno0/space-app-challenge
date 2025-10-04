'use client';

import { useState } from 'react';
import { Locate, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentLocation } from '@/lib/geolocation';
import { toast } from 'sonner';

interface CurrentLocationButtonProps {
  onLocationDetected: (lat: number, lon: number) => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function CurrentLocationButton({
  onLocationDetected,
  variant = 'outline',
  size = 'default',
}: CurrentLocationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetLocation = async () => {
    setIsLoading(true);
    try {
      const result = await getCurrentLocation();
      onLocationDetected(result.coordinates.lat, result.coordinates.lon);
      toast.success('Location detected successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to get location'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleGetLocation}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Locate className="h-4 w-4" />
      )}
      {size !== 'icon' && (
        <span className="hidden sm:inline">
          {isLoading ? 'Detecting...' : 'Use My Location'}
        </span>
      )}
    </Button>
  );
}
