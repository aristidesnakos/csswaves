import React, { forwardRef, CSSProperties } from 'react';
import styles from './GradientBackground.module.css';
import { ensureHexColor } from '@/libs/colorUtils';

interface GradientDisplayProps {
  colors: string[];
  isAnimationPaused: boolean;
  animationDuration: number;
}

const GradientDisplay = forwardRef<HTMLDivElement, GradientDisplayProps>(
  ({ colors, isAnimationPaused, animationDuration }, ref) => {
    const gradientStyle: CSSProperties = {
      backgroundImage: `linear-gradient(-45deg, ${colors.map(ensureHexColor).join(', ')})`,
      animationDuration: `${animationDuration}s`,
      animationPlayState: isAnimationPaused ? 'paused' : 'running',
    };

    return (
      <div 
        ref={ref}
        style={gradientStyle} 
        id="gradient-display" 
        className={`${styles.animatedGradient} rounded-lg shadow-lg mb-8 relative overflow-hidden h-64`}
        role="img"
        aria-label={`Animated gradient with colors ${colors.join(', ')}`}
      />
    );
  }
);

GradientDisplay.displayName = 'GradientDisplay';

export default GradientDisplay;