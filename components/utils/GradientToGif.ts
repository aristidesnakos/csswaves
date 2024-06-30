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
      
      // Create a diagonal gradient
      const gradient = ctx.createLinearGradient(-width, 0, width * 2, height);
      
      // Add color stops to create a repeating pattern
      colors.forEach((color, index) => {
        const baseStop = index / (colors.length - 1);
        const animatedStop = (baseStop + progress) % 1;
        gradient.addColorStop(animatedStop, color);
        
        // Add an extra stop to ensure smooth looping
        if (animatedStop < baseStop) {
          gradient.addColorStop(animatedStop + 1, color);
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