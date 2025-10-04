import { AQICategory, PollutantType } from './air-quality';

export type AlertSeverity = 'info' | 'warning' | 'danger' | 'critical';
export type AlertType =
  | 'aqi-threshold'
  | 'pollutant-spike'
  | 'event'
  | 'forecast';
export type AudienceType =
  | 'general'
  | 'sensitive'
  | 'elderly'
  | 'children'
  | 'athletes'
  | 'outdoor-workers';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: Date;
  expiresAt?: Date;
  location: {
    name: string;
    lat: number;
    lon: number;
  };
  aqiValue?: number;
  category?: AQICategory;
  pollutant?: PollutantType;
  actionable: boolean;
  recommendations: string[];
}

export interface AlertPreferences {
  enabled: boolean;
  audienceType: AudienceType;
  thresholds: {
    aqi: number;
    o3?: number;
    no2?: number;
    so2?: number;
    pm25?: number;
  };
  notificationMethods: {
    push: boolean;
    email: boolean;
  };
  quietHours?: {
    start: string;
    end: string;
  };
  locations: string[];
}

export interface AlertHistory {
  alerts: Alert[];
  totalCount: number;
  unreadCount: number;
}
