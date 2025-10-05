import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { TRPCError } from '@trpc/server';
import type { Alert, AlertSeverity, AlertType } from '@/types/alert';
import type { AQICategory } from '@/types/air-quality';
import { getAQICategory } from '@/lib/aqi-calculator';

const WAQI_API_KEY = process.env.WAQI_API_KEY;
const NASA_FIRMS_API_KEY = process.env.NASA_FIRMS_API_KEY || 'demo'; // NASA provides demo key

if (!WAQI_API_KEY) {
  console.warn('WAQI_API_KEY is not set in environment variables');
}

// Helper function to determine severity based on AQI
function getAlertSeverity(aqi: number): AlertSeverity {
  if (aqi >= 301) return 'critical';
  if (aqi >= 201) return 'critical';
  if (aqi >= 151) return 'danger';
  if (aqi >= 101) return 'warning';
  return 'info';
}

// Helper function to generate AQI threshold alert
function generateAQIAlert(
  aqi: number,
  location: { name: string; lat: number; lon: number },
  pollutant: string
): Alert {
  const category = getAQICategory(aqi);
  const severity = getAlertSeverity(aqi);

  let title = 'Air Quality Alert';
  let message = '';
  let recommendations: string[] = [];

  if (aqi >= 301) {
    title = 'Hazardous Air Quality - Health Emergency';
    message = `Air quality is hazardous (AQI: ${aqi}). Everyone should avoid all outdoor activities.`;
    recommendations = [
      'Stay indoors with windows and doors closed',
      'Run air purifiers on high',
      'Avoid all physical activity',
      'Seek medical attention if experiencing symptoms',
      'Follow local emergency guidance',
    ];
  } else if (aqi >= 201) {
    title = 'Very Unhealthy Air Quality Warning';
    message = `Air quality is very unhealthy (AQI: ${aqi}). Health warnings of emergency conditions.`;
    recommendations = [
      'Everyone should avoid all outdoor exertion',
      'Keep windows and doors closed',
      'Run air purifiers if available',
      'Move activities indoors',
      'Monitor health symptoms closely',
    ];
  } else if (aqi >= 151) {
    title = 'Unhealthy Air Quality Alert';
    message = `Air quality is unhealthy (AQI: ${aqi}). Everyone may begin to experience health effects.`;
    recommendations = [
      'Limit prolonged outdoor activities',
      'Sensitive groups should stay indoors',
      'Close windows during peak hours',
      'Use air purifiers if available',
    ];
  } else if (aqi >= 101) {
    title = 'Air Quality Alert for Sensitive Groups';
    message = `Air quality has reached unhealthy levels for sensitive groups (AQI: ${aqi}). ${pollutant.toUpperCase()} levels are elevated.`;
    recommendations = [
      'Sensitive groups should reduce prolonged outdoor activities',
      'Consider rescheduling outdoor activities to early morning',
      'Keep windows closed if possible',
      'Monitor symptoms if you are sensitive to air pollution',
    ];
  } else {
    title = 'Moderate Air Quality Notice';
    message = `Air quality is moderate (AQI: ${aqi}). Unusually sensitive people should consider limiting prolonged outdoor exertion.`;
    recommendations = [
      'Unusually sensitive people should consider reducing prolonged outdoor exertion',
      'General public can enjoy normal outdoor activities',
    ];
  }

  return {
    id: `aqi-alert-${location.lat}-${location.lon}-${Date.now()}`,
    type: 'aqi-threshold',
    severity,
    title,
    message,
    timestamp: new Date(),
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours
    location,
    aqiValue: aqi,
    category: category as AQICategory,
    pollutant: pollutant as any,
    actionable: true,
    recommendations,
  };
}

