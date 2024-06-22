import React, { useEffect, useRef } from 'react';

interface BubbleAnimationProps {
  containerWidth: number;
  containerHeight: number;
  bubbleColor: string;
  bubbleSpeed: number;
}

const BubbleAnimation: React.FC<BubbleAnimationProps> = ({ 
  containerWidth, 
  containerHeight, 
  bubbleColor, 
  bubbleSpeed 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = containerWidth;
    canvas.height = containerHeight;

    class Bubble {
      x: number;
      y: number;
      size: number;
      speedY: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 8 + 2;
        this.speedY = (Math.random() * 1 + 0.5) * bubbleSpeed;
      }

      update() {
        this.y -= this.speedY;
        if (this.y < -this.size) {
          this.y = canvas.height + this.size;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = bubbleColor;
        ctx.fill();
      }
    }

    const bubbles: Bubble[] = [];
    for (let i = 0; i < 50; i++) {
      bubbles.push(new Bubble());
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bubbles.forEach((bubble) => {
        bubble.update();
        bubble.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      // Cleanup if needed
    };
  }, [containerWidth, containerHeight, bubbleColor, bubbleSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    />
  );
};

export default BubbleAnimation;