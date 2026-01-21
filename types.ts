
export enum SatelliteSource {
  SENTINEL = 'Sentinel-2A/B',
  LANDSAT = 'Landsat 8/9',
  ISRO = 'Cartosat/Resourcesat',
  MODIS = 'MODIS/Aqua',
  WEATHER = 'GOES/Meteosat',
  RADAR = 'Sentinel-1/RISAT'
}

export type SatelliteStatus = 'Nominal' | 'Degraded' | 'Maintenance' | 'Offline';

export interface ProcessingStage {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'idle' | 'processing';
  icon: string;
}

export interface AnalyticInsights {
  region: string;
  threatLevel: 'Low' | 'Medium' | 'High';
  summary: string;
  weather?: {
    temp: string;
    condition: string;
    humidity: string;
    windSpeed: string;
  };
  airQuality?: {
    aqi: number;
    dominantPollutant: string;
    description: string;
  };
  keyMetrics: {
    label: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
  }[];
  groundingSources: string[];
}

export interface SensorPayload {
  name: string;
  availability: number; // 0-100
}

export interface SatelliteState {
  id: string;
  source: SatelliteSource;
  lat: number;
  lng: number;
  alt: number;
  health: number;
  throughput: string;
  status: SatelliteStatus;
  purpose: string;
  dataTypes: SensorPayload[];
  resolution: string;
  revisitTime: string;
  orbitType: string;
  launchAgency: string;
  countryCode: string;
}
