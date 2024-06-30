import React, { useCallback, useState } from 'react';
import GIF from 'gif.js';
import html2canvas from 'html2canvas';

interface ExportGifProps {
  targetId: string;
  duration: number;
}

const ExportGif: React.FC<ExportGifProps> = ({ targetId, duration }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const captureFrame = useCallback(async (target: HTMLElement) => {
    try {
      const canvas = await html2canvas(target, {
        logging: false,
        useCORS: true,
        scale: 1,
        backgroundColor: null
      });
      return canvas;
    } catch (error) {
      console.error('Error capturing frame:', error);
      throw error;
    }
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    const target = document.getElementById(targetId);
    if (!target) {
      setError('Target element not found');
      setIsExporting(false);
      return;
    }

    try {
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: target.offsetWidth,
        height: target.offsetHeight,
        transparent: 'rgba(0,0,0,0)'
      });

      const frames = 30; // Reduced number of frames for better performance
      const interval = duration * 1000 / frames;

      for (let i = 0; i < frames; i++) {
        const canvas = await captureFrame(target);
        gif.addFrame(canvas, { delay: interval, copy: true });
      }

      gif.on('finished', (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'gradient-animation.gif';
        link.click();
        setIsExporting(false);
      });

      gif.render();
    } catch (error) {
      console.error('Error exporting GIF:', error);
      setError('Failed to export GIF. Please try again.');
      setIsExporting(false);
    }
  };

  return (
    <div>
      <button 
        onClick={handleExport} 
        disabled={isExporting}
        className="px-6 py-2 mt-4 font-semibold text-white bg-green-500 rounded-lg shadow-lg disabled:bg-green-300"
      >
        {isExporting ? 'Exporting...' : 'Export as GIF'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ExportGif;