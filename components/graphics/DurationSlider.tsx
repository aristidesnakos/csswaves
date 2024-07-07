import React from 'react';
import styles from './Graphics.module.css';

interface DurationSliderProps {
  duration: number;
  onChange: (duration: number) => void;
}

const DurationSlider: React.FC<DurationSliderProps> = ({ duration, onChange }) => (
  <div className={styles.durationSlider}>
    <label htmlFor="duration">Animation: {duration}s</label>
    <input
      type="range"
      id="duration"
      min="5"
      max="30"
      value={duration}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  </div>
);

export default DurationSlider;