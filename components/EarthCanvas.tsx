
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { geoOrthographic, geoDistance, geoContains, json } from 'd3';

interface SatelliteTelemetry {
  id: string;
  label: string;
  lat: string;
  lng: string;
  alt: string;
  color: string;
  isHighlighted?: boolean;
}

interface VoxelNode {
  lng: number;
  lat: number;
  isLand: boolean;
  isUrban: boolean;
  elevation: number;
  baseHue: number;
}

interface EarthCanvasProps {
  highlightTerm?: string;
  selectedSatId?: string | null;
}

const EarthCanvas: React.FC<EarthCanvasProps> = ({ highlightTerm = '', selectedSatId = null }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [telemetry, setTelemetry] = useState<SatelliteTelemetry[]>([]);
  const [globeRotation, setGlobeRotation] = useState(0);

  // Generate a high-fidelity voxel grid for the "Proper 3D" Earth
  const voxelGrid: VoxelNode[] = useMemo(() => {
    const points: VoxelNode[] = [];
    const step = 1.4; 
    for (let lat = -90; lat <= 90; lat += step) {
      const lngStep = step / Math.cos(lat * Math.PI / 180) || step;
      for (let lng = -180; lng <= 180; lng += lngStep) {
        const isUrban = Math.random() > 0.94;
        const elevation = (Math.sin(lat * 0.1) * Math.cos(lng * 0.1) + 1) * 2;
        const baseHue = isUrban ? 45 : 200;
        points.push({ lng, lat, isLand: false, isUrban, elevation, baseHue });
      }
    }
    return points;
  }, []);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const context = canvasRef.current.getContext('2d', { alpha: true });
    if (!context) return;

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    const projection = geoOrthographic()
      .scale(Math.min(width, height) / 2.4)
      .translate([width / 2, height / 2])
      .precision(0.1);

    // Comprehensive satellite constellation matching TelemetryFeed IDs
    const satellites = [
      { id: 'SEN-1A', label: 'Sentinel-1A', color: '#f43f5e', angle: 0, speed: 0.0022, radius: 1.35, tilt: 45, swathWidth: 0.12 },
      { id: 'SEN-2A', label: 'Sentinel-2A', color: '#0ea5e9', angle: 0.5 * Math.PI, speed: 0.003, radius: 1.42, tilt: 35, swathWidth: 0.15 },
      { id: 'LND-9', label: 'Landsat-9', color: '#818cf8', angle: 1.2 * Math.PI, speed: 0.002, radius: 1.52, tilt: 15, swathWidth: 0.1 },
      { id: 'CRT-3', label: 'Cartosat-3', color: '#10b981', angle: 0.1 * Math.PI, speed: 0.0035, radius: 1.38, tilt: -10, swathWidth: 0.08 },
      { id: 'MET-11', label: 'Meteosat-11', color: '#fbbf24', angle: 0.2 * Math.PI, speed: 0.0005, radius: 1.85, tilt: 0, swathWidth: 0.25 },
      { id: 'GOE-16', label: 'GOES-16', color: '#fbbf24', angle: 0.8 * Math.PI, speed: 0.0005, radius: 1.85, tilt: 5, swathWidth: 0.25 },
      { id: 'RIS-2B', label: 'RISAT-2B', color: '#f43f5e', angle: 1.7 * Math.PI, speed: 0.0028, radius: 1.45, tilt: 55, swathWidth: 0.12 },
      { id: 'HIM-9', label: 'Himawari-9', color: '#fbbf24', angle: 0.4 * Math.PI, speed: 0.0005, radius: 1.85, tilt: -2, swathWidth: 0.25 },
      { id: 'NOAA-20', label: 'NOAA-20', color: '#34d399', angle: 0.6 * Math.PI, speed: 0.0018, radius: 1.62, tilt: 30, swathWidth: 0.2 },
      { id: 'SENT-5P', label: 'Sentinel-5P', color: '#0ea5e9', angle: 1.8 * Math.PI, speed: 0.0016, radius: 1.65, tilt: -30, swathWidth: 0.2 },
      { id: 'GPM-1', label: 'GPM Core', color: '#38bdf8', angle: 1.1 * Math.PI, speed: 0.0025, radius: 1.32, tilt: 65, swathWidth: 0.18 },
      { id: 'SWOT-A', label: 'SWOT', color: '#f43f5e', angle: 0.3 * Math.PI, speed: 0.0022, radius: 1.48, tilt: 75, swathWidth: 0.14 },
      { id: 'GRACE-1', label: 'GRACE-FO', color: '#6366f1', angle: 0.9 * Math.PI, speed: 0.0032, radius: 1.30, tilt: 88, swathWidth: 0.08 },
      { id: 'METOP-C', label: 'MetOp-C', color: '#fbbf24', angle: 1.5 * Math.PI, speed: 0.002, radius: 1.58, tilt: 80, swathWidth: 0.12 },
      { id: 'S1-C', label: 'Sentinel-1C', color: '#f43f5e', angle: 0.7 * Math.PI, speed: 0.0022, radius: 1.35, tilt: -45, swathWidth: 0.12 },
      { id: 'MOD-A', label: 'MODIS Aqua', color: '#d946ef', angle: 1.4 * Math.PI, speed: 0.0018, radius: 1.55, tilt: -15, swathWidth: 0.2 },
      { id: 'TER-A', label: 'MODIS Terra', color: '#d946ef', angle: 0.1 * Math.PI, speed: 0.0018, radius: 1.55, tilt: 15, swathWidth: 0.2 },
      { id: 'ICE-2', label: 'ICESat-2', color: '#f8fafc', angle: 1.9 * Math.PI, speed: 0.0024, radius: 1.40, tilt: 92, swathWidth: 0.05 },
    ];

    json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then((data: any) => {
      // @ts-ignore
      const worldData = topojson.feature(data, data.objects.countries);
      voxelGrid.forEach(v => {
        v.isLand = geoContains(worldData, [v.lng, v.lat]);
        if (v.isLand) v.elevation += 2;
      });
    });

    let rotation = 0;
    let lastUpdate = 0;

    const render = (time: number) => {
      context.clearRect(0, 0, width, height);
      rotation += 0.12;
      projection.rotate([rotation, -25]);
      const scale = projection.scale();

      // Atmospheric Glow
      const bgGrad = context.createRadialGradient(width/2, height/2, scale * 0.9, width/2, height/2, scale * 1.5);
      bgGrad.addColorStop(0, 'rgba(56, 189, 248, 0.1)');
      bgGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = bgGrad;
      context.fillRect(0, 0, width, height);

      const activeSats = satellites.map(s => {
        s.angle += s.speed;
        const sLat = Math.sin(s.angle) * s.tilt;
        // Approximation of orbital lng based on rotation and angle
        const sLng = (s.angle * (180 / Math.PI) - rotation * 0.5) % 360;
        const finalLng = sLng > 180 ? sLng - 360 : sLng < -180 ? sLng + 360 : sLng;
        return { ...s, lat: sLat, lng: finalLng };
      });

      // Draw Orbital Paths first
      activeSats.forEach(s => {
        const orbitRadiusX = scale * s.radius;
        const orbitRadiusY = scale * s.radius * 0.45;
        const isHighlighted = (highlightTerm !== '' && (s.label.toLowerCase().includes(highlightTerm.toLowerCase()) || s.id.toLowerCase().includes(highlightTerm.toLowerCase()))) || 
                            (selectedSatId === s.id);
        
        if (isHighlighted) {
          context.save();
          context.translate(width / 2, height / 2);
          context.rotate((s.tilt * Math.PI) / 180 * 0.1); 
          context.beginPath();
          for (let a = 0; a <= Math.PI * 2; a += 0.1) {
            const ox = Math.cos(a) * orbitRadiusX;
            const oy = Math.sin(a) * orbitRadiusY;
            if (a === 0) context.moveTo(ox, oy);
            else context.lineTo(ox, oy);
          }
          context.strokeStyle = `${s.color}33`;
          context.lineWidth = 1;
          context.setLineDash([5, 10]);
          context.stroke();
          context.restore();
        }
      });

      // Render Globe
      const sunPos: [number, number] = [-rotation + 45, 45];
      voxelGrid.forEach((v, i) => {
        const distance = geoDistance([v.lng, v.lat], [-rotation, 25]);
        if (distance < Math.PI / 2) {
          const sunDist = geoDistance([v.lng, v.lat], sunPos);
          const shading = Math.max(0.08, Math.cos(sunDist)); 
          const coords = projection([v.lng, v.lat]);

          if (coords) {
            const [x, y] = coords;
            const opacity = Math.max(0.1, 1 - (distance / (Math.PI / 2)));
            let scanColor: string | null = null;
            
            // Sat Swath scanning visualization
            activeSats.forEach(s => {
              if (geoDistance([v.lng, v.lat], [s.lng, s.lat]) < s.swathWidth) scanColor = s.color;
            });

            if (scanColor) {
              context.fillStyle = scanColor;
              context.globalAlpha = opacity;
              context.fillRect(x - 1.2, y - 1.2, 3, 3);
              context.globalAlpha = 1;
            } else if (v.isLand) {
              const lightness = shading * 50 + 10;
              context.fillStyle = v.isUrban ? `rgba(255, 255, 255, ${opacity * 0.8})` : `hsla(150, 50%, ${lightness}%, ${opacity})`;
              context.fillRect(x - 1, y - 1, 2, 2);
            } else if (i % 3 === 0) {
              const lightness = shading * 15;
              context.fillStyle = `hsla(220, 80%, ${lightness}%, ${opacity * 0.3})`;
              context.fillRect(x - 0.5, y - 0.5, 1, 1);
            }
          }
        }
      });

      // Render Satellites and Nadir Lines
      activeSats.forEach(s => {
        const orbitRadiusX = scale * s.radius;
        const orbitRadiusY = scale * s.radius * 0.45;
        const sx = width / 2 + Math.cos(s.angle) * orbitRadiusX;
        const sy = height / 2 + Math.sin(s.angle) * orbitRadiusY;
        const isHighlighted = (highlightTerm !== '' && (s.label.toLowerCase().includes(highlightTerm.toLowerCase()) || s.id.toLowerCase().includes(highlightTerm.toLowerCase()))) || 
                            (selectedSatId === s.id);

        const gCoords = projection([s.lng, s.lat]);
        if (gCoords && geoDistance([s.lng, s.lat], [-rotation, 25]) < Math.PI / 2) {
          const [gx, gy] = gCoords;
          // Nadir projection line
          context.beginPath();
          context.moveTo(sx, sy);
          context.lineTo(gx, gy);
          context.strokeStyle = isHighlighted ? `${s.color}aa` : `rgba(255,255,255,0.05)`;
          context.lineWidth = isHighlighted ? 1.5 : 0.5;
          if (!isHighlighted) context.setLineDash([2, 4]);
          else context.setLineDash([]);
          context.stroke();
          context.setLineDash([]);

          // Surface tracking marker
          context.fillStyle = s.color;
          context.beginPath();
          context.arc(gx, gy, isHighlighted ? 4 : 1.5, 0, Math.PI * 2);
          context.fill();
          if (isHighlighted) {
            context.strokeStyle = '#fff';
            context.lineWidth = 1;
            context.stroke();
          }
        }

        // Satellite body
        context.save();
        context.shadowBlur = isHighlighted ? 15 : 0;
        context.shadowColor = s.color;
        context.fillStyle = s.color;
        if (isHighlighted) {
          context.fillRect(sx - 5, sy - 5, 10, 10);
          context.strokeStyle = '#fff';
          context.lineWidth = 1.5;
          context.strokeRect(sx - 5, sy - 5, 10, 10);
          
          context.fillStyle = '#fff';
          context.font = 'bold 11px monospace';
          context.shadowBlur = 0;
          context.fillText(s.id, sx + 14, sy - 4);
          context.font = '9px monospace';
          context.fillStyle = 'rgba(255,255,255,0.7)';
          context.fillText(`${s.lat.toFixed(2)}N ${s.lng.toFixed(2)}E`, sx + 14, sy + 8);
        } else {
          context.fillRect(sx - 2, sy - 2, 4, 4);
        }
        context.restore();
      });

      if (time - lastUpdate > 120) {
        setTelemetry(activeSats.map(s => ({
          id: s.id,
          label: s.label,
          lat: s.lat.toFixed(4),
          lng: s.lng.toFixed(4),
          alt: ((s.radius - 1) * 3500 + 400).toFixed(0),
          color: s.color,
          isHighlighted: (highlightTerm !== '' && (s.label.toLowerCase().includes(highlightTerm.toLowerCase()) || s.id.toLowerCase().includes(highlightTerm.toLowerCase()))) || (selectedSatId === s.id)
        })));
        setGlobeRotation(rotation);
        lastUpdate = time;
      }
      requestAnimationFrame(render);
    };

    const anim = requestAnimationFrame(render);
    return () => cancelAnimationFrame(anim);
  }, [highlightTerm, voxelGrid, selectedSatId]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden rounded-[2.5rem] bg-slate-950 border border-slate-800/40 shadow-inner">
      <canvas ref={canvasRef} className="block w-full h-full" />
      
      {/* Dynamic Data Overlays */}
      <div className="absolute top-8 left-8 flex flex-col gap-6 pointer-events-none">
        <div className="animate-in fade-in duration-1000">
          <div className="text-[10px] font-black text-sky-400 uppercase tracking-[0.4em] mb-1">System_Mode: Orbital_Track</div>
          <div className="flex gap-1 h-0.5 w-40 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-sky-500 w-1/4 animate-[slide_2s_infinite]"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
          <div className="flex flex-col group">
            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest group-hover:text-sky-500 transition-colors">Nadir_Focus</span>
            <span className="text-sm font-mono text-white">{(globeRotation % 360).toFixed(1)}°E</span>
          </div>
          <div className="flex flex-col group">
            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">Active_Grid</span>
            <span className="text-sm font-mono text-emerald-400">{telemetry.length} Units</span>
          </div>
          <div className="flex flex-col group">
            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest group-hover:text-rose-500 transition-colors">Resolution</span>
            <span className="text-sm font-mono text-white">0.8m GSD</span>
          </div>
          <div className="flex flex-col group">
            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest group-hover:text-amber-500 transition-colors">IO_Streams</span>
            <span className="text-sm font-mono text-sky-400">18 Sync</span>
          </div>
        </div>
      </div>

      {/* Constellation Deck Sidebar */}
      <div className="absolute top-8 right-8 bottom-8 w-60 flex flex-col gap-2 pointer-events-none">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-xl mb-2">
            <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <span>Orbital Registry</span>
                <span className="flex gap-1">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="w-1 h-1 bg-emerald-500/50 rounded-full"></span>
                </span>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 pr-2 pointer-events-auto">
          {telemetry.map(sat => (
            <div 
              key={sat.id} 
              className={`p-3 rounded-2xl border transition-all duration-300 relative overflow-hidden group
                ${sat.isHighlighted ? 'bg-sky-500/10 border-sky-500/60 scale-[1.02] shadow-lg shadow-sky-500/10' : 'bg-slate-900/40 border-slate-800/40 hover:bg-slate-800/60 hover:border-slate-700'}`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`text-[10px] font-black transition-colors ${sat.isHighlighted ? 'text-white' : 'text-slate-400'}`}>{sat.id}</span>
                <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: sat.color, color: sat.color }}></div>
              </div>
              <div className="flex flex-col gap-0.5 font-mono text-[8px] uppercase tracking-tighter">
                <div className="flex justify-between text-slate-600">
                  <span>Lat: <span className="text-slate-300 font-bold">{sat.lat}</span></span>
                  <span>Alt: <span className="text-slate-300 font-bold">{sat.alt}km</span></span>
                </div>
                <div className="text-slate-600">Lng: <span className="text-slate-300 font-bold">{sat.lng}</span></div>
              </div>
              {sat.isHighlighted && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-sky-500 animate-pulse"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.15);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.3);
        }
      `}</style>
    </div>
  );
};

export default EarthCanvas;
