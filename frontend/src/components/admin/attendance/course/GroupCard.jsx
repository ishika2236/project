import React from 'react';
import { Users, ChevronRight } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeProvider';

const GroupCard = ({ group, onClick }) => {
  const { themeConfig, theme, isDark } = useTheme();
  const currentTheme = themeConfig[theme];

  return (
    <div 
      onClick={() => onClick(group)}
      className={`${currentTheme.card} rounded-xl p-5 cursor-pointer transition-all duration-300 hover:scale-105`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg mb-1">{group.name}</h3>
          <p className={`${currentTheme.secondaryText} text-sm`}>{group.studentCount} Students</p>
        </div>
        <Users size={24} className={isDark ? 'text-purple-400' : 'text-purple-600'} />
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <span className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>
          View Attendance
        </span>
        <ChevronRight size={18} className="text-gray-400" />
      </div>
    </div>
  );
};

export default GroupCard;