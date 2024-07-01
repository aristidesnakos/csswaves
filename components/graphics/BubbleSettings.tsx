'use client';
import React, { useState } from 'react';
import { ChromePicker } from 'react-color';

interface BubbleSettingsProps {
  bubbleColor: string;
  setBubbleColor: React.Dispatch<React.SetStateAction<string>>;
  bubbleSpeed: number;
  setBubbleSpeed: React.Dispatch<React.SetStateAction<number>>;
}

const BubbleSettings: React.FC<BubbleSettingsProps> = ({
  bubbleColor,
  setBubbleColor,
  bubbleSpeed,
  setBubbleSpeed,
}) => {
  const [isBubbleColorPickerActive, setIsBubbleColorPickerActive] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-lg font-semibold">Bubble Settings</h3>
      <div className="flex items-center gap-4">
        <button
          className="w-12 h-12 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          style={{ backgroundColor: bubbleColor }}
          onClick={() => setIsBubbleColorPickerActive(!isBubbleColorPickerActive)}
          aria-label="Select bubble color"
        ></button>
        <div>
          <label htmlFor="bubble-speed" className="block text-sm font-medium text-gray-700 mb-1">Bubble Speed</label>
          <input
            id="bubble-speed"
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
      {isBubbleColorPickerActive && (
        <div className="mt-2">
          <ChromePicker
            color={bubbleColor}
            onChange={(color) => setBubbleColor(color.hex)}
          />
        </div>
      )}
    </div>
  );
};

export default BubbleSettings;