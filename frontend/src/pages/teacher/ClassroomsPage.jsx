import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Book, Calendar, Clock, File, Users, CheckCircle, PlusCircle, ChevronRight, ArrowLeft, Bell, Sun, Moon, UserCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeProvider';
import ClassroomList from '../../components/teacher/ClassroomList';
import ClassroomHeader from '../../components/teacher/ClassroomHeader';
import ClassScheduler from '../../components/teacher/ClassScheduler';
import HomeworkPanel from '../../components/teacher/HomeworkPanel';
import MaterialsSharing from '../../components/teacher/MaterialSharing';
import ActiveAttendance from '../../components/teacher/ActiveAttendance';
import ClassHistory from '../../components/teacher/ClassHistory';
import { fetchTeacherClassrooms } from '../../app/features/class/classThunks';

// Main Dashboard Component
export default function TeacherDashboard() {
  const dispatch = useDispatch();
  const [view, setView] = useState('classrooms'); // 'classrooms', 'classroom'
  const [activeClassroom, setActiveClassroom] = useState(null);
  const [attendanceActive, setAttendanceActive] = useState(false);
  const [activeTab, setActiveTab] = useState('materials');
  
  // Access theme from context
  const { theme, toggleTheme, themeConfig, isDark } = useTheme();
  
  // Get the current theme config
  const currentTheme = themeConfig[theme];

  // Get teacher classrooms from Redux store
  const { teacherClassrooms, loading: classroomsLoading } = useSelector(state => state.classes);
  
  // Loading state
  const isLoading = classroomsLoading;

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchTeacherClassrooms());
   
  }, [dispatch]);
  
  // Transform teaching assignments into classroom data format
  const getClassroomData = () => {
    // If no teaching assignments yet, return empty array
    if (!teacherClassrooms?.teachingAssignments?.length) return [];
    
    // Map teaching assignments to the format expected by ClassroomList
    return teacherClassrooms.teachingAssignments.map(assignment => {
      const { course, group } = assignment;
      
      // Get next class info (simplified example - would need real schedule data)
      const nextClass = course.schedule?.length > 0 
        ? formatNextClassTime(course.schedule[0]) 
        : "No scheduled classes";
      
      // Calculate attendance rate (this is a placeholder - would need real attendance data)
      const attendanceRate = group
        ? `${Math.floor(85 + Math.random() * 15)}%` // Placeholder calculation
        : "N/A";
      
      return {
        id: course._id,
        courseName: course.courseName,
        groupName: group ? group.name : "Unassigned",
        department: course.department?.name || "Department",
        students: group ? (group.students?.length || 0) : 0,
        nextClass,
        attendanceRate,
        // Include the full course object for detailed views
        courseDetails: course,
        // Include the related group
        relatedGroups: group ? [group] : []
      };
    });
  };

  // Helper function to format next class time
  const formatNextClassTime = (schedule) => {
    if (!schedule) return "Not scheduled";
    
    // This is a placeholder - you would use actual schedule data
    // and format with a date library like date-fns or moment.js
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // Placeholder logic - replace with actual schedule parsing
    if (schedule.day && schedule.time) {
      const scheduleDay = days.indexOf(schedule.day);
      if (scheduleDay === dayOfWeek) {
        return `Today, ${schedule.time}`;
      } else if (scheduleDay === (dayOfWeek + 1) % 7) {
        return `Tomorrow, ${schedule.time}`;
      } else {
        return `${schedule.day}, ${schedule.time}`;
      }
    }
    
    return "Schedule information unavailable";
  };

  const handleClassroomSelect = (classroom) => {
    setActiveClassroom(classroom);
    setView('classroom');
  };

  const handleBackToClasses = () => {
    setView('classrooms');
    setActiveClassroom(null);
    setAttendanceActive(false);
  };

  const toggleAttendance = () => {
    setAttendanceActive(!attendanceActive);
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDark ? 'bg-gradient-to-br from-[#0A0E13] to-[#121A22]' : 'bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6]'}`}>
      {/* Header */}
      <header className={`p-4 ${isDark ? 'bg-[#0F1419] border-b border-[#1E2733]' : 'bg-white border-b border-gray-200'}`}>
        <div className="flex justify-between items-center">
          {view === 'classroom' ? (
            <button 
              className={`flex items-center gap-2 ${isDark ? 'text-white hover:text-blue-400' : 'text-indigo-600 hover:text-indigo-800'}`}
              onClick={handleBackToClasses}
            >
              <ArrowLeft size={18} />
              <span>Back to Classes</span>
            </button>
          ) : (
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Teacher Dashboard
            </h1>
          )}
          
          <div className="flex items-center gap-4">
            <button className={`p-2 rounded-full ${isDark ? 'bg-[#1E2733] text-white' : 'bg-gray-100 text-gray-700'}`}>
              <Bell size={18} />
            </button>
            <button 
              className={`p-2 rounded-full ${isDark ? 'bg-[#1E2733] text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={toggleTheme}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6">
        {isLoading ? (
          <div className={`flex justify-center items-center h-64 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-blue-400 mb-4"></div>
              <p>Loading classroom data...</p>
            </div>
          </div>
        ) : view === 'classrooms' ? (
          <ClassroomList 
            classrooms={getClassroomData()} 
            onSelect={handleClassroomSelect} 
            isDark={isDark} 
          />
        ) : (
          <div className="flex flex-col space-y-6">
            {attendanceActive ? (
              <ActiveAttendance 
                classroom={activeClassroom} 
                onClose={toggleAttendance}
                isDark={isDark}
              />
            ) : (
              <>
                <ClassroomHeader 
                  classroom={activeClassroom} 
                  onAttendanceToggle={toggleAttendance}
                  isDark={isDark} 
                />
                <div className={`${isDark ? currentTheme.card : 'bg-white bg-opacity-90 rounded-xl shadow-md border border-purple-200 backdrop-blur-sm'}`}>
                  <div className={`flex ${isDark ? 'border-b border-[#1E2733]' : 'border-b border-purple-200'}`}>
                    <button 
                      className={`px-6 py-4 font-medium text-sm ${activeTab === 'materials' 
                        ? (isDark ? 'border-b-2 border-[#506EE5] text-[#506EE5]' : 'border-b-2 border-pink-500 text-pink-500') 
                        : (isDark ? 'text-white' : 'text-indigo-700')}`}
                      onClick={() => setActiveTab('materials')}
                    >
                      Materials
                    </button>
                    <button 
                      className={`px-6 py-4 font-medium text-sm ${activeTab === 'schedule' 
                        ? (isDark ? 'border-b-2 border-[#506EE5] text-[#506EE5]' : 'border-b-2 border-pink-500 text-pink-500') 
                        : (isDark ? 'text-white' : 'text-indigo-700')}`}
                      onClick={() => setActiveTab('schedule')}
                    >
                      Schedule
                    </button>
                    <button 
                      className={`px-6 py-4 font-medium text-sm ${activeTab === 'homework' 
                        ? (isDark ? 'border-b-2 border-[#506EE5] text-[#506EE5]' : 'border-b-2 border-pink-500 text-pink-500') 
                        : (isDark ? 'text-white' : 'text-indigo-700')}`}
                      onClick={() => setActiveTab('homework')}
                    >
                      Homework
                    </button>
                    <button 
                      className={`px-6 py-4 font-medium text-sm ${activeTab === 'history' 
                        ? (isDark ? 'border-b-2 border-[#506EE5] text-[#506EE5]' : 'border-b-2 border-pink-500 text-pink-500') 
                        : (isDark ? 'text-white' : 'text-indigo-700')}`}
                      onClick={() => setActiveTab('history')}
                    >
                      Class History
                    </button>
                  </div>
                  <div className="p-6">
                    {activeTab === 'materials' && (
                      <MaterialsSharing 
                        isDark={isDark} 
                        currentTheme={currentTheme} 
                        classroom={activeClassroom}
                      />
                    )}
                    {activeTab === 'schedule' && (
                      <ClassScheduler 
                        isDark={isDark} 
                        currentTheme={currentTheme} 
                        classroom={activeClassroom}
                      />
                    )}
                    {activeTab === 'homework' && (
                      <HomeworkPanel 
                        isDark={isDark} 
                        currentTheme={currentTheme} 
                        classroom={activeClassroom}
                      />
                    )}
                    {activeTab === 'history' && (
                      <ClassHistory 
                        isDark={isDark} 
                        currentTheme={currentTheme} 
                        classroom={activeClassroom}
                      />
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Optional: Show teacher's department info if available */}
      {!isLoading && teacherClassrooms?.department && view === 'classrooms' && (
        <div className={`p-4 ${isDark ? 'bg-[#0F1419] border-t border-[#1E2733] text-white' : 'bg-white border-t border-gray-200 text-gray-700'}`}>
          <p>Department: {teacherClassrooms.department.name}</p>
        </div>
      )}
    </div>
  );
}