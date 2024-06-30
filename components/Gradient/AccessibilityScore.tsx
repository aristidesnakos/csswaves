import React from 'react';

interface AccessibilityScoreProps {
  score: number;
}

const AccessibilityScore: React.FC<AccessibilityScoreProps> = ({ score }) => {
  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-2">Accessibility Score</h3>
      <p className="text-3xl font-bold">{score}/100</p>
      <p className="mt-2 text-sm text-gray-600">
        This score is based on color contrast, animation speed, and the ability to pause the animation.
      </p>
    </div>
  );
};

export default AccessibilityScore;