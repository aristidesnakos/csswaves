import React from 'react';
import GIF from 'gif.js';

interface ExportGifProps {
  targetId: string;
  duration: number;
}

const ExportGif: React.FC<ExportGifProps> = ({ targetId, duration }) => {
  const handleExport = () => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: target.offsetWidth,
      height: target.offsetHeight,
    });

    const frames = 60;
    const interval = duration * 1000 / frames;

    for (let i = 0; i < frames; i++) {
      setTimeout(() => {
        gif.addFrame(target, { copy: true, delay: interval });
        if (i === frames - 1) {
          gif.render();
        }
      }, i * interval);
    }

    gif.on('finished', (blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'gradient-animation.gif';
      link.click();
    });
  };

  return (
    <button 
      onClick={handleExport} 
      className="px-6 py-2 mt-4 font-semibold text-white bg-green-500 rounded-lg shadow-lg">
      Export as GIF
    </button>
  );
};

export default ExportGif;