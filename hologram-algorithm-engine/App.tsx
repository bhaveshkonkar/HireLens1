
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { analyzeAlgorithm } from './geminiService';
import { AlgorithmMetadata, SimulationStep } from './types';
import HologramRenderer from './components/HologramRenderer';
import CodeEditor from './components/CodeEditor';
import TimelineControls from './components/TimelineControls';
import DashboardOverlay from './components/DashboardOverlay';
import CameraLayer from './components/CameraLayer';

const DEFAULT_CODE = `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`;

const DEFAULT_INPUT = "arr: [1, 3, 5, 7, 9, 11, 13, 15], target: 7";

const App: React.FC = () => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [inputData, setInputData] = useState(DEFAULT_INPUT);
  const [algoMetadata, setAlgoMetadata] = useState<AlgorithmMetadata | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const [isTimelineMinimized, setIsTimelineMinimized] = useState(true);
  
  const timerRef = useRef<any>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const result = await analyzeAlgorithm(code, inputData);
      setAlgoMetadata(result);
      setCurrentStepIndex(0);
      setIsPlaying(false);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = useCallback(() => {
    if (!algoMetadata) return;
    setCurrentStepIndex((prev) => (prev < algoMetadata.steps.length - 1 ? prev + 1 : prev));
  }, [algoMetadata]);

  const prevStep = useCallback(() => {
    setCurrentStepIndex((prev) => (prev > 0 ? prev - 1 : 0));
  }, []);

  useEffect(() => {
    if (isPlaying && algoMetadata) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < algoMetadata.steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, algoMetadata, playbackSpeed]);

  const currentStep = algoMetadata?.steps[currentStepIndex] || null;

  return (
    <div className="relative h-screen w-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      {/* Absolute Background Camera Layer */}
      <CameraLayer />

      {/* Main UI Overlay - Use transparency to let camera through */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <header className="h-20 px-10 flex items-center justify-between shrink-0 bg-slate-950/60 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center space-x-5">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/30">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white leading-none">AlgoFlow</h1>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.4em] mt-1.5 opacity-80">Virtual Camera Interface</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {isLoading && (
              <div className="flex items-center space-x-3 text-indigo-400 text-[11px] font-black tracking-widest animate-pulse">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span>SYNCING_NEURAL_TRACE</span>
              </div>
            )}
            {!isLoading && algoMetadata && (
              <div className="bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20 text-[10px] font-black text-indigo-300 tracking-widest uppercase">
                {algoMetadata.steps.length} Simulation Cycles
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden p-8 gap-8">
          {/* Sidebar Panel */}
          <aside className="w-[340px] flex flex-col">
            <div className="flex-1 bg-slate-900/70 backdrop-blur-2xl border border-white/5 rounded-[40px] p-8 shadow-2xl flex flex-col overflow-hidden">
              <CodeEditor 
                code={code} 
                setCode={setCode} 
                input={inputData} 
                setInput={setInputData} 
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
                activeLine={currentStep?.codeLine || 0}
              />
            </div>
          </aside>

          {/* Visualizer Canvas */}
          <section className="flex-1 relative flex flex-col">
            <div className="flex-1 bg-transparent rounded-[40px] overflow-hidden relative border border-white/5">
               <HologramRenderer 
                metadata={algoMetadata} 
                currentStep={currentStep}
                onManualAction={() => setIsPlaying(false)}
              />
              
              {/* Floating Dashboard */}
              <div className="absolute top-10 right-10 z-40">
                <DashboardOverlay 
                  metadata={algoMetadata} 
                  currentStepIndex={currentStepIndex}
                  isLoading={isLoading}
                />
              </div>

              {/* Description HUD */}
              {currentStep && (
                <div className="absolute top-10 left-10 max-w-sm z-30">
                  <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/5 p-6 rounded-3xl shadow-2xl">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] block mb-3">Cycle Insight</span>
                    <p className="text-sm text-slate-100 leading-relaxed font-medium">
                      {currentStep.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Timeline Control Island */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 w-full px-8 transition-all duration-700 ease-in-out" style={{ maxWidth: isTimelineMinimized ? '140px' : '900px' }}>
          <div className="bg-slate-900/80 backdrop-blur-3xl border border-white/10 p-3 rounded-[32px] shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
            <TimelineControls 
              totalSteps={algoMetadata?.steps.length || 0}
              currentStep={currentStepIndex}
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onNext={nextStep}
              onPrev={prevStep}
              onSeek={setCurrentStepIndex}
              speed={playbackSpeed}
              onSpeedChange={setPlaybackSpeed}
              isMinimized={isTimelineMinimized}
              onToggleMinimize={() => setIsTimelineMinimized(!isTimelineMinimized)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
