
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';

interface CameraBackgroundProps {
  onFrame?: (video: HTMLVideoElement) => void;
}

export interface CameraHandle {
  video: HTMLVideoElement | null;
}

const CameraBackground = forwardRef<CameraHandle, CameraBackgroundProps>(({ onFrame }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onFrameRef = useRef(onFrame);
  
  // Keep the callback ref updated
  useEffect(() => {
    onFrameRef.current = onFrame;
  }, [onFrame]);

  useImperativeHandle(ref, () => ({
    video: videoRef.current
  }));

  useEffect(() => {
    let mounted = true;
    
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        
        if (!mounted || !videoRef.current) return;
        
        videoRef.current.srcObject = stream;
        
        // Explicitly play the video
        videoRef.current.onloadedmetadata = async () => {
          if (!mounted || !videoRef.current) return;
          try {
            await videoRef.current.play();
            // Notify parent whenever video is ready
            if (onFrameRef.current && videoRef.current) {
              onFrameRef.current(videoRef.current);
            }
          } catch (playErr) {
            console.error("Error playing video:", playErr);
          }
        };
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
    
    startCamera();

    return () => {
      mounted = false;
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-0 bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover opacity-80"
        style={{ transform: 'scaleX(-1)' }}
      />
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />
    </div>
  );
});

CameraBackground.displayName = 'CameraBackground';

export default CameraBackground;
