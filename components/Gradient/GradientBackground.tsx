'use client';
import React, { useState, useRef, useEffect } from 'react';
import GradientDisplay from './GradientDisplay';
import ColorPickers from './ColorPickers';
import BubbleSettings from './BubbleSettings';
import AccessibilityControls from './AccessibilityControls';
import AccessibilityScore from './AccessibilityScore';
import { getContrastRatio } from '@/libs/utils';

const GradientBackground: React.FC = () => {
  const [colors, setColors] = useState(['#ff00cc', '#3333ff']);
  const [bubbleColor, setBubbleColor] = useState('#ffffff');
  const [bubbleSpeed, setBubbleSpeed] = useState(1);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  const [accessibilityScore, setAccessibilityScore] = useState(0);
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
  }, [colors, bubbleColor, bubbleSpeed, isAnimationPaused]);

  const calculateAccessibilityScore = () => {
    let score = 0;

    const contrastRatio = getContrastRatio(colors[0], colors[1]);
    if (contrastRatio >= 4.5) score += 30;
    else if (contrastRatio >= 3) score += 15;

    const bubbleContrastRatio = getContrastRatio(bubbleColor, colors[0]);
    if (bubbleContrastRatio >= 4.5) score += 30;
    else if (bubbleContrastRatio >= 3) score += 15;

    if (bubbleSpeed <= 3) score += 20;
    if (isAnimationPaused) score += 20;

    setAccessibilityScore(score);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Gradient Generator</h2>
        <GradientDisplay
          ref={gradientRef}
          colors={colors}
          bubbleColor={bubbleColor}
          bubbleSpeed={bubbleSpeed}
          containerSize={containerSize}
          isAnimationPaused={isAnimationPaused}
        />
        <div className='flex flex-col md:flex-row justify-between items-start gap-8 mb-8'>
          <ColorPickers colors={colors} setColors={setColors} />
          <BubbleSettings
            bubbleColor={bubbleColor}
            setBubbleColor={setBubbleColor}
            bubbleSpeed={bubbleSpeed}
            setBubbleSpeed={setBubbleSpeed}
          />
          <AccessibilityControls
            isAnimationPaused={isAnimationPaused}
            setIsAnimationPaused={setIsAnimationPaused}
          />
        </div>

        <AccessibilityScore score={accessibilityScore} />
      </div>
    </div>
  );
};

export default GradientBackground;