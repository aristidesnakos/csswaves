import React from 'react';

interface ExportCodeProps {
  colors: string[];
  animationDuration: number;
  animationType: 'gradient' | 'horizontalWave' | 'circularWave';
}

const ExportCode: React.FC<ExportCodeProps> = ({ colors, animationDuration, animationType }) => {
  const getCSS = () => {
    const commonStyles = `
  width: 100%;
  height: 300px;
  overflow: hidden;
`;

    const animationStyles = {
      gradient: `
  background: linear-gradient(-45deg, ${colors.join(', ')});
  background-size: 400% 400%;
  animation: gradientAnimation ${animationDuration}s ease infinite;
`,
      horizontalWave: `
  position: relative;
  background-color: ${colors[0]};
`,
      circularWave: `
  position: relative;
  background: ${colors[0]};
  border-radius: 50%;
  box-shadow: inset 0 0 50px 0 rgba(0, 0, 0, 0.5);
`
    };

    const keyframes = {
      gradient: `
@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}`,
      horizontalWave: `
@keyframes wave {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}`,
      circularWave: `
@keyframes animate {
  0% { transform: translate(-50%, -75%) rotate(0deg); }
  100% { transform: translate(-50%, -75%) rotate(360deg); }
}`
    };

    return `.${animationType}-animation {
  ${commonStyles}
  ${animationStyles[animationType]}
}

${keyframes[animationType]}

${animationType === 'horizontalWave' || animationType === 'circularWave' ? `
.${animationType}-animation::before,
.${animationType}-animation::after {
  content: '';
  position: absolute;
  background: ${colors[1]};
  animation: ${animationType === 'horizontalWave' ? 'wave' : 'animate'} ${animationDuration}s linear infinite;
}
` : ''}`;
  };

  const getHTML = () => `<div class="${animationType}-animation"></div>`;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">Export Code</h3>
      <div className="mb-4">
        <h4 className="text-md font-medium mb-1">CSS:</h4>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
          <code>{getCSS()}</code>
        </pre>
      </div>
      <div>
        <h4 className="text-md font-medium mb-1">HTML:</h4>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
          <code>{getHTML()}</code>
        </pre>
      </div>
    </div>
  );
};

export default ExportCode;