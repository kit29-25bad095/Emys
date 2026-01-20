
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface SatelliteTelemetry {
  id: string;
  label: string;
  lat: string;
  lng: string;
  alt: string;
  color: string;
}

const EarthCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [telemetry, setTelemetry] = useState<SatelliteTelemetry[]>([]);
  // Added globeRotation state to expose the internal rotation variable to the UI
  const [globeRotation, setGlobeRotation] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const canvas = d3.select(canvasRef.current);
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    canvas.attr('width', width).attr('height', height);

    const projection = d3.geoOrthographic()
      .scale(Math.min(width, height) / 2.3)
      .translate([width / 2, height / 2])
      .precision(0.1);

    const path = d3.geoPath(projection, context);
    const graticule = d3.geoGraticule();

    let rotation = 0;
    const satellites = [
      { id: 'S1', agency: 'ESA', label: 'Sentinel-2A', color: '#38bdf8', angle: 0, speed: 0.003, radius: 1.3, tilt: 35 },
      { id: 'S2', agency: 'ESA', label: 'Sentinel-1B', color: '#38bdf8', angle: Math.PI / 2, speed: 0.002, radius: 1.4, tilt: -45 },
      { id: 'L8', agency: 'NASA', label: 'Landsat-8', color: '#818cf8', angle: Math.PI, speed: 0.0025, radius: 1.5, tilt: 15 },
      { id: 'L9', agency: 'NASA', label: 'Landsat-9', color: '#818cf8', angle: 1.5 * Math.PI, speed: 0.0018, radius: 1.6, tilt: 75 },
      { id: 'C3', agency: 'ISRO', label: 'Cartosat-3', color: '#10b981', angle: 0.5 * Math.PI, speed: 0.0035, radius: 1.35, tilt: -10 },
      { id: 'R2', agency: 'ISRO', label: 'Resourcesat-2', color: '#10b981', angle: 1.2 * Math.PI, speed: 0.0022, radius: 1.45, tilt: 55 },
    ];

    const poi = [
      { lat: 20.5937, lng: 78.9629, label: 'Agri-Monitoring' },
      { lat: -3.4653, lng: -62.2159, label: 'Amazon Deforestation' },
      { lat: 48.8566, lng: 2.3522, label: 'Smart City Flux' },
      { lat: 34.0522, lng: -118.2437, label: 'Wildfire Risk' },
    ];

    let worldData: any;
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then((data: any) => {
      // @ts-ignore
      if (typeof topojson !== 'undefined') {
        // @ts-ignore
        worldData = topojson.feature(data, data.objects.countries);
      }
    });

    let lastUpdate = 0;
    const render = (time: number) => {
      context.clearRect(0, 0, width, height);
      rotation += 0.15;
      projection.rotate([rotation, -20]);

      const scale = projection.scale();

      // Atmospheric Glow
      const atmosGradient = context.createRadialGradient(width/2, height/2, scale * 0.95, width/2, height/2, scale * 1.3);
      atmosGradient.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
      atmosGradient.addColorStop(0.5, 'rgba(56, 189, 248, 0.05)');
      atmosGradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
      context.fillStyle = atmosGradient;
      context.beginPath();
      context.arc(width/2, height/2, scale * 1.3, 0, 2 * Math.PI);
      context.fill();

      // Globe Base
      context.beginPath();
      context.arc(width / 2, height / 2, scale, 0, 2 * Math.PI);
      context.fillStyle = '#020617';
      context.shadowBlur = 40;
      context.shadowColor = 'rgba(56, 189, 248, 0.2)';
      context.fill();
      context.shadowBlur = 0;

      // Graticule
      context.beginPath();
      path(graticule());
      context.strokeStyle = 'rgba(148, 163, 184, 0.08)';
      context.lineWidth = 0.5;
      context.stroke();

      if (worldData) {
        context.beginPath();
        path(worldData);
        context.fillStyle = '#0f172a';
        context.fill();
        context.strokeStyle = 'rgba(56, 189, 248, 0.15)';
        context.lineWidth = 0.8;
        context.stroke();
      }

      // POIs
      poi.forEach(p => {
        const coords = projection([p.lng, p.lat]);
        if (coords) {
          const [x, y] = coords;
          // @ts-ignore
          const isVisible = d3.geoDistance([p.lng, p.lat], [-rotation, 20]) < Math.PI/2;
          if (isVisible) {
            context.beginPath();
            context.arc(x, y, 2, 0, 2 * Math.PI);
            context.fillStyle = '#fbbf24';
            context.fill();
            const pulse = (time % 2000) / 2000;
            context.beginPath();
            context.arc(x, y, 4 + pulse * 10, 0, 2 * Math.PI);
            context.strokeStyle = `rgba(251, 191, 36, ${1 - pulse})`;
            context.stroke();
          }
        }
      });

      // Update Satellites & Telemetry
      const newTelemetry: SatelliteTelemetry[] = [];
      satellites.forEach((sat, i) => {
        sat.angle += sat.speed;
        const orbitRadiusX = scale * sat.radius;
        const orbitRadiusY = scale * sat.radius * 0.4;
        const x = width / 2 + Math.cos(sat.angle) * orbitRadiusX;
        const y = height / 2 + Math.sin(sat.angle) * orbitRadiusY;

        // Visual Satellite
        context.fillStyle = sat.color;
        context.shadowBlur = 15;
        context.shadowColor = sat.color;
        context.fillRect(x - 2, y - 2, 4, 4);
        context.shadowBlur = 0;

        // Label line
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + 10, y - 10);
        context.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        context.stroke();
        context.fillStyle = 'rgba(148, 163, 184, 0.7)';
        context.font = '9px "JetBrains Mono", monospace';
        context.fillText(`${sat.label}`, x + 12, y - 10);

        // Calculate Telemetry
        const currentLat = (Math.sin(sat.angle) * sat.tilt).toFixed(4);
        const rawLng = (sat.angle * (180 / Math.PI) - rotation) % 360;
        const currentLng = (rawLng > 180 ? rawLng - 360 : rawLng < -180 ? rawLng + 360 : rawLng).toFixed(4);
        const currentAlt = ((sat.radius - 1) * 3500 + 400).toFixed(0);

        newTelemetry.push({
          id: sat.id,
          label: sat.label,
          lat: currentLat,
          lng: currentLng,
          alt: currentAlt,
          color: sat.color
        });
      });

      // Throttled UI Update (approx 10fps for HUD stability)
      if (time - lastUpdate > 100) {
        setTelemetry(newTelemetry);
        // Sync rotation variable with state
        setGlobeRotation(rotation);
        lastUpdate = time;
      }

      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden rounded-3xl bg-slate-950/20">
      <canvas ref={canvasRef} className="block w-full h-full" />
      
      {/* Upper HUD Left */}
      <div className="absolute top-6 left-6 flex flex-col gap-1 pointer-events-none">
        <div className="text-[10px] font-mono text-sky-500 uppercase tracking-widest bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-sky-500 animate-pulse"></span>
          System: Live Orbital Fusion
        </div>
        {/* Fixed error: changed rotation to globeRotation state */}
        <div className="text-[9px] font-mono text-slate-500 mt-2">RADIAL_ROT: {(globeRotation % 360).toFixed(2)}°</div>
        <div className="text-[9px] font-mono text-slate-500">SYNC_NODES: {telemetry.length}</div>
      </div>

      {/* Telemetry Panel Overlay (Right) */}
      <div className="absolute top-6 right-6 bottom-6 w-48 flex flex-col gap-2 pointer-events-none overflow-hidden">
        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 border-b border-slate-800 pb-1">Telemetry Uplink</div>
        <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1">
          {telemetry.map(sat => (
            <div key={sat.id} className="bg-slate-950/60 border border-slate-800/60 p-2 rounded-lg backdrop-blur-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[8px] font-bold text-slate-100 uppercase tracking-tight">{sat.label}</span>
                <span className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: sat.color }}></span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 font-mono text-[8px]">
                <span className="text-slate-600">LAT:</span>
                <span className="text-sky-400 text-right">{sat.lat}°</span>
                <span className="text-slate-600">LNG:</span>
                <span className="text-sky-400 text-right">{sat.lng}°</span>
                <span className="text-slate-600">ALT:</span>
                <span className="text-emerald-400 text-right">{sat.alt}KM</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Lower HUD Left */}
      <div className="absolute bottom-6 left-6 flex gap-4 pointer-events-none">
        <div className="flex flex-col">
          <span className="text-[8px] font-bold text-slate-600 uppercase">ESA_COMM</span>
          <span className="text-[10px] font-mono text-sky-400">NOMINAL</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] font-bold text-slate-600 uppercase">NASA_LINK</span>
          <span className="text-[10px] font-mono text-indigo-400">NOMINAL</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] font-bold text-slate-600 uppercase">ISRO_SXS</span>
          <span className="text-[10px] font-mono text-emerald-400">NOMINAL</span>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.2);
          border-radius: 1px;
        }
      `}</style>
    </div>
  );
};

export default EarthCanvas;
