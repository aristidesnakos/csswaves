import React, { useRef, useEffect } from 'react';

interface CanvasAnimationRendererProps {
  width: number;
  height: number;
  colors: string[];
  animationType: 'gradient' | 'horizontalWave' | 'circularWave';
  progress: number;
}

const CanvasAnimationRenderer: React.FC<CanvasAnimationRendererProps> = ({
  width,
  height,
  colors,
  animationType,
  progress
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    switch (animationType) {
      case 'gradient':
        drawGradient(ctx, colors, progress, width, height);
        break;
      case 'horizontalWave':
        drawHorizontalWave(ctx, colors, progress, width, height);
        break;
      case 'circularWave':
        drawCircularWave(ctx, colors, progress, width, height);
        break;
    }
  }, [width, height, colors, animationType, progress]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

function drawGradient(
  ctx: CanvasRenderingContext2D,
  colors: string[],
  progress: number,
  width: number,
  height: number
) {
  const gradient = ctx.createLinearGradient(
    width * Math.cos(progress * Math.PI * 2),
    height * Math.sin(progress * Math.PI * 2),
    width * Math.cos((progress + 0.5) * Math.PI * 2),
    height * Math.sin((progress + 0.5) * Math.PI * 2)
  );
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawHorizontalWave(
  ctx: CanvasRenderingContext2D,
  colors: string[],
  progress: number,
  width: number,
  height: number
) {
  // Background
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, width, height);

  // Waves
  ctx.fillStyle = colors[1];
  const waveHeight = height * 0.4;
  const baseY = height - waveHeight;

  ctx.beginPath();
  ctx.moveTo(0, height);
  for (let x = 0; x <= width; x++) {
    const y = Math.sin((x * 0.02 + progress * Math.PI * 2)) * 15 + baseY;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(width, height);
  ctx.fill();
}

function drawCircularWave(
  ctx: CanvasRenderingContext2D,
  colors: string[],
  progress: number,
  width: number,
  height: number
) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2;

  // Background
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, width, height);

  // Circular clip
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();

  // Waves
  const drawWave = (offset: number, alpha: number) => {
    const angle = progress * Math.PI * 2 + offset;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.scale(1, 0.75);

    ctx.beginPath();
    ctx.arc(0, 0, radius * 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${parseInt(colors[1].slice(1, 3), 16)}, ${parseInt(
      colors[1].slice(3, 5),
      16
    )}, ${parseInt(colors[1].slice(5, 7), 16)}, ${alpha})`;
    ctx.fill();

    ctx.restore();
  };

  drawWave(0, 1);
  drawWave(Math.PI, 0.5);

  ctx.restore();
}

export default CanvasAnimationRenderer;