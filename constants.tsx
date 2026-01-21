
import React from 'react';

export const PROCESSING_LAYERS = [
  { 
    id: 'ingest', 
    name: 'Multi-Constellation Ingestion', 
    description: 'Real-time telemetry stream from Sentinel, Landsat, and ISRO platforms.', 
    detailedInfo: 'Aggregate raw data streams from 12+ orbital nodes. Direct downlink from ESA, NASA, and ISRO portals using unified secure uplinks.',
    sampleQuery: 'Current health and real-time status of Sentinel-2 and Landsat-9 orbital constellations',
    icon: '📡' 
  },
  { 
    id: 'standard', 
    name: 'Unified Grid Harmonization', 
    description: 'Scaling spatial, temporal, and resolution differences into a unified dataset.', 
    detailedInfo: 'Aligning 30m Landsat with 10m Sentinel. Normalizing spectral bands and temporal revisits into a sub-5m synthetic planetary grid.',
    sampleQuery: 'State-of-the-art techniques for multi-sensor satellite data normalization and spatial resampling',
    icon: '⚖️' 
  },
  { 
    id: 'fusion', 
    name: 'AI/ML Feature Fusion', 
    description: 'Computer vision stack for automated building, crop, and water extraction.', 
    detailedInfo: 'Leveraging Vision Transformers (ViT) and CNNs to fuse multi-temporal imagery. Detecting change vectors in urban sprawl with 98% precision.',
    sampleQuery: 'Recent advancements in AI computer vision for planetary-scale multi-spectral feature extraction',
    icon: '🧠' 
  },
  { 
    id: 'cloud', 
    name: 'Elastic Cloud Processing', 
    description: 'Distributed compute nodes processing petabytes of pixel data.', 
    detailedInfo: 'Highly scalable Kubernetes-orchestrated clusters processing 500+ terapixels per hour. Multi-region edge nodes ensure low-latency.',
    sampleQuery: 'Efficiency and scalability of distributed cloud computing in processing global remote sensing datasets',
    icon: '☁️' 
  },
  { 
    id: 'dashboard', 
    name: 'Atmospheric Sentinel Desk', 
    description: 'Actionable environmental insights for air purity and weather forecasting.', 
    detailedInfo: 'Transforming unified datasets into tactical intelligence. Real-time alerting for air quality hotspots and meteorological shifts.',
    sampleQuery: 'Case studies on how real-time satellite dashboards improve environmental monitoring and air quality response',
    icon: '📊' 
  }
];

export const APP_THEME = {
  primary: '#38bdf8', // Light Blue
  secondary: '#818cf8', // Indigo
  accent: '#10b981', // Emerald
  bg: '#020617',
  glass: 'rgba(15, 23, 42, 0.8)',
};
