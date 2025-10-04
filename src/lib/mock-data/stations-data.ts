import { GroundStation, StationNetwork } from '@/types/station';

export const mockGroundStations: GroundStation[] = [
  {
    id: 'pandora-001',
    name: 'Los Angeles Pandora Station',
    type: 'pandora',
    location: {
      lat: 34.0522,
      lon: -118.2437,
      elevation: 71,
      address: 'Los Angeles, CA',
    },
    status: 'active',
    pollutantsMonitored: ['o3', 'no2', 'so2', 'formaldehyde'],
    lastReading: new Date(),
    dataQuality: 'excellent',
    operator: 'NASA GSFC',
    installDate: new Date('2020-06-15'),
  },
  {
    id: 'openaq-002',
    name: 'Downtown LA Air Quality Monitor',
    type: 'openaq',
    location: {
      lat: 34.0407,
      lon: -118.2468,
      elevation: 89,
      address: 'Downtown Los Angeles, CA',
    },
    status: 'active',
    pollutantsMonitored: ['o3', 'no2', 'pm25', 'pm10'],
    lastReading: new Date(Date.now() - 15 * 60000),
    dataQuality: 'good',
    operator: 'AQMD',
    installDate: new Date('2019-03-20'),
  },
  {
    id: 'pandora-003',
    name: 'New York City Pandora',
    type: 'pandora',
    location: {
      lat: 40.7128,
      lon: -74.006,
      elevation: 10,
      address: 'New York, NY',
    },
    status: 'active',
    pollutantsMonitored: ['o3', 'no2', 'so2'],
    lastReading: new Date(),
    dataQuality: 'excellent',
    operator: 'NASA GSFC',
    installDate: new Date('2019-09-10'),
  },
  {
    id: 'openaq-004',
    name: 'Mexico City Central',
    type: 'openaq',
    location: {
      lat: 19.4326,
      lon: -99.1332,
      elevation: 2240,
      address: 'Mexico City, Mexico',
    },
    status: 'active',
    pollutantsMonitored: ['o3', 'no2', 'pm25', 'pm10', 'so2'],
    lastReading: new Date(Date.now() - 30 * 60000),
    dataQuality: 'good',
    operator: 'SIMAT',
    installDate: new Date('2018-11-05'),
  },
  {
    id: 'tolnet-005',
    name: 'Houston TolNet Station',
    type: 'tolnet',
    location: {
      lat: 29.7604,
      lon: -95.3698,
      elevation: 13,
      address: 'Houston, TX',
    },
    status: 'active',
    pollutantsMonitored: ['o3'],
    lastReading: new Date(),
    dataQuality: 'excellent',
    operator: 'NASA LaRC',
    installDate: new Date('2021-02-18'),
  },
  {
    id: 'pandora-006',
    name: 'Chicago Pandora',
    type: 'pandora',
    location: {
      lat: 41.8781,
      lon: -87.6298,
      elevation: 181,
      address: 'Chicago, IL',
    },
    status: 'maintenance',
    pollutantsMonitored: ['o3', 'no2', 'so2'],
    lastReading: new Date(Date.now() - 2 * 24 * 60 * 60000),
    dataQuality: 'fair',
    operator: 'NASA GSFC',
    installDate: new Date('2020-01-22'),
  },
];

export const stationNetworks: StationNetwork[] = [
  {
    type: 'pandora',
    name: 'Pandora Network',
    description:
      'Global network of ground-based spectrometers measuring atmospheric trace gases',
    stations: mockGroundStations.filter((s) => s.type === 'pandora'),
    coverage: {
      countries: ['USA', 'Canada', 'Mexico', 'South Korea', 'Germany'],
      totalStations: 150,
    },
    dataFrequency: '80 seconds',
    website: 'https://pandora.gsfc.nasa.gov',
  },
  {
    type: 'openaq',
    name: 'OpenAQ Network',
    description:
      'Open-source air quality data platform aggregating data from multiple sources',
    stations: mockGroundStations.filter((s) => s.type === 'openaq'),
    coverage: {
      countries: ['Global - 100+ countries'],
      totalStations: 25000,
    },
    dataFrequency: 'Varies by station (typically 1 hour)',
    website: 'https://openaq.org',
  },
  {
    type: 'tolnet',
    name: 'TolNet',
    description:
      'Tropospheric Ozone Lidar Network for vertical ozone profile measurements',
    stations: mockGroundStations.filter((s) => s.type === 'tolnet'),
    coverage: {
      countries: ['USA', 'Canada'],
      totalStations: 12,
    },
    dataFrequency: 'Continuous during campaigns',
    website: 'https://www-air.larc.nasa.gov/missions/TOLNet',
  },
];

export function getStationsByLocation(
  lat: number,
  lon: number,
  radiusKm: number = 50
): GroundStation[] {
  return mockGroundStations.filter((station) => {
    const distance = calculateDistance(
      { lat, lon },
      { lat: station.location.lat, lon: station.location.lon }
    );
    return distance <= radiusKm;
  });
}

function calculateDistance(
  point1: { lat: number; lon: number },
  point2: { lat: number; lon: number }
): number {
  const R = 6371;
  const dLat = toRad(point2.lat - point1.lat);
  const dLon = toRad(point2.lon - point1.lon);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) *
      Math.cos(toRad(point2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
