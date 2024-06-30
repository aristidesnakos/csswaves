import React, { useState } from 'react';
import { gradientToGif } from './GradientToGif';

interface ExportGifProps {
  colors: string[];
  duration: number;
}

const ExportGif: React.FC<ExportGifProps> = ({ colors, duration }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      const blob = await gradientToGif({
        colors,
        width: 300,
        height: 150,
        duration,
        fps: 30
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'gradient-animation.gif';
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
        className="px-6 py-2 mt-4 font-semibold text-white bg-green-500 rounded-lg shadow-lg disabled:bg-green-300"
      >
        {isExporting ? 'Exporting...' : 'Export as GIF'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ExportGif;