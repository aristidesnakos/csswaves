import GIF from 'gif.js';
import html2canvas from 'html2canvas';

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

    const container = document.createElement('div');
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    const animationElement = document.createElement('div');
    animationElement.style.width = '100%';
    animationElement.style.height = '100%';
    container.appendChild(animationElement);

    const style = document.createElement('style');
    document.head.appendChild(style);

    let cleanup: () => void;

    switch (animationType) {
      case 'gradient':
        cleanup = setupGradientAnimation(animationElement, style, colors, duration);
        break;
      case 'horizontalWave':
        cleanup = setupHorizontalWaveAnimation(animationElement, style, colors, duration);
        break;
      case 'circularWave':
        cleanup = setupCircularWaveAnimation(animationElement, style, colors, duration);
        break;
    }

    const frames = duration * fps;
    const interval = duration / frames;
    let frameCount = 0;

    function captureFrame() {
      if (frameCount >= frames) {
        cleanup();
        document.body.removeChild(container);
        document.head.removeChild(style);
        gif.render();
        return;
      }

      html2canvas(container, { scale: 1 }).then(canvas => {
        gif.addFrame(canvas, { delay: interval * 1000, copy: true });
        frameCount++;
        requestAnimationFrame(captureFrame);
      });
    }

    gif.on('finished', blob => {
      resolve(blob);
    });

    captureFrame();
  });
}

function setupGradientAnimation(element: HTMLElement, style: HTMLStyleElement, colors: string[], duration: number) {
  element.style.background = `linear-gradient(-45deg, ${colors[0]}, ${colors[1]})`;
  element.style.backgroundSize = '400% 400%';
  element.style.animation = `gradientAnimation ${duration}s ease infinite`;

  style.textContent = `
    @keyframes gradientAnimation {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;

  return () => {};
}

function setupHorizontalWaveAnimation(element: HTMLElement, style: HTMLStyleElement, colors: string[], duration: number) {
  element.style.position = 'relative';
  element.style.backgroundColor = colors[0];
  element.style.overflow = 'hidden';

  const wave = document.createElement('div');
  wave.style.position = 'absolute';
  wave.style.left = '0';
  wave.style.right = '0';
  wave.style.bottom = '0';
  wave.style.height = '40%';
  wave.style.background = colors[1];
  element.appendChild(wave);

  style.textContent = `
    @keyframes waveAnimation {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
    ${element.tagName.toLowerCase()} > div {
      &::before, &::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        background-repeat: repeat-x;
      }
      &::before {
        height: 20px;
        bottom: 100%;
        background-image: radial-gradient(circle at 10px -5px, transparent 12px, ${colors[1]} 13px);
        background-size: 20px 20px;
        animation: waveAnimation ${duration * 0.5}s ease-in-out infinite;
      }
      &::after {
        height: 15px;
        bottom: 100%;
        background-image: radial-gradient(circle at 10px -5px, transparent 12px, ${colors[1]} 13px);
        background-size: 40px 20px;
        animation: waveAnimation ${duration * 0.7}s ease-in-out infinite;
        opacity: 0.5;
      }
    }
  `;

  return () => element.removeChild(wave);
}

function setupCircularWaveAnimation(element: HTMLElement, style: HTMLStyleElement, colors: string[], duration: number) {
  element.style.position = 'relative';
  element.style.backgroundColor = colors[0];

  const circle = document.createElement('div');
  circle.style.position = 'absolute';
  circle.style.top = '50%';
  circle.style.left = '50%';
  circle.style.width = '80%';
  circle.style.height = '80%';
  circle.style.transform = 'translate(-50%, -50%)';
  circle.style.borderRadius = '50%';
  circle.style.overflow = 'hidden';
  element.appendChild(circle);

  const wave = document.createElement('div');
  wave.style.position = 'absolute';
  wave.style.top = '50%';
  wave.style.left = '0';
  wave.style.width = '200%';
  wave.style.height = '200%';
  wave.style.backgroundColor = colors[1];
  wave.style.borderRadius = '38%';
  wave.style.animation = `circularWave ${duration}s linear infinite`;
  circle.appendChild(wave);

  style.textContent = `
    @keyframes circularWave {
      0% { transform: translate(-50%, -50%) rotate(0deg); }
      100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
  `;

  return () => {
    element.removeChild(circle);
  };
}