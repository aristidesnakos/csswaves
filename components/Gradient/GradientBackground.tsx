'use client';
import React, { useState, useRef } from 'react';
import GradientDisplay from './GradientDisplay';
import HorizontalWaveAnimation from './HorizontalWaveAnimation';
import CircularWaveAnimation from './CircularWaveAnimation';
import ColorPickers from './ColorPickers';
import ExportCode from '@/components/utils/ExportCode';
import ExportGif from '@/components/utils/ExportGif';
import { toPng } from 'html-to-image';

type AnimationType = 'gradient' | 'horizontalWave' | 'circularWave';

const GradientBackground: React.FC = () => {
  const [colors, setColors] = useState(['#ff00cc', '#3333ff']);
  const [animationDuration, setAnimationDuration] = useState(10);
  const [animationType, setAnimationType] = useState<AnimationType>('gradient');
  const animationRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const renderAnimation = () => {
    switch (animationType) {
      case 'gradient':
        return <GradientDisplay colors={colors} animationDuration={animationDuration} />;
      case 'horizontalWave':
        return <HorizontalWaveAnimation colors={colors} animationDuration={animationDuration} />;
      case 'circularWave':
        return <CircularWaveAnimation colors={colors} animationDuration={animationDuration} />;
    }
  };

  const exportPNG = async () => {
    if (animationRef.current) {
      try {
        setIsExporting(true);
        const dataUrl = await toPng(animationRef.current, { quality: 0.95 });
        const link = document.createElement('a');
        link.download = `${animationType}-animation.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error exporting PNG:', error);
      } finally {
        setIsExporting(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
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
        
        <div className="mb-8 h-64 relative overflow-hidden rounded-lg shadow-lg" ref={animationRef}>
          {renderAnimation()}
        </div>
        
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
        
        <div className="flex gap-4 mb-4">
          <button 
            onClick={exportPNG} 
            disabled={isExporting}
            className="px-6 py-2 mt-4 font-semibold text-white bg-blue-500 rounded-lg shadow-lg disabled:bg-blue-300 hover:bg-blue-600 transition-colors"
          >
            {isExporting ? 'Exporting...' : 'Export as PNG'}
          </button>
          <ExportGif
            colors={colors}
            duration={animationDuration}
            animationType={animationType}
            animationRef={animationRef}
          />
        </div>
        
        <ExportCode colors={colors} animationDuration={animationDuration} animationType={animationType} />
      </div>
    </div>
  );
};

export default GradientBackground;