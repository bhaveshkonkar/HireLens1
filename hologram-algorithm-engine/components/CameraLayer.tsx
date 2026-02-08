
import React, { useEffect, useRef, useState } from 'react';

const CameraLayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<'initializing' | 'active' | 'denied' | 'blocked'>('initializing');
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false 
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        try {
          await videoRef.current.play();
          setStatus('active');
        } catch (playError) {
          console.warn("Autoplay blocked, waiting for user interaction");
          setStatus('blocked');
        }
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      setStatus('denied');
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-[#020617]">
      <div className="relative w-full h-full">
        {/* The Live Video Feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-1000 ${status === 'active' ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* HUD Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Scanline Effect Overlay */}
          <div className="absolute inset-0 opacity-[0.05]" 
               style={{ 
                 backgroundImage: 'linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 50%)', 
                 backgroundSize: '100% 4px' 
               }} />
          
          {/* Corner Status HUD */}
          <div className="absolute top-24 left-10 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500'}`}></div>
              <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] drop-shadow-md">
                {status === 'active' ? 'SENSOR_01 // LIVE' : 'SENSOR_01 // CONNECTING'}
              </span>
            </div>
            <span className="text-[8px] text-slate-500 font-mono tracking-widest uppercase ml-4">
              Buffer: 0.04ms | Latency: 12ms
            </span>
          </div>

          {/* Vignette */}
          <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.6)]" />
        </div>

        {/* Fallback / Interaction UI */}
        {(status === 'blocked' || status === 'initializing') && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto bg-slate-950/40 backdrop-blur-sm">
            <button 
              onClick={startCamera}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl transition-all active:scale-95"
            >
              Initialize Optical Sensor
            </button>
          </div>
        )}

        {status === 'denied' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950">
            <div className="w-12 h-12 rounded-full border border-rose-500 flex items-center justify-center text-rose-500">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <span className="text-[10px] text-rose-500 font-black uppercase tracking-[0.3em]">Hardware Access Refused</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraLayer;
