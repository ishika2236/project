import React from 'react';
import { useTheme } from '../../../../context/ThemeProvider';
import GroupCard from '../course/GroupCard';

const CourseView = ({ course, groups, handleGroupSelect }) => {
  const { isDark } = useTheme();
  
  const courseGroups = groups.filter(group => group.courseId === course.id);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Groups in {course.courseName}</h2>
        <div className={`px-3 py-1 rounded-md ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
          {course.courseCode}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courseGroups.map(group => (
          <GroupCard 
            key={group.id}
            group={group}
            onClick={handleGroupSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseView;