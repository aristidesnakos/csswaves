import React from 'react';

interface TsunamiWaveAnimationProps {
  colors: string[];
  animationDuration: number;
}

const TsunamiWaveAnimation: React.FC<TsunamiWaveAnimationProps> = ({ colors, animationDuration }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: colors[0],
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '5%',
          bottom: '10%',
          width: '20%',
          height: '20%',
          borderRadius: '50%',
          background: colors[1],
          opacity: 0.8,
          animation: `riseCelestialObject ${animationDuration}s linear infinite`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '200%',
          height: '60%',
          background: `linear-gradient(90deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
          animation: `tsunamiWave ${animationDuration}s linear infinite`,
        }}
      />
      <style jsx>{`
        @keyframes tsunamiWave {
          0% { transform: translateX(0) scaleY(1); }
          50% { transform: translateX(-25%) scaleY(1.5); }
          100% { transform: translateX(-50%) scaleY(1); }
        }
        @keyframes riseCelestialObject {
          0% { transform: translateY(100%) scale(0.8); }
          50% { transform: translateY(0) scale(1); }
          100% { transform: translateY(100%) scale(0.8); }
        }
      `}</style>
    </div>
  );
};

export default TsunamiWaveAnimation;