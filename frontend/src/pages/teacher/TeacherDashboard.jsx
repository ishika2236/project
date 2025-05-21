
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeProvider';
import { 
  Calendar, ChevronRight, Clock, Grid,
  Users, TrendingUp, PieChart, CheckCircle, 
  MapPin, BookOpen, AlertCircle, ArrowRight
} from 'lucide-react';
import { getClassroomsByTeacher } from '../../app/features/classroom/classroomThunks';
import { fetchGroups } from '../../app/features/groups/groupThunks';
import { 
  LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const DashboardContent = () => {
  const { themeConfig, theme } = useTheme();
  const isDark = theme === 'dark';
  const dispatch = useDispatch();
  const { teacherClassrooms, isLoading: classroomsLoading } = useSelector(state => state.classrooms);
  const { userGroups, loading: groupsLoading } = useSelector(state => state.groups);
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  
  // States for dashboard data
  const [dashboardStats, setDashboardStats] = useState({
    todayClasses: 0,
    activeStudents: 0,
    totalStudents: 0,
    totalGroups: 0,
    upcomingClasses: 0
  });
  
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [studentsByGroup, setStudentsByGroup] = useState([]);
  const [classActivityData, setClassActivityData] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  
  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '-';
    
    try {
      // Handle time in HH:MM format
      const [hours, minutes] = timeString.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (err) {
      return timeString;
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString([], { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (err) {
      return dateString;
    }
  };
  
  // Fetch data on component mount
  useEffect(() => {
    const teacherId = user?._id;
    if (teacherId) {
      dispatch(getClassroomsByTeacher(teacherId));
      dispatch(fetchGroups());
    }
  }, [dispatch, user?._id]);
  
  // Calculate dashboard stats whenever data changes
  useEffect(() => {
    if (classroomsLoading || groupsLoading || !teacherClassrooms) return;
    
    // Calculate today's date to filter classes
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let allStudents = new Set();
    let activeStudentsCount = 0;
    let todayClassesCount = 0;
    let upcomingClassesCount = 0;
    let weeklyAttendance = {
      Monday: { total: 0, present: 0 },
      Tuesday: { total: 0, present: 0 },
      Wednesday: { total: 0, present: 0 },
      Thursday: { total: 0, present: 0 },
      Friday: { total: 0, present: 0 }
    };
    
    const upcoming = [];
    const classActivities = [];
    
    // Process classroom data
    if (Array.isArray(teacherClassrooms)) {
      teacherClassrooms.forEach(classroom => {
        // Add students to the total count
        if (classroom.assignedStudents && classroom.assignedStudents.length) {
          classroom.assignedStudents.forEach(student => allStudents.add(student._id));
        }
        
        // Count classes and prepare upcoming classes
        if (classroom.classes && classroom.classes.length) {
          classroom.classes.forEach(classItem => {
            const classSchedule = classItem.class?.schedule || {};
            const scheduleStartTime = classSchedule.startTime || '';
            const scheduleEndTime = classSchedule.endTime || '';
            const classStatus = classItem.status || 'unknown';
            const classLocation = classItem.class?.location || {};
            
            // Simulate today's date for demo (or use real date)
            const classDate = new Date();
            let classTime = scheduleStartTime;
            
            if (!scheduleStartTime) {
              // If no startTime available, generate random time for demo
              classTime = `${Math.floor(Math.random() * 8) + 9}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
            }
            
            // For weekly stats - assign to a weekday
            const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const dayName = weekdays[classDate.getDay()];
            if (dayName !== "Sunday" && dayName !== "Saturday") {
              weeklyAttendance[dayName].total++;
              // Simulate attendance 
              const presentCount = Math.floor(Math.random() * 5) + 10; // 10-15 students
              weeklyAttendance[dayName].present += presentCount;
              
              // Add to class activity data
              classActivities.push({
                name: classroom?.course?.courseName || 'Class Session',
                students: presentCount,
                day: dayName
              });
            }
            
            // Is class today?
            if (classDate.toDateString() === today.toDateString()) {
              todayClassesCount++;
              
              // Active class with attendance window open
              if (classStatus === 'in-progress') {
                activeStudentsCount++;
              }
            }
            
            // Upcoming classes (status = scheduled or in-progress)
            if (classStatus === 'scheduled' || classStatus === 'in-progress') {
              upcomingClassesCount++;
              
              // Add to upcoming classes list with real schedule data
              upcoming.push({
                id: classItem._id || classItem.class?._id,
                name: classroom?.course?.courseName || 'Unnamed Class',
                code: classroom?.course?.courseCode || '-',
                time: formatTime(scheduleStartTime),
                endTime: formatTime(scheduleEndTime),
                location: classLocation?.name || 'No Location',
                coordinates: classLocation?.latitude && classLocation?.longitude 
                  ? `${classLocation.latitude}, ${classLocation.longitude}` 
                  : null,
                group: classroom?.group?.name || 'No Group',
                students: classroom?.assignedStudents?.length || 0,
                status: classStatus,
                notes: classItem.notes || classItem.class?.notes || '',
                startDate: formatDate(classSchedule.startDate),
                endDate: formatDate(classSchedule.endDate),
                schedule: classSchedule,
                title: classItem.class?.title || 'Class Session',
                topics: classItem.class?.topics || []
              });
            }
          });
        }
      });
    }
    
    // Count total groups from all departments
    let totalGroups = 0;
    let groupStudents = [];
    
    if (userGroups) {
      Object.entries(userGroups).forEach(([deptId, groups]) => {
        totalGroups += groups.length;
        
        // Count students per group for pie chart
        groups.forEach(group => {
          groupStudents.push({
            name: group.name,
            students: group.students?.length || 0
          });
        });
      });
    }
    
    // Update stats
    setDashboardStats({
      todayClasses: todayClassesCount,
      activeStudents: activeStudentsCount,
      totalStudents: allStudents.size,
      totalGroups,
      upcomingClasses: upcomingClassesCount
    });
    
    // Set upcoming classes (sorted by time)
    upcoming.sort((a, b) => {
      const timeA = a.time.split(':').map(Number);
      const timeB = b.time.split(':').map(Number);
      return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
    });
    setUpcomingClasses(upcoming.slice(0, 5));
    
    // Prepare attendance chart data
    const attendanceChartData = Object.entries(weeklyAttendance).map(([day, data]) => ({
      day,
      present: data.present,
      total: data.total,
      attendanceRate: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0
    }));
    
    setAttendanceData(attendanceChartData);
    setStudentsByGroup(groupStudents.slice(0, 5)); // Top 5 groups
    setClassActivityData(classActivities.slice(0, 8)); // Recent 8 activities
    
  }, [teacherClassrooms, userGroups, classroomsLoading, groupsLoading]);
  
  // Stats cards data
  const stats = [
    { 
      title: "Today's Classes", 
      value: classroomsLoading ? "-" : dashboardStats.todayClasses, 
      icon: <Calendar size={20} className={isDark ? "text-blue-400" : "text-blue-600"} />,
      color: isDark ? "from-blue-500/20 to-blue-600/5" : "from-blue-100 to-blue-50"
    },
    { 
      title: "Active Students", 
      value: classroomsLoading ? "-" : `${dashboardStats.activeStudents}/${dashboardStats.totalStudents}`, 
      icon: <Users size={20} className={isDark ? "text-green-400" : "text-green-600"} />,
      color: isDark ? "from-green-500/20 to-green-600/5" : "from-green-100 to-green-50"
    },
    { 
      title: "Total Groups", 
      value: groupsLoading ? "-" : dashboardStats.totalGroups, 
      icon: <Grid size={20} className={isDark ? "text-purple-400" : "text-purple-600"} />,
      color: isDark ? "from-purple-500/20 to-purple-600/5" : "from-purple-100 to-purple-50"
    },
    { 
      title: "Upcoming Classes", 
      value: classroomsLoading ? "-" : dashboardStats.upcomingClasses, 
      icon: <Clock size={20} className={isDark ? "text-amber-400" : "text-amber-600"} />,
      color: isDark ? "from-amber-500/20 to-amber-600/5" : "from-amber-100 to-amber-50"
    }
  ];
  
  // Colors for charts
  const CHART_COLORS = {
    primary: isDark ? '#506EE5' : '#4F46E5',
    secondary: isDark ? '#2F955A' : '#10B981',
    accent: isDark ? '#F2683C' : '#F59E0B',
    background: isDark ? '#121A22' : '#F9FAFB',
    text: isDark ? '#5E6E82' : '#6B7280',
    grid: isDark ? '#1E2733' : '#E5E7EB'
  };
  
  // Pie chart colors array
  const PIE_COLORS = [
    isDark ? '#506EE5' : '#4F46E5', 
    isDark ? '#2F955A' : '#10B981',
    isDark ? '#F2683C' : '#F59E0B',
    isDark ? '#8B5CF6' : '#8B5CF6',
    isDark ? '#EC4899' : '#EC4899'
  ];
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-2 ${isDark ? 'bg-[#1E2733] border border-[#2E3A4A]' : 'bg-white border border-gray-200'} rounded shadow-lg`}>
          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Class detail modal
  const ClassDetailModal = ({ classData, onClose }) => {
    if (!classData) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className={`w-full max-w-lg p-5 rounded-xl ${themeConfig[theme].card}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-bold text-lg ${themeConfig[theme].text}`}>{classData.title || classData.name}</h3>
            <button 
              onClick={onClose}
              className={`p-1 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="flex items-center mb-2">
                <BookOpen size={16} className={isDark ? "text-blue-400" : "text-blue-600"} />
                <span className={`ml-2 font-medium ${themeConfig[theme].text}`}>Course Details</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className={`${themeConfig[theme].secondaryText}`}>Code:</span>
                  <span className={`ml-1 font-medium ${themeConfig[theme].text}`}>{classData.code}</span>
                </div>
                <div>
                  <span className={`${themeConfig[theme].secondaryText}`}>Group:</span>
                  <span className={`ml-1 font-medium ${themeConfig[theme].text}`}>{classData.group}</span>
                </div>
                <div>
                  <span className={`${themeConfig[theme].secondaryText}`}>Students:</span>
                  <span className={`ml-1 font-medium ${themeConfig[theme].text}`}>{classData.students}</span>
                </div>
                <div>
                  <span className={`${themeConfig[theme].secondaryText}`}>Status:</span>
                  <span className={`ml-1 font-medium ${
                    classData.status === 'in-progress' 
                      ? (isDark ? 'text-green-400' : 'text-green-600')
                      : themeConfig[theme].text
                  }`}>
                    {classData.status === 'in-progress' ? 'In Progress' : 'Scheduled'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="flex items-center mb-2">
                <Clock size={16} className={isDark ? "text-amber-400" : "text-amber-600"} />
                <span className={`ml-2 font-medium ${themeConfig[theme].text}`}>Schedule</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className={`${themeConfig[theme].secondaryText}`}>Start Date:</span>
                  <span className={`ml-1 font-medium ${themeConfig[theme].text}`}>{classData.startDate}</span>
                </div>
                <div>
                  <span className={`${themeConfig[theme].secondaryText}`}>End Date:</span>
                  <span className={`ml-1 font-medium ${themeConfig[theme].text}`}>{classData.endDate}</span>
                </div>
                <div>
                  <span className={`${themeConfig[theme].secondaryText}`}>Time:</span>
                  <span className={`ml-1 font-medium ${themeConfig[theme].text}`}>
                    {classData.time} - {classData.endTime}
                  </span>
                </div>
                <div>
                  <span className={`${themeConfig[theme].secondaryText}`}>Days:</span>
                  <span className={`ml-1 font-medium ${themeConfig[theme].text}`}>
                    {classData.schedule?.daysOfWeek?.join(', ') || 'Not specified'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="flex items-center mb-2">
                <MapPin size={16} className={isDark ? "text-purple-400" : "text-purple-600"} />
                <span className={`ml-2 font-medium ${themeConfig[theme].text}`}>Location</span>
              </div>
              <div className="text-sm">
                <span className={`font-medium ${themeConfig[theme].text}`}>{classData.location}</span>
                {classData.coordinates && (
                  <p className={`mt-1 text-xs ${themeConfig[theme].secondaryText}`}>
                    Coordinates: {classData.coordinates}
                  </p>
                )}
              </div>
            </div>
            
            {classData.notes && (
              <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="flex items-center mb-2">
                  <AlertCircle size={16} className={isDark ? "text-amber-400" : "text-amber-600"} />
                  <span className={`ml-2 font-medium ${themeConfig[theme].text}`}>Notes</span>
                </div>
                <p className={`text-sm ${themeConfig[theme].text}`}>{classData.notes}</p>
              </div>
            )}
            
            {classData.topics && classData.topics.length > 0 && classData.topics[0] !== 'nil' && (
              <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="flex items-center mb-2">
                  <BookOpen size={16} className={isDark ? "text-green-400" : "text-green-600"} />
                  <span className={`ml-2 font-medium ${themeConfig[theme].text}`}>Topics</span>
                </div>
                <ul className="list-disc list-inside">
                  {classData.topics.map((topic, index) => (
                    <li key={index} className={`text-sm ${themeConfig[theme].text}`}>{topic}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              onClick={onClose}
              className={`px-4 py-2 rounded-lg mr-2 text-sm ${
                isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Close
            </button>
            <button 
              className={`px-4 py-2 rounded-lg text-sm flex items-center ${
                isDark
                  ? themeConfig.dark.button.primary
                  : themeConfig.light.button.primary
              }`}
            >
              <span>Take Attendance</span>
              <ArrowRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className={themeConfig[theme].gradientBackground}>
      {/* Class details modal */}
      {selectedClass && (
        <ClassDetailModal 
          classData={selectedClass} 
          onClose={() => setSelectedClass(null)} 
        />
      )}
      
      {/* Welcome banner */}
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${themeConfig[theme].text}`}>
          Welcome back, {user?.firstName || 'Teacher'}!
        </h2>
        <p className={`mt-1 ${themeConfig[theme].secondaryText}`}>
          Here's what's happening with your classes today
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`rounded-xl overflow-hidden ${themeConfig[theme].card}`}>
            <div className="p-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className={`text-sm ${themeConfig[theme].secondaryText}`}>{stat.title}</p>
                  <p className={`text-2xl font-bold mt-1 ${themeConfig[theme].text}`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-gradient-to-br ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Class Status Overview */}
      <div className="mb-8">
        <div className={`p-5 rounded-xl ${themeConfig[theme].card}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-bold ${themeConfig[theme].text}`}>Today's Schedule</h3>
            <div className={`text-xs px-2 py-1 rounded ${
              isDark ? 'bg-[#1E2733]/70 text-blue-400' : 'bg-blue-50 text-blue-600'
            }`}>
              {new Date().toLocaleDateString([], {weekday: 'long', month: 'short', day: 'numeric'})}
            </div>
          </div>
          
          <div className="overflow-auto">
            <table className="min-w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`pb-2 text-left text-xs font-medium ${themeConfig[theme].secondaryText}`}>Class</th>
                  <th className={`pb-2 text-left text-xs font-medium ${themeConfig[theme].secondaryText}`}>Time</th>
                  <th className={`pb-2 text-left text-xs font-medium ${themeConfig[theme].secondaryText}`}>Location</th>
                  <th className={`pb-2 text-left text-xs font-medium ${themeConfig[theme].secondaryText}`}>Group</th>
                  <th className={`pb-2 text-left text-xs font-medium ${themeConfig[theme].secondaryText}`}>Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingClasses.slice(0, 3).map((cls, index) => (
                  <tr 
                    key={index} 
                    onClick={() => setSelectedClass(cls)}
                    className={`cursor-pointer ${
                      isDark 
                        ? 'hover:bg-[#1E2733]/30' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className={`py-3 pr-4 ${themeConfig[theme].text}`}>
                      <div className="flex items-center">
                        <BookOpen size={16} className={`mr-2 ${
                          isDark ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                        <div>
                          <div className="font-medium text-sm">{cls.title || cls.name}</div>
                          <div className="text-xs text-gray-500">{cls.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className={`py-3 pr-4 text-sm ${themeConfig[theme].text}`}>
                      {cls.time} - {cls.endTime}
                    </td>
                    <td className={`py-3 pr-4 text-sm ${themeConfig[theme].text}`}>
                      {cls.location}
                    </td>
                    <td className={`py-3 pr-4 text-sm ${themeConfig[theme].text}`}>
                      {cls.group}
                    </td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        cls.status === 'in-progress'
                          ? (isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700') 
                          : (isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700')
                      }`}>
                        {cls.status === 'in-progress' ? 'In Progress' : 'Scheduled'}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {upcomingClasses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center">
                      <p className={`text-sm ${themeConfig[theme].secondaryText}`}>
                        No classes scheduled for today
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Charts & Data section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Attendance Chart */}
        <div className={`p-5 rounded-xl ${themeConfig[theme].card}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-bold ${themeConfig[theme].text}`}>Weekly Attendance</h3>
            <div className={`text-xs px-2 py-1 rounded ${
              isDark ? 'bg-[#1E2733]/70 text-blue-400' : 'bg-blue-50 text-blue-600'
            }`}>
              Last 5 days
            </div>
          </div>
          
          <div className="h-64">
            {!classroomsLoading && attendanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={attendanceData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                  <XAxis dataKey="day" tick={{ fill: CHART_COLORS.text }} />
                  <YAxis tick={{ fill: CHART_COLORS.text }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="attendanceRate" 
                    name="Attendance Rate (%)" 
                    stroke={CHART_COLORS.primary} 
                    activeDot={{ r: 6 }} 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className={`${themeConfig[theme].secondaryText}`}>
                  {classroomsLoading ? "Loading chart data..." : "No attendance data available"}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Students by Group */}
        <div className={`p-5 rounded-xl ${themeConfig[theme].card}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-bold ${themeConfig[theme].text}`}>Students by Group</h3>
            <div className={`text-xs px-2 py-1 rounded ${
              isDark ? 'bg-[#1E2733]/70 text-green-400' : 'bg-green-50 text-green-600'
            }`}>
              Top {studentsByGroup.length} groups
            </div>
          </div>
          
          <div className="h-64">
            {!groupsLoading && studentsByGroup.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie className="flex items-center justify-center">
                  <Pie
                    data={studentsByGroup}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="students"
                  >
                    {studentsByGroup.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </RechartsPie>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className={`${themeConfig[theme].secondaryText}`}>
                  {groupsLoading ? "Loading group data..." : "No student group data available"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Activity & Upcoming Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Activity */}
        <div className={`col-span-2 p-5 rounded-xl ${themeConfig[theme].card}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-bold ${themeConfig[theme].text}`}>Class Activity</h3>
            <div className={`text-xs px-2 py-1 rounded ${
              isDark ? 'bg-[#1E2733]/70 text-purple-400' : 'bg-purple-50 text-purple-600'
            }`}>
              Recent classes
            </div>
          </div>
          
          <div className="h-64">
            {!classroomsLoading && classActivityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={classActivityData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                  <XAxis dataKey="name" tick={{ fill: CHART_COLORS.text }} />
                  <YAxis tick={{ fill: CHART_COLORS.text }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="students" 
                    name="Students Present" 
                    fill={CHART_COLORS.accent}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className={`${themeConfig[theme].secondaryText}`}>
                  {classroomsLoading ? "Loading activity data..." : "No class activity data available"}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Upcoming Classes List */}
        <div className={`p-5 rounded-xl ${themeConfig[theme].card}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-bold ${themeConfig[theme].text}`}>Upcoming Classes</h3>
            <button className={`text-xs px-2 py-1 rounded ${
              isDark 
                ? 'bg-[#1E2733]/70 text-amber-400 hover:bg-[#1E2733]' 
                : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
            }`}>
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {classroomsLoading ? (
              <div className={`text-sm ${themeConfig[theme].secondaryText}`}>
                Loading upcoming classes...
              </div>
            ) : upcomingClasses.length > 0 ? (
              upcomingClasses.map((cls, index) => (
                <div 
                  key={index} 
                  onClick={() => setSelectedClass(cls)}
                  className={`p-3 rounded-lg transition-all cursor-pointer ${
                    isDark 
                      ? 'bg-[#1E2733]/30 hover:bg-[#1E2733]/50' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${themeConfig[theme].text}`}>
                          {cls.title || cls.name}
                        </span>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                          isDark 
                            ? 'bg-[#1E2733] text-blue-400' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {cls.code}
                        </span>
                      </div>
                      <p className={`text-xs ${themeConfig[theme].secondaryText}`}>{cls.group}</p>
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className={isDark ? "text-amber-400" : "text-amber-500"} />
                      <span className={`ml-1 text-xs font-medium ${
                        isDark ? "text-amber-400" : "text-amber-500"
                      }`}>
                        {cls.time}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <div className="flex items-center">
                      <Users size={14} className={themeConfig[theme].secondaryText} />
                      <span className={`ml-1 text-xs ${themeConfig[theme].secondaryText}`}>
                        {cls.students} students
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={14} className={themeConfig[theme].secondaryText} />
                      <span className={`ml-1 text-xs ${themeConfig[theme].secondaryText}`}>
                        {cls.location}
                      </span>
                    </div>
                  </div>
                  {cls.status === 'in-progress' && (
                    <div className="mt-2 flex items-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isDark 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        In Progress
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className={`text-sm ${themeConfig[theme].secondaryText}`}>
                No upcoming classes scheduled.
              </div>
            )}
          </div>
          
          {upcomingClasses.length > 0 && (
            <button className={`w-full mt-4 p-2 text-sm flex items-center justify-center rounded-lg ${
              isDark
                ? themeConfig.dark.button.primary
                : themeConfig.light.button.primary
            }`} onClick={()=>navigate('/teacher/classroom')}>
              <span>Schedule New Class</span>
              <ChevronRight size={16} className="ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;