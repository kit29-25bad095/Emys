
export enum SatelliteSource {
  SENTINEL = 'Sentinel-2A/B',
  LANDSAT = 'Landsat 8/9',
  ISRO = 'Cartosat/Resourcesat',
  MODIS = 'MODIS/Aqua'
}

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
  keyMetrics: {
    label: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
  }[];
  groundingSources: string[];
}

export interface SatelliteState {
  id: string;
  source: SatelliteSource;
  lat: number;
  lng: number;
  alt: number;
  health: number;
  throughput: string;
}
