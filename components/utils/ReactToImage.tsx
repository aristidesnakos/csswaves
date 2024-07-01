import React from 'react';
import ReactDOM from 'react-dom';
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

    ReactDOM.render(React.createElement(Component, props), container, async () => {
      try {
        const dataUrl = await toPng(container, { width, height });
        resolve(dataUrl);
      } catch (error) {
        reject(error);
      } finally {
        ReactDOM.unmountComponentAtNode(container);
        document.body.removeChild(container);
      }
    });
  });
}