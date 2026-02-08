
import React from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, language }) => {
  const lineCount = code.split('\n').length;

  return (
    <div className="flex flex-col h-full w-full bg-[#1e1e1e] rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-slate-800">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Solution.{language === 'typescript' ? 'tsx' : 'js'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
           <span className="text-[10px] text-slate-500 px-2 py-0.5 bg-slate-800 rounded">{language}</span>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-grow flex font-mono text-sm overflow-hidden relative group">
        {/* Line Numbers */}
        <div className="bg-[#1e1e1e] text-[#858585] text-right py-4 pr-4 pl-3 select-none border-r border-[#333]">
          {Array.from({ length: Math.max(lineCount, 25) }).map((_, i) => (
            <div key={i} className="leading-6 h-6">{i + 1}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="flex-grow bg-transparent text-[#d4d4d4] p-4 resize-none focus:outline-none leading-6 h-full w-full caret-blue-500"
          placeholder="// Start coding your solution here..."
          style={{ 
            fontFamily: "'Fira Code', monospace",
            whiteSpace: 'pre',
            overflowY: 'auto'
          }}
        />
        
        {/* Subtle Hint */}
        <div className="absolute bottom-4 right-4 text-[10px] text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Type to begin...
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
