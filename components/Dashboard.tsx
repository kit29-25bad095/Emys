
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { AnalyticInsights } from '../types';
import { fetchAnalyticInsights } from '../services/geminiService';
import TelemetryFeed from './TelemetryFeed';

const loadData = [
  { name: '00:00', val: 400, load: 240 },
  { name: '04:00', val: 300, load: 130 },
  { name: '08:00', val: 600, load: 450 },
  { name: '12:00', val: 800, load: 680 },
  { name: '16:00', val: 700, load: 520 },
  { name: '20:00', val: 900, load: 780 },
];

interface DashboardProps {
  autoTriggerQuery?: string | null;
  globalSearchTerm?: string;
  onSatSelect: (id: string | null) => void;
  selectedSatId: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ autoTriggerQuery, globalSearchTerm = '', onSatSelect, selectedSatId }) => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<AnalyticInsights | null>(null);
  const [isFusionActive, setIsFusionActive] = useState(false);
  const [fusionProgress, setFusionProgress] = useState(0);
  const [fusionStep, setFusionStep] = useState(0);

  const performAnalysis = useCallback(async (targetQuery: string) => {
    if (!targetQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetchAnalyticInsights(targetQuery);
      setInsights(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const triggerFusion = () => {
    setIsFusionActive(true);
    setFusionProgress(0);
    setFusionStep(0);
  };

  useEffect(() => {
    if (isFusionActive && fusionProgress < 100) {
      const timer = setTimeout(() => {
        setFusionProgress(p => p + 1);
        if (fusionProgress === 30) setFusionStep(1);
        if (fusionProgress === 60) setFusionStep(2);
        if (fusionProgress === 90) setFusionStep(3);
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [isFusionActive, fusionProgress]);

  useEffect(() => {
    if (autoTriggerQuery) performAnalysis(autoTriggerQuery);
  }, [autoTriggerQuery, performAnalysis]);

  const fusionHistogram = useMemo(() => [
    { name: 'B1', val: 45 }, { name: 'B2', val: 52 }, { name: 'B3', val: 88 },
    { name: 'B4', val: 120 }, { name: 'B8', val: 155 }, { name: 'B11', val: 92 }
  ], []);

  return (
    <div className="flex flex-col gap-8">
      {/* Fusion Engine Layer */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-[2.5rem] p-1 w-full overflow-hidden shadow-2xl relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent pointer-events-none"></div>
        
        <div className="flex flex-col lg:flex-row min-h-[500px]">
          {/* Controls Panel */}
          <div className="lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-800/60 p-8 flex flex-col gap-8">
            <div>
              <div className="text-[10px] font-black text-sky-500 uppercase tracking-[0.4em] mb-2">Constellation_Aligner</div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Orbital Fusion</h3>
              <p className="text-[10px] text-slate-500 mt-2 font-mono leading-relaxed">
                Normalizing GSD (10m ↔ 30m) and aligning temporal revisit windows into a unified synthetic grid.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Scaling Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  {['BILINEAR', 'LANCZOS', 'CUBIC', 'AI_SUPER'].map(m => (
                    <button key={m} className={`px-2 py-2 rounded-lg text-[8px] font-bold uppercase tracking-tighter border transition-all ${m === 'AI_SUPER' ? 'bg-sky-500/10 border-sky-500/40 text-sky-400' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Temporal Buffer</label>
                <input type="range" className="w-full accent-sky-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                <div className="flex justify-between text-[8px] font-mono text-slate-600">
                  <span>LIVE_ONLY</span>
                  <span>±30 DAYS</span>
                </div>
              </div>

              <button 
                onClick={triggerFusion}
                disabled={isFusionActive && fusionProgress < 100}
                className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all relative overflow-hidden
                  ${isFusionActive && fusionProgress < 100 ? 'bg-slate-800 text-slate-500' : 'bg-sky-500 text-slate-950 hover:shadow-[0_0_20px_rgba(14,165,233,0.4)]'}`}
              >
                {isFusionActive && fusionProgress < 100 ? `Syncing_${fusionProgress}%` : 'Execute Alignment'}
                {isFusionActive && fusionProgress < 100 && (
                  <div className="absolute bottom-0 left-0 h-1 bg-white/40" style={{ width: `${fusionProgress}%` }}></div>
                )}
              </button>
            </div>
          </div>

          {/* Visualization Workspace */}
          <div className="flex-1 p-8 bg-slate-950/40 relative">
            <div className="absolute top-8 right-8 flex gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-slate-600 uppercase">Mean_Res</span>
                <span className="text-xs font-mono text-white">5.2m Synthetic</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-slate-600 uppercase">Sync_Error</span>
                <span className="text-xs font-mono text-emerald-400">0.02 RMSE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
              {/* Coarse Input Preview */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Coarse_Input (30m)</span>
                  <span className="text-[9px] font-mono text-rose-500">ORIGINAL_VECTORS</span>
                </div>
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-[2rem] relative overflow-hidden group/view">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541450805268-4822a3a774ca?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center blur-[3px] opacity-60"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-slate-950/20 backdrop-pixelate"></div>
                  </div>
                  {/* Grid Overlay */}
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-20 pointer-events-none">
                    {Array.from({length: 64}).map((_, i) => <div key={i} className="border-[0.5px] border-slate-700"></div>)}
                  </div>
                </div>
              </div>

              {/* Unified Output Preview */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] font-black text-sky-400 uppercase tracking-widest">Unified_Dataset (5m)</span>
                  <span className="text-[9px] font-mono text-emerald-400">ENHANCED_GRID</span>
                </div>
                <div className="flex-1 bg-slate-900 border border-sky-500/30 rounded-[2rem] relative overflow-hidden shadow-[0_0_30px_rgba(14,165,233,0.1)]">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541450805268-4822a3a774ca?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center transition-all duration-[3000ms]" style={{ filter: isFusionActive ? 'brightness(1.1) contrast(1.2)' : 'brightness(0.5) blur(4px)' }}></div>
                  
                  {/* Synthesis Scanning Animation */}
                  {isFusionActive && fusionProgress < 100 && (
                    <div className="absolute inset-0 z-10 pointer-events-none">
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-sky-400/80 shadow-[0_0_15px_rgba(14,165,233,0.8)] animate-[scanDown_4s_infinite_linear]"></div>
                      <div className="absolute top-0 left-0 w-[2px] h-full bg-sky-400/40 animate-[scanRight_3s_infinite_linear]"></div>
                    </div>
                  )}

                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div className="space-y-1">
                      <div className="text-[8px] font-black text-sky-400 uppercase">Process_Log</div>
                      <div className="text-[7px] font-mono text-slate-400 leading-tight">
                        {fusionStep >= 1 ? '> SPATIAL_INTERPOLATION_DONE\n' : ''}
                        {fusionStep >= 2 ? '> TEMPORAL_RESAMPLING_DONE\n' : ''}
                        {fusionStep >= 3 ? '> SPECTRAL_FUSION_STABLE' : '> WAITING_FOR_UPLINK...'}
                      </div>
                    </div>
                    {isFusionActive && (
                       <div className="w-16 h-12">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={fusionHistogram}>
                               <Bar dataKey="val" fill="#38bdf8" radius={[1, 1, 0, 0]} isAnimationActive />
                            </BarChart>
                          </ResponsiveContainer>
                       </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Environmental Intelligence Core */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden h-full">
            <div className="absolute top-0 left-0 w-1 h-full bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]"></div>
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full bg-sky-500 ${loading ? 'animate-ping' : ''}`}></span>
                Atmospheric Intelligence Core
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => performAnalysis("Weather and Air Quality for global hotspots")}
                  disabled={loading}
                  className="text-[10px] font-mono text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 px-3 py-1 rounded-full border border-sky-500/20 transition-all disabled:opacity-50"
                >
                  {loading ? 'ANALYZING...' : 'FORCE_SCAN'}
                </button>
              </div>
            </div>

            {insights ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  <div className="md:col-span-7">
                    <div className="flex items-baseline gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white tracking-tight">{insights.region}</h3>
                      <span className="text-[10px] font-mono text-slate-500">Environmental Vector</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${
                        insights.threatLevel === 'High' ? 'bg-red-500/10 border-red-500/40 text-red-400' : 
                        insights.threatLevel === 'Medium' ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                      }`}>
                        THREAT: {insights.threatLevel}
                      </span>
                    </div>

                    <p className="text-sm text-slate-400 leading-relaxed font-light mb-8">
                      {insights.summary}
                    </p>

                    <div className="grid grid-cols-3 gap-4">
                      {insights.weather && (
                        <>
                          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                            <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Temp</span>
                            <span className="text-sm font-bold text-sky-400">{insights.weather.temp}</span>
                          </div>
                          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                            <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Humidity</span>
                            <span className="text-sm font-bold text-emerald-400">{insights.weather.humidity}</span>
                          </div>
                          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                            <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Wind</span>
                            <span className="text-sm font-bold text-slate-200">{insights.weather.windSpeed}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-5 space-y-6">
                    {insights.airQuality && (
                      <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Air Purity Index</h4>
                        <div className="flex items-center gap-6">
                          <div className="flex flex-col items-center">
                            <span className="text-3xl font-black text-white leading-none">{insights.airQuality.aqi}</span>
                            <span className="text-[8px] font-mono text-slate-500 mt-1 uppercase">US_AQI</span>
                          </div>
                          <div className="h-10 w-px bg-slate-800"></div>
                          <div>
                            <div className="text-[10px] font-bold uppercase text-sky-400">{insights.airQuality.dominantPollutant} Load</div>
                            <div className="text-[9px] text-slate-400 mt-0.5">{insights.airQuality.description}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Spectral Insights</div>
                      <div className="grid grid-cols-2 gap-3">
                        {insights.keyMetrics.slice(0, 4).map((m, i) => (
                          <div key={i} className="bg-slate-950/40 border border-slate-800 p-3 rounded-xl">
                            <div className="text-[8px] text-slate-500 uppercase font-bold mb-1 truncate">{m.label}</div>
                            <div className="text-xs font-mono text-sky-400">{m.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center bg-slate-950/20 rounded-xl border border-dashed border-slate-800/50">
                {loading ? (
                  <div className="text-center">
                      <div className="w-12 h-12 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-4 mx-auto"></div>
                      <div className="text-[10px] font-mono text-slate-500 animate-pulse uppercase">Scaling global revisits...</div>
                  </div>
                ) : (
                  <div className="text-center px-8">
                      <div className="text-4xl opacity-20 mb-4 font-black tracking-tighter">DATA_IDLE</div>
                      <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest max-w-sm mx-auto">
                        Search or select a constellation node to trigger intelligence synthesis
                      </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Side Metrics */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Processing_Load</span>
              <span className="text-[10px] font-mono text-emerald-400">NOMINAL</span>
            </div>
            
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={loadData}>
                  <Area type="monotone" dataKey="val" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.1} strokeWidth={2} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800/50">
              <div>
                <div className="text-[8px] font-bold text-slate-600 uppercase mb-1">Grid_Sync</div>
                <div className="text-sm font-mono text-white">12.4<span className="text-[9px] text-sky-500">ms</span></div>
              </div>
              <div>
                <div className="text-[8px] font-bold text-slate-600 uppercase mb-1">Const_Nodes</div>
                <div className="text-sm font-mono text-white">18/18</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <TelemetryFeed 
          globalSearchTerm={globalSearchTerm} 
          onSatSelect={onSatSelect}
          selectedSatId={selectedSatId}
        />
      </div>

      <style>{`
        @keyframes scanDown {
          0% { transform: translateY(0); }
          100% { transform: translateY(500%); }
        }
        @keyframes scanRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(500%); }
        }
        .backdrop-pixelate {
          backdrop-filter: blur(8px) brightness(0.8);
          mask-image: linear-gradient(to right, black 50%, transparent 50%),
                      linear-gradient(to bottom, black 50%, transparent 50%);
          mask-size: 8px 8px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
