// StatCard.jsx
import React from 'react';
import { useTheme } from '../../../../context/ThemeProvider';
import { ArrowUpRight } from 'lucide-react';

export default function StatCard({ 
  title, 
  value, 
  icon, 
  subtext, 
  trend, 
  onClick, 
  id, 
  hoveredCard, 
  setHoveredCard 
}) {
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];
  
  return (
    <div 
      className={`${colors.card} rounded-xl p-6 cursor-pointer transition-all duration-300 transform ${hoveredCard === id ? 'scale-105' : ''}`}
      onMouseEnter={() => setHoveredCard(id)}
      onMouseLeave={() => setHoveredCard(null)}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`rounded-full p-3 ${theme === 'dark' ? 'bg-[#1E2733]/50' : 'bg-gray-100'}`}>
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            <ArrowUpRight size={14} className="text-green-500" />
            <span className="text-green-500 text-sm font-medium">{trend}%</span>
          </div>
        )}
      </div>
      <h3 className={`${colors.secondaryText} text-sm font-medium mb-1`}>{title}</h3>
      <div className="flex items-end justify-between">
        <h2 className={`${colors.text} text-2xl font-bold`}>{value}</h2>
        {subtext && <p className={`${colors.secondaryText} text-xs`}>{subtext}</p>}
      </div>
    </div>
  );
}



