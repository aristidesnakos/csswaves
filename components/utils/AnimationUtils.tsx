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
  
// ... (keep the existing renderGradientFrame and renderHorizontalWaveFrame functions)

export function renderCircularWaveFrame(
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
  
    // Draw the circular boundary
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 5;
    ctx.stroke();
  
    // Add outer glow (box-shadow equivalent)
    ctx.shadowColor = '#4973ff';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.stroke();
  
    // Reset shadow
    ctx.shadowColor = 'transparent';
  
    // Create a clipping region for the waves
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 2.5, 0, Math.PI * 2);
    ctx.clip();
  
    // Fill the background
    ctx.fillStyle = colors[0]; // Using the first color as background
    ctx.fillRect(0, 0, width, height);
  
    // Add inner shadow
    const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
    ctx.fillStyle = gradient;
    ctx.fill();
  
    // Draw the waves
    const drawWave = (rotation: number, color: string) => {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      ctx.scale(1, 0.5); // Create an elliptical shape
      ctx.beginPath();
      ctx.arc(0, -radius * 0.15, radius * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    };
  
    // Draw two rotating waves
    drawWave(progress * Math.PI * 2, 'rgba(255, 255, 255, 1)');
    drawWave(progress * Math.PI * 4, 'rgba(255, 255, 255, 0.5)');
  
    // Restore the canvas context
    ctx.restore();
  }