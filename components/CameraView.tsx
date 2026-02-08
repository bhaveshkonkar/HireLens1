
import React, { useEffect, useRef } from 'react';

interface CameraViewProps {
  isActive: boolean;
  className?: string;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

export const CameraView: React.FC<CameraViewProps> = ({ isActive, className, videoRef: providedRef }) => {
  const localRef = useRef<HTMLVideoElement>(null);
  const videoRef = providedRef || localRef;

  useEffect(() => {
    // If a ref is provided externally, we assume parent manages the stream
    if (providedRef) return;

    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    if (isActive) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive]);

  return (
    <div className={`relative overflow-hidden bg-slate-900 rounded-2xl shadow-2xl ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover transform -scale-x-100"
      />
      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-500">
          <p>Camera Disabled</p>
        </div>
      )}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-xs font-semibold text-white uppercase tracking-widest bg-black/40 px-2 py-1 rounded">LIVE</span>
      </div>
    </div>
  );
};
