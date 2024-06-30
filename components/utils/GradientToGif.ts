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
    const interval = duration / frames;
    let frameCount = 0;

    function renderFrame(progress: number) {
      ctx.clearRect(0, 0, width, height);
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

    function captureFrame() {
      if (frameCount >= frames) {
        gif.render();
        return;
      }

      const progress = frameCount / frames;
      renderFrame(progress);
      gif.addFrame(ctx, { copy: true, delay: interval * 1000 });
      frameCount++;
      requestAnimationFrame(captureFrame);
    }

    gif.on('finished', blob => {
      resolve(blob);
    });

    captureFrame();
  });
}

function renderGradient(ctx: CanvasRenderingContext2D, colors: string[], progress: number, width: number, height: number) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function renderHorizontalWave(ctx: CanvasRenderingContext2D, colors: string[], progress: number, width: number, height: number) {
  // Background
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, width, height);

  // Wave
  ctx.fillStyle = colors[1];
  const waveHeight = height * 0.4;
  const frequency = 0.01;
  const amplitude = 20;

  ctx.beginPath();
  ctx.moveTo(0, height);
  for (let x = 0; x < width; x++) {
    const y = Math.sin((x + progress * width) * frequency) * amplitude + height - waveHeight;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();
}

function renderCircularWave(ctx: CanvasRenderingContext2D, colors: string[], progress: number, width: number, height: number) {
  // Background
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, width, height);

  // Circular wave
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.4;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();

  ctx.fillStyle = colors[1];
  const waveRadius = radius * 1.2;
  const frequency = 10;
  const amplitude = 20;

  ctx.beginPath();
  for (let angle = 0; angle < Math.PI * 2; angle += 0.01) {
    const x = centerX + Math.cos(angle) * (waveRadius + Math.sin(angle * frequency + progress * Math.PI * 2) * amplitude);
    const y = centerY + Math.sin(angle) * (waveRadius + Math.sin(angle * frequency + progress * Math.PI * 2) * amplitude);
    if (angle === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.fill();
  ctx.restore();
}