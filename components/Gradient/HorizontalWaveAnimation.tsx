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
  const gradientColor = colors[0] || '#440099';
  const waveColor = colors[1] || '#fcc900';

  const waveStyle = `
    @keyframes wave {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-20px);
      }
    }

    .wave-container {
      position: relative;
      width: 100%;
      height: 100%;
      background-color: ${gradientColor};
      overflow: hidden;
    }

    .wave {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 40%;
      background-color: ${waveColor};
    }

    .wave::before,
    .wave::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 100%;
      background-repeat: repeat-x;
    }

    .wave::before {
      height: 20px;
      background-image: radial-gradient(circle at 10px -5px, transparent 12px, ${waveColor} 13px);
      background-size: 20px 20px;
      animation: wave ${animationDuration * 0.5}s ease-in-out infinite;
      animation-play-state: ${isAnimationPaused ? 'paused' : 'running'};
    }

    .wave::after {
      height: 15px;
      background-image: radial-gradient(circle at 10px -5px, transparent 12px, ${waveColor} 13px);
      background-size: 40px 20px;
      animation: wave ${animationDuration * 0.7}s ease-in-out infinite;
      animation-play-state: ${isAnimationPaused ? 'paused' : 'running'};
      opacity: 0.5;
    }
  `;

  return (
    <div className="w-full h-full">
      <style>{waveStyle}</style>
      <div className="wave-container">
        <div className="wave"></div>
      </div>
    </div>
  );
};

export default HorizontalWaveAnimation;