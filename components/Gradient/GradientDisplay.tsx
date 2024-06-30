import React, { forwardRef, CSSProperties } from 'react';
import BubbleAnimation from './BubbleAnimation';
import styles from './GradientBackground.module.css';
import { ensureHexColor } from '@/libs/colorUtils';

interface GradientDisplayProps {
  colors: string[];
  bubbleColor: string;
  bubbleSpeed: number;
  containerSize: { width: number; height: number };
  isAnimationPaused: boolean;
  animationDuration: number;
}

const GradientDisplay = forwardRef<HTMLDivElement, GradientDisplayProps>(
  ({ colors, bubbleColor, bubbleSpeed, containerSize, isAnimationPaused, animationDuration }, ref) => {
    const gradientStyle: CSSProperties = {
      background: `linear-gradient(-45deg, ${colors.map(ensureHexColor).join(', ')})`,
      backgroundSize: '400% 400%',
      animationPlayState: isAnimationPaused ? 'paused' : 'running',
      '--animation-duration': `${animationDuration}s`,
    } as CSSProperties;

    return (
      <div 
        ref={ref}
        style={gradientStyle} 
        id="gradient-display" 
        className={`${styles.animatedGradient} rounded-lg shadow-lg mb-8 relative overflow-hidden h-64`}
        role="img"
        aria-label={`Animated gradient with colors ${colors.join(', ')} and ${bubbleColor} bubbles`}
      >
        <BubbleAnimation 
          containerWidth={containerSize.width} 
          containerHeight={containerSize.height}
          bubbleColor={ensureHexColor(bubbleColor)}
          bubbleSpeed={bubbleSpeed}
          isPaused={isAnimationPaused}
        />
      </div>
    );
  }
);

GradientDisplay.displayName = 'GradientDisplay';

export default GradientDisplay;