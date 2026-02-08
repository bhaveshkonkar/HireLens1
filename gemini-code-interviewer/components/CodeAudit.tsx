import React, { useState, useEffect } from 'react';
import { CodeAuditService, AuditResult } from '../services/codeAuditService';
import CodeEditor from './CodeEditor';

interface AuditProps {
  code: string;
  language: string;
  onClose: () => void;
  question?: string;
}

const CodeAudit: React.FC<AuditProps> = ({ code: initialCode, language, onClose, question }) => {
  const [code, setCode] = useState<string>(initialCode);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null);

  useEffect(() => {
    const runAudit = async () => {
      setIsLoading(true);
      try {
        const result = await CodeAuditService.analyzeCode(code, language, question);
        setAuditResult(result);
      } catch (error) {
        console.error('Audit failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    runAudit();
  }, [code, language, question]);

  const issuesByCategory = auditResult ? {
    correctness: auditResult.issues.filter(i => i.category === 'correctness'),
    efficiency: auditResult.issues.filter(i => i.category === 'efficiency'),
    structure: auditResult.issues.filter(i => i.category === 'structure'),
    'best-practice': auditResult.issues.filter(i => i.category === 'best-practice')
  } : { correctness: [], efficiency: [], structure: [], 'best-practice': [] };

  const filteredIssues = selectedCategory && auditResult
    ? issuesByCategory[selectedCategory as keyof typeof issuesByCategory]
    : auditResult?.issues || [];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    if (score >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed inset-0 bg-[#020617] text-slate-100 overflow-hidden selection:bg-blue-500/30 font-sans z-50 flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.1),transparent)] pointer-events-none"></div>

      {/* Header */}
      <header className="relative flex items-center justify-between px-8 py-4 border-b border-slate-800/50 bg-slate-900/20 backdrop-blur-xl z-20">
        <div className="flex items-center space-x-4">
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative p-2 bg-slate-900 rounded-lg border border-slate-700">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">CODE AUDIT</h1>
            <div className="flex items-center space-x-2">
              <span className="flex h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse"></span>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Analysis Engine</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-rose-900/20 hover:text-rose-400 text-slate-400 px-5 py-2.5 rounded-lg transition-all font-bold border border-slate-700 active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>Close Audit</span>
        </button>
      </header>

      {/* Main UI */}
      <main className="relative flex-grow flex p-4 space-x-4 overflow-hidden z-10">
        {/* Code Editor Container */}
        <div className="flex-grow flex flex-col h-full min-w-0">
          <CodeEditor 
            code={code} 
            onChange={setCode} 
            language={language} 
          />
        </div>

        {/* Audit Results Sidebar */}
        <div className="w-[360px] flex flex-col space-y-4 h-full flex-shrink-0">
          
          {isLoading && (
            <div className="relative aspect-video bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Analyzing...</p>
              </div>
            </div>
          )}

          {!isLoading && auditResult && (
            <div className="flex flex-col bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/50 flex-grow shadow-2xl overflow-hidden min-h-0">
              {/* Header */}
              <div className="p-4 border-b border-slate-800/50 flex items-center justify-between bg-slate-800/20">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m-9 9a9 9 0 1 1 18 0 9 9 0 0 1-18 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Code Audit</p>
                    <p className="text-xs font-bold text-slate-200">Analysis Complete</p>
                  </div>
                </div>
              </div>

              {/* Results Content */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar min-h-0">
                
                {/* Overall Score */}
                <div className="bg-slate-800/40 rounded-lg p-4 space-y-2 border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase">Overall Score</span>
                    <span className={`text-2xl font-black ${getScoreColor(auditResult.scores.overall)}`}>
                      {Math.round(auditResult.scores.overall)}
                    </span>
                  </div>
                </div>

                {/* Dimension Scores */}
                <div className="bg-slate-800/40 rounded-lg p-3 space-y-3 border border-slate-700/50">
                  {[
                    { label: 'Correctness', score: auditResult.scores.correctness, color: getScoreColor(auditResult.scores.correctness) },
                    { label: 'Efficiency', score: auditResult.scores.efficiency, color: getScoreColor(auditResult.scores.efficiency) },
                    { label: 'Readability', score: auditResult.scores.readability, color: getScoreColor(auditResult.scores.readability) },
                    { label: 'Best Practices', score: auditResult.scores.bestPractices, color: getScoreColor(auditResult.scores.bestPractices) }
                  ].map((item) => (
                    <div key={item.label} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-slate-300">{item.label}</span>
                        <span className={`text-xs font-bold ${item.color}`}>{Math.round(item.score)}</span>
                      </div>
                      <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${item.color.replace('text', 'bg')}`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20 space-y-2">
                  <p className="text-[10px] font-black text-blue-300 uppercase">Recommendation</p>
                  <p className="text-xs text-blue-200 leading-relaxed">{auditResult.summary.finalRecommendation}</p>
                </div>

                {/* Issues */}
                {auditResult.issues.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase">Issues Found</p>
                      <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded">{auditResult.issues.length}</span>
                    </div>
                    
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`text-[9px] font-bold px-2 py-1 rounded transition-all ${
                          selectedCategory === null
                            ? 'bg-slate-300 text-slate-900'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        All
                      </button>
                      {Object.entries(issuesByCategory).map(([cat, issues]) => {
                        if (issues.length === 0) return null;
                        return (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`text-[9px] font-bold px-2 py-1 rounded transition-all ${
                              selectedCategory === cat
                                ? 'bg-purple-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                          >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </button>
                        );
                      })}
                    </div>

                    {/* Issues List */}
                    <div className="space-y-1">
                      {filteredIssues.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-[10px] text-slate-500">No issues in this category</p>
                        </div>
                      ) : (
                        filteredIssues.map((issue, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-800/60 rounded border border-slate-700/50 overflow-hidden hover:bg-slate-800/80 transition-all"
                          >
                            <button
                              onClick={() => setExpandedIssue(expandedIssue === idx ? null : idx)}
                              className="w-full flex items-start space-x-2 p-2 text-left"
                            >
                              <div className="flex-shrink-0 mt-0.5">
                                {issue.severity === 'critical' && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                                {issue.severity === 'high' && <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                                {issue.severity === 'medium' && <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />}
                                {issue.severity === 'low' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                              </div>
                              <div className="flex-grow min-w-0">
                                <p className="text-[9px] font-semibold text-slate-100 leading-tight">{issue.message}</p>
                              </div>
                              <svg
                                className={`w-3 h-3 text-slate-500 flex-shrink-0 transition-transform ${
                                  expandedIssue === idx ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                              </svg>
                            </button>

                            {expandedIssue === idx && issue.suggestion && (
                              <div className="px-2 pb-2 border-t border-slate-700/50 bg-slate-900/50">
                                <p className="text-[8px] font-bold text-slate-400 mb-1 uppercase">Fix</p>
                                <p className="text-[8px] text-slate-300 leading-tight">{issue.suggestion}</p>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-2 border-t border-slate-800/50 bg-slate-900/40 backdrop-blur-md flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase tracking-widest z-20">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 rounded-full mr-2 shadow-sm bg-purple-500 shadow-purple-500/50"></div>
            <span>Status: Audit Complete</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-slate-700">Protected Workspace</span>
          <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
          <span>Audit v1.0</span>
        </div>
      </footer>
    </div>
  );
};

export default CodeAudit;
