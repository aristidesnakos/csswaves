'use client';
import React, { useState, useRef, useEffect } from 'react';
import ColorPickers from './ColorPickers';
import ExportCode from '@/components/utils/ExportCode';
import ExportGif from '@/components/utils/ExportGif';
import { renderGradientFrame, renderCircularWaveFrame, renderTsunamiWaveFrame } from '@/components/utils/AnimationUtils';
import useAudioAnalyzer from '@/hooks/useAudioAnalyzer';

type AnimationType = 'gradient' | 'standingWave' | 'tsunami';

const GraphicsBackground: React.FC = () => {
  const [colors, setColors] = useState(['#5538F6', '#FFFFFF']);
  const [animationDuration, setAnimationDuration] = useState(10);
  const [isAudioResponsive, setIsAudioResponsive] = useState(false);
  const [animationType, setAnimationType] = useState<AnimationType>('standingWave');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { audioData, isListening, toggleListening } = useAudioAnalyzer();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationFrameId: number;
    let startTime: number;

    const render = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = ((timestamp - startTime) / 1000 / animationDuration) % 1;

      const { width, height } = canvas.getBoundingClientRect();

      const reactivity = isAudioResponsive && audioData ? audioData.average / 255 : progress;

      switch (animationType) {
        case 'gradient':
          renderGradientFrame(ctx, colors, reactivity, width, height);
          break;
        case 'standingWave':
          renderCircularWaveFrame(ctx, colors, reactivity, width, height);
          break;
        case 'tsunami':
          renderTsunamiWaveFrame(ctx, colors, reactivity, width, height);
          break;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [colors, animationDuration, animationType, isAudioResponsive, audioData]);

  const handleAudioToggle = () => {
    setIsAudioResponsive(!isAudioResponsive);
    toggleListening();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Animation type selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Select Animation Type</h3>
          <div className="flex gap-4">
            {[
              { type: 'gradient', icon: '🌈' },
              { type: 'standingWave', icon: '🌀' },
              { type: 'tsunami', icon: '🌊' }
            ].map(({ type, icon }) => (
              <label key={type} className="flex flex-col items-center">
                <input
                  type="radio"
                  name="animationType"
                  value={type}
                  checked={animationType === type}
                  onChange={() => setAnimationType(type as AnimationType)}
                  className="sr-only"
                />
                <div className={`w-16 h-16 flex items-center justify-center text-3xl rounded-lg cursor-pointer ${animationType === type ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                  {icon}
                </div>
                <span className="mt-2 text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mb-8">
          <canvas
            ref={canvasRef}
            className="w-full h-96 rounded-lg"
            style={{ width: '100%', height: '400px' }}
          />
          
          {/* <button
            onClick={handleAudioToggle}
            className="px-6 py-2 mt-4 font-semibold text-white bg-purple-500 rounded-lg shadow-lg"
          >
            {isAudioResponsive ? 'Disable' : 'Enable'} Audio Responsive Mode
          </button> */}
        </div>
        
        <div className='flex flex-col md:flex-row justify-between items-start gap-8 mb-8'>
          <ColorPickers colors={colors} setColors={setColors} />
          {/* <div className="flex-grow">
            <label htmlFor="animation-duration" className="block text-sm font-medium text-gray-700 mb-1">
              Animation Duration (seconds)
            </label>
            <input
              id="animation-duration"
              type="range"
              min="5"
              max="30"
              value={animationDuration}
              onChange={(e) => setAnimationDuration(Number(e.target.value))}
              className="w-full"
            />
            <span>{animationDuration}s</span>
          </div> */}
        </div>
        
        <div className="flex gap-4 mb-4">
          <ExportGif
            colors={colors}
            duration={10}
            animationType={animationType}
            canvasRef={canvasRef}
          />
        </div>
        
        <ExportCode colors={colors} animationDuration={animationDuration} animationType={animationType} />
      </div>
    </div>
  );
};

export default GraphicsBackground;