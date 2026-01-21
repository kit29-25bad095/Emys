
import React from 'react';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onSearchSubmit: (val: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, onSearchChange, onSearchSubmit }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearchSubmit(searchTerm);
    }
  };

  return (
    <header className="px-6 py-4 flex flex-col md:flex-row items-center justify-between border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md sticky top-0 z-[60] gap-4">
      <div className="flex items-center gap-8 w-full md:w-auto">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-black text-white text-lg">T</div>
          <span className="text-lg font-black tracking-tighter text-white uppercase">Terra<span className="text-sky-500">Fusion</span></span>
        </div>
        
        <nav className="hidden xl:flex items-center gap-6">
          <a href="#" className="text-[10px] font-bold text-sky-400 uppercase tracking-widest border-b border-sky-400 pb-1">Operations</a>
          <a href="#" className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest pb-1">Data Catalog</a>
          <a href="#" className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest pb-1">AI Pipeline</a>
        </nav>
      </div>

      {/* Unified Global Search Bar */}
      <div className="flex-1 max-w-2xl w-full px-0 md:px-8">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-slate-500 group-focus-within:text-sky-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search system nodes, satellites, regions, or run analysis..."
            className="block w-full bg-slate-900/50 border border-slate-800 focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 rounded-xl py-2 pl-10 pr-4 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none transition-all"
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <span className="hidden sm:inline text-[9px] font-mono text-slate-700 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">ENTER TO ANALYZE</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="hidden lg:flex flex-col items-end mr-4">
           <span className="text-[10px] font-mono text-slate-500 uppercase">Secure Uplink</span>
           <span className="text-[10px] font-mono text-emerald-400">AUTHENTICATED</span>
        </div>
        <button className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center p-0.5">
           <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
             <img src="https://picsum.photos/40/40" alt="Avatar" className="w-full h-full object-cover opacity-80" />
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
