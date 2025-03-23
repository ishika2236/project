import React from 'react';

const BackgroundDecorations = ({ theme }) => {
  // Function to generate decorative dots
  const generateDots = () => {
    const dots = [];
    // Increased from 8 to 15 dots
    for (let i = 0; i < 15; i++) {
      const size = Math.random() * 60 + 20;
      const x = Math.random() * 40; // Concentrate dots on the left side (0-40% of width)
      const y = Math.random() * 100;
      dots.push(
        <div 
          key={i}
          className={`absolute rounded-full border-2 border-dashed ${theme === 'dark' ? 'border-slate-700/50' : 'border-gray-300/70'}`}
          style={{ width: `${size}px`, height: `${size}px`, left: `${x}%`, top: `${y}%` }}
        />
      );
    }
    return dots;
  };

  return (
    <>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {generateDots()}
      </div>
      
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900/20 to-slate-900/90" />
    </>
  );
};

export default BackgroundDecorations;