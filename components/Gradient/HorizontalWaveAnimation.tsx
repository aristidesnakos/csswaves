import React from 'react';

interface HorizontalWaveAnimationProps {
  colors: string[];
  animationDuration: number;
  isAnimationPaused: boolean;
}

const HorizontalWaveAnimation: React.FC<HorizontalWaveAnimationProps> = ({ 
  colors, 
  animationDuration,
  isAnimationPaused
}) => {
  const backgroundColor = colors[0] || '#000000';
  const waveColors = [
    'rgba(255,255,255,0.7)',
    'rgba(255,255,255,0.5)',
    'rgba(255,255,255,0.3)',
    '#ffffff'
  ];

  const waveStyle = `
    .hero_area {
      position: relative;
      height: 100%;
      background-color: ${backgroundColor};
    }
    .waves {
      position: absolute;
      width: 100%;
      height: 15vh;
      min-height: 100px;
      max-height: 150px;
      bottom: 0;
      left: 0;
    }
    .parallax > use {
      animation: move-forever ${animationDuration}s cubic-bezier(.55, .5, .45, .5) infinite;
      animation-play-state: ${isAnimationPaused ? 'paused' : 'running'};
    }
    .parallax > use:nth-child(1) {
      animation-delay: -2s;
      animation-duration: ${animationDuration * 0.28}s;
    }
    .parallax > use:nth-child(2) {
      animation-delay: -3s;
      animation-duration: ${animationDuration * 0.4}s;
    }
    .parallax > use:nth-child(3) {
      animation-delay: -4s;
      animation-duration: ${animationDuration * 0.52}s;
    }
    .parallax > use:nth-child(4) {
      animation-delay: -5s;
      animation-duration: ${animationDuration * 0.8}s;
    }
    @keyframes move-forever {
      0% {
        transform: translate3d(-90px, 0, 0);
      }
      100% {
        transform: translate3d(85px, 0, 0);
      }
    }
    @media (max-width: 768px) {
      .waves {
        height: 40px;
        min-height: 40px;
      }
    }
  `;

  return (
    <div className="w-full h-full">
      <style>{waveStyle}</style>
      <div className="hero_area">
        <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="parallax">
            {waveColors.map((color, index) => (
              <use key={index} xlinkHref="#gentle-wave" x="48" y={index * 2} fill={color} />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default HorizontalWaveAnimation;