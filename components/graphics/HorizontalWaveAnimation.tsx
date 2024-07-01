import React from 'react';

interface HorizontalWaveAnimationProps {
  colors: string[];
  animationDuration: number;
}

const HorizontalWaveAnimation: React.FC<HorizontalWaveAnimationProps> = ({ colors, animationDuration }) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: colors[0] }}>
      <svg
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '200%',
          height: '100%',
          animation: `waveAnimation ${animationDuration}s linear infinite`,
        }}
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill={colors[1]}
          fillOpacity="1"
          d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
      <svg
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '200%',
          height: '100%',
          animation: `waveAnimation ${animationDuration * 0.75}s linear infinite`,
        }}
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill={colors[1]}
          fillOpacity="0.5"
          d="M0,320L48,288C96,256,192,192,288,176C384,160,480,192,576,208C672,224,768,224,864,213.3C960,203,1056,181,1152,170.7C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
      <style jsx>{`
        @keyframes waveAnimation {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default HorizontalWaveAnimation;