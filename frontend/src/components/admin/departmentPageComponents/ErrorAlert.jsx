import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

const ErrorAlert = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-red-100 border border-red-200 rounded-lg p-4 mb-6 dark:bg-red-900/30 dark:border-red-900/50">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-grow">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error</h3>
          <div className="mt-1 text-sm text-red-700 dark:text-red-300">
            {message || 'An unexpected error occurred. Please try again.'}
          </div>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="ml-4 inline-flex text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ErrorAlert;