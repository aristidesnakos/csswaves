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

function renderCircularWave(ctx: CanvasRenderingContext2D, colors: string[], progress: number, width: number, height: number) {
  const backgroundColor = colors[0];
  const waveColor = colors[1];

  const centerX = width / 2;
  const centerY = height / 2;
  const size = Math.min(width, height);
  const radius = size / 2;

  // Background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // Clip to a circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();

  // Function to draw a wave
  const drawWave = (offset: number, alpha: number) => {
    const angle = progress * Math.PI * 2 + offset;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.scale(1, 0.75);  // To create an ellipse effect

    ctx.beginPath();
    ctx.arc(0, 0, radius * 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${parseInt(waveColor.slice(1, 3), 16)}, ${parseInt(waveColor.slice(3, 5), 16)}, ${parseInt(waveColor.slice(5, 7), 16)}, ${alpha})`;
    ctx.fill();

    ctx.restore();
  };

  // Draw two waves
  drawWave(0, 1);
  drawWave(Math.PI, 0.5);

  ctx.restore();
}