// API Response Type Definitions for External Air Quality and Weather APIs

// IQAir API Response Types
export interface IQAirResponse {
  status: string;
  data: {
    city: string;
    state: string;
    country: string;
    location: {
      type: string;
      coordinates: [number, number];
    };
    current: {
      pollution: {
        ts: string;
        aqius: number; // US AQI
        mainus: string; // Main pollutant (US)
        aqicn: number; // China AQI
        maincn: string; // Main pollutant (China)
      };
      weather: {
        ts: string;
        tp: number; // Temperature (Celsius)
        pr: number; // Atmospheric pressure (hPa)
        hu: number; // Humidity (%)
        ws: number; // Wind speed (m/s)
        wd: number; // Wind direction (degrees)
        ic: string; // Weather icon code
      };
    };
  };
}

// WAQI API Response Types
export interface WAQIResponse {
  status: string;
  data: {
    aqi: number;
    idx: number;
    attributions: Array<{
      url: string;
      name: string;
      logo?: string;
    }>;
    city: {
      geo: [number, number];
      name: string;
      url: string;
    };
    dominentpol: string;
    iaqi: {
      pm25?: { v: number };
      pm10?: { v: number };
      o3?: { v: number };
      no2?: { v: number };
      so2?: { v: number };
      co?: { v: number };
      t?: { v: number }; // Temperature
      p?: { v: number }; // Pressure
      h?: { v: number }; // Humidity
      w?: { v: number }; // Wind speed
      wd?: { v: number }; // Wind direction
    };
    time: {
      s: string;
      tz: string;
      v: number;
    };
  };
}

// OpenWeatherMap One Call API 3.0 Response Types
export interface OpenWeatherOneCallResponse {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: number; // Kelvin
    feels_like: number; // Kelvin
    pressure: number; // hPa
    humidity: number; // %
    dew_point: number; // Kelvin
    uvi: number; // UV index
    clouds: number; // %
    visibility: number; // meters
    wind_speed: number; // m/s
    wind_deg: number; // degrees
    wind_gust?: number; // m/s
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    rain?: {
      '1h': number; // mm
    };
    snow?: {
      '1h': number; // mm
    };
  };
}

// IQA Predict API Response Types (Our own forecast API)
export interface ICAPredictForecastItem {
  date: string; // Format: "YYYY-MM-DD"
  temperature_celsius: number;
  dewpoint_celsius: number;
  pressure_hpa: number;
  wind_speed: number; // m/s
  precipitation_mm: number;
}

export type ICAPredictForecastResponse = ICAPredictForecastItem[];
