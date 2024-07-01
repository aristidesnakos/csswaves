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
    const radius = Math.min(width, height) * 0.4;
  
    // Clear the canvas
    ctx.clearRect(0, 0, width, height);
  
    // Create a clipping region for the circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();
  
    // Fill the entire circle with the first color
    const backgroundColor = colors[0];
    const waveColor = colors[1];
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
  
    // Function to convert hex to rgba
    const hexToRgba = (hex: string, alpha: number) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
  
    // Draw the standing waves
    const drawStandingWave = (amplitude: number, frequency: number, opacity: number) => {
      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY + radius);
      for (let x = -radius; x <= radius; x++) {
        const y = Math.sin(x * frequency + progress * Math.PI * 2) * amplitude;
        ctx.lineTo(centerX + x, centerY + y);
      }
      ctx.lineTo(centerX + radius, centerY + radius);
      ctx.closePath();
      ctx.fillStyle = hexToRgba(waveColor, opacity);
      ctx.fill();
    };
  
    // Draw multiple standing waves with different parameters
    drawStandingWave(radius * 0.6, 0.03, 0.4);
    drawStandingWave(radius * 0.5, 0.05, 0.3);
    drawStandingWave(radius * 0.4, 0.07, 0.2);
  
    // Fill the top portion with the background color
    ctx.beginPath();
    ctx.moveTo(centerX - radius, centerY);
    ctx.arc(centerX, centerY, radius, Math.PI, 0);
    ctx.lineTo(centerX + radius, 0);
    ctx.lineTo(centerX - radius, 0);
    ctx.closePath();
    ctx.fillStyle = backgroundColor;
    ctx.fill();
  
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
  
    // Add inner shadow
    const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
    ctx.fillStyle = gradient;
    ctx.fill();
  
    // Restore the canvas context
    ctx.restore();
  }
  
  export function renderTsunamiWaveFrame(
    ctx: CanvasRenderingContext2D,
    colors: string[],
    progress: number,
    width: number,
    height: number
  ) {
    // Clear the canvas
    ctx.clearRect(0, 0, width, height);
  
    // Draw background
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, width, height);
  
    // Draw celestial object
    const celestialRadius = Math.min(width, height) * 0.1;
    const celestialX = width * 0.1;
    const celestialY = height - celestialRadius - (height * 0.4 * Math.sin(progress * Math.PI * 2));
    
    ctx.beginPath();
    ctx.arc(celestialX, celestialY, celestialRadius, 0, Math.PI * 2);
    ctx.fillStyle = colors[1];
    ctx.globalAlpha = 0.8;
    ctx.fill();
    ctx.globalAlpha = 1;
  
    // Draw tsunami wave
    const waveHeight = height * 0.6;
    const waveWidth = width * 1.5;
    const waveX = -width * 0.5 + (progress * width);
    
    ctx.beginPath();
    ctx.moveTo(waveX, height);
    for (let x = 0; x <= waveWidth; x++) {
      const relativeX = x / waveWidth;
      const y = height - waveHeight * Math.pow(Math.sin(relativeX * Math.PI), 2);
      ctx.lineTo(waveX + x, y);
    }
    ctx.lineTo(waveX + waveWidth, height);
    ctx.closePath();
  
    const gradient = ctx.createLinearGradient(waveX, 0, waveX + waveWidth, 0);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    ctx.fillStyle = gradient;
    ctx.fill();
  }