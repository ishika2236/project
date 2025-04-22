import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeProvider';

import { Users, Clock, Calendar } from 'lucide-react';

const CourseOverview = ({ onSelectCourse }) => {
  const { themeConfig, theme } = useTheme();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulated data fetch
  useEffect(() => {
    // Mock API call
    setTimeout(() => {
      setCourses([
        {
          id: 1,
          name: 'Advanced Web Development',
          groups: 3,
          students: 45,
          upcoming: 2,
          completeRate: 85,
          nextClass: '2025-04-14 10:00 AM'
        },
        {
          id: 2,
          name: 'Data Structures & Algorithms',
          groups: 2,
          students: 32,
          upcoming: 1,
          completeRate: 92,
          nextClass: '2025-04-13 2:30 PM'
        },
        {
          id: 3,
          name: 'Machine Learning Fundamentals',
          groups: 4,
          students: 60,
          upcoming: 3,
          completeRate: 78,
          nextClass: '2025-04-15 9:00 AM'
        }
      ]);
      setLoading(false);
    }, 600);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${themeConfig[theme].text}`}>Your Courses</h2>
        <div className="flex space-x-2">
          <button className={`px-4 py-2 rounded-lg ${themeConfig[theme].button.primary}`}>
            Schedule Class
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div 
              key={i}
              className={`h-48 animate-pulse rounded-xl ${theme === 'dark' 
                ? 'bg-[#121A22]/60' 
                : 'bg-gray-100'}`}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div 
              key={course.id}
              onClick={() => onSelectCourse(course)}
              className={`${themeConfig[theme].card} rounded-xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className={`font-bold text-lg ${themeConfig[theme].text}`}>{course.name}</h3>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  theme === 'dark'
                    ? 'bg-[#506EE5]/20 text-blue-300' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {course.upcoming} Upcoming
                </div>
              </div>
              
              <div className="flex items-center mb-3">
                <Users size={16} className={`mr-2 ${themeConfig[theme].secondaryText}`} />
                <span className={`text-sm ${themeConfig[theme].secondaryText}`}>
                  {course.groups} Groups • {course.students} Students
                </span>
              </div>
              
              <div className="flex items-center mb-6">
                <Calendar size={16} className={`mr-2 ${themeConfig[theme].secondaryText}`} />
                <span className={`text-sm ${themeConfig[theme].secondaryText}`}>
                  Next: {new Date(course.nextClass).toLocaleString()}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className={`h-2 rounded-full ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-r from-[#506EE5] to-[#2F955A]' 
                      : 'bg-blue-600'
                  }`}
                  style={{ width: `${course.completeRate}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className={`text-xs ${themeConfig[theme].secondaryText}`}>Course Completion</span>
                <span className={`text-xs font-medium ${themeConfig[theme].text}`}>{course.completeRate}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseOverview; 