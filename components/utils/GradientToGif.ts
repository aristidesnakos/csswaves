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

  // Waves
  ctx.fillStyle = colors[1];
  const waveHeight = height * 0.4;
  const baseY = height - waveHeight;

  // Render three waves with different frequencies and amplitudes
  renderWave(ctx, width, height, baseY, progress, 0.02, 15, 0);
  renderWave(ctx, width, height, baseY, progress, 0.03, 10, Math.PI / 2);
  renderWave(ctx, width, height, baseY, progress, 0.01, 20, Math.PI / 4);
}

function renderWave(
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  baseY: number, 
  progress: number, 
  frequency: number, 
  amplitude: number, 
  phaseShift: number
) {
  ctx.beginPath();
  ctx.moveTo(0, baseY);
  for (let x = 0; x < width; x++) {
    const y = Math.sin((x * frequency + progress * Math.PI * 2 + phaseShift)) * amplitude + baseY;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(width, baseY);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
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

  // Render two overlapping circular waves
  renderCircularWaveLayer(ctx, colors[1], centerX, centerY, radius, progress, 6, 15, 1);
  renderCircularWaveLayer(ctx, colors[1] + '80', centerX, centerY, radius, -progress * 0.5, 8, 10, 0.7);

  ctx.restore();
}

function renderCircularWaveLayer(
  ctx: CanvasRenderingContext2D,
  color: string,
  centerX: number,
  centerY: number,
  radius: number,
  progress: number,
  frequency: number,
  amplitude: number,
  scale: number
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let angle = 0; angle < Math.PI * 2; angle += 0.01) {
    const waveRadius = radius * scale + Math.sin(angle * frequency + progress * Math.PI * 2) * amplitude;
    const x = centerX + Math.cos(angle) * waveRadius;
    const y = centerY + Math.sin(angle) * waveRadius;
    if (angle === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.fill();
}