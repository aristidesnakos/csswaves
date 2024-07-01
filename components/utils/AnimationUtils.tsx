export function renderGradientFrame(
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
  
  export function renderHorizontalWaveFrame(
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
    const renderWave = (waveHeight: number, opacity: number) => {
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x++) {
        const y = Math.sin((x * 0.01 + progress * Math.PI * 2) * 2) * waveHeight + (height - waveHeight);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = `rgba(${parseInt(colors[1].slice(1, 3), 16)}, ${parseInt(colors[1].slice(3, 5), 16)}, ${parseInt(colors[1].slice(5, 7), 16)}, ${opacity})`;
      ctx.fill();
    };
  
    renderWave(height * 0.2, 0.7);
    renderWave(height * 0.3, 0.5);
    renderWave(height * 0.4, 0.3);
  }
  
  export function renderCircularWaveFrame(
    ctx: CanvasRenderingContext2D,
    colors: string[],
    progress: number,
    width: number,
    height: number
  ) {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.4;
  
    // Background
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, width, height);
  
    // Circular clip
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
    ctx.clip();
  
    // Waves
    const renderWave = (waveOffset: number, opacity: number) => {
      const radius = maxRadius * (1 + Math.sin(progress * Math.PI * 2 + waveOffset) * 0.1);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${parseInt(colors[1].slice(1, 3), 16)}, ${parseInt(colors[1].slice(3, 5), 16)}, ${parseInt(colors[1].slice(5, 7), 16)}, ${opacity})`;
      ctx.fill();
    };
  
    renderWave(0, 0.7);
    renderWave(Math.PI / 2, 0.5);
    renderWave(Math.PI, 0.3);
  
    ctx.restore();
  }