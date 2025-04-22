// SectionHeader.jsx
import React from 'react';
import { useTheme } from '../../../../context/ThemeProvider';

export default function SectionHeader({ title, subtitle }) {
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];
  
  return (
    <div className="mb-4">
      <h2 className={`${colors.text} text-xl font-bold`}>{title}</h2>
      {subtitle && <p className={`${colors.secondaryText} text-sm`}>{subtitle}</p>}
    </div>
  );
}