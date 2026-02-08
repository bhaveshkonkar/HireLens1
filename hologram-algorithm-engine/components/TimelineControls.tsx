
import React from 'react';

interface TimelineControlsProps {
  totalSteps: number;
  currentStep: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (step: number) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

const TimelineControls: React.FC<TimelineControlsProps> = ({
  totalSteps,
  currentStep,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onSeek,
  speed,
  onSpeedChange,
  isMinimized,
  onToggleMinimize
}) => {
  const progress = Math.round((currentStep / Math.max(1, totalSteps - 1)) * 100);

  if (isMinimized) {
    return (
      <div className="flex items-center justify-center w-full group relative">
        <button 
          onClick={onPlayPause}
          className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center text-white hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/30 active:scale-95"
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
            <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
        {/* Toggle to Expand */}
        <button 
          onClick={onToggleMinimize}
          className="absolute -top-1 -right-1 w-5 h-5 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 8h16M4 16h16" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center gap-6 p-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-1">
        <button 
          onClick={onPrev}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={onPlayPause}
          className="w-11 h-11 bg-indigo-500 rounded-2xl flex items-center justify-center text-white hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/30 active:scale-95"
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>

        <button 
          onClick={onNext}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-[10px] text-slate-500 font-black uppercase tracking-widest px-1">
          <span>{totalSteps ? `Step ${currentStep + 1} / ${totalSteps}` : 'No active trace'}</span>
          <span>{progress}%</span>
        </div>
        <div className="relative h-1.5 group">
          <input 
            type="range"
            min={0}
            max={totalSteps ? totalSteps - 1 : 0}
            value={currentStep}
            onChange={(e) => onSeek(parseInt(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="w-full h-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.4)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Playback</span>
          <select 
            value={speed}
            onChange={(e) => onSpeedChange(parseInt(e.target.value))}
            className="bg-transparent text-slate-200 text-xs font-bold outline-none cursor-pointer hover:text-indigo-400 transition-colors"
          >
            <option value={2000}>0.5x</option>
            <option value={1000}>1.0x</option>
            <option value={500}>2.0x</option>
            <option value={250}>4.0x</option>
          </select>
        </div>
        
        <button 
          onClick={onToggleMinimize}
          className="p-2 text-slate-600 hover:text-slate-400 rounded-xl transition-all border border-slate-800 hover:bg-slate-800"
          title="Minimize Scrubber"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TimelineControls;
