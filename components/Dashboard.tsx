
import React, { useState, useEffect, useCallback } from 'react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { AnalyticInsights } from '../types';
import { fetchAnalyticInsights } from '../services/geminiService';

const data = [
  { name: '00:00', val: 400, load: 240 },
  { name: '04:00', val: 300, load: 130 },
  { name: '08:00', val: 600, load: 450 },
  { name: '12:00', val: 800, load: 680 },
  { name: '16:00', val: 700, load: 520 },
  { name: '20:00', val: 900, load: 780 },
];

interface DashboardProps {
  autoTriggerQuery?: string | null;
}

const MAX_HISTORY = 5;

const Dashboard: React.FC<DashboardProps> = ({ autoTriggerQuery }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<AnalyticInsights | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const addToHistory = useCallback((q: string) => {
    if (!q.trim()) return;
    setHistory(prev => {
      const filtered = prev.filter(item => item !== q);
      return [q, ...filtered].slice(0, MAX_HISTORY);
    });
  }, []);

  const performAnalysis = useCallback(async (targetQuery: string) => {
    if (!targetQuery.trim()) return;
    setLoading(true);
    addToHistory(targetQuery);
    try {
      const res = await fetchAnalyticInsights(targetQuery);
      setInsights(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [addToHistory]);

  useEffect(() => {
    if (autoTriggerQuery) {
      setQuery(autoTriggerQuery);
      performAnalysis(autoTriggerQuery);
    }
  }, [autoTriggerQuery, performAnalysis]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    performAnalysis(query);
  };

  const handleHistoryClick = (historicalQuery: string) => {
    setQuery(historicalQuery);
    performAnalysis(historicalQuery);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main Intelligence Panel */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-sky-500"></div>
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full bg-sky-500 ${loading ? 'animate-ping' : ''}`}></span>
              AI Insight Core
            </h2>
            <div className="text-[10px] font-mono text-slate-500">UPLINK_STABLE // 5.2Gbps</div>
          </div>

          <form onSubmit={handleAnalyze} className="relative mb-4">
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter analysis vector (e.g., 'Urban sprawl impact on Mumbai wetlands')..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-4 text-sm font-mono focus:outline-none focus:border-sky-500 transition-all pr-32 placeholder:text-slate-700"
            />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 text-white text-[10px] font-black px-6 rounded-lg transition-all uppercase tracking-widest"
            >
              {loading ? 'Fusing...' : 'Initiate Fusion'}
            </button>
          </form>

          {/* Query History Bar */}
          {history.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <span className="text-[9px] font-mono text-slate-600 uppercase flex items-center gap-1 mr-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                History:
              </span>
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => handleHistoryClick(h)}
                  className="px-2 py-1 rounded-md bg-slate-950 border border-slate-800 hover:border-sky-500/50 text-[10px] text-slate-400 hover:text-sky-400 transition-all truncate max-w-[150px] font-mono"
                >
                  {h}
                </button>
              ))}
            </div>
          )}

          {insights ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <div className="flex items-baseline gap-2 mb-2">
                     <h3 className="text-xl font-bold text-white tracking-tight">{insights.region}</h3>
                     <span className="text-[10px] font-mono text-slate-500">Target Vector</span>
                   </div>
                   
                   <div className="flex gap-2 mb-6">
                     <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${
                       insights.threatLevel === 'High' ? 'bg-red-500/10 border-red-500/40 text-red-400' : 
                       insights.threatLevel === 'Medium' ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                     }`}>
                       THREAT: {insights.threatLevel}
                     </span>
                     <span className="text-[9px] font-black px-2 py-0.5 rounded border bg-sky-500/10 border-sky-500/40 text-sky-400">
                       SENSOR_FUSION: L9+S2+C3
                     </span>
                   </div>

                   <div className="relative group">
                     <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-slate-800 group-hover:bg-sky-500 transition-colors"></div>
                     <p className="text-sm text-slate-400 leading-relaxed font-light">
                       {insights.summary}
                     </p>
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Spectral Metrics</div>
                  <div className="grid grid-cols-2 gap-3">
                    {insights.keyMetrics.map((m, i) => (
                      <div key={i} className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl group hover:border-sky-500/30 transition-all">
                        <div className="text-[9px] text-slate-500 uppercase font-bold mb-1 tracking-tight">{m.label}</div>
                        <div className="text-xl font-mono text-sky-400 group-hover:text-white transition-colors">{m.value}</div>
                        <div className={`text-[9px] mt-1 font-bold ${m.trend === 'up' ? 'text-rose-400' : m.trend === 'down' ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {m.trend === 'up' ? '↗ TREND_INC' : m.trend === 'down' ? '↘ TREND_DEC' : '→ TREND_STB'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {insights.groundingSources.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-800/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Grounding Citations</span>
                    <span className="text-[9px] font-mono text-slate-700">VERIFIED_SOURCES: {insights.groundingSources.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {insights.groundingSources.map((url, idx) => (
                      <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="bg-slate-950 border border-slate-800 hover:border-sky-500/50 px-3 py-1.5 rounded-lg text-[10px] text-sky-500 hover:text-sky-400 transition-all flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-sky-500"></span>
                        {new URL(url).hostname}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center bg-slate-950/20 rounded-xl border border-dashed border-slate-800/50">
               {loading ? (
                 <div className="text-center">
                    <div className="w-12 h-12 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-4 mx-auto"></div>
                    <div className="text-[10px] font-mono text-slate-500 animate-pulse tracking-widest">SYNCHRONIZING GLOBAL CONSTELLATIONS...</div>
                 </div>
               ) : (
                 <div className="text-center px-8">
                    <div className="text-4xl opacity-20 mb-4 italic">FUSION_IDLE</div>
                    <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                      Input telemetry query or select a processing stage to begin planetary analysis
                    </div>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>

      {/* Side Visual Analytics */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {/* Live Imagery Sim */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-xl h-64 relative overflow-hidden">
           <div className="absolute top-4 left-4 z-10">
             <div className="text-[9px] font-bold text-white bg-red-600 px-1.5 py-0.5 rounded flex items-center gap-1">
               <span className="w-1 h-1 rounded-full bg-white animate-ping"></span> LIVE_FEED
             </div>
             <div className="text-[8px] font-mono text-slate-400 mt-1 uppercase">Sat: Sentinel-2B // 10m Res</div>
           </div>
           
           <div className="absolute inset-0 bg-slate-950">
              <div className="w-full h-full opacity-40 bg-[url('https://images.unsplash.com/photo-1551288049-bbbda536ad37?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center grayscale contrast-125"></div>
              <div className="absolute inset-0 p-4 flex items-center justify-center">
                 <div className="w-48 h-48 border border-sky-500/30 relative animate-[pulse_4s_infinite]">
                    <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-sky-500"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-sky-500"></div>
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-sky-500"></div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-sky-500"></div>
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-sky-500/20 animate-[scan_2s_infinite]"></div>
                 </div>
              </div>
           </div>

           <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div className="text-[8px] font-mono text-sky-500">
                 LAT: 19.0760 N<br/>
                 LNG: 72.8777 E
              </div>
              <div className="text-[8px] font-mono text-slate-500">
                 FRAME_ID: 9283-AX<br/>
                 EXT_CONF: 94.2%
              </div>
           </div>
        </div>

        {/* Real-time System Load */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl flex-1">
          <div className="flex items-center justify-between mb-6">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Throughput Pulse</span>
             <span className="text-[10px] font-mono text-emerald-400">NOMINAL</span>
          </div>
          
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#38bdf8" fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} isAnimationActive={false} />
                <Area type="monotone" dataKey="load" stroke="#818cf8" fillOpacity={0} strokeWidth={1} strokeDasharray="3 3" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800/50">
             <div>
               <div className="text-[8px] font-bold text-slate-600 uppercase mb-1">Compute Nodes</div>
               <div className="text-sm font-mono text-white">4,096 <span className="text-[9px] text-sky-500">Active</span></div>
             </div>
             <div>
               <div className="text-[8px] font-bold text-slate-600 uppercase mb-1">Sync Latency</div>
               <div className="text-sm font-mono text-white">8.4<span className="text-[9px] text-slate-500">ms</span></div>
             </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
