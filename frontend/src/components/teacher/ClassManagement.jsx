import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeProvider';

import { Calendar, Clock, Check, AlertCircle, Users, Plus, Edit, Trash2 } from 'lucide-react';

const ClassManagement = ({ course, group, onSelectClass }) => {
  const { themeConfig, theme } = useTheme();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedClassForEdit, setSelectedClassForEdit] = useState(null);

  // Simulated data fetch
  useEffect(() => {
    if (course && group) {
      // Mock API call for classes
      setTimeout(() => {
        setClasses([
          {
            id: 1,
            title: 'Introduction to React Hooks',
            date: '2025-04-14',
            time: '10:00 AM - 12:00 PM',
            attendanceStatus: 'pending',
            attendanceRate: null,
            topic: 'React Hooks',
            materials: 2
          },
          {
            id: 2,
            title: 'State Management with Redux',
            date: '2025-04-10',
            time: '10:00 AM - 12:00 PM',
            attendanceStatus: 'completed',
            attendanceRate: 92,
            topic: 'Redux',
            materials: 4
          },
          {
            id: 3,
            title: 'Component Lifecycle & Effects',
            date: '2025-04-07',
            time: '10:00 AM - 12:00 PM',
            attendanceStatus: 'completed',
            attendanceRate: 88,
            topic: 'Lifecycle Methods',
            materials: 3
          },
          {
            id: 4,
            title: 'Performance Optimization',
            date: '2025-04-03',
            time: '10:00 AM - 12:00 PM',
            attendanceStatus: 'completed',
            attendanceRate: 94,
            topic: 'Optimization',
            materials: 5
          }
        ]);
        setLoading(false);
      }, 600);
    }
  }, [course, group]);

  const handleScheduleClass = () => {
    setSelectedClassForEdit(null);
    setShowScheduleModal(true);
  };

  const handleEditClass = (classItem) => {
    setSelectedClassForEdit(classItem);
    setShowScheduleModal(true);
  };

  if (!course || !group) {
    return (
      <div className={`p-8 text-center ${themeConfig[theme].secondaryText}`}>
        Please select a course and group to view classes
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold ${themeConfig[theme].text}`}>{group.name} Classes</h2>
          <p className={`mt-1 ${themeConfig[theme].secondaryText}`}>
            {course.name} • {group.completedClasses}/{group.totalClasses} Classes Completed
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleScheduleClass}
            className={`px-4 py-2 rounded-lg flex items-center ${themeConfig[theme].button.primary}`}
          >
            <Plus size={18} className="mr-2" />
            Schedule Class
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div 
              key={i}
              className={`h-24 animate-pulse rounded-lg ${theme === 'dark' 
                ? 'bg-[#121A22]/60' 
                : 'bg-gray-100'}`} 
            />
          ))
        ) : (
          classes.map(classItem => (
            <div
              key={classItem.id}
              className={`${themeConfig[theme].card} rounded-lg p-4 ${
                new Date(classItem.date) > new Date() 
                  ? theme === 'dark' 
                    ? 'border-l-4 border-l-[#506EE5]' 
                    : 'border-l-4 border-l-blue-600'
                  : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className={`font-medium text-lg ${themeConfig[theme].text}`}>{classItem.title}</h3>
                    {classItem.attendanceStatus === 'completed' ? (
                      <span className={`ml-3 px-2 py-1 rounded-full text-xs ${
                        theme === 'dark' 
                          ? 'bg-[#2F955A]/20 text-green-300' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        <Check size={12} className="inline mr-1" />
                        Completed
                      </span>
                    ) : (
                      <span className={`ml-3 px-2 py-1 rounded-full text-xs ${
                        theme === 'dark' 
                          ? 'bg-[#F2683C]/20 text-orange-300' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        <AlertCircle size={12} className="inline mr-1" />
                        Upcoming
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    <div className="flex items-center">
                      <Calendar size={16} className={`mr-1 ${themeConfig[theme].secondaryText}`} />
                      <span className={`text-sm ${themeConfig[theme].secondaryText}`}>
                        {new Date(classItem.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock size={16} className={`mr-1 ${themeConfig[theme].secondaryText}`} />
                      <span className={`text-sm ${themeConfig[theme].secondaryText}`}>
                        {classItem.time}
                      </span>
                    </div>
                    
                    {classItem.attendanceStatus === 'completed' && (
                      <div className="flex items-center">
                        <Users size={16} className={`mr-1 ${themeConfig[theme].secondaryText}`} />
                        <span className={`text-sm ${themeConfig[theme].secondaryText}`}>
                          {classItem.attendanceRate}% Attendance
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {classItem.attendanceStatus === 'pending' ? (
                    <>
                      <button 
                        onClick={() => handleEditClass(classItem)}
                        className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-[#1E2733]' : 'hover:bg-gray-100'}`}
                      >
                        <Edit size={18} className={themeConfig[theme].secondaryText} />
                      </button>
                      <button 
                        className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-[#1E2733]' : 'hover:bg-gray-100'}`}
                      >
                        <Trash2 size={18} className={theme === 'dark' ? 'text-red-400' : 'text-red-500'} />
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => onSelectClass(classItem)}
                      className={`px-3 py-1 rounded-lg text-sm ${themeConfig[theme].button.primary}`}
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Schedule Class Modal would be implemented here */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${theme === 'dark' ? 'bg-[#121A22]' : 'bg-white'} rounded-xl p-6 w-full max-w-md`}>
            <h3 className={`text-xl font-bold mb-4 ${themeConfig[theme].text}`}>
              {selectedClassForEdit ? 'Edit Class' : 'Schedule New Class'}
            </h3>
            {/* Form would go here */}
            <div className="flex justify-end mt-6 space-x-3">
              <button 
                onClick={() => setShowScheduleModal(false)}
                className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:bg-[#1E2733]' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Cancel
              </button>
              <button className={`px-4 py-2 rounded-lg ${themeConfig[theme].button.primary}`}>
                {selectedClassForEdit ? 'Save Changes' : 'Schedule Class'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagement;
