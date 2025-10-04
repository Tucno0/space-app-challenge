import { Alert, AlertHistory, AlertPreferences } from '@/types/alert';

export const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    type: 'aqi-threshold',
    severity: 'warning',
    title: 'Air Quality Alert',
    message:
      'Air quality has reached unhealthy levels for sensitive groups. Ozone levels are elevated.',
    timestamp: new Date(Date.now() - 2 * 60 * 60000),
    expiresAt: new Date(Date.now() + 4 * 60 * 60000),
    location: {
      name: 'Los Angeles, CA',
      lat: 34.0522,
      lon: -118.2437,
    },
    aqiValue: 152,
    category: 'unhealthy-sensitive',
    pollutant: 'o3',
    actionable: true,
    recommendations: [
      'Sensitive groups should reduce prolonged outdoor activities',
      'Consider rescheduling outdoor activities to early morning',
      'Keep windows closed if possible',
    ],
  },
  {
    id: 'alert-002',
    type: 'event',
    severity: 'danger',
    title: 'Wildfire Smoke Advisory',
    message:
      'Smoke from wildfires in the north is affecting air quality in your area.',
    timestamp: new Date(Date.now() - 6 * 60 * 60000),
    expiresAt: new Date(Date.now() + 24 * 60 * 60000),
    location: {
      name: 'Los Angeles, CA',
      lat: 34.0522,
      lon: -118.2437,
    },
    aqiValue: 165,
    category: 'unhealthy',
    pollutant: 'pm25',
    actionable: true,
    recommendations: [
      'Everyone should avoid prolonged outdoor exertion',
      'Keep windows and doors closed',
      'Run air purifiers if available',
      'Monitor symptoms and seek medical attention if needed',
    ],
  },
  {
    id: 'alert-003',
    type: 'forecast',
    severity: 'info',
    title: 'Ozone Forecast',
    message: 'High ozone levels expected tomorrow afternoon between 2-6 PM.',
    timestamp: new Date(Date.now() - 30 * 60000),
    location: {
      name: 'Los Angeles, CA',
      lat: 34.0522,
      lon: -118.2437,
    },
    aqiValue: 145,
    category: 'unhealthy-sensitive',
    pollutant: 'o3',
    actionable: true,
    recommendations: [
      'Plan outdoor activities for morning hours',
      'Sensitive groups should limit afternoon outdoor time',
    ],
  },
  {
    id: 'alert-004',
    type: 'pollutant-spike',
    severity: 'warning',
    title: 'NO₂ Spike Detected',
    message:
      'Traffic-related nitrogen dioxide levels have spiked in your area.',
    timestamp: new Date(Date.now() - 45 * 60000),
    expiresAt: new Date(Date.now() + 2 * 60 * 60000),
    location: {
      name: 'Downtown Los Angeles',
      lat: 34.0407,
      lon: -118.2468,
    },
    pollutant: 'no2',
    actionable: false,
    recommendations: [
      'Avoid busy roads if possible',
      'Consider alternate routes for walking or biking',
    ],
  },
];

export const mockAlertHistory: AlertHistory = {
  alerts: mockAlerts,
  totalCount: mockAlerts.length,
  unreadCount: 2,
};

export const mockAlertPreferences: AlertPreferences = {
  enabled: true,
  audienceType: 'general',
  thresholds: {
    aqi: 100,
    o3: 70,
    no2: 50,
    so2: 35,
    pm25: 35,
  },
  notificationMethods: {
    push: true,
    email: false,
  },
  quietHours: {
    start: '22:00',
    end: '07:00',
  },
  locations: ['Los Angeles, CA'],
};

export function generateAlert(
  type: 'aqi-threshold' | 'pollutant-spike' | 'event' | 'forecast',
  aqiValue: number
): Alert {
  const severity =
    aqiValue > 200
      ? 'critical'
      : aqiValue > 150
      ? 'danger'
      : aqiValue > 100
      ? 'warning'
      : 'info';

  return {
    id: `alert-${Date.now()}`,
    type,
    severity,
    title: `Air Quality ${
      severity.charAt(0).toUpperCase() + severity.slice(1)
    }`,
    message: `Current AQI is ${aqiValue}`,
    timestamp: new Date(),
    location: {
      name: 'Current Location',
      lat: 0,
      lon: 0,
    },
    aqiValue,
    actionable: true,
    recommendations: [],
  };
}
