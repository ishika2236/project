import React from 'react';
import CourseCard from '../overview/CourseCard';

const OverviewView = ({ courses, groups, handleCourseSelect }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <CourseCard 
            key={course.id}
            course={course}
            groups={groups}
            onClick={handleCourseSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default OverviewView;