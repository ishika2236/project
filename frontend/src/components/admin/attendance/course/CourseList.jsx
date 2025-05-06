import React from 'react';
import { BookOpen } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeProvider';

const CourseList = ({ courses }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`${
      isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
    } border rounded-xl shadow-sm p-4`}>
      {courses.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No courses available</div>
      ) : (
        <div className="space-y-3">
          {courses.map(course => (
            <div key={course.id} className={`${
              isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
            } rounded-lg p-3 transition-colors flex justify-between items-center`}>
              <div className="flex items-center">
                <BookOpen size={18} className={`mr-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className="font-medium">{course.courseName}</span>
              </div>
              <div className={`${
                isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
              } px-2 py-1 rounded text-xs`}>
                {course.courseCode}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;