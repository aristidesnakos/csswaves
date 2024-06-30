import GIF from 'gif.js';

interface GradientToGifOptions {
  colors: string[];
  width: number;
  height: number;
  duration: number;
  fps: number;
}

export function gradientToGif({
  colors,
  width,
  height,
  duration,
  fps
}: GradientToGifOptions): Promise<Blob> {
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

    for (let i = 0; i < frames; i++) {
      const progress = i / frames;
      
      const gradient = ctx.createLinearGradient(-width, 0, width * 2, height);
      
      colors.forEach((color, index) => {
        const baseStop = index / (colors.length);
        let animatedStop = (baseStop + progress) % 1;
        
        animatedStop = Math.max(0, Math.min(1, animatedStop));
        
        gradient.addColorStop(animatedStop, color);
        
        if (animatedStop < baseStop) {
          let extraStop = animatedStop + 1;
          extraStop = Math.min(1, extraStop);
          gradient.addColorStop(extraStop, color);
        }
      });

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      gif.addFrame(ctx, { copy: true, delay: interval * 1000 });
    }

    gif.on('finished', (blob) => {
      resolve(blob);
    });

    gif.render();
  });
}