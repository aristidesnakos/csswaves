import React, { useState } from 'react';
import GIF from 'gif.js';
import { renderGradientFrame, renderHorizontalWaveFrame, renderCircularWaveFrame } from './AnimationUtils';

interface ExportGifProps {
  colors: string[];
  duration: number;
  animationType: 'gradient' | 'horizontalWave' | 'circularWave';
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const ExportGif: React.FC<ExportGifProps> = ({ colors, duration, animationType, canvasRef }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    if (!canvasRef.current) return;

    setIsExporting(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Unable to get canvas context');

      const fps = 30;
      const frames = duration * fps;

      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: canvas.width,
        height: canvas.height,
        workerScript: '/gif.worker.js',
      });

      const renderFrame = (progress: number) => {
        switch (animationType) {
          case 'gradient':
            renderGradientFrame(ctx, colors, progress, canvas.width, canvas.height);
            break;
          case 'horizontalWave':
            renderHorizontalWaveFrame(ctx, colors, progress, canvas.width, canvas.height);
            break;
          case 'circularWave':
            renderCircularWaveFrame(ctx, colors, progress, canvas.width, canvas.height);
            break;
        }
      };

      for (let i = 0; i < frames; i++) {
        const progress = i / frames;
        renderFrame(progress);
        gif.addFrame(ctx, { copy: true, delay: 1000 / fps });
      }

      gif.on('finished', (blob: Blob) => {
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