import React from 'react';
import { CodeFeedback } from '../services/codeFeedbackService';

interface CodeFeedbackDisplayProps {
  feedback: CodeFeedback;
  isLoading?: boolean;
}

const CodeFeedbackDisplay: React.FC<CodeFeedbackDisplayProps> = ({ feedback, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full gap-3">
        <div className="w-6 h-6 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-sm text-slate-400">Analyzing your code...</span>
      </div>
    );
  }

  const verdictColor = {
    PASS: 'from-green-500 to-emerald-500',
    PARTIAL: 'from-yellow-500 to-orange-500',
    FAIL: 'from-red-500 to-rose-500'
  }[feedback.verdict];

  const verdictBgColor = {
    PASS: 'bg-green-500/10 border-green-500/30',
    PARTIAL: 'bg-yellow-500/10 border-yellow-500/30',
    FAIL: 'bg-red-500/10 border-red-500/30'
  }[feedback.verdict];

  const verdictTextColor = {
    PASS: 'text-green-400',
    PARTIAL: 'text-yellow-400',
    FAIL: 'text-red-400'
  }[feedback.verdict];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500/10 border-red-500/20 text-red-300';
      case 'MAJOR':
        return 'bg-orange-500/10 border-orange-500/20 text-orange-300';
      case 'MINOR':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300';
      default:
        return 'bg-slate-500/10 border-slate-500/20 text-slate-300';
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-h-[90vh] overflow-y-auto">
      {/* Verdict & Score Header */}
      <div className={`p-6 rounded-2xl border ${verdictBgColor} bg-gradient-to-br ${verdictColor} bg-opacity-5`}>
        <div className="flex items-start justify-between">
          <div>
            <p className={`text-sm font-black uppercase tracking-widest mb-2 ${verdictTextColor}`}>
              Verdict: {feedback.verdict}
            </p>
            <h3 className="text-4xl font-black text-white mb-2">
              {feedback.overallScore}/100
            </h3>
            <p className="text-slate-300 text-sm">
              {feedback.verdict === 'PASS'
                ? '✓ Code is correct and well-structured!'
                : feedback.verdict === 'PARTIAL'
                ? '⚠ Code has some issues that need fixing'
                : '✗ Code has critical errors that prevent it from working'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 mb-1">Algorithm</p>
            <p className="text-lg font-bold text-slate-200">{feedback.algorithmType}</p>
            <div className="mt-4 space-y-1 text-xs text-slate-400">
              <p>⏱️ {feedback.timeComplexity}</p>
              <p>💾 {feedback.spaceComplexity}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Analysis Sections */}
      <div className="space-y-4">
        {/* Correctness */}
        <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
          <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
            Correctness Analysis
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed">{feedback.correctnessAnalysis}</p>
        </div>

        {/* Efficiency */}
        <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
          <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-500 rounded-full" />
            Efficiency Analysis
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed">{feedback.efficiencyAnalysis}</p>
        </div>

        {/* Code Quality */}
        <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5">
          <h4 className="text-xs font-black text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full" />
            Code Quality & Readability
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed">{feedback.readabilityAnalysis}</p>
        </div>

        {/* Best Practices */}
        <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
          <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full" />
            Best Practices
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed">{feedback.bestPracticesAnalysis}</p>
        </div>
      </div>

      {/* Issues Found */}
      {feedback.issuesFound && feedback.issuesFound.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            Issues Found ({feedback.issuesFound.length})
          </h4>
          {feedback.issuesFound.map((issue, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${getSeverityColor(issue.severity)}`}>
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-sm font-bold mb-1">{issue.issue}</p>
                  <p className="text-xs leading-relaxed mb-2 opacity-90">{issue.explanation}</p>
                  <div className="bg-black/30 rounded p-2 mt-2">
                    <p className="text-xs font-mono mb-1 text-slate-400">Suggested Fix:</p>
                    <p className="text-xs text-slate-300">{issue.suggestedFix}</p>
                  </div>
                </div>
                <span className={`text-xs font-black px-2 py-1 rounded whitespace-nowrap mt-1`}>
                  {issue.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Strengths */}
      {feedback.strengths && feedback.strengths.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-black text-green-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            Strengths ({feedback.strengths.length})
          </h4>
          <div className="space-y-2">
            {feedback.strengths.map((strength, idx) => (
              <div key={idx} className="p-3 bg-green-500/5 border border-green-500/20 rounded-lg flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <p className="text-sm text-slate-300">{strength}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvements */}
      {feedback.improvements && feedback.improvements.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full" />
            Improvement Suggestions ({feedback.improvements.length})
          </h4>
          <div className="space-y-2">
            {feedback.improvements.map((improvement, idx) => (
              <div key={idx} className="p-3 bg-orange-500/5 border border-orange-500/20 rounded-lg flex items-start gap-3">
                <span className="text-orange-400 mt-1">→</span>
                <p className="text-sm text-slate-300">{improvement}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Execution Steps */}
      {feedback.executionSteps && feedback.executionSteps.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-black text-teal-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-500 rounded-full" />
            Execution Flow ({feedback.executionSteps.length} steps)
          </h4>
          <div className="space-y-2">
            {feedback.executionSteps.map((step, idx) => (
              <div key={idx} className="p-3 bg-teal-500/5 border border-teal-500/20 rounded-lg flex gap-3">
                <span className="text-teal-400 font-bold text-sm min-w-[2rem]">{idx + 1}.</span>
                <p className="text-sm text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeFeedbackDisplay;
