import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  MoreVertical,
  Book,
  CheckCircle,
  AlertCircle,
  Clipboard,
  X
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { getClassesByClassroom } from '../../app/features/class/classThunks';
import { reset } from '../../app/features/class/classSlice';
import { useTheme } from '../../context/ThemeProvider';
import ClassAttendanceController from './ClassAttendanceController'; // Import the attendance controller

export default function ScheduledClasses({ classroom }) {
  const { theme, themeConfig, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  
  const [view, setView] = useState('today'); // 'today', 'upcoming', 'all'
  const [selectedClass, setSelectedClass] = useState(null); // Track the selected class for attendance
  const [showAttendanceModal, setShowAttendanceModal] = useState(false); // Control attendance modal visibility
  
  const classroomId = classroom?.id;
  const dispatch = useDispatch();
  const { classes, isLoading, isError, message } = useSelector((state) => state.classes);

  useEffect(() => {
    if (classroomId) {
      dispatch(getClassesByClassroom(classroomId));
    }
    
    // Cleanup function
    return () => {
      dispatch(reset());
    };
  }, [dispatch, classroomId]);

  // Function to check if a class is happening now
  const isClassOngoing = (classItem) => {
    const now = new Date();
    
    // Handle extra classes specifically based on extraClassDate
    if (classItem.isExtraClass && classItem.extraClassDate) {
      // Convert extraClassDate to date object
      const extraClassDate = new Date(classItem.extraClassDate);
      
      // Check if today is the same day as the extra class date
      const isSameDay = 
        now.getFullYear() === extraClassDate.getFullYear() &&
        now.getMonth() === extraClassDate.getMonth() &&
        now.getDate() === extraClassDate.getDate();
      
      if (!isSameDay) return false;
      
      // Parse start and end times for the extra class
      const [startHours, startMinutes] = classItem.schedule.startTime.split(':').map(Number);
      const [endHours, endMinutes] = classItem.schedule.endTime.split(':').map(Number);
      
      // Create Date objects for start and end times today
      const classStart = new Date(now);
      classStart.setHours(startHours, startMinutes, 0);
      
      const classEnd = new Date(now);
      classEnd.setHours(endHours, endMinutes, 0);
      
      // Check if current time is between start and end
      return now >= classStart && now <= classEnd;
    }
    
    // For regular classes, check schedule
    const today = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Check if class is scheduled for today
    if (!classItem.schedule.daysOfWeek.includes(today)) {
      return false;
    }
    
    // Parse start and end times
    const [startHours, startMinutes] = classItem.schedule.startTime.split(':').map(Number);
    const [endHours, endMinutes] = classItem.schedule.endTime.split(':').map(Number);
    
    // Create Date objects for start and end times today
    const classStart = new Date(now);
    classStart.setHours(startHours, startMinutes, 0);
    
    const classEnd = new Date(now);
    classEnd.setHours(endHours, endMinutes, 0);
    
    // Check if current time is between start and end
    return now >= classStart && now <= classEnd;
  };

  // Function to check if a class is scheduled for today
  const isClassToday = (classItem) => {
    const today = new Date();
    
    // Handle extra classes specifically
    if (classItem.isExtraClass && classItem.extraClassDate) {
      const extraClassDate = new Date(classItem.extraClassDate);
      
      // Check if today is the same day as the extra class date
      return (
        today.getFullYear() === extraClassDate.getFullYear() &&
        today.getMonth() === extraClassDate.getMonth() &&
        today.getDate() === extraClassDate.getDate()
      );
    }
    
    // For regular classes
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const isScheduledForToday = classItem.schedule.daysOfWeek.includes(dayOfWeek);
    const hasStarted = classItem.schedule.startDate ? new Date(classItem.schedule.startDate) <= today : true;
    const hasEnded = classItem.schedule.endDate ? today <= new Date(classItem.schedule.endDate) : true;
    
    return isScheduledForToday && hasStarted && hasEnded && classItem.status !== 'completed';
  };

  // Function to format time
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };

  // Filter classes based on view
  const filteredClasses = Array.isArray(classes) ? classes.filter(classItem => {
    if (view === 'today') {
      return isClassToday(classItem) || isClassOngoing(classItem);
    } else if (view === 'upcoming') {
      return classItem.status === 'scheduled';
    } else {
      return true; // 'all' view
    }
  }) : [];

  // Sort classes - ongoing first, then by start time
  const sortedClasses = [...filteredClasses].sort((a, b) => {
    // Ongoing classes first
    if (isClassOngoing(a) && !isClassOngoing(b)) return -1;
    if (!isClassOngoing(a) && isClassOngoing(b)) return 1;
    
    // Then sort by start time
    const aTime = a.schedule.startTime;
    const bTime = b.schedule.startTime;
    return aTime.localeCompare(bTime);
  });

  const renderClassStatus = (classItem) => {
    if (isClassOngoing(classItem)) {
      return (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'} text-xs font-medium`}>
          <CheckCircle size={12} />
          <span>In Progress</span>
        </div>
      );
    } else if (classItem.status === 'scheduled') {
      return (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'} text-xs font-medium`}>
          <Clock size={12} />
          <span>Scheduled</span>
        </div>
      );
    } else {
      return (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'} text-xs font-medium`}>
          <AlertCircle size={12} />
          <span>Completed</span>
        </div>
      );
    }
  };

  // Function to open attendance modal for a class
  const openAttendance = (classItem) => {
    setSelectedClass(classItem);
    setShowAttendanceModal(true);
  };

  // Function to close attendance modal
  const closeAttendanceModal = () => {
    setShowAttendanceModal(false);
    setSelectedClass(null);
  };

  // Function to format class date (for extra classes)
  const formatClassDate = (classItem) => {
    if (classItem.isExtraClass && classItem.extraClassDate) {
      const extraDate = new Date(classItem.extraClassDate);
      return extraDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } else {
      return `${new Date(classItem.schedule.startDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })} - ${new Date(classItem.schedule.endDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })}`;
    }
  };

  // Function to display class type tag
  const renderClassTypeTag = (classItem) => {
    if (classItem.isExtraClass) {
      return (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'} text-xs font-medium ml-2`}>
          <Calendar size={12} />
          <span>Extra Class</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={isDark ? themeConfig.dark.background : themeConfig.light.background}>
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? themeConfig.dark.text : themeConfig.light.text}`}>
              Class Schedule
            </h1>
            <p className={isDark ? themeConfig.dark.secondaryText : themeConfig.light.secondaryText}>
              Manage your upcoming and ongoing classes
            </p>
          </div>
        </div>

        {/* View Selection Tabs */}
        <div className={`flex rounded-lg overflow-hidden mb-6 ${isDark ? 'bg-[#1E2733]' : 'bg-white border border-gray-200'}`}>
          <button
            onClick={() => setView('today')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              view === 'today'
                ? (isDark ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white')
                : (isDark ? 'text-gray-300 hover:bg-[#2A3744]' : 'text-gray-700 hover:bg-gray-100')
            }`}
          >
            Today's Classes
          </button>
          <button
            onClick={() => setView('upcoming')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              view === 'upcoming'
                ? (isDark ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white')
                : (isDark ? 'text-gray-300 hover:bg-[#2A3744]' : 'text-gray-700 hover:bg-gray-100')
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setView('all')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              view === 'all'
                ? (isDark ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white')
                : (isDark ? 'text-gray-300 hover:bg-[#2A3744]' : 'text-gray-700 hover:bg-gray-100')
            }`}
          >
            All Classes
          </button>
        </div>

        {/* Class List */}
        {isLoading ? (
          <div className={`flex justify-center items-center p-8 rounded-lg ${isDark ? 'bg-[#1E2733]' : 'bg-white border border-gray-200'}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : sortedClasses.length === 0 ? (
          <div className={`text-center p-8 rounded-lg ${isDark ? 'bg-[#1E2733]' : 'bg-white border border-gray-200'}`}>
            <div className={`text-6xl mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>📚</div>
            <h3 className="text-xl font-medium mb-2">No Classes Found</h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              {view === 'today' 
                ? "You don't have any classes scheduled for today." 
                : view === 'upcoming' 
                  ? "You don't have any upcoming classes scheduled." 
                  : "No classes found in your schedule."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Ongoing Classes Section */}
            {sortedClasses.some(classItem => isClassOngoing(classItem)) && (
              <div className="mb-6">
                <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full bg-green-500 animate-pulse`}></div>
                    In Progress
                  </div>
                </h2>
                <div className="space-y-3">
                  {sortedClasses
                    .filter(classItem => isClassOngoing(classItem))
                    .map(classItem => (
                      <div
                        key={classItem._id}
                        className={`rounded-lg p-4 border-l-4 border-green-500 ${
                          isDark ? 'bg-[#1E2733]' : 'bg-white shadow-sm border-t border-r border-b border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-medium text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>{classItem.title}</h3>
                              {renderClassStatus(classItem)}
                              {renderClassTypeTag(classItem)}
                            </div>
                            <div className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                              {classItem.course.courseName || classItem.course} ({classItem.course.courseCode || ''})
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-2">
                              <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                <Clock size={16} />
                                <span>{formatTime(classItem.schedule.startTime)} - {formatTime(classItem.schedule.endTime)}</span>
                              </div>
                              <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                <Users size={16} />
                                <span>{classItem.teacher?.firstName} {classItem.teacher?.lastName}</span>
                              </div>
                              {classItem.isExtraClass && (
                                <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                  <Calendar size={16} />
                                  <span>Extra class on {new Date(classItem.extraClassDate).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openAttendance(classItem)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                                isDark 
                                  ? 'bg-blue-700 hover:bg-blue-800 text-white' 
                                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                              } transition-colors`}
                            >
                              <Clipboard size={16} />
                              Manage Attendance
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Scheduled Classes Section */}
            <div>
              <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  {view === 'today' ? "Today's Schedule" : view === 'upcoming' ? "Upcoming Classes" : "All Classes"}
                </div>
              </h2>
              <div className="space-y-3">
                {sortedClasses
                  .filter(classItem => !isClassOngoing(classItem))
                  .map(classItem => (
                    <div
                      key={classItem._id}
                      className={`rounded-lg p-4 ${
                        isDark 
                          ? 'bg-[#1E2733] hover:bg-[#2A3744]' 
                          : 'bg-white shadow-sm border border-gray-200 hover:border-blue-300'
                      } transition-colors cursor-pointer`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-medium text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>{classItem.title}</h3>
                            {renderClassStatus(classItem)}
                            {renderClassTypeTag(classItem)}
                          </div>
                          <div className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                            {classItem.course.courseName || classItem.course} ({classItem.course.courseCode || ''})
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              <Clock size={16} />
                              <span>{formatTime(classItem.schedule.startTime)} - {formatTime(classItem.schedule.endTime)}</span>
                            </div>
                            <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              <Users size={16} />
                              <span>{classItem.teacher?.firstName} {classItem.teacher?.lastName}</span>
                            </div>
                            <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              <Book size={16} />
                              <span>{classItem.department?.code || (classItem.department && classItem.department.name)}</span>
                            </div>
                            <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              <Calendar size={16} />
                              <span>
                                {classItem.isExtraClass && classItem.extraClassDate 
                                  ? new Date(classItem.extraClassDate).toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric',
                                      year: 'numeric'
                                    })
                                  : classItem.schedule.startDate && classItem.schedule.endDate
                                    ? `${new Date(classItem.schedule.startDate).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric' 
                                      })} - ${new Date(classItem.schedule.endDate).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric' 
                                      })}`
                                    : 'Date not specified'
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={20} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Attendance Modal */}
      {showAttendanceModal && selectedClass && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-[#1E2733]' : 'bg-white'} rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto`}>
            <div className={`p-4 ${isDark ? 'bg-[#2A3744]' : 'bg-gray-100'} flex justify-between items-center sticky top-0 z-10`}>
              <h2 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Attendance Management - {selectedClass.title}
                {selectedClass.isExtraClass && " (Extra Class)"}
              </h2>
              <button
                onClick={closeAttendanceModal}
                className={`p-2 rounded-full ${isDark ? 'hover:bg-[#3A4755] text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <ClassAttendanceController classItem={selectedClass} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}