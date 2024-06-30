import GIF from 'gif.js';

interface AnimationToGifOptions {
  colors: string[];
  width: number;
  height: number;
  duration: number;
  fps: number;
  animationType: 'gradient' | 'horizontalWave' | 'circularWave';
}

export async function animationToGif({
  colors,
  width,
  height,
  duration,
  fps,
  animationType
}: AnimationToGifOptions): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const gif = new GIF({
      workers: 2,
      quality: 10,
      width,
      height,
      workerScript: '/gif.worker.js'
    });

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    const frames = duration * fps;
    const interval = 1000 / fps;

    for (let i = 0; i < frames; i++) {
      const progress = i / frames;
      renderFrame(ctx, colors, progress, width, height, animationType);
      gif.addFrame(ctx, { copy: true, delay: interval });
    }

    gif.on('finished', (blob: Blob) => {
      resolve(blob);
    });

    gif.render();
  });
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
  const backgroundColor = colors[0] || '#2C74B3';
  const waveColor = colors[1] || '#FFFFFF';

  // Background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const size = Math.min(width, height);

  ctx.save();
  ctx.translate(centerX, centerY);

  // Clip to a circle
  ctx.beginPath();
  ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
  ctx.clip();

  // Draw two rotating ellipses
  for (let i = 0; i < 2; i++) {
    ctx.save();
    
    // Rotate based on progress
    const rotation = (progress * Math.PI * 2) + (i * Math.PI / 2);
    ctx.rotate(rotation);

    // Draw ellipse
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.6, size * 0.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = i === 0 ? waveColor : `${waveColor}80`;
    ctx.fill();

    ctx.restore();
  }

  ctx.restore();
}