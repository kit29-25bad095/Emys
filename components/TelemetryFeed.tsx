
import React, { useState, useEffect, useMemo } from 'react';
import { SatelliteSource, SatelliteState, SatelliteStatus } from '../types';

const INITIAL_SATS: SatelliteState[] = [
  { id: 'SEN-1A', source: SatelliteSource.RADAR, lat: 52.3676, lng: 4.9041, alt: 693, health: 99, throughput: '350 Mbps', status: 'Nominal', purpose: 'Land & Ocean SAR Imaging', dataTypes: [{ name: 'C-Band SAR', availability: 98 }], resolution: '5m - 20m', revisitTime: '6 Days', orbitType: 'SSO', launchAgency: 'ESA', countryCode: 'EU' },
  { id: 'SEN-2A', source: SatelliteSource.SENTINEL, lat: 19.0760, lng: 72.8777, alt: 786, health: 98, throughput: '420 Mbps', status: 'Nominal', purpose: 'Agriculture & Land Monitoring', dataTypes: [{ name: 'MSI', availability: 99 }, { name: '13-Bands', availability: 95 }], resolution: '10m - 60m', revisitTime: '5 Days', orbitType: 'SSO', launchAgency: 'ESA', countryCode: 'EU' },
  { id: 'LND-9', source: SatelliteSource.LANDSAT, lat: -33.8688, lng: 151.2093, alt: 705, health: 94, throughput: '1.2 Gbps', status: 'Nominal', purpose: 'Global Land Inventory', dataTypes: [{ name: 'OLI-2', availability: 94 }, { name: 'TIRS-2', availability: 91 }], resolution: '15m - 100m', revisitTime: '16 Days', orbitType: 'SSO', launchAgency: 'NASA/USGS', countryCode: 'USA' },
  { id: 'CRT-3', source: SatelliteSource.ISRO, lat: 28.6139, lng: 77.2090, alt: 505, health: 99, throughput: '850 Mbps', status: 'Nominal', purpose: 'High-Res Urban Mapping', dataTypes: [{ name: 'Panchromatic', availability: 100 }, { name: 'MX', availability: 98 }], resolution: '0.28m', revisitTime: '4 Days', orbitType: 'SSO', launchAgency: 'ISRO', countryCode: 'IND' },
  { id: 'MET-11', source: SatelliteSource.WEATHER, lat: 0.0000, lng: 0.0000, alt: 35786, health: 97, throughput: '2.4 Gbps', status: 'Nominal', purpose: 'Meteorological Forecasting', dataTypes: [{ name: 'SEVIRI', availability: 97 }, { name: 'GERB', availability: 89 }], resolution: '1km - 3km', revisitTime: '15 Mins', orbitType: 'GEO', launchAgency: 'EUMETSAT', countryCode: 'EU' },
  { id: 'GOE-16', source: SatelliteSource.WEATHER, lat: 0.0000, lng: -75.2000, alt: 35786, health: 99, throughput: '4.2 Gbps', status: 'Nominal', purpose: 'Severe Storm Tracking', dataTypes: [{ name: 'ABI', availability: 99 }, { name: 'GLM', availability: 97 }], resolution: '0.5km - 2km', revisitTime: '30 Secs', orbitType: 'GEO', launchAgency: 'NOAA', countryCode: 'USA' },
  { id: 'RIS-2B', source: SatelliteSource.RADAR, lat: 13.0827, lng: 80.2707, alt: 632, health: 92, throughput: '510 Mbps', status: 'Nominal', purpose: 'All-Weather Surveillance', dataTypes: [{ name: 'X-Band SAR', availability: 92 }], resolution: '1m', revisitTime: '5 Days', orbitType: 'SSO', launchAgency: 'ISRO', countryCode: 'IND' },
  { id: 'HIM-9', source: SatelliteSource.WEATHER, lat: 0.0000, lng: 140.7000, alt: 35786, health: 96, throughput: '3.1 Gbps', status: 'Nominal', purpose: 'Pacific Rim Weather', dataTypes: [{ name: 'AHI', availability: 96 }], resolution: '1km - 2km', revisitTime: '10 Mins', orbitType: 'GEO', launchAgency: 'JMA', countryCode: 'JPN' },
  { id: 'SENT-5P', source: SatelliteSource.SENTINEL, lat: 10.5000, lng: 15.2000, alt: 824, health: 95, throughput: '310 Mbps', status: 'Nominal', purpose: 'Air Quality Monitoring', dataTypes: [{ name: 'TROPOMI', availability: 95 }], resolution: '3.5km - 7km', revisitTime: '1 Day', orbitType: 'SSO', launchAgency: 'ESA', countryCode: 'EU' },
  { id: 'GPM-1', source: SatelliteSource.WEATHER, lat: -20.1200, lng: 45.6000, alt: 407, health: 94, throughput: '150 Mbps', status: 'Nominal', purpose: 'Precipitation Measuring', dataTypes: [{ name: 'GMI', availability: 94 }, { name: 'DPR', availability: 92 }], resolution: '5km', revisitTime: '3 Hours', orbitType: 'LEO', launchAgency: 'NASA/JAXA', countryCode: 'USA/JPN' },
  { id: 'SWOT-A', source: SatelliteSource.RADAR, lat: 34.0000, lng: -118.0000, alt: 891, health: 97, throughput: '1.4 Gbps', status: 'Nominal', purpose: 'Surface Water Topography', dataTypes: [{ name: 'KaRIn', availability: 97 }], resolution: '10m - 100m', revisitTime: '21 Days', orbitType: 'LEO', launchAgency: 'NASA/CNES', countryCode: 'USA/FRA' },
  { id: 'GRACE-1', source: SatelliteSource.RADAR, lat: 0.0000, lng: 0.0000, alt: 490, health: 89, throughput: '80 Mbps', status: 'Degraded', purpose: 'Gravity Field Mapping', dataTypes: [{ name: 'Microwave Range', availability: 89 }], resolution: '300km', revisitTime: '30 Days', orbitType: 'LEO', launchAgency: 'NASA/DLR', countryCode: 'USA/GER' },
  { id: 'ICE-2', source: SatelliteSource.SENTINEL, lat: -82.0000, lng: 10.0000, alt: 496, health: 93, throughput: '120 Mbps', status: 'Nominal', purpose: 'Ice Sheet Elevation', dataTypes: [{ name: 'ATLAS Lidar', availability: 93 }], resolution: '10m (Spot)', revisitTime: '91 Days', orbitType: 'LEO', launchAgency: 'NASA', countryCode: 'USA' },
];

interface TelemetryFeedProps {
  globalSearchTerm?: string;
  onSatSelect: (id: string | null) => void;
  selectedSatId: string | null;
}

const AgencyBadge = ({ agency, country }: { agency: string, country: string }) => {
  const isEU = country === 'EU';
  const isUSA = country.includes('USA');
  const isIND = country === 'IND';
  const isJPN = country === 'JPN';

  return (
    <div className="flex items-center gap-2">
      <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border
        ${isEU ? 'bg-blue-900/40 border-blue-500/30 text-blue-400' : 
          isUSA ? 'bg-rose-900/40 border-rose-500/30 text-rose-400' :
          isIND ? 'bg-orange-900/40 border-orange-500/30 text-orange-400' :
          isJPN ? 'bg-slate-800 border-slate-600 text-slate-300' :
          'bg-slate-900 border-slate-700 text-slate-500'}`}>
        {agency}
      </div>
      <span className="text-[9px] font-mono text-slate-600">{country}</span>
    </div>
  );
};

const StatusIcon = ({ status }: { status: SatelliteStatus }) => {
  const styles = {
    Nominal: { text: 'text-emerald-400', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    Degraded: { text: 'text-amber-500', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    Maintenance: { text: 'text-sky-400', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    Offline: { text: 'text-slate-600', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' }
  };
  const config = styles[status] || styles.Offline;
  return (
    <div className={`flex items-center gap-2 ${config.text}`}>
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={config.icon} />
      </svg>
      <span className="text-[9px] font-mono font-black uppercase tracking-[0.1em]">{status}</span>
    </div>
  );
};

const TelemetryFeed: React.FC<TelemetryFeedProps> = ({ globalSearchTerm = '', onSatSelect, selectedSatId }) => {
  const [sats, setSats] = useState<SatelliteState[]>(INITIAL_SATS);
  const [filterSource, setFilterSource] = useState<string>('ALL');
  const [localSearch, setLocalSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const UPDATE_INTERVAL = 1500;
    const interval = setInterval(() => {
      setSats(current => current.map(sat => ({
        ...sat,
        lat: parseFloat((sat.lat + (Math.random() - 0.5) * 0.02).toFixed(4)),
        lng: parseFloat((sat.lng + (Math.random() - 0.5) * 0.02).toFixed(4)),
        health: Math.max(0, Math.min(100, parseFloat((sat.health + (Math.random() - 0.5) * 0.1).toFixed(1)))),
      })));
      setSyncProgress(0);
    }, UPDATE_INTERVAL);
    const progressInterval = setInterval(() => setSyncProgress(prev => Math.min(100, prev + 2.5)), 50);
    return () => { clearInterval(interval); clearInterval(progressInterval); };
  }, []);

  const filteredSats = useMemo(() => {
    let result = sats;
    if (filterSource !== 'ALL') {
      result = result.filter(sat => sat.source.toUpperCase().includes(filterSource.toUpperCase()));
    }
    const searchTerms = `${globalSearchTerm} ${localSearch}`.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (searchTerms.length > 0) {
      result = result.filter(sat => {
        const searchable = `${sat.id} ${sat.source} ${sat.purpose} ${sat.launchAgency} ${sat.countryCode} ${sat.orbitType} ${sat.resolution}`.toLowerCase();
        return searchTerms.every(t => searchable.includes(t));
      });
    }
    return result;
  }, [sats, filterSource, localSearch, globalSearchTerm]);

  const activeSat = useMemo(() => sats.find(s => s.id === selectedSatId), [sats, selectedSatId]);
  const pinnedSats = useMemo(() => sats.filter(s => pinnedIds.has(s.id)), [sats, pinnedIds]);

  const togglePin = (id: string) => {
    setPinnedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleRowClick = (sat: SatelliteState) => {
    onSatSelect(sat.id);
    setShowModal(true);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-[2rem] p-8 backdrop-blur-2xl relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-950/40">
        <div className="h-full bg-sky-500/60 transition-all duration-75 ease-linear" style={{ width: `${syncProgress}%` }}></div>
      </div>

      {pinnedSats.length > 0 && (
        <div className="mb-10 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-[10px] font-black text-sky-400 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
            <svg className="w-3 h-3 fill-sky-500" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1.323l3.954 2.103a1 1 0 01.546.885V14a1 1 0 01-1-1H5a1 1 0 01-1-1V7.311a1 1 0 01.546-.885L8.5 4.323V3a1 1 0 011-1z"/></svg>
            Tactical HUD Overlays
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pinnedSats.map(ps => (
              <div key={ps.id} onClick={() => handleRowClick(ps)} className="bg-slate-950/60 border border-sky-500/30 rounded-2xl p-4 cursor-pointer hover:border-sky-500/60 transition-all relative">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-[10px] font-black text-white uppercase">{ps.id} <span className="text-slate-500 text-[8px] ml-1">[{ps.launchAgency}]</span></div>
                  <div className={`w-1.5 h-1.5 rounded-full ${ps.health > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                </div>
                <div className="text-[8px] text-slate-500 font-mono truncate mb-2">{ps.purpose}</div>
                <div className="flex justify-between font-mono text-[9px] text-sky-400">
                  <span>RES: {ps.resolution}</span>
                  <span>{ps.orbitType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-[0.4em] mb-1">Planetary Registry Feed</h2>
            <p className="text-[10px] text-slate-500 font-mono">Synchronizing global observation constellations...</p>
          </div>
          <div className="flex p-1 bg-slate-950/90 border border-slate-800 rounded-2xl overflow-x-auto scrollbar-hide">
            {['ALL', 'Sentinel', 'Landsat', 'ISRO', 'Weather', 'Radar'].map((s) => (
              <button key={s} onClick={() => setFilterSource(s === 'ALL' ? 'ALL' : s.toUpperCase())}
                className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all
                  ${filterSource.includes(s.toUpperCase()) || (filterSource === 'ALL' && s === 'ALL') ? 'bg-sky-500 text-slate-950' : 'text-slate-600 hover:text-slate-300'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <input type="text" value={localSearch} onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Filter by ID, Launch Origin, Payload, Resolution or Sensor Tech..."
          className="w-full bg-slate-950/40 border border-slate-800 rounded-2xl px-6 py-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500/50" />
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-separate border-spacing-y-3 min-w-[1200px]">
          <thead>
            <tr className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] px-8">
              <th className="px-6 pb-2">Registry_ID</th>
              <th className="px-6 pb-2">Launch_Origin</th>
              <th className="px-6 pb-2">Spatial_Resolution</th>
              <th className="px-6 pb-2">Temporal_Revisit</th>
              <th className="px-6 pb-2">Orbital_Profile</th>
              <th className="px-6 pb-2">Integrity</th>
              <th className="px-6 pb-2 text-right">Ops_Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredSats.map((sat) => (
              <tr key={sat.id} onClick={() => handleRowClick(sat)} className={`cursor-pointer transition-all duration-300 border border-transparent ${selectedSatId === sat.id ? 'bg-sky-500/10 border-sky-500/30' : 'bg-slate-950/40 hover:bg-sky-950/10'}`}>
                <td className="px-6 py-4 rounded-l-2xl">
                  <div className={`text-[11px] font-mono font-black ${selectedSatId === sat.id ? 'text-white' : 'text-sky-400'}`}>{sat.id}</div>
                  <div className="text-[8px] text-slate-600 font-mono mt-0.5">{sat.source}</div>
                </td>
                <td className="px-6 py-4">
                  <AgencyBadge agency={sat.launchAgency} country={sat.countryCode} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="text-[10px] font-mono text-emerald-400 font-black">{sat.resolution}</div>
                    <div className="text-[7px] text-slate-500 font-mono uppercase tracking-widest mt-0.5">Ground Sampling</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="text-[10px] font-mono text-amber-500 font-black">{sat.revisitTime}</div>
                    <div className="text-[7px] text-slate-500 font-mono uppercase tracking-widest mt-0.5">Temporal Cadence</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="text-[10px] font-mono text-slate-300 font-black uppercase">{sat.orbitType}</div>
                    <div className="text-[7px] text-slate-500 font-mono uppercase tracking-widest mt-0.5">Alt: {sat.alt}km</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${sat.health > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${sat.health}%` }}></div>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400">{sat.health}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 rounded-r-2xl text-right">
                  <StatusIcon status={sat.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && activeSat && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/98 backdrop-blur-xl animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-[3rem] overflow-hidden flex flex-col h-[85vh]">
            <div className="p-8 border-b border-slate-800 flex justify-between items-start bg-slate-950/20">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-sky-500/10 border border-sky-500/30 rounded-2xl flex items-center justify-center text-3xl">📡</div>
                <div>
                  <h3 className="text-4xl font-black text-white uppercase">{activeSat.id}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <AgencyBadge agency={activeSat.launchAgency} country={activeSat.countryCode} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                    <span className="text-[10px] text-sky-500 font-mono uppercase tracking-widest">{activeSat.source}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => togglePin(activeSat.id)} className={`p-4 rounded-2xl ${pinnedIds.has(activeSat.id) ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                   <svg className="w-5 h-5" fill={pinnedIds.has(activeSat.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                </button>
                <button onClick={() => setShowModal(false)} className="p-4 hover:bg-slate-800 rounded-2xl text-slate-500"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-10 space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
                    <div className="text-[9px] text-slate-500 font-black uppercase mb-4 tracking-widest">Governance</div>
                    <div className="text-xl font-black text-white">{activeSat.launchAgency}</div>
                    <div className="text-[10px] text-sky-400 mt-1 font-mono uppercase">Primary Operator</div>
                  </div>
                  <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
                    <div className="text-[9px] text-slate-500 font-black uppercase mb-4 tracking-widest">Resolution</div>
                    <div className="text-xl font-black text-emerald-400">{activeSat.resolution}</div>
                    <div className="text-[10px] text-emerald-500/60 mt-1 font-mono uppercase">Spatial Accuracy</div>
                  </div>
                  <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
                    <div className="text-[9px] text-slate-500 font-black uppercase mb-4 tracking-widest">Temporal</div>
                    <div className="text-xl font-black text-white">{activeSat.revisitTime}</div>
                    <div className="text-[10px] text-amber-400 mt-1 font-mono uppercase">Revisit Frequency</div>
                  </div>
                  <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
                    <div className="text-[9px] text-slate-500 font-black uppercase mb-4 tracking-widest">Dynamics</div>
                    <div className="text-xl font-black text-white">{activeSat.orbitType}</div>
                    <div className="text-[10px] text-rose-400 mt-1 font-mono uppercase">Orbital Profile</div>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="bg-slate-950/40 p-8 rounded-[2rem] border border-slate-800">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Mission Strategic Profile</h4>
                    <p className="text-slate-300 leading-relaxed text-sm">
                      The {activeSat.id} platform is a critical component of the {activeSat.countryCode} orbital infrastructure, operated primarily by {activeSat.launchAgency}. 
                      Launched to support global {activeSat.purpose.toLowerCase()}, it utilizes sensors to provide consistent 
                      high-fidelity planetary data. Current health metrics are at {activeSat.health}% with a revisit window of {activeSat.revisitTime}.
                    </p>
                  </div>

                  <div className="bg-slate-950/40 p-8 rounded-[2rem] border border-slate-800">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Sensor Payload Integrity</h4>
                    <div className="space-y-6">
                      {activeSat.dataTypes.map((sensor, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between items-end">
                            <span className="text-[11px] font-black text-white uppercase tracking-tight">{sensor.name}</span>
                            <span className="text-[10px] font-mono text-sky-400">{sensor.availability}% Available</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ease-out ${sensor.availability > 95 ? 'bg-emerald-500' : sensor.availability > 90 ? 'bg-sky-500' : 'bg-amber-500'}`} 
                              style={{ width: `${sensor.availability}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TelemetryFeed;
