
import React from 'react';

interface CodeEditorProps {
  code?: string;
  onCodeChange?: (code: string) => void;
  onRun?: () => void;
  output?: string;
  language?: string;
  isMinimized?: boolean;
  onMinimizeToggle?: () => void;
  isLoading?: boolean;
  feedbackData?: { steps: string[]; bugs: string[]; complexity: string } | null;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  code = "", 
  onCodeChange, 
  onRun,
  output,
  isMinimized = false,
  onMinimizeToggle,
  isLoading = false,
  feedbackData = null
}) => {
  if (isMinimized) {
    return (
      <button 
        onClick={onMinimizeToggle}
        className="group relative flex items-center gap-3 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 transition-all pointer-events-auto shadow-2xl"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center gap-1">
          <div className="w-4 h-0.5 bg-blue-400 rounded-full" />
          <div className="w-4 h-0.5 bg-blue-400/60 rounded-full" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Restore Workspace</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-slate-950/70 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-auto font-mono pointer-events-auto resize" style={{ minWidth: 280, minHeight: 280 }}>
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-white/5">
        <div className="flex items-center gap-5">
          <div className="flex gap-1.5">
             <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
             <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
             <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30" />
          </div>
          <h2 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.3em]">IDE Command</h2>
        </div>
        <button onClick={onMinimizeToggle} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-all group">
          <div className="w-4 h-0.5 bg-slate-500 group-hover:bg-white transition-colors" />
        </button>
      </div>

      <div className="flex-1 flex flex-col p-8 overflow-hidden gap-6">
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          <div className={`${feedbackData ? 'flex-[0.6]' : 'flex-1'} relative overflow-hidden bg-black/60 rounded-3xl border border-white/5 shadow-inner`}>
            <textarea
              value={code}
              onChange={(e) => onCodeChange?.(e.target.value)}
              className="absolute inset-0 w-full h-full p-8 bg-transparent text-slate-300 text-[14px] resize-none outline-none focus:ring-0 leading-relaxed scrollbar-hide selection:bg-blue-500/40"
              spellCheck={false}
              placeholder="// Write your logic implementation here..."
            />
          </div>
          
          {/* AI Feedback Panel - Audit Feature */}
          {feedbackData && (
            <div className="flex-[0.4] overflow-y-auto bg-slate-900/80 rounded-3xl border border-blue-500/20 p-6 animate-in slide-in-from-bottom duration-500">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <h3 className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.3em]">AI Analysis Complete</h3>
              </div>
              
              {/* Step-by-Step Analysis */}
              <div className="mb-4 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                <h4 className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-3">Code Execution Flow</h4>
                <ul className="space-y-2">
                  {feedbackData.steps.map((step, i) => (
                    <li key={i} className="text-[11px] text-slate-300 leading-relaxed flex items-start gap-2">
                      <span className="text-blue-400 font-black">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Bugs/Issues */}
              {feedbackData.bugs.length > 0 && (
                <div className="mb-4 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                  <h4 className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-3">Issues Detected</h4>
                  <ul className="space-y-2">
                    {feedbackData.bugs.map((bug, i) => (
                      <li key={i} className="text-[11px] text-red-300/90 leading-relaxed flex items-start gap-2">
                        <span className="text-red-400">⚠</span>
                        <span>{bug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Complexity */}
              <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">Complexity Analysis</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">{feedbackData.complexity}</p>
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 flex justify-between items-center pt-4 border-t border-white/5">
           <div className="text-[10px] text-slate-600 italic font-bold uppercase tracking-widest">
             {isLoading ? "AI Agent Analyzing Code..." : feedbackData ? "Analysis Complete" : "Ready for Analysis"}
           </div>
           <button 
             onClick={onRun}
             disabled={isLoading}
             className={`group px-10 py-4 ${isLoading ? 'bg-slate-800 cursor-wait' : 'bg-orange-600/90 hover:bg-orange-500'} text-white font-black rounded-xl text-[10px] tracking-[0.2em] shadow-lg shadow-orange-900/20 transition-all active:scale-95 uppercase flex items-center justify-center gap-3 relative overflow-hidden`}
           >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
             {isLoading && <div className="w-2 h-2 bg-orange-400 rounded-full animate-ping" />}
             <span>{isLoading ? "Analyzing..." : feedbackData ? "Re-Analyse Code" : "Analyse Code"}</span>
             {!isLoading && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
           </button>
        </div>
      </div>
    </div>
  );
};
