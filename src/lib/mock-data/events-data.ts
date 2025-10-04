export type EventType = 'wildfire' | 'dust-storm' | 'smog' | 'traffic';

export interface AirQualityEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    name: string;
    lat: number;
    lon: number;
    radius?: number;
  };
  startTime: Date;
  endTime?: Date;
  impactedAreas: string[];
  pollutantsAffected: string[];
  expectedAQIImpact: {
    current: number;
    peak: number;
  };
  sources: string[];
  updates: {
    timestamp: Date;
    message: string;
  }[];
}

export const mockEvents: AirQualityEvent[] = [
  {
    id: 'event-001',
    type: 'wildfire',
    title: 'Northern California Wildfire',
    description:
      'Large wildfire burning in northern California is producing significant smoke that is impacting air quality across the region.',
    severity: 'high',
    location: {
      name: 'Northern California',
      lat: 39.5,
      lon: -121.5,
      radius: 200,
    },
    startTime: new Date(Date.now() - 3 * 24 * 60 * 60000),
    impactedAreas: ['Sacramento', 'San Francisco Bay Area', 'Central Valley'],
    pollutantsAffected: ['pm25', 'pm10', 'o3'],
    expectedAQIImpact: {
      current: 165,
      peak: 200,
    },
    sources: ['CAL FIRE', 'NOAA HMS'],
    updates: [
      {
        timestamp: new Date(Date.now() - 2 * 60 * 60000),
        message:
          'Fire is 40% contained. Smoke impact expected to decrease over next 24 hours.',
      },
      {
        timestamp: new Date(Date.now() - 12 * 60 * 60000),
        message:
          'Wind shift expected to push smoke south towards Los Angeles area.',
      },
    ],
  },
  {
    id: 'event-002',
    type: 'smog',
    title: 'Los Angeles Smog Event',
    description:
      'Temperature inversion is trapping pollutants near the surface, creating elevated ozone and particulate levels.',
    severity: 'medium',
    location: {
      name: 'Los Angeles Basin',
      lat: 34.0522,
      lon: -118.2437,
      radius: 80,
    },
    startTime: new Date(Date.now() - 1 * 24 * 60 * 60000),
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60000),
    impactedAreas: ['Los Angeles', 'Orange County', 'Inland Empire'],
    pollutantsAffected: ['o3', 'no2', 'pm25'],
    expectedAQIImpact: {
      current: 145,
      peak: 165,
    },
    sources: ['AQMD', 'NOAA'],
    updates: [
      {
        timestamp: new Date(Date.now() - 1 * 60 * 60000),
        message:
          'Inversion layer expected to break up tomorrow morning as marine layer moves in.',
      },
    ],
  },
  {
    id: 'event-003',
    type: 'dust-storm',
    title: 'Arizona Dust Storm',
    description:
      'Haboob moving through Arizona creating hazardous visibility and air quality conditions.',
    severity: 'critical',
    location: {
      name: 'Phoenix, AZ',
      lat: 33.4484,
      lon: -112.074,
      radius: 100,
    },
    startTime: new Date(Date.now() - 3 * 60 * 60000),
    endTime: new Date(Date.now() + 2 * 60 * 60000),
    impactedAreas: ['Phoenix', 'Mesa', 'Scottsdale', 'Tempe'],
    pollutantsAffected: ['pm10', 'pm25'],
    expectedAQIImpact: {
      current: 285,
      peak: 320,
    },
    sources: ['NWS Phoenix', 'ADEQ'],
    updates: [
      {
        timestamp: new Date(Date.now() - 1 * 60 * 60000),
        message:
          'Dust storm moving east. Conditions expected to improve in next 2 hours.',
      },
      {
        timestamp: new Date(Date.now() - 2 * 60 * 60000),
        message:
          'Visibility reduced to near zero. All residents advised to remain indoors.',
      },
    ],
  },
  {
    id: 'event-004',
    type: 'traffic',
    title: 'Rush Hour Congestion',
    description:
      'Heavy traffic congestion is elevating NO₂ and particulate levels in urban corridors.',
    severity: 'low',
    location: {
      name: 'Downtown Los Angeles',
      lat: 34.0407,
      lon: -118.2468,
      radius: 15,
    },
    startTime: new Date(Date.now() - 1 * 60 * 60000),
    endTime: new Date(Date.now() + 2 * 60 * 60000),
    impactedAreas: ['Downtown', 'I-10 Corridor', 'I-110 Corridor'],
    pollutantsAffected: ['no2', 'pm25'],
    expectedAQIImpact: {
      current: 95,
      peak: 105,
    },
    sources: ['CalTrans', 'AQMD'],
    updates: [],
  },
];

export function getEventIcon(type: EventType): string {
  const icons: Record<EventType, string> = {
    wildfire: '🔥',
    'dust-storm': '🌪️',
    smog: '🏭',
    traffic: '🚗',
  };
  return icons[type];
}

export function getEventColor(severity: string): string {
  const colors: Record<string, string> = {
    low: '#3B82F6',
    medium: '#F59E0B',
    high: '#EF4444',
    critical: '#991B1B',
  };
  return colors[severity] || '#6B7280';
}
