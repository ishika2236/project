import React from 'react';
import { useTheme } from '../../../../context/ThemeProvider';
import { ArrowLeft } from 'lucide-react';

const NavigationButton = ({ onClick, label = 'Back' }) => {
  const { themeConfig, theme } = useTheme();
  const currentTheme = themeConfig[theme];

  return (
    <button 
      onClick={onClick}
      className={`flex items-center mr-4 px-3 py-1.5 rounded-lg ${currentTheme.button.primary}`}
    >
      <ArrowLeft size={16} className="mr-1" />
      {label}
    </button>
  );
};

export default NavigationButton;