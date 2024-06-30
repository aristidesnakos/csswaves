import React from 'react';

interface ExportCodeProps {
  colors: string[];
  animationDuration: number;
}

const ExportCode: React.FC<ExportCodeProps> = ({ colors, animationDuration }) => {
  const cssCode = `
.animated-gradient {
  width: 100%;
  height: 300px;
  background: linear-gradient(-45deg, ${colors.join(', ')});
  background-size: 400% 400%;
  animation: gradientAnimation ${animationDuration}s ease infinite;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
  `.trim();

  const htmlCode = `
<div class="animated-gradient"></div>
  `.trim();

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">Export Code</h3>
      <div className="mb-4">
        <h4 className="text-md font-medium mb-1">CSS:</h4>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
          <code>{cssCode}</code>
        </pre>
      </div>
      <div>
        <h4 className="text-md font-medium mb-1">HTML:</h4>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
          <code>{htmlCode}</code>
        </pre>
      </div>
    </div>
  );
};

export default ExportCode;