import React from 'react';

interface GradientAnimationProps {
  colors: string[];
  animationDuration: number;
}

const GradientAnimation: React.FC<GradientAnimationProps> = ({ colors, animationDuration }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundImage: `linear-gradient(-45deg, ${colors.join(', ')})`,
        backgroundSize: '400% 400%',
        animation: `gradientAnimation ${animationDuration}s ease infinite`,
      }}
    >
      <style jsx>{`
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default GradientAnimation;