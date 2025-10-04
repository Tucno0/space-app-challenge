'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';

// Fix Leaflet icon paths
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface AirQualityMapProps {
  center?: [number, number];
  zoom?: number;
  height?: string;
  onLocationChange?: (lat: number, lon: number) => void;
  markers?: Array<{
    lat: number;
    lon: number;
    aqi: number;
    name: string;
  }>;
}

export function AirQualityMap({
  center = [34.0522, -118.2437],
  zoom = 10,
  height = '500px',
  onLocationChange,
  markers = [],
}: AirQualityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView(center, zoom);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add click handler
    if (onLocationChange) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        onLocationChange(e.latlng.lat, e.latlng.lng);
      });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add new markers
    markers.forEach((marker) => {
      const icon = L.divIcon({
        html: `<div style="background-color: ${getAQIColor(
          marker.aqi
        )}; color: ${getTextColor(
          marker.aqi
        )}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${
          marker.aqi
        }</div>`,
        className: 'custom-aqi-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      L.marker([marker.lat, marker.lon], { icon })
        .bindPopup(`<strong>${marker.name}</strong><br/>AQI: ${marker.aqi}`)
        .addTo(map);
    });
  }, [markers]);

  // Update center
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map && center) {
      map.setView(center, zoom);
    }
  }, [center, zoom]);

  return (
    <Card className="overflow-hidden">
      <div ref={mapRef} style={{ height, width: '100%' }} />
    </Card>
  );
}

function getAQIColor(aqi: number): string {
  if (aqi <= 50) return '#00E400';
  if (aqi <= 100) return '#FFFF00';
  if (aqi <= 150) return '#FF7E00';
  if (aqi <= 200) return '#FF0000';
  if (aqi <= 300) return '#8F3F97';
  return '#7E0023';
}

function getTextColor(aqi: number): string {
  return aqi > 150 ? '#FFFFFF' : '#000000';
}
