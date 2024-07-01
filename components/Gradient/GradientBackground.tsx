'use client';
import React, { useState, useRef, useEffect } from 'react';
import ColorPickers from './ColorPickers';
import ExportCode from '@/components/utils/ExportCode';
import ExportGif from '@/components/utils/ExportGif';
import { renderGradientFrame, renderHorizontalWaveFrame, renderCircularWaveFrame } from '@/components/utils/AnimationUtils';

type AnimationType = 'gradient' | 'horizontalWave' | 'circularWave';

const GradientBackground: React.FC = () => {
  const [colors, setColors] = useState(['#ff00cc', '#3333ff']);
  const [animationDuration, setAnimationDuration] = useState(10);
  const [animationType, setAnimationType] = useState<AnimationType>('gradient');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let startTime: number;

    const render = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = ((timestamp - startTime) / 1000 / animationDuration) % 1;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      switch (animationType) {
        case 'gradient':
          renderGradientFrame(ctx, colors, progress, canvas.width, canvas.height);
          break;
        case 'horizontalWave':
          renderHorizontalWaveFrame(ctx, colors, progress, canvas.width, canvas.height);
          break;
        case 'circularWave':
          renderCircularWaveFrame(ctx, colors, progress, canvas.width, canvas.height);
          break;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [colors, animationDuration, animationType]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Animation type selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Select Animation Type</h3>
          <div className="flex gap-4">
            {[
              { type: 'gradient', icon: '🌈' },
              { type: 'horizontalWave', icon: '🌊' },
              { type: 'circularWave', icon: '🌀' }
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
        
        {/* Animation display */}
        <div className="mb-8 h-64 relative overflow-hidden rounded-lg shadow-lg">
          <canvas
            ref={canvasRef}
            width={640}
            height={256}
            className="w-full h-full"
          />
        </div>
        
        {/* Color pickers and duration slider */}
        <div className='flex flex-col md:flex-row justify-between items-start gap-8 mb-8'>
          <ColorPickers colors={colors} setColors={setColors} />
          <div className="flex-grow">
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
          </div>
        </div>
        
        {/* Export buttons */}
        <div className="flex gap-4 mb-4">
          <ExportGif
            colors={colors}
            duration={animationDuration}
            animationType={animationType}
            canvasRef={canvasRef}
          />
        </div>
        
        {/* Export code */}
        <ExportCode colors={colors} animationDuration={animationDuration} animationType={animationType} />
      </div>
    </div>
  );
};

export default GradientBackground;