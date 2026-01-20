
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
    name: 'Atmospheric Correction & Grid', 
    description: 'Harmonizing spectral bands and spatial resolutions (10m-30m fusion).', 
    detailedInfo: 'Processing Level-1C to Level-2A data. Normalizing spectral bands across disparate sensors into a unified 5m synthetic grid using advanced radiometric calibration.',
    sampleQuery: 'State-of-the-art techniques for multi-sensor satellite data normalization and atmospheric correction',
    icon: '⚖️' 
  },
  { 
    id: 'fusion', 
    name: 'AI/ML Feature Fusion', 
    description: 'Computer vision stack for automated building, crop, and water extraction.', 
    detailedInfo: 'Leveraging Vision Transformers (ViT) and CNNs to fuse multi-temporal imagery. Detecting change vectors in urban sprawl, forest cover, and water bodies with 98% precision.',
    sampleQuery: 'Recent advancements in AI computer vision for planetary-scale multi-spectral feature extraction',
    icon: '🧠' 
  },
  { 
    id: 'cloud', 
    name: 'Elastic Cloud Processing', 
    description: 'Distributed compute nodes processing petabytes of pixel data.', 
    detailedInfo: 'Highly scalable Kubernetes-orchestrated clusters processing 500+ terapixels per hour. Multi-region edge nodes ensure low-latency data availability.',
    sampleQuery: 'Efficiency and scalability of distributed cloud computing in processing global remote sensing datasets',
    icon: '☁️' 
  },
  { 
    id: 'dashboard', 
    name: 'Unified Decision Dashboard', 
    description: 'Actionable insights for disaster response and climate monitoring.', 
    detailedInfo: 'Transforming petabytes of raw pixels into tactical intelligence. Real-time alerting and report generation for humanitarian and environmental agencies.',
    sampleQuery: 'Case studies on how real-time satellite dashboards improve disaster relief and climate monitoring outcomes',
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
