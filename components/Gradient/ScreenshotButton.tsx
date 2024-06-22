import React from 'react';
import * as htmlToImage from 'html-to-image';
import styles from './GradientBackground.module.css';

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
    <button onClick={handleScreenshot} className={styles.screenshotButton}>
      Take a screenshot
    </button>
  );
};

export default ScreenshotButton;