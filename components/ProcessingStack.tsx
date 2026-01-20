
import React from 'react';
import { PROCESSING_LAYERS } from '../constants';

interface ProcessingStackProps {
  activeLayerId: string | null;
  onSelectLayer: (id: string, query: string) => void;
}

const ProcessingStack: React.FC<ProcessingStackProps> = ({ activeLayerId, onSelectLayer }) => {
  return (
    <div className="flex flex-col gap-3 py-6 relative">
      {/* Animated Data Path Line */}
      <div className="absolute left-10 top-12 bottom-12 w-[2px] bg-slate-800">
        <div className="absolute top-0 w-full h-20 bg-gradient-to-b from-transparent via-sky-500 to-transparent animate-[dataFlow_3s_infinite_linear]"></div>
      </div>

      {PROCESSING_LAYERS.map((layer, index) => {
        const isActive = activeLayerId === layer.id;
        
        return (
          <div key={layer.id} className="relative group">
            <button 
              onClick={() => onSelectLayer(layer.id, layer.sampleQuery)}
              className={`w-full text-left flex items-start gap-6 p-4 rounded-xl border transition-all duration-500 backdrop-blur-md outline-none
                ${isActive 
                  ? 'bg-sky-950/20 border-sky-500/60 ring-1 ring-sky-500/20' 
                  : 'bg-slate-900/40 border-slate-800/60 hover:border-sky-500/40'}`}
            >
              {/* Index indicator */}
              <div className={`absolute -left-3 top-8 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-950 border flex items-center justify-center text-[10px] font-mono transition-colors z-10
                ${isActive ? 'border-sky-500 text-sky-400' : 'border-slate-800 text-slate-500 group-hover:text-sky-400'}`}>
                0{index + 1}
              </div>

              <div className={`w-12 h-12 flex items-center justify-center text-xl rounded-lg border transition-all shrink-0
                ${isActive 
                  ? 'bg-sky-900/40 border-sky-500/50 text-sky-400' 
                  : 'bg-slate-800/50 border-slate-700/50 group-hover:bg-sky-950/30 group-hover:border-sky-500/30'}`}>
                {layer.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={`text-sm font-bold transition-colors truncate uppercase tracking-tight
                    ${isActive ? 'text-sky-400' : 'text-slate-200 group-hover:text-sky-400'}`}>
                    {layer.name}
                  </h3>
                  {isActive && (
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20 animate-pulse">
                      FOCUSED
                    </span>
                  )}
                </div>
                <p className={`text-[11px] mt-1 leading-snug transition-colors
                  ${isActive ? 'text-slate-300' : 'text-slate-500 group-hover:text-slate-400'}`}>
                  {isActive ? layer.detailedInfo : layer.description}
                </p>
                
                {isActive && (
                  <div className="mt-3 pt-3 border-t border-sky-500/20 flex gap-2">
                    <span className="text-[9px] font-mono text-sky-500 uppercase tracking-widest">Analysis Triggered</span>
                    <div className="flex-1 h-[1px] bg-sky-500/20 self-center"></div>
                  </div>
                )}
              </div>

              <div className="hidden xl:flex flex-col items-end gap-1 shrink-0">
                 <div className="flex gap-1">
                   <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-sky-400' : 'bg-sky-500'}`}></div>
                   <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-sky-400/80' : 'bg-sky-500/50'}`}></div>
                   <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-sky-400/60' : 'bg-sky-500/20'}`}></div>
                 </div>
                 <span className={`text-[9px] font-mono uppercase transition-colors
                   ${isActive ? 'text-sky-400' : 'text-slate-500 group-hover:text-sky-500/80'}`}>
                   {isActive ? 'SYNCING...' : 'Processing...'}
                 </span>
              </div>
            </button>
          </div>
        );
      })}

      <style>{`
        @keyframes dataFlow {
          0% { transform: translateY(-100%); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(400%); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ProcessingStack;
