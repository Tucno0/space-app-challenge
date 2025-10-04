export interface WeatherData {
  timestamp: Date;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  windGust?: number;
  visibility: number;
  uvIndex: number;
  cloudCover: number;
  precipitation: number;
  conditions: string;
  icon: string;
}

export interface WeatherForecast {
  timestamp: Date;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  conditions: string;
}

export interface AtmosphericConditions {
  inversionLayer: boolean;
  inversionHeight?: number;
  mixingLayerHeight: number;
  stability: 'stable' | 'neutral' | 'unstable';
  ventilationIndex: number;
}