// Helper function to fetch nearby wildfires from NASA FIRMS
async function getNearbyWildfires(
  lat: number,
  lon: number,
  radiusKm: number = 200
): Promise<Alert[]> {
  try {
    // NASA FIRMS provides last 24 hours of fire data
    // Using VIIRS data (375m resolution)
    const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${NASA_FIRMS_API_KEY}/VIIRS_SNPP_NRT/${lat},${lon}/${radiusKm}/1`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'text/csv',
      },
    });

    if (!response.ok) {
      console.warn(`NASA FIRMS API error: ${response.status}`);
      return [];
    }

    const csvText = await response.text();
    const lines = csvText.trim().split('\n');

    // Skip if no data (only header)
    if (lines.length <= 1) {
      return [];
    }

    // Parse CSV (skip header)
    const fires = lines
      .slice(1)
      .map((line) => {
        const parts = line.split(',');
        if (parts.length < 13) return null;

        return {
          lat: parseFloat(parts[0]),
          lon: parseFloat(parts[1]),
          brightness: parseFloat(parts[2]),
          confidence: parts[9],
          acq_date: parts[5],
          acq_time: parts[6],
        };
      })
      .filter((f) => f !== null);

    // Group fires by proximity to create single alert
    if (fires.length === 0) {
      return [];
    }

    // Calculate average position and count
    const avgLat = fires.reduce((sum, f) => sum + f!.lat, 0) / fires.length;
    const avgLon = fires.reduce((sum, f) => sum + f!.lon, 0) / fires.length;

    // Determine severity based on fire count and confidence
    const highConfidenceFires = fires.filter(
      (f) => f!.confidence === 'h' || f!.confidence === 'n'
    ).length;
    const severity: AlertSeverity =
      highConfidenceFires > 10
        ? 'critical'
        : fires.length > 5
        ? 'danger'
        : 'warning';

    // Calculate distance to user location
    const distance = Math.sqrt(
      Math.pow((avgLat - lat) * 111, 2) + Math.pow((avgLon - lon) * 111, 2)
    );

    const alert: Alert = {
      id: `wildfire-alert-${Date.now()}`,
      type: 'event',
      severity,
      title: 'Wildfire Smoke Advisory',
      message: `${fires.length} active fire${
        fires.length > 1 ? 's' : ''
      } detected approximately ${Math.round(
        distance
      )}km from your location. Smoke may affect air quality in your area.`,
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      location: {
        name: `~${Math.round(distance)}km from current location`,
        lat: avgLat,
        lon: avgLon,
      },
      aqiValue: 165, // Estimated impact
      category: 'unhealthy',
      pollutant: 'pm25',
      actionable: true,
      recommendations: [
        'Monitor air quality closely',
        'Keep windows and doors closed',
        'Run air purifiers if available',
        'Limit outdoor activities',
        'Follow local fire evacuation orders',
        'Check for official smoke advisories',
      ],
    };

    return [alert];
  } catch (error) {
    console.error('Error fetching NASA FIRMS data:', error);
    return [];
  }
}

export const alertsRouter = createTRPCRouter({
  getActiveAlerts: baseProcedure
    .input(
      z.object({
        lat: z.number().min(-90).max(90),
        lon: z.number().min(-180).max(180),
        locationName: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      if (!WAQI_API_KEY) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'WAQI API key not configured',
        });
      }

      const { lat, lon, locationName } = input;
      const alerts: Alert[] = [];

      try {
        // 1. Get current AQI data from WAQI
        const waqiUrl = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${WAQI_API_KEY}`;
        const response = await fetch(waqiUrl);

        if (response.ok) {
          const data = await response.json();

          if (data.status === 'ok' && data.data && data.data.aqi > 0) {
            const aqi = data.data.aqi;
            const dominantPollutant = data.data.dominentpol || 'pm25';

            // Generate alert if AQI is above moderate (>50)
            if (aqi > 50) {
              const location = {
                name: locationName || data.data.city.name,
                lat,
                lon,
              };

              const aqiAlert = generateAQIAlert(
                aqi,
                location,
                dominantPollutant
              );
              alerts.push(aqiAlert);
            }

            // Check for pollutant spikes
            if (data.data.iaqi) {
              const { pm25, pm10, o3, no2 } = data.data.iaqi;

              // PM2.5 spike detection
              if (pm25 && pm25.v > 75) {
                alerts.push({
                  id: `pm25-spike-${Date.now()}`,
                  type: 'pollutant-spike',
                  severity: pm25.v > 150 ? 'danger' : 'warning',
                  title: 'PM2.5 Levels Elevated',
                  message: `Fine particulate matter (PM2.5) concentration is ${
                    pm25.v
                  } µg/m³, which is ${
                    pm25.v > 150 ? 'very unhealthy' : 'unhealthy'
                  }.`,
                  timestamp: new Date(),
                  expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
                  location: {
                    name: locationName || data.data.city.name,
                    lat,
                    lon,
                  },
                  pollutant: 'pm25',
                  actionable: true,
                  recommendations: [
                    'Wear N95 or KN95 mask outdoors',
                    'Keep windows closed',
                    'Use air purifiers indoors',
                    'Limit outdoor activities',
                  ],
                });
              }

              // Ozone spike detection
              if (o3 && o3.v > 80) {
                alerts.push({
                  id: `o3-spike-${Date.now()}`,
                  type: 'pollutant-spike',
                  severity: o3.v > 120 ? 'danger' : 'warning',
                  title: 'High Ozone Levels',
                  message: `Ground-level ozone is ${o3.v} ppb. Ozone levels are typically highest in the afternoon.`,
                  timestamp: new Date(),
                  expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
                  location: {
                    name: locationName || data.data.city.name,
                    lat,
                    lon,
                  },
                  pollutant: 'o3',
                  actionable: true,
                  recommendations: [
                    'Schedule outdoor activities for morning or evening',
                    'Reduce physical exertion outdoors',
                    'Sensitive groups should stay indoors during afternoon',
                  ],
                });
              }

              // NO2 spike detection (traffic-related)
              if (no2 && no2.v > 100) {
                alerts.push({
                  id: `no2-spike-${Date.now()}`,
                  type: 'pollutant-spike',
                  severity: 'warning',
                  title: 'Elevated NO₂ from Traffic',
                  message: `Nitrogen dioxide levels are ${no2.v} ppb, likely due to increased traffic emissions.`,
                  timestamp: new Date(),
                  expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000),
                  location: {
                    name: locationName || data.data.city.name,
                    lat,
                    lon,
                  },
                  pollutant: 'no2',
                  actionable: false,
                  recommendations: [
                    'Avoid busy roads if possible',
                    'Consider alternate routes for walking or biking',
                    'Keep car windows closed in traffic',
                  ],
                });
              }
            }
          }
        }

        // 2. Check for nearby wildfires using NASA FIRMS
        const wildfireAlerts = await getNearbyWildfires(lat, lon, 200);
        alerts.push(...wildfireAlerts);

        console.log(`✅ Generated ${alerts.length} active alerts`);
        return alerts;
      } catch (error) {
        console.error('Error generating alerts:', error);
        // Return empty array instead of throwing error
        return [];
      }
    }),

  // Get historical alerts (for past alerts section)
  getAlertHistory: baseProcedure
    .input(
      z.object({
        lat: z.number().min(-90).max(90),
        lon: z.number().min(-180).max(180),
        days: z.number().min(1).max(30).default(7),
      })
    )
    .query(async ({ input }) => {
      // For now, return empty array
      // In production, this would query a database of historical alerts
      return [];
    }),
});
