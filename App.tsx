
import React, { useState } from 'react';
import Header from './components/Header';
import EarthCanvas from './components/EarthCanvas';
import ProcessingStack from './components/ProcessingStack';
import Dashboard from './components/Dashboard';
import MissionBriefing from './components/MissionBriefing';
import TemporalDrift from './components/TemporalDrift';

const App: React.FC = () => {
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  const [dashboardTrigger, setDashboardTrigger] = useState<string | null>(null);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [selectedSatId, setSelectedSatId] = useState<string | null>(null);

  const handleSelectLayer = (id: string, query: string) => {
    setActiveLayerId(id);
    setDashboardTrigger(query);
    
    // Scroll to dashboard on mobile for better UX
    if (window.innerWidth < 1024) {
      document.getElementById('dashboard-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGlobalSearchSubmit = (query: string) => {
    if (!query.trim()) return;
    setDashboardTrigger(query);
    document.getElementById('dashboard-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-200 selection:bg-sky-500/30">
      <Header 
        searchTerm={globalSearchTerm} 
        onSearchChange={setGlobalSearchTerm} 
        onSearchSubmit={handleGlobalSearchSubmit}
      />
      
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col gap-10">
        
        {/* Upper Operations Deck */}
        <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Visualizer */}
          <div className="lg:col-span-7 xl:col-span-8 h-[500px] lg:h-auto min-h-[650px] relative">
            <div className="absolute inset-0 bg-radial-gradient from-sky-500/5 to-transparent pointer-events-none"></div>
            <EarthCanvas 
              highlightTerm={globalSearchTerm} 
              selectedSatId={selectedSatId} 
            />
            
            {/* Visual Overlays for 'Lab' feel */}
            <div className="absolute top-8 left-8 flex flex-col items-start gap-2 pointer-events-none">
              <div className="text-[9px] font-mono text-slate-600 bg-slate-950/50 p-2 border border-slate-800 rounded">
                SYSTEM_MODE: PLANETARY_FUSION<br/>
                UPLINK_STABLE: 100%<br/>
                ENCRYPTION: AES-256-QUANTUM
              </div>
            </div>
          </div>
          
          {/* Right Control Column */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
            {/* Mission Briefing Module */}
            <div className="h-64">
              <MissionBriefing />
            </div>

            {/* Processing Stream */}
            <div className="flex-1 flex flex-col">
              <div className="mb-4">
                <div className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-1">Operations Pipeline</div>
                <h2 className="text-2xl font-black tracking-tight text-white uppercase">
                  Data <span className="text-sky-500">Standardization</span>
                </h2>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                  Aggregating spectral telemetry from multiple constellations to generate 
                  human-understandable planet intelligence.
                </p>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <ProcessingStack 
                  activeLayerId={activeLayerId} 
                  onSelectLayer={handleSelectLayer} 
                  searchTerm={globalSearchTerm}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Global Impact Dashboard */}
        <section id="dashboard-section" className="border-t border-slate-800/30 pt-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Planetary Intelligence Desk</h3>
              </div>
              <p className="text-xs text-slate-500 font-mono">MULTI-AGENT ANALYSIS // GLOBAL REVISIT: 45 MINS</p>
            </div>
            
            <div className="flex gap-4">
               <div className="bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-xl flex flex-col">
                 <span className="text-[8px] font-bold text-slate-600 uppercase">Archive Latency</span>
                 <span className="text-sm font-mono text-sky-400">0.4s</span>
               </div>
               <div className="bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-xl flex flex-col">
                 <span className="text-[8px] font-bold text-slate-600 uppercase">Detection Events</span>
                 <span className="text-sm font-mono text-emerald-400">14.2k <span className="text-[10px]">/hr</span></span>
               </div>
            </div>
          </div>
          
          <Dashboard 
            autoTriggerQuery={dashboardTrigger} 
            globalSearchTerm={globalSearchTerm} 
            onSatSelect={setSelectedSatId}
            selectedSatId={selectedSatId}
          />
        </section>

        {/* Temporal Visualization Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-12">
               <TemporalDrift />
            </div>
          </div>
        </section>
      </main>

      {/* Footer / Status Bar */}
      <footer className="border-t border-slate-800/50 py-3 px-6 bg-slate-950/90 backdrop-blur-md sticky bottom-0 z-50">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-[0.2em]">Global Sensor Network: Online</span>
            </div>
            <div className="h-4 w-px bg-slate-800"></div>
            <div className="flex gap-3">
               <span className="text-[9px] font-mono text-slate-600">S1_ACTIVE</span>
               <span className="text-[9px] font-mono text-slate-600">S2_ACTIVE</span>
               <span className="text-[9px] font-mono text-slate-600">L8_ACTIVE</span>
               <span className="text-[9px] font-mono text-emerald-500/80">ISRO_ACTIVE</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest hidden lg:block">Local Time: {new Date().toLocaleTimeString()}</span>
            <div className="h-4 w-px bg-slate-800 hidden lg:block"></div>
            <div className="text-[9px] font-bold text-slate-400">TERRAFUSION <span className="text-sky-500">v4.2.0-STABLE</span></div>
          </div>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default App;
