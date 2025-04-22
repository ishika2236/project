import React from 'react';
import { useTheme } from '../../../context/ThemeProvider';
import { Search } from 'lucide-react';

const GroupFilters = ({
  courses,
  selectedCourse,
  setSelectedCourse,
  searchQuery,
  setSearchQuery,
  filterBy,
  setFilterBy
}) => {
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];

  return (
    <div className={`${colors.card} rounded-lg p-4`}>
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-1 ${colors.text}`}>
          Filter by Course
        </label>
        <select
          className={`w-full p-2 border rounded-md ${theme === 'dark' ? `${colors.background}` : colors.background} ${colors.text} ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
          value={selectedCourse ? selectedCourse._id : ''}
          onChange={(e) => {
            const courseId = e.target.value;
            // Find the course object from the id
            const course = courseId ? courses.find(c => c._id === courseId) : null;
            setSelectedCourse(course);
          }}
        >
          <option value="">All Courses</option>
          {Array.isArray(courses) && courses.map(course => (
            <option key={course._id} value={course._id}>
              {course.courseName}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-1 ${colors.text}`}>
          Search Groups
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or teacher..."
            className={`w-full p-2 pl-8 border rounded-md ${theme === 'dark' ? 'bg-transparent' : colors.background} ${colors.text} ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={16} className={`absolute left-2 top-3 ${colors.icon}`} />
        </div>
      </div>
      
      <div>
        <label className={`block text-sm font-medium mb-1 ${colors.text}`}>
          Group Size
        </label>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-md text-sm ${filterBy === 'all' ? colors.button.primary : `${colors.secondaryText} bg-opacity-20`}`}
            onClick={() => setFilterBy('all')}
          >
            All
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${filterBy === 'small' ? colors.button.green : `${colors.secondaryText} bg-opacity-20`}`}
            onClick={() => setFilterBy('small')}
          >
            Small Groups
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${filterBy === 'large' ? colors.button.orange : `${colors.secondaryText} bg-opacity-20`}`}
            onClick={() => setFilterBy('large')}
          >
            Large Groups
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupFilters;