import React from 'react';
import ScreenshotButton from './ScreenshotButton';

interface AccessibilityControlsProps {
  isAnimationPaused: boolean;
  setIsAnimationPaused: React.Dispatch<React.SetStateAction<boolean>>;
}

const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  isAnimationPaused,
  setIsAnimationPaused,
}) => {
  const toggleAnimation = () => {
    setIsAnimationPaused(!isAnimationPaused);
  };

  return (
    <div className="flex justify-center gap-4 mb-8">
      <ScreenshotButton targetId="gradient-display" />
      <button
        onClick={toggleAnimation}
        className="px-6 py-2 mt-4 font-semibold text-black bg-lime-100 rounded-lg shadow-lg"
      >
        {isAnimationPaused ? 'Resume Animation' : 'Pause Animation'}
      </button>
    </div>
  );
};

export default AccessibilityControls;