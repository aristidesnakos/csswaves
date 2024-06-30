import React, { forwardRef } from 'react';
import BubbleAnimation from './BubbleAnimation';
import styles from './GradientBackground.module.css';

interface GradientDisplayProps {
  colors: string[];
  bubbleColor: string;
  bubbleSpeed: number;
  containerSize: { width: number; height: number };
  isAnimationPaused: boolean;
}

const GradientDisplay = forwardRef<HTMLDivElement, GradientDisplayProps>(
  ({ colors, bubbleColor, bubbleSpeed, containerSize, isAnimationPaused }, ref) => {
    const gradientStyle = {
      background: `linear-gradient(to right, ${colors[0]}, ${colors[1]})`,
    };

    return (
      <div 
        ref={ref}
        style={gradientStyle} 
        id="gradient-display" 
        className={`${styles.animatedGradient} rounded-lg shadow-lg mb-8 relative overflow-hidden h-64`}
        role="img"
        aria-label={`Gradient from ${colors[0]} to ${colors[1]} with ${bubbleColor} bubbles`}
      >
        <BubbleAnimation 
          containerWidth={containerSize.width} 
          containerHeight={containerSize.height}
          bubbleColor={bubbleColor}
          bubbleSpeed={bubbleSpeed}
          isPaused={isAnimationPaused}
        />
      </div>
    );
  }
);

GradientDisplay.displayName = 'GradientDisplay';

export default GradientDisplay;