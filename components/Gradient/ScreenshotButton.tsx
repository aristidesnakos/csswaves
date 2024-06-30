import React from 'react';
import * as htmlToImage from 'html-to-image';

interface ScreenshotButtonProps {
  targetId: string;
}

const ScreenshotButton: React.FC<ScreenshotButtonProps> = ({ targetId }) => {
  const handleScreenshot = () => {
    const target = document.getElementById(targetId);
    if (target) {
      htmlToImage.toPng(target)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = 'gradient.png';
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error('Error taking screenshot:', error);
        });
    }
  };

  return (
    <button 
      onClick={handleScreenshot} 
      className="px-6 py-2 mt-4 font-semibold text-white bg-purple-500 rounded-lg shadow-lg">
      Take a screenshot
    </button>
  );
};

export default ScreenshotButton;