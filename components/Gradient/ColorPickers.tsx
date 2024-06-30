import React, { useState } from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import { ensureHexColor } from '@/libs/colorUtils';

interface ColorPickersProps {
  colors: string[];
  setColors: React.Dispatch<React.SetStateAction<string[]>>;
}

const ColorPickers: React.FC<ColorPickersProps> = ({ colors, setColors }) => {
  const [activeColorPicker, setActiveColorPicker] = useState<number | null>(null);

  const handleColorChange = (index: number, color: ColorResult) => {
    const newColors = [...colors];
    newColors[index] = ensureHexColor(color.hex);
    setColors(newColors);
  };

  const toggleColorPicker = (index: number) => {
    setActiveColorPicker(activeColorPicker === index ? null : index);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-lg font-semibold">Gradient Colors</h3>
      <div className="flex gap-4">
        {colors.map((color, index) => (
          <div key={index} className="relative">
            <button
              className="w-12 h-12 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              style={{ backgroundColor: ensureHexColor(color) }}
              onClick={() => toggleColorPicker(index)}
              aria-label={`Select color ${index + 1}`}
            ></button>
            {activeColorPicker === index && (
              <div className="absolute z-10 mt-2">
                <ChromePicker
                  color={ensureHexColor(color)}
                  onChange={(color) => handleColorChange(index, color)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPickers;