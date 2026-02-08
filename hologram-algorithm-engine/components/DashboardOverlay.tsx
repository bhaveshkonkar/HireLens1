
import React, { useState } from 'react';
import { AlgorithmMetadata } from '../types';

interface DashboardOverlayProps {
  metadata: AlgorithmMetadata | null;
  currentStepIndex: number;
  isLoading?: boolean;
}

const DashboardOverlay: React.FC<DashboardOverlayProps> = ({ metadata, currentStepIndex, isLoading }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const name = metadata?.name || (isLoading ? "Syncing..." : "Offline");
  const type = metadata?.type || "Waiting for signal";

  return (
    <div className={`bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl transition-all duration-500 ease-out overflow-hidden ${isMinimized ? 'w-14 h-14' : 'w-72'}`}>
      <div className={`flex items-center justify-between p-4 ${!isMinimized ? 'border-b border-slate-800/50' : ''}`}>
        {!isMinimized && (
          <div className="flex flex-col overflow-hidden pl-1">
            <h2 className="text-white text-xs font-black truncate uppercase tracking-tight">{name}</h2>
            <span className="text-[9px] text-indigo-400 uppercase tracking-[0.2em] font-bold mt-0.5">{type}</span>
          </div>
        )}
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className={`flex items-center justify-center transition-all ${isMinimized ? 'w-full h-full' : 'p-2 hover:bg-slate-800 rounded-xl'}`}
        >
          {isMinimized ? (
            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          ) : (
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M18 12H6" /></svg>
          )}
        </button>
      </div>

      {!isMinimized && (
        <div className="p-5 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-800/40">
              <span className="block text-[8px] text-slate-500 font-black uppercase mb-1 tracking-widest">Temporal</span>
              <span className="text-[10px] text-slate-200 font-mono font-black">{metadata?.timeComplexity || "---"}</span>
            </div>
            <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-800/40">
              <span className="block text-[8px] text-slate-500 font-black uppercase mb-1 tracking-widest">Spatial</span>
              <span className="text-[10px] text-slate-200 font-mono font-black">{metadata?.spaceComplexity || "---"}</span>
            </div>
          </div>

          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/40">
             <div className="flex justify-between items-center mb-2">
                <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Trace State</span>
                <span className="text-[9px] text-indigo-400 font-mono font-bold">RAW_DUMP</span>
             </div>
             <p className="text-[10px] font-mono text-slate-400 break-all leading-tight opacity-80">
               {metadata ? JSON.stringify(metadata.steps[currentStepIndex].state).slice(0, 80) + "..." : "System dormant"}
             </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverlay;
