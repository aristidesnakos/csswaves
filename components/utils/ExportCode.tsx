import React from 'react';

interface ExportCodeProps {
  colors: string[];
  animationDuration: number;
  animationType: 'gradient' | 'horizontalWave' | 'circularWave';
}

const ExportCode: React.FC<ExportCodeProps> = ({ colors, animationDuration, animationType }) => {
  const getCSS = () => {
    switch (animationType) {
      case 'gradient':
        return `
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
}`;
      case 'horizontalWave':
        return `
.wave-container {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
}

@keyframes wave {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.wave {
  position: absolute;
  left: 0;
  width: 200%;
  height: 100%;
  background-color: ${colors[0]};
}

.wave::before,
.wave::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  background-repeat: repeat-x;
}

.wave::before {
  height: 80px;
  background-size: 80px 80px;
  background-image: radial-gradient(circle at 40px -25px, transparent 50px, ${colors[1]} 52px);
  animation: wave ${animationDuration}s linear infinite;
}

.wave::after {
  height: 60px;
  background-size: 60px 60px;
  background-image: radial-gradient(circle at 30px -15px, transparent 37px, ${colors[1]} 39px);
  animation: wave ${animationDuration * 0.8}s linear infinite;
}`;
      case 'circularWave':
        return `
.circle {
  position: relative;
  width: 250px;
  height: 250px;
  border: 5px solid #FFFFFF;
  box-shadow: 0 0 0 5px #4973ff;
  border-radius: 50%;
  overflow: hidden;
}

.wave {
  position: relative;
  width: 100%;
  height: 100%;
  background: ${colors[0]};
  border-radius: 50%;
  box-shadow: inset 0 0 50px 0 rgba(0, 0, 0, 0.5);
}

.wave:before,
.wave:after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 200%;
  height: 200%;
  transform: translate(-50%, -75%);
}

.wave:before {
  border-radius: 45%;
  background: ${colors[1]};
  animation: animate ${animationDuration}s linear infinite;
}

.wave:after {
  border-radius: 40%;
  background: ${colors[1]}80;
  animation: animate ${animationDuration * 2}s linear infinite;
}

@keyframes animate {
  0% {
    transform: translate(-50%, -75%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -75%) rotate(360deg);
  }
}`;
    }
  };

  const getHTML = () => {
    switch (animationType) {
      case 'gradient':
        return '<div class="animated-gradient"></div>';
      case 'horizontalWave':
        return `
<div class="wave-container">
  <div class="wave"></div>
</div>`;
      case 'circularWave':
        return `
<div class="circle">
  <div class="wave"></div>
</div>`;
    }
  };

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