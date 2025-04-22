import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeProvider';

import { Users, Calendar, Clock, ArrowUpRight } from 'lucide-react';

const CourseDetails = ({ course, onSelectGroup }) => {
  const { themeConfig, theme } = useTheme();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulated data fetch
  useEffect(() => {
    // Mock API call for groups
    setTimeout(() => {
      setGroups([
        {
          id: 1,
          name: 'Group A',
          students: 15,
          completedClasses: 12,
          totalClasses: 16,
          attendanceRate: 92,
          nextClass: '2025-04-14 10:00 AM'
        },
        {
          id: 2,
          name: 'Group B',
          students: 18,
          completedClasses: 11,
          totalClasses: 16,
          attendanceRate: 87,
          nextClass: '2025-04-15 1:30 PM'
        },
        {
          id: 3,
          name: 'Group C',
          students: 12,
          completedClasses: 13,
          totalClasses: 16,
          attendanceRate: 94,
          nextClass: '2025-04-13 3:00 PM'
        }
      ]);
      setLoading(false);
    }, 600);
  }, [course]);

  if (!course) {
    return (
      <div className={`p-8 text-center ${themeConfig[theme].secondaryText}`}>
        Please select a course to view details
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold ${themeConfig[theme].text}`}>{course.name}</h2>
          <p className={`mt-1 ${themeConfig[theme].secondaryText}`}>
            {course.groups} Groups • {course.students} Students
          </p>
        </div>
        <div className="flex space-x-3">
          <button className={`px-4 py-2 rounded-lg ${themeConfig[theme].button.orange}`}>
            Create Group
          </button>
          <button className={`px-4 py-2 rounded-lg ${themeConfig[theme].button.green}`}>
            Export Data
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6`}>
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div 
              key={i}
              className={`h-40 animate-pulse rounded-xl ${theme === 'dark' 
                ? 'bg-[#121A22]/60' 
                : 'bg-gray-100'}`} 
            />
          ))
        ) : (
          groups.map(group => (
            <div
              key={group.id}
              onClick={() => onSelectGroup(group)}
              className={`${themeConfig[theme].card} rounded-xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-bold text-lg ${themeConfig[theme].text}`}>{group.name}</h3>
                <div className={`flex items-center ${
                  theme === 'dark' ? 'text-[#2F955A]' : 'text-green-600'
                }`}>
                  <span className="text-sm font-medium">View Classes</span>
                  <ArrowUpRight size={16} className="ml-1" />
                </div>
              </div>
              
              <div className="flex items-center mb-3">
                <Users size={16} className={`mr-2 ${themeConfig[theme].secondaryText}`} />
                <span className={`text-sm ${themeConfig[theme].secondaryText}`}>
                  {group.students} Students
                </span>
              </div>
              
              <div className="flex items-center mb-3">
                <Calendar size={16} className={`mr-2 ${themeConfig[theme].secondaryText}`} />
                <span className={`text-sm ${themeConfig[theme].secondaryText}`}>
                  {group.completedClasses}/{group.totalClasses} Classes
                </span>
              </div>
              
              <div className="flex items-center mb-4">
                <Clock size={16} className={`mr-2 ${themeConfig[theme].secondaryText}`} />
                <span className={`text-sm ${themeConfig[theme].secondaryText}`}>
                  Next: {new Date(group.nextClass).toLocaleString()}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className={`h-2 rounded-full ${
                    theme === 'dark' 
                      ? group.attendanceRate > 90 
                        ? 'bg-gradient-to-r from-[#2F955A] to-[#506EE5]' 
                        : group.attendanceRate > 75 
                          ? 'bg-gradient-to-r from-[#F2683C] to-[#506EE5]'
                          : 'bg-gradient-to-r from-[#F2683C] to-[#F24B4B]'
                      : group.attendanceRate > 90
                        ? 'bg-green-600'
                        : group.attendanceRate > 75
                          ? 'bg-orange-500'
                          : 'bg-red-500'
                  }`}
                  style={{ width: `${group.attendanceRate}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className={`text-xs ${themeConfig[theme].secondaryText}`}>Attendance Rate</span>
                <span className={`text-xs font-medium ${themeConfig[theme].text}`}>{group.attendanceRate}%</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseDetails;