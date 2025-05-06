import React from 'react';
import { BookOpen, Users } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeProvider';

const DepartmentCard = ({ department, onClick }) => {
  const { isDark } = useTheme();
  
  return (
    <div 
      className={`${
        isDark 
          ? 'bg-gray-800/50 hover:bg-gray-800/80 border-gray-700' 
          : 'bg-white hover:bg-gray-50 border-gray-200'
      } border cursor-pointer rounded-xl shadow-sm transition-all duration-200 p-5`}
      onClick={() => onClick(department)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{department.name}</h3>
      </div>
      
      <div className="flex items-center justify-between">
        <div className={`flex items-center ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
          <Users size={16} className="mr-1" />
          <span>{department.studentCount} Students</span>
        </div>
        <div className={`${
          isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'
        } px-3 py-1 rounded-md text-sm`}>
          View Groups
        </div>
      </div>
    </div>
  );
};

export default DepartmentCard;