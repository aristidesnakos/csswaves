'use client';
import React, { useState, useRef, useEffect } from 'react';
import GradientDisplay from './GradientDisplay';
import ColorPickers from './ColorPickers';
import AccessibilityControls from './AccessibilityControls';
import AccessibilityScore from './AccessibilityScore';
import ExportGif from '@/components/utils/ExportGif';
import { getContrastRatio } from '@/libs/utils';

const GradientBackground: React.FC = () => {
  const [colors, setColors] = useState(['#ff00cc', '#3333ff']);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  const [accessibilityScore, setAccessibilityScore] = useState(0);
  const [animationDuration, setAnimationDuration] = useState(10);
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (gradientRef.current) {
        setContainerSize({
          width: gradientRef.current.offsetWidth,
          height: gradientRef.current.offsetHeight
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Gradient Generator</h2>
        <GradientDisplay
          ref={gradientRef}
          colors={colors}
          isAnimationPaused={isAnimationPaused}
          animationDuration={animationDuration}
        />
        <div className='flex flex-col md:flex-row justify-between items-start gap-8 mb-8'>
          <ColorPickers colors={colors} setColors={setColors} />
          <AccessibilityControls
            isAnimationPaused={isAnimationPaused}
            setIsAnimationPaused={setIsAnimationPaused}
          />
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
        <ExportGif colors={colors} duration={animationDuration} />
      </div>
    </div>
  );
};

export default GradientBackground;