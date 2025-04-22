import React from 'react';
import { useTheme } from '../../../../context/ThemeProvider';

const CircularProgressBar = ({ percentage, size = 24, label }) => {
  const { isDark } = useTheme();
  
  const getColor = (value) => {
    if (value >= 90) return "#2F955A";
    if (value >= 75) return "#F2683C";
    return "#E53E3E";
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`relative h-${size} w-${size}`}>
        <svg viewBox="0 0 36 36" className={`h-${size} w-${size} transform -rotate-90`}>
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={isDark ? "#2C3E50" : "#E2E8F0"}
            strokeWidth="3"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={getColor(percentage)}
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{percentage}%</span>
        </div>
      </div>
      {label && <span className="text-sm mt-1">{label}</span>}
    </div>
  );
};

export default CircularProgressBar;