// ColorPicker.tsx
import React from 'react';
import { SketchPicker } from 'react-color';
import styles from './GradientBackground.module.css';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => (
  <div className={styles.colorPicker}>
    <div className={styles.colorPreview} style={{ backgroundColor: color }} />
    <SketchPicker color={color} onChangeComplete={(color) => onChange(color.hex)} />
  </div>
);

export default ColorPicker;