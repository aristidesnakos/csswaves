import React from 'react';
import { createRoot } from 'react-dom/client';
import { toPng } from 'html-to-image';

export async function reactComponentToImage(
  Component: React.ComponentType<any>,
  props: any,
  width: number,
  height: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div');
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(React.createElement(Component, props));

    // Wait for the next frame to ensure the component has rendered
    requestAnimationFrame(async () => {
      try {
        const dataUrl = await toPng(container, { width, height });
        resolve(dataUrl);
      } catch (error) {
        reject(error);
      } finally {
        root.unmount();
        document.body.removeChild(container);
      }
    });
  });
}