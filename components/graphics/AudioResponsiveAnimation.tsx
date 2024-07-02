import React, { useRef, useEffect, useState } from 'react';
import { renderGradientFrame, renderCircularWaveFrame, renderTsunamiWaveFrame } from '@/components/utils/AnimationUtils';

interface AudioResponsiveAnimationProps {
  colors: string[];
  animationType: 'gradient' | 'standingWave' | 'tsunami';
  width: number;
  height: number;
}

const AudioResponsiveAnimation: React.FC<AudioResponsiveAnimationProps> = ({
  colors,
  animationType,
  width,
  height
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const setupAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;
        setIsListening(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    const render = () => {
      if (!analyserRef.current || !isListening) return;

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      // Calculate audio reactivity
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      const normalizedReactivity = average / 255; // 0 to 1

      switch (animationType) {
        case 'gradient':
          renderGradientFrame(ctx, colors, normalizedReactivity, width, height);
          break;
        case 'standingWave':
          renderCircularWaveFrame(ctx, colors, normalizedReactivity, width, height);
          break;
        case 'tsunami':
          renderTsunamiWaveFrame(ctx, colors, normalizedReactivity, width, height);
          break;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    setupAudio();
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [colors, animationType, width, height, isListening]);

  return (
    <div>
      <canvas ref={canvasRef} width={width} height={height} />
      <button onClick={() => setIsListening(!isListening)}>
        {isListening ? 'Stop' : 'Start'} Audio Responsive Animation
      </button>
    </div>
  );
};

export default AudioResponsiveAnimation;