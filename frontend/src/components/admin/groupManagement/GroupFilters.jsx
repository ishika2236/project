import React from 'react';
import { useTheme } from '../../../context/ThemeProvider';
import { Search, Filter } from 'lucide-react';

const GroupFilters = ({ 
  departments, 
  selectedDepartment, 
  setSelectedDepartment, 
  searchQuery, 
  setSearchQuery, 
  filterBy, 
  setFilterBy 
}) => {
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];
  
  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    if (departmentId === "") {
      setSelectedDepartment(null);
    } else {
      const department = departments.find(d => d._id === departmentId);
      setSelectedDepartment(department);
    }
  };

  // Get active button style by combining the primary button style
  const getFilterButtonStyle = (isActive) => {
    return isActive 
      ? colors.button.primary  // Use primary button style for active state
      : colors.button.secondary; // Use secondary button style for inactive state
  };

  return (
    <div className={`${colors.card} p-4 mb-6`}>
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className={colors.secondaryText} />
        </div>
        <input
          type="text"
          placeholder="Search groups..."
          className={`pl-10 w-full p-2 ${colors.input}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-1 ${colors.text}`}>
          Department
        </label>
        <select
          className={`w-full p-2 ${colors.select}`}
          value={selectedDepartment ? selectedDepartment._id : ""}
          onChange={handleDepartmentChange}
        >
          <option value="">All Departments</option>
          {departments.map(department => (
            <option key={department._id} value={department._id}>
              {department.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className={`block text-sm font-medium mb-1 ${colors.text}`}>
          Filter By Size
        </label>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded-md flex items-center ${getFilterButtonStyle(filterBy === 'all')}`}
            onClick={() => setFilterBy('all')}
          >
            <Filter size={14} className="mr-1" />
            All
          </button>
          <button
            className={`px-3 py-1 rounded-md flex items-center ${getFilterButtonStyle(filterBy === 'small')}`}
            onClick={() => setFilterBy('small')}
          >
            <Filter size={14} className="mr-1" />
            Small (&lt;15)
          </button>
          <button
            className={`px-3 py-1 rounded-md flex items-center ${getFilterButtonStyle(filterBy === 'large')}`}
            onClick={() => setFilterBy('large')}
          >
            <Filter size={14} className="mr-1" />
            Large (≥15)
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupFilters;