
import React from 'react';

interface CodeEditorProps {
  code: string;
  setCode: (c: string) => void;
  input: string;
  setInput: (i: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  activeLine: number;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode, input, setInput, onAnalyze, isLoading, activeLine }) => {
  const lines = code.split('\n');

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between mb-3 px-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Source Code</label>
          <div className="w-2 h-2 rounded-full bg-indigo-500/40"></div>
        </div>
        <div className="relative flex-1 bg-slate-950/50 border border-slate-800 rounded-2xl overflow-hidden font-mono text-xs">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="absolute inset-0 w-full h-full bg-transparent text-slate-300 p-6 outline-none resize-none leading-relaxed z-10 selection:bg-indigo-500/40"
            spellCheck={false}
          />
          <div className="absolute top-0 left-0 w-full pointer-events-none p-6 pt-6">
            {lines.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-[1.5rem] -mx-6 px-6 w-[calc(100%+3rem)] transition-colors duration-200 ${activeLine === idx + 1 ? 'bg-indigo-500/10 border-l-4 border-indigo-500' : ''}`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Initial Input</label>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. [1, 5, 10]"
          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3.5 text-slate-200 font-mono text-[11px] focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700"
        />
      </div>

      <button
        onClick={onAnalyze}
        disabled={isLoading}
        className={`w-full py-4 rounded-2xl font-bold uppercase tracking-[0.15em] text-[11px] transition-all flex items-center justify-center
          ${isLoading 
            ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
            : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-xl shadow-indigo-500/20 active:scale-[0.97]'
          }`}
      >
        {isLoading ? (
          <span className="flex items-center gap-3">
            <svg className="animate-spin h-4 w-4 text-white/50" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Trace
          </span>
        ) : (
          'Run Visualization'
        )}
      </button>
    </div>
  );
};

export default CodeEditor;
