import React, { useState } from 'react';
import GIF from 'gif.js';
import html2canvas from 'html2canvas';

interface ExportGifProps {
  colors: string[];
  duration: number;
  animationType: 'gradient' | 'horizontalWave' | 'circularWave';
  animationRef: React.RefObject<HTMLDivElement>;
}

const ExportGif: React.FC<ExportGifProps> = ({ colors, duration, animationType, animationRef }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    if (!animationRef.current) return;

    setIsExporting(true);
    setError(null);

    try {
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: animationRef.current.clientWidth,
        height: animationRef.current.clientHeight,
        workerScript: '/gif.worker.js'
      });

      const frames = 60; // Capture 60 frames for a smooth animation
      const frameInterval = duration * 1000 / frames;

      for (let i = 0; i < frames; i++) {
        const canvas = await html2canvas(animationRef.current, {
          scale: 1,
          allowTaint: true,
          useCORS: true
        });
        gif.addFrame(canvas, { delay: frameInterval, copy: true });
        await new Promise(resolve => setTimeout(resolve, frameInterval));
      }

      gif.on('finished', (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${animationType}-animation.gif`;
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
        className="px-6 py-2 mt-4 font-semibold text-white bg-green-500 rounded-lg shadow-lg disabled:bg-green-300 hover:bg-green-600 transition-colors"
      >
        {isExporting ? 'Exporting...' : 'Export as GIF'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ExportGif;