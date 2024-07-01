import React from 'react';

interface CircularWaveAnimationProps {
  colors: string[];
  animationDuration: number;
}

const CircularWaveAnimation: React.FC<CircularWaveAnimationProps> = ({ colors, animationDuration }) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: colors[0] }}>
      <svg
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '200%',
          height: '200%',
        }}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="circleGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={colors[1]} stopOpacity="1" />
            <stop offset="100%" stopColor={colors[1]} stopOpacity="0" />
          </radialGradient>
        </defs>
        <g>
          <circle cx="50" cy="50" r="50" fill={colors[0]} />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="url(#circleGradient)"
            style={{
              transformOrigin: 'center',
              animation: `pulseAnimation ${animationDuration}s ease-in-out infinite`,
            }}
          />
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="url(#circleGradient)"
            style={{
              transformOrigin: 'center',
              animation: `pulseAnimation ${animationDuration * 0.75}s ease-in-out infinite`,
            }}
          />
        </g>
      </svg>
      <style jsx>{`
        @keyframes pulseAnimation {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default CircularWaveAnimation;