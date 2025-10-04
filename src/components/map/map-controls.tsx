'use client';

import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface MapLayer {
  id: string;
  name: string;
  enabled: boolean;
}

interface MapControlsProps {
  layers: MapLayer[];
  onLayerToggle: (layerId: string, enabled: boolean) => void;
}

export function MapControls({ layers, onLayerToggle }: MapControlsProps) {
  return (
    <Card className="p-4 space-y-4">
      <div>
        <h3 className="font-semibold text-sm mb-3">Map Layers</h3>
        <div className="space-y-3">
          {layers.map((layer) => (
            <div key={layer.id} className="flex items-center justify-between">
              <Label
                htmlFor={layer.id}
                className="text-sm font-normal cursor-pointer"
              >
                {layer.name}
              </Label>
              <Switch
                id={layer.id}
                checked={layer.enabled}
                onCheckedChange={(enabled) => onLayerToggle(layer.id, enabled)}
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
