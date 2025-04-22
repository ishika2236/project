import React from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { useTheme } from '../../../context/ThemeProvider';
import NavigationButton from './utils/NavigationButton';
import SearchInput from './utils/SearchInput';

const Header = ({ 
  activeView, 
  selectedCourse, 
  selectedGroup, 
  selectedStudent,
  searchTerm,
  setSearchTerm,
  handleBack
}) => {
  const { themeConfig, theme, isDark } = useTheme();
  const currentTheme = themeConfig[theme];

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        {activeView !== 'overview' && (
          <NavigationButton onClick={handleBack} />
        )}
      </div>
      
      <h1 className={`text-2xl font-bold ${isDark ? currentTheme.gradient.text : 'text-gray-800'}`}>
        {activeView === 'overview' && 'Attendance Management Dashboard'}
        {activeView === 'course' && selectedCourse?.courseName}
        {activeView === 'group' && `${selectedCourse?.courseName} - ${selectedGroup?.name}`}
        {activeView === 'student' && selectedStudent?.name}
      </h1>
      
      <div className="flex gap-2">
        {activeView === 'group' && (
          <SearchInput 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students..."
          />
        )}
      </div>
    </div>
  );
};

export default Header;