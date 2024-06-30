'use client';
import React, { useState, useRef, useEffect } from 'react';
import GradientDisplay from './GradientDisplay';
import HorizontalWaveAnimation from './HorizontalWaveAnimation';
import CircularWaveAnimation from './CircularWaveAnimation';
import ColorPickers from './ColorPickers';
import AccessibilityControls from './AccessibilityControls';
import AccessibilityScore from './AccessibilityScore';
import ExportGif from '@/components/utils/ExportGif';
import ExportCode from '@/components/utils/ExportCode';
import { getContrastRatio } from '@/libs/utils';

type AnimationType = 'gradient' | 'horizontalWave' | 'circularWave';

const GradientBackground: React.FC = () => {
  const [colors, setColors] = useState(['#ff00cc', '#3333ff']);
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  const [accessibilityScore, setAccessibilityScore] = useState(0);
  const [animationDuration, setAnimationDuration] = useState(10);
  const [animationType, setAnimationType] = useState<AnimationType>('gradient');
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    calculateAccessibilityScore();
  }, [colors, isAnimationPaused]);

  const calculateAccessibilityScore = () => {
    let score = 0;
    const contrastRatio = getContrastRatio(colors[0], colors[1]);
    if (contrastRatio >= 4.5) score += 50;
    else if (contrastRatio >= 3) score += 25;
    if (isAnimationPaused) score += 50;
    setAccessibilityScore(score);
  };

  const renderAnimation = () => {
    switch (animationType) {
      case 'gradient':
        return (
          <GradientDisplay
            ref={gradientRef}
            colors={colors}
            isAnimationPaused={isAnimationPaused}
            animationDuration={animationDuration}
          />
        );
      case 'horizontalWave':
        return (
          <HorizontalWaveAnimation
            colors={colors}
            animationDuration={animationDuration}
            isAnimationPaused={isAnimationPaused}
          />
        );
      case 'circularWave':
        return (
          <CircularWaveAnimation
            colors={colors}
            animationDuration={animationDuration}
            isAnimationPaused={isAnimationPaused}
          />
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Gradient Generator</h2>
        <div className="mb-8 h-64">
          {renderAnimation()}
        </div>
        <div className='flex flex-col md:flex-row justify-between items-start gap-8 mb-8'>
          <ColorPickers colors={colors} setColors={setColors} />
          <AccessibilityControls
            isAnimationPaused={isAnimationPaused}
            setIsAnimationPaused={setIsAnimationPaused}
          />
        </div>
        <div className="mb-8">
          <label htmlFor="animation-type" className="block text-sm font-medium text-gray-700 mb-1">
            Animation Type
          </label>
          <select
            id="animation-type"
            value={animationType}
            onChange={(e) => setAnimationType(e.target.value as AnimationType)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="gradient">Simple Gradient</option>
            <option value="horizontalWave">Horizontal Wave</option>
            <option value="circularWave">Circular Wave</option>
          </select>
        </div>
        <div className="mb-8">
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
        <AccessibilityScore score={accessibilityScore} />
        <ExportGif colors={colors} duration={animationDuration} animationType={animationType} />
        <ExportCode colors={colors} animationDuration={animationDuration} animationType={animationType} />
      </div>
    </div>
  );
};

export default GradientBackground;