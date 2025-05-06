import React from 'react';
import { Plus, Search } from 'lucide-react';
import { useTheme } from '../../../context/ThemeProvider';

const DepartmentHeader = ({ onCreateClick, onSearch, searchTerm }) => {
  const { themeConfig, theme } = useTheme();
  const currentTheme = themeConfig[theme];
  
  return (
    <div className="mb-6">
      <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? currentTheme.gradient.text : 'text-gray-800'}`}>
        Department Management
      </h1>
      <p className={`${currentTheme.secondaryText} mb-6`}>
        Create, view, and manage academic departments across the institution
      </p>
      
      <div className="flex flex-wrap justify-between items-center">
        <div className="mb-4 md:mb-0">
          <button 
            className={`${currentTheme.button.primary} px-4 py-2 rounded-lg flex items-center`}
            onClick={onCreateClick}
          >
            <Plus size={16} className="mr-2" />
            Create Department
          </button>
        </div>
        
        <div className={`relative ${theme === 'dark' ? 'bg-[#121A22]' : 'bg-gray-100'} rounded-lg flex items-center px-3 py-2 w-full md:w-64`}>
          <Search size={18} className={currentTheme.secondaryText} />
          <input
            type="text"
            placeholder="Search departments..."
            className={`${theme === 'dark' ? 'bg-[#121A22]' : 'bg-gray-100'} ${currentTheme.text} ml-2 focus:outline-none w-full`}
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default DepartmentHeader;