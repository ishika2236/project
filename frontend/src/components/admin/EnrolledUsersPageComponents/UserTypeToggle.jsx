// UserTypeToggle.jsx
import React from 'react';
import { Users, UserCircle } from 'lucide-react';

const UserTypeToggle = ({ viewMode, setViewMode, theme, currentTheme }) => {
  return (
    <div className="flex mb-6 p-1 rounded-lg w-fit border border-opacity-20" style={{ 
      borderColor: theme === 'dark' ? '#1E2733' : '#BDC3C7'
    }}>
      <button
        onClick={() => setViewMode('students')}
        className={`px-4 py-2 rounded-md transition-all duration-300 ${
          viewMode === 'students' 
            ? theme === 'dark' 
              ? 'bg-[#121A22] text-white' 
              : 'bg-white text-[#1C2833] shadow-sm' 
            : `${currentTheme.text} opacity-60`
        }`}
      >
        <div className="flex items-center gap-2">
          <Users size={16} />
          <span>Students</span>
        </div>
      </button>
      <button
        onClick={() => setViewMode('teachers')}
        className={`px-4 py-2 rounded-md transition-all duration-300 ${
          viewMode === 'teachers' 
            ? theme === 'dark' 
              ? 'bg-[#121A22] text-white' 
              : 'bg-white text-[#1C2833] shadow-sm' 
            : `${currentTheme.text} opacity-60`
        }`}
      >
        <div className="flex items-center gap-2">
          <UserCircle size={16} />
          <span>Teachers</span>
        </div>
      </button>
    </div>
  );
};

export default UserTypeToggle;