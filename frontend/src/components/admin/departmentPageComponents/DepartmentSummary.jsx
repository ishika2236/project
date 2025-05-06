import React, { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Users, BookOpen } from 'lucide-react';

const DepartmentSummary = ({ departments, currentTheme, theme }) => {
  // Properly access the courses array from the nested state
  const { courses } = useSelector(state => state.courses);
  const { allGroups } = useSelector(state => state.groups);
  
  // Calculate total groups by counting all groups across all departments
  const totalGroups = useMemo(() => {
    let count = 0;
    // Check if allGroups is an object with department IDs as keys
    if (allGroups && typeof allGroups === 'object') {
      Object.keys(allGroups).forEach(deptId => {
        // Add the length of the groups array for this department if it exists
        if (Array.isArray(allGroups[deptId])) {
          count += allGroups[deptId].length;
        }
      });
    }
    return count;
  }, [allGroups]);
  
  // Calculate total courses
  const totalCourses = useMemo(() => {
    // If courses is available and is an array, return its length
    return Array.isArray(courses) ? courses.length : 0;
  }, [courses]);

  // Fallback to department data if Redux data is unavailable
  const displayGroups = useMemo(() => {
    if (totalGroups === 0 && departments) {
      // Use department data as fallback
      return departments.reduce((sum, dept) => sum + (dept.groupCount || 0), 0);
    }
    return totalGroups;
  }, [totalGroups, departments]);

  const displayCourses = useMemo(() => {
    if (totalCourses === 0 && departments) {
      // Use department data as fallback
      return departments.reduce((sum, dept) => sum + (dept.courseCount || 0), 0);
    }
    return totalCourses;
  }, [totalCourses, departments]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className={`${currentTheme.card} rounded-lg p-4 flex items-center`}>
        <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'} mr-4`}>
          <Grid size={24} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
        </div>
        <div>
          <p className={currentTheme.secondaryText}>Total Departments</p>
          <h3 className={`text-xl font-bold ${currentTheme.text}`}>{departments?.length || 0}</h3>
        </div>
      </div>
      
      <div className={`${currentTheme.card} rounded-lg p-4 flex items-center`}>
        <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'} mr-4`}>
          <Users size={24} className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} />
        </div>
        <div>
          <p className={currentTheme.secondaryText}>Total Groups</p>
          <h3 className={`text-xl font-bold ${currentTheme.text}`}>{displayGroups}</h3>
        </div>
      </div>
      
      <div className={`${currentTheme.card} rounded-lg p-4 flex items-center`}>
        <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-orange-900/30' : 'bg-orange-100'} mr-4`}>
          <BookOpen size={24} className={theme === 'dark' ? 'text-orange-400' : 'text-orange-600'} />
        </div>
        <div>
          <p className={currentTheme.secondaryText}>Total Courses</p>
          <h3 className={`text-xl font-bold ${currentTheme.text}`}>{displayCourses}</h3>
        </div>
      </div>
    </div>
  );
};

export default DepartmentSummary;