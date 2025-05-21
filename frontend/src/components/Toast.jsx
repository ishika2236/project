import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

// Toast types with their corresponding colors and icons
const TOAST_TYPES = {
  SUCCESS: {
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-500',
    icon: <CheckCircle size={20} className="text-green-500" />
  },
  ERROR: {
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-500',
    icon: <AlertCircle size={20} className="text-red-500" />
  },
  INFO: {
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-500',
    icon: <Info size={20} className="text-blue-500" />
  }
};

const Toast = ({ message, type = 'INFO', onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const toastStyle = TOAST_TYPES[type] || TOAST_TYPES.INFO;
  
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onClose?.();
        }, 300); // Allow fade-out animation to complete
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  return (
    <div 
      className={`${toastStyle.bgColor} ${toastStyle.textColor} ${toastStyle.borderColor} 
        border-l-4 p-4 rounded shadow-md flex items-center justify-between
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
      role="alert"
    >
      <div className="flex items-center">
        <span className="mr-2">{toastStyle.icon}</span>
        <p>{message}</p>
      </div>
      <button 
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
        className="ml-4 focus:outline-none hover:opacity-75"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;