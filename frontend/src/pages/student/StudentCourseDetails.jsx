import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeProvider';
import { Calendar, Clock, User } from 'lucide-react';

const StudentCourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { themeConfig, theme } = useTheme();
  
  const [course, setCourse] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch from API
    const fetchCourseData = async () => {
      try {
        // Mock course data
        setCourse({
          _id: courseId,
          name: courseId === '1' ? 'Programming 101' : 
                courseId === '2' ? 'Data Structures' : 
                courseId === '3' ? 'Web Development' : 'Mobile Apps',
          code: courseId === '1' ? 'CS101' : 
                courseId === '2' ? 'CS201' : 
                courseId === '3' ? 'CS301' : 'CS401',
          description: 'This course covers the fundamental concepts and practices of the subject.',
          instructor: 'Dr. Jane Smith',
          schedule: 'Mon, Wed, Fri - 10:00 AM to 11:30 AM',
          totalClasses: 16,
          completedClasses: courseId === '1' ? 14 : 
                          courseId === '2' ? 9 : 
                          courseId === '3' ? 18 : 7,
        });

        // Mock classes data
        setClasses([
          {
            _id: '101',
            title: 'Introduction to the Course',
            date: '2025-01-15',
            time: '10:00 AM - 11:30 AM',
            status: 'completed',
            attendance: 'present'
          },
          {
            _id: '102',
            title: 'Basic Concepts',
            date: '2025-01-17',
            time: '10:00 AM - 11:30 AM',
            status: 'completed',
            attendance: 'present'
          },
          {
            _id: '103',
            title: 'Advanced Topics Part 1',
            date: '2025-01-20',
            time: '10:00 AM - 11:30 AM',
            status: 'completed',
            attendance: 'absent'
          },
          {
            _id: '104',
            title: 'Project Planning',
            date: '2025-04-15',
            time: '10:00 AM - 11:30 AM',
            status: 'upcoming'
          },
          {
            _id: '105',
            title: 'Final Review',
            date: '2025-04-17',
            time: '10:00 AM - 11:30 AM',
            status: 'upcoming'
          }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course data:', error);
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleClassClick = (classId) => {
    navigate(`/student/courses/${courseId}/classes/${classId}/materials`);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${themeConfig[theme].text}`}>
        Loading course details...
      </div>
    );
  }

  if (!course) {
    return (
      <div className={`flex items-center justify-center h-64 ${themeConfig[theme].text}`}>
        Course not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className={`${themeConfig[theme].card} p-6 rounded-lg`}>
        <h1 className={`text-2xl font-bold ${themeConfig[theme].gradient.text}`}>
          {course.name} <span className={`text-sm ${themeConfig[theme].secondaryText}`}>({course.code})</span>
        </h1>
        <p className={`mt-2 ${themeConfig[theme].text}`}>{course.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="flex items-center">
            <User size={18} className={themeConfig[theme].icon} />
            <span className={`ml-2 ${themeConfig[theme].text}`}>Instructor: {course.instructor}</span>
          </div>
          <div className="flex items-center">
            <Calendar size={18} className={themeConfig[theme].icon} />
            <span className={`ml-2 ${themeConfig[theme].text}`}>{course.schedule}</span>
          </div>
          <div className="flex items-center">
            <Clock size={18} className={themeConfig[theme].icon} />
            <span className={`ml-2 ${themeConfig[theme].text}`}>
              {course.completedClasses} of {course.totalClasses} classes completed
            </span>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className={`${themeConfig[theme].card} p-6 rounded-lg`}>
        <h2 className={`text-lg font-semibold mb-3 ${themeConfig[theme].text}`}>Course Progress</h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div 
            className={`${themeConfig[theme].gradient.accent} h-2.5 rounded-full`} 
            style={{ width: `${(course.completedClasses / course.totalClasses) * 100}%` }}
          ></div>
        </div>
        <p className={`mt-2 text-right ${themeConfig[theme].secondaryText}`}>
          {Math.round((course.completedClasses / course.totalClasses) * 100)}% Complete
        </p>
      </div>
      
      {/* Class Schedule */}
      <div className={`${themeConfig[theme].card} p-6 rounded-lg`}>
        <h2 className={`text-lg font-semibold mb-4 ${themeConfig[theme].text}`}>Class Schedule</h2>
        
        <div className="space-y-4">
          {classes.map((classItem) => (
            <div 
              key={classItem._id}
              onClick={() => handleClassClick(classItem._id)}
              className={`${themeConfig[theme].button.gradient} p-4 rounded-lg cursor-pointer hover:opacity-90 transition-opacity`}
            >
              <div className="flex flex-wrap justify-between items-center">
                <h3 className={`text-base font-medium ${themeConfig[theme].text}`}>{classItem.title}</h3>
                <span 
                  className={`text-xs px-2 py-1 rounded ${
                    classItem.status === 'completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                  }`}
                >
                  {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                </span>
              </div>
              
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="flex items-center">
                  <Calendar size={14} className={themeConfig[theme].secondaryText} />
                  <span className={`ml-1 text-sm ${themeConfig[theme].secondaryText}`}>
                    {new Date(classItem.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock size={14} className={themeConfig[theme].secondaryText} />
                  <span className={`ml-1 text-sm ${themeConfig[theme].secondaryText}`}>
                    {classItem.time}
                  </span>
                </div>
                {classItem.attendance && (
                  <div className={`text-sm ${
                    classItem.attendance === 'present' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    Attendance: {classItem.attendance.charAt(0).toUpperCase() + classItem.attendance.slice(1)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentCourseDetail;