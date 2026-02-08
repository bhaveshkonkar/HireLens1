
import React, { useEffect, useRef } from 'react';

interface VoiceVisualizerProps {
  isListening: boolean;
  isSpeaking: boolean;
  analyzer?: AnalyserNode;
}

const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ isListening, isSpeaking, analyzer }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    const bufferLength = analyzer ? analyzer.frequencyBinCount : 64;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrame = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (analyzer) {
        analyzer.getByteFrequencyData(dataArray);
      } else if (!isListening && !isSpeaking) {
        // Flat line if nothing happening
        dataArray.fill(0);
      } else {
        // Fake data for visual effect if no analyzer yet
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = Math.random() * 50 + (isListening || isSpeaking ? 50 : 0);
        }
      }

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height;
        
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        if (isSpeaking) {
          gradient.addColorStop(0, '#3b82f6'); // Blue
          gradient.addColorStop(1, '#60a5fa');
        } else if (isListening) {
          gradient.addColorStop(0, '#10b981'); // Green
          gradient.addColorStop(1, '#34d399');
        } else {
          gradient.addColorStop(0, '#475569'); // Gray
          gradient.addColorStop(1, '#94a3b8');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();
    return () => cancelAnimationFrame(animationFrame);
  }, [analyzer, isListening, isSpeaking]);

  return (
    <div className="relative w-full h-16 bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
      <canvas ref={canvasRef} className="w-full h-full" width={400} height={64} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 opacity-50">
          {isSpeaking ? 'Interviewer Speaking' : isListening ? 'Listening to You' : 'Standby'}
        </span>
      </div>
    </div>
  );
};

export default VoiceVisualizer;
