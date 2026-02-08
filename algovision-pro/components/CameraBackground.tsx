
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

interface CameraBackgroundProps {
  onFrame?: (video: HTMLVideoElement) => void;
}

export interface CameraHandle {
  video: HTMLVideoElement | null;
}

const CameraBackground = forwardRef<CameraHandle, CameraBackgroundProps>(({ onFrame }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useImperativeHandle(ref, () => ({
    video: videoRef.current
  }));

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Notify parent whenever video is ready
          videoRef.current.onloadedmetadata = () => {
            if (onFrame && videoRef.current) onFrame(videoRef.current);
          };
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, [onFrame]);

  return (
    <div className="fixed inset-0 w-full h-full z-0 bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />
    </div>
  );
});

export default CameraBackground;
