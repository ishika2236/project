import React from 'react';

const ProgressBar = ({ step, totalSteps, getThemedClass, theme }) => {
  const progress = (step / (totalSteps - 1)) * 100;
  
  return (
    <div className="w-full mb-4">
      <div className={`relative h-1 ${getThemedClass('bg-slate-800/50', 'bg-blue-100')} rounded-full overflow-hidden`}>
        <div 
          className="absolute h-full bg-green-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index}
            className={`flex items-center justify-center h-5 w-5 text-xs rounded-full transition-colors ${
              step > index ? 'bg-green-600 border border-green-400 text-white' : 
              step === index ? (theme === 'dark' ? 'bg-slate-600 border border-green-500 text-white' : 'bg-blue-200 border border-green-500 text-blue-800') : 
              getThemedClass('bg-slate-800/50 border border-slate-700 text-gray-400', 'bg-white border border-blue-200 text-blue-400')
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;