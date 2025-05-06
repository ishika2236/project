import React from 'react';
import { useTheme } from '../../../../context/ThemeProvider';
import GroupCard from '../group/GroupCard';
import CourseList from '../course/CourseList';

const DepartmentView = ({ department, groups, courses, handleGroupSelect }) => {
  const { isDark } = useTheme();
  
  const departmentGroups = groups.filter(group => group.departmentId === department.id);
  const departmentCourses = courses.filter(course => course.departmentId === department.id);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{department.name} Department</h2>
        <div className={`px-3 py-1 rounded-md ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
          {department.studentCount} Students
        </div>
      </div>
      
      {/* Department Courses Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Courses</h3>
        <CourseList courses={departmentCourses} />
      </div>
      
      {/* Department Groups Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Groups</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departmentGroups.map(group => (
            <GroupCard 
              key={group.id}
              group={group}
              onClick={handleGroupSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentView;