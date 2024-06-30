import React, { useState } from 'react';
import { animationToGif } from './GradientToGif';

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
      const blob = await animationToGif({
        colors,
        width: animationRef.current.clientWidth,
        height: animationRef.current.clientHeight,
        duration,
        fps: 30,
        animationType
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${animationType}-animation.gif`;
      link.click();
    } catch (error) {
      console.error('Error exporting GIF:', error);
      setError('Failed to export GIF. Please try again.');
    } finally {
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