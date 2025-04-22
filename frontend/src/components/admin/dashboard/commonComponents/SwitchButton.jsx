// SwitchButton.jsx
import React from 'react';
import { useTheme } from '../../../../context/ThemeProvider';

export default function SwitchButton({ active, label, onClick }) {
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];
  
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        active 
          ? `${theme === 'dark' ? 'bg-[#1E2733]' : 'bg-blue-900'} ${theme === 'dark' ? colors.text : 'text-white'}` 
          : `${theme === 'dark' ? 'bg-transparent' : 'bg-transparent'} ${colors.secondaryText}`
      }`}
    >
      {label}
    </button>
  );
}