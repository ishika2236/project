import React from 'react';
import { Users } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeProvider';

const GroupCard = ({ group, onClick }) => {
  const { isDark } = useTheme();
  
  return (
    <div 
      className={`${
        isDark 
          ? 'bg-gray-800/50 hover:bg-gray-800/80 border-gray-700' 
          : 'bg-white hover:bg-gray-50 border-gray-200'
      } border cursor-pointer rounded-xl shadow-sm transition-all duration-200 p-5`}
      onClick={() => onClick(group)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{group.name}</h3>
      </div>
      
      <div className="flex items-center justify-between">
        <div className={`flex items-center ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
          <Users size={16} className="mr-1" />
          <span>{group.studentCount} Students</span>
        </div>
        <div className={`${
          isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
        } px-3 py-1 rounded-md text-sm`}>
          View Students
        </div>
      </div>
    </div>
  );
};

export default GroupCard;