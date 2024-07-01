import GIF from 'gif.js';
import { reactComponentToImage } from '@/components/utils/ReactToImage';
import CircularWaveAnimation from '@/components/graphics/CircularWaveAnimation';

interface AnimationToGifOptions {
  colors: string[];
  width: number;
  height: number;
  duration: number;
  fps: number;
  animationType: string;
}

export async function animationToGif({
  colors,
  width,
  height,
  duration,
  fps,
  animationType
}: AnimationToGifOptions): Promise<Blob> {
  const gif = new GIF({
    workers: 2,
    quality: 10,
    width,
    height,
    workerScript: '/gif.worker.js',
  });

  const frames = duration * fps;
  const interval = 1000 / fps;

  console.log(`Starting GIF generation: ${frames} frames, ${duration}s duration, ${fps} fps`);

  try {
    for (let i = 0; i < frames; i++) {
      const progress = i / frames;

      const imageDataUrl = await reactComponentToImage(
        CircularWaveAnimation,
        { colors, progress },
        width,
        height
      );

      const img = await new Promise<HTMLImageElement>((resolve) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.src = imageDataUrl;
      });

      gif.addFrame(img, { delay: interval });

      console.log(`Added frame ${i + 1}/${frames}`);
    }

    return new Promise((resolve, reject) => {
      gif.on('finished', (blob: Blob) => {
        resolve(blob);
      });
      gif.render();
    });
  } catch (error) {
    console.error('Error generating GIF:', error);
    throw error;
  }
}

function renderFrame(
  ctx: CanvasRenderingContext2D, 
  colors: string[], 
  progress: number, 
  width: number, 
  height: number, 
  animationType: 'gradient' | 'horizontalWave' | 'circularWave'
) {
  switch (animationType) {
    case 'gradient':
      renderGradient(ctx, colors, progress, width, height);
      break;
    case 'horizontalWave':
      renderHorizontalWave(ctx, colors, progress, width, height);
      break;
    case 'circularWave':
      renderCircularWave(ctx, colors, progress, width, height);
      break;
  }
}

function renderGradient(ctx: CanvasRenderingContext2D, colors: string[], progress: number, width: number, height: number) {
  const gradient = ctx.createLinearGradient(
    width * (progress % 1),
    height * (progress % 1),
    width * ((progress + 0.5) % 1),
    height * ((progress + 0.5) % 1)
  );
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function renderHorizontalWave(ctx: CanvasRenderingContext2D, colors: string[], progress: number, width: number, height: number) {
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

export function renderCircularWave(
  ctx: CanvasRenderingContext2D,
  colors: string[],
  progress: number,
  width: number,
  height: number
) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.4;

  // Clear the canvas
  ctx.clearRect(0, 0, width, height);

  // Create a clipping region for the circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();

  // Fill the background (representing the goblet)
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, width, height);

  // Function to convert hex to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Draw the "wine" waves
  const drawWine = () => {
    const waveColor = hexToRgba(colors[1], 0.8);
    ctx.fillStyle = waveColor;

    ctx.beginPath();
    for (let angle = 0; angle < Math.PI * 2; angle += 0.01) {
      const sineWave = Math.sin(angle * 4 + progress * Math.PI * 2) * 0.05;
      const r = radius * (0.8 + sineWave);
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);

      if (angle === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.fill();
  };

  // Draw multiple layers of waves for depth
  for (let i = 0; i < 3; i++) {
    drawWine();
  }

  // Add a subtle shine effect
  const gradient = ctx.createRadialGradient(
    centerX - radius * 0.5, 
    centerY - radius * 0.5, 
    0, 
    centerX, 
    centerY, 
    radius
  );
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fill();

  // Draw the circular boundary (goblet rim)
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = hexToRgba(colors[1], 0.5);
  ctx.lineWidth = 2;
  ctx.stroke();

  // Restore the canvas context
  ctx.restore();
}