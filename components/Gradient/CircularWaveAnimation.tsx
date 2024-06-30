import React from 'react';

interface CircularWaveAnimationProps {
  colors: string[];
  animationDuration: number;
}

const CircularWaveAnimation: React.FC<CircularWaveAnimationProps> = ({ colors, animationDuration }) => {
  const backgroundColor = colors[0] || '#2C74B3';
  const waveColor = colors[1] || '#FFFFFF';

  const waveStyle = `
    @keyframes animate {
      0% {
        transform: translate(-50%, -75%) rotate(0deg);
      }
      100% {
        transform: translate(-50%, -75%) rotate(360deg);
      }
    }
  `;

  return (
    <div className="relative w-64 h-64 mx-auto">
      <style>{waveStyle}</style>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full border-5 border-white rounded-full overflow-hidden shadow-lg">
        <div className="relative w-full h-full" style={{ background: backgroundColor }}>
          <div 
            className="absolute top-0 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-3/4 rounded-[45%]"
            style={{
              background: waveColor,
              animation: `animate ${animationDuration}s linear infinite`,
            }}
          />
          <div 
            className="absolute top-0 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-3/4 rounded-[40%]"
            style={{
              background: `${waveColor}80`,
              animation: `animate ${animationDuration * 2}s linear infinite`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CircularWaveAnimation;