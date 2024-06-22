import React from 'react';
import styles from './GradientBackground.module.css';

interface GradientDisplayProps {
  colors: string[];
  duration: number;
}

const GradientDisplay: React.FC<GradientDisplayProps> = ({ colors, duration }) => (
  <div
    className={styles.animatedGradient}
    style={{
      background: `linear-gradient(270deg, ${colors.join(', ')})`,
      animationDuration: `${duration}s`
    }}
  />
);

export default GradientDisplay;