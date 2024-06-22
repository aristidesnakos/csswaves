'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import ScreenshotButton from './ScreenshotButton';
import BubbleAnimation from './BubbleAnimation';
import styles from './GradientBackground.module.css';

const GradientBackground: React.FC = () => {
  const [colors, setColors] = useState(['#ff00cc', '#3333ff']);
  const [activeColorPicker, setActiveColorPicker] = useState<number | null>(null);
  const [bubbleColor, setBubbleColor] = useState(['#ffffff']);
  const [bubbleSpeed, setBubbleSpeed] = useState(1);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (gradientRef.current) {
        setContainerSize({
          width: gradientRef.current.offsetWidth,
          height: gradientRef.current.offsetHeight
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleColorChange = (index: number, color: { hex: string }) => {
    const newColors = [...colors];
    newColors[index] = color.hex;
    setColors(newColors);
  };

  const toggleColorPicker = (index: number) => {
    setActiveColorPicker(activeColorPicker === index ? null : index);
  };

  const gradientStyle = {
    background: `linear-gradient(to right, ${colors[0]}, ${colors[1]})`,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Gradient Generator</h2>
        <div 
          ref={gradientRef}
          style={gradientStyle} 
          id="gradient-display" 
          className={`${styles.animatedGradient} rounded-lg shadow-lg mb-8 relative overflow-hidden h-64`}
        >
          <BubbleAnimation 
            containerWidth={containerSize.width} 
            containerHeight={containerSize.height}
            bubbleColor={bubbleColor}
            bubbleSpeed={bubbleSpeed}
          />
        </div>
        <div className='flex flex-row'>
          <div className="flex justify-center gap-4 mb-4">
              {colors.map((color, index) => (
                <div key={index} className="relative">
                  <button
                    className="w-12 h-12 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    style={{ backgroundColor: color }}
                    onClick={() => toggleColorPicker(index)}
                  ></button>
                  {activeColorPicker === index && (
                    <div className="absolute z-10 mt-2">
                      <ChromePicker
                        color={color}
                        onChange={(color) => handleColorChange(index, color)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center gap-4 mb-4 pl-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bubble Color</label>
                {bubbleColor.map((color, index) => (
                <div key={index} className="relative">
                  <button
                    className="w-12 h-12 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    style={{ backgroundColor: color }}
                    onClick={() => toggleColorPicker(index)}
                  ></button>
                  {activeColorPicker === index && (
                    <div className="absolute z-10 mt-2">
                      <ChromePicker
                        color={color}
                        onChange={(color) => handleColorChange(index, color)}
                      />
                    </div>
                  )}
                </div>
              ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bubble Speed</label>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={bubbleSpeed}
                  onChange={(e) => setBubbleSpeed(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
        </div>
        <div className="flex justify-center">
          <ScreenshotButton targetId="gradient-display" />
        </div>
      </div>
    </div>
  );
};

export default GradientBackground;