import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, BookOpen, School, AlertTriangle, Calendar, User, Clock, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeProvider';
import { getOverallAttendance } from '../../app/features/attendanceStats/attendanceStatsThunks';

const AttendanceDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { theme, toggleTheme, themeConfig, isDark } = useTheme();
  const dispatch = useDispatch();
  
  // Get attendance data from Redux store
  const { 
    overallAttendance, 
    isLoading, 
    isError, 
    message 
  } = useSelector((state) => state.attendanceStats);
  
  // Fetch attendance data when component mounts
  useEffect(() => {
    dispatch(getOverallAttendance());
  }, [dispatch]);
  
  // Theme colors
  const currentTheme = themeConfig[theme];

  // Check if data is loading or has errors
  if (isLoading) {
    return (
      <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} flex items-center justify-center`}>
        <p>Loading attendance data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} flex items-center justify-center`}>
        <p>Error loading attendance data: {message}</p>
      </div>
    );
  }

  if (!overallAttendance) {
    return (
      <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} flex items-center justify-center`}>
        <p>No attendance data available.</p>
      </div>
    );
  }

  // Destructure the data from Redux store
  const {
    overallStats,
    attendanceByClass,
    attendanceByCourse,
    attendanceByGroup,
    attendanceByClassroom,
    attendanceByTeacher,
    lowAttendanceStudents
  } = overallAttendance;

  // Overall status data for pie chart
  const statusData = [
    { name: 'Present', value: overallStats.statusCounts.present || 0 },
    { name: 'Absent', value: overallStats.statusCounts.absent || 0 },
    { name: 'Late', value: overallStats.statusCounts.late || 0 }
  ];
  
  // Colors for pie chart - adjusted for themes
  const COLORS = isDark 
    ? ['#2F955A', '#F2683C', '#506EE5'] 
    : ['#4ade80', '#f87171', '#facc15'];

  // Format class data for bar chart
  const classAttendanceData = attendanceByClass.map((item, index) => ({
    name: `Class ${index + 1}`,
    Present: item.present || 0,
    Late: item.late || 0,
    Absent: item.absent || 0
  }));
  
  // Format course data for bar chart
  const courseAttendanceData = attendanceByCourse.map((item, index) => ({
    name: item._id ? `Course ${index + 1}` : 'Other',
    Present: item.presentCount || 0,
    Late: item.lateCount || 0,
    Absent: item.absentCount || 0
  }));

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-3xl font-bold ${currentTheme.text}`}>Attendance Dashboard</h1>
          <div className="flex space-x-2">
            <button 
              onClick={toggleTheme} 
              className={`p-2 rounded-full ${isDark ? 'bg-gray-800 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button className={isDark ? currentTheme.button?.primary : "px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"}>
              Export Report
            </button>
            <button 
              onClick={() => dispatch(getOverallAttendance())} 
              className={isDark ? "px-4 py-2 bg-gray-800 text-white rounded-md shadow hover:bg-gray-700" : "px-4 py-2 bg-slate-100 text-slate-700 rounded-md shadow hover:bg-slate-200"}
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex ${isDark ? 'border-b border-gray-800' : 'border-b border-gray-200'} mb-6`}>
          {['overview', 'classes', 'courses', 'students'].map((tab) => (
            <button 
              key={tab}
              className={`py-4 px-6 font-medium ${
                activeTab === tab 
                  ? (isDark ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') 
                  : (isDark ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-gray-700')
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={isDark ? currentTheme.card : "bg-white rounded-lg shadow p-6 flex items-center space-x-4"}>
            <div className={isDark ? "bg-gray-900 p-3 rounded-full" : "bg-blue-100 p-3 rounded-full"}>
              <Calendar className={isDark ? "w-6 h-6 text-blue-400" : "w-6 h-6 text-blue-600"} />
            </div>
            <div>
              <p className={isDark ? "text-sm text-gray-400" : "text-sm text-gray-500"}>Total Sessions</p>
              <p className="text-2xl font-semibold">{overallStats.totalRecords}</p>
            </div>
          </div>
          
          <div className={isDark ? currentTheme.card : "bg-white rounded-lg shadow p-6 flex items-center space-x-4"}>
            <div className={isDark ? "bg-gray-900 p-3 rounded-full" : "bg-green-100 p-3 rounded-full"}>
              <User className={isDark ? "w-6 h-6 text-green-400" : "w-6 h-6 text-green-600"} />
            </div>
            <div>
              <p className={isDark ? "text-sm text-gray-400" : "text-sm text-gray-500"}>Present Rate</p>
              <p className="text-2xl font-semibold">
                {Math.round(((overallStats.statusCounts.present || 0) / overallStats.totalRecords) * 100)}%
              </p>
            </div>
          </div>
          
          <div className={isDark ? currentTheme.card : "bg-white rounded-lg shadow p-6 flex items-center space-x-4"}>
            <div className={isDark ? "bg-gray-900 p-3 rounded-full" : "bg-yellow-100 p-3 rounded-full"}>
              <Clock className={isDark ? "w-6 h-6 text-blue-400" : "w-6 h-6 text-yellow-600"} />
            </div>
            <div>
              <p className={isDark ? "text-sm text-gray-400" : "text-sm text-gray-500"}>Late Rate</p>
              <p className="text-2xl font-semibold">
                {Math.round(((overallStats.statusCounts.late || 0) / overallStats.totalRecords) * 100)}%
              </p>
            </div>
          </div>
          
          <div className={isDark ? currentTheme.card : "bg-white rounded-lg shadow p-6 flex items-center space-x-4"}>
            <div className={isDark ? "bg-gray-900 p-3 rounded-full" : "bg-red-100 p-3 rounded-full"}>
              <AlertTriangle className={isDark ? "w-6 h-6 text-red-400" : "w-6 h-6 text-red-600"} />
            </div>
            <div>
              <p className={isDark ? "text-sm text-gray-400" : "text-sm text-gray-500"}>Absent Rate</p>
              <p className="text-2xl font-semibold">
                {Math.round(((overallStats.statusCounts.absent || 0) / overallStats.totalRecords) * 100)}%
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overall Attendance Chart */}
            <div className={isDark ? currentTheme.card : "bg-white rounded-lg shadow p-6"}>
              <h2 className="text-lg font-medium mb-4">Overall Attendance</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={isDark ? { backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' } : {}} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Low Attendance Students */}
            <div className={isDark ? currentTheme.card : "bg-white rounded-lg shadow p-6"}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Low Attendance Students</h2>
                <button className={isDark ? "text-sm text-blue-400 hover:text-blue-300" : "text-sm text-blue-600 hover:text-blue-800"}>View All</button>
              </div>
              {console.log(lowAttendanceStudents)}
              
              {lowAttendanceStudents && lowAttendanceStudents.length > 0 ? (
                <div className={isDark ? "divide-y divide-gray-800" : "divide-y divide-gray-200"}>
                  {lowAttendanceStudents.map((student) => (
                    <div key={student._id} className="py-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={isDark ? "bg-gray-900 rounded-full p-2 mr-3" : "bg-gray-100 rounded-full p-2 mr-3"}>
                          <Users className={isDark ? "h-5 w-5 text-gray-400" : "h-5 w-5 text-gray-500"} />
                        </div>
                        <div>
                          <p className="font-medium">Student {student._id.substring(0, 6)}</p>
                          <p className={isDark ? "text-sm text-gray-400" : "text-sm text-gray-500"}>
                            Present: {student.presentCount} | Late: {student.lateCount} | 
                            Total: {student.totalClasses}
                          </p>
                        </div>
                      </div>
                      <div className={`font-medium ${
                        student.attendancePercentage < 75 
                          ? (isDark ? 'text-red-400' : 'text-red-500') 
                          : (isDark ? 'text-blue-400' : 'text-yellow-500')
                      }`}>
                        {student.attendancePercentage.toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <p>No students with low attendance</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'classes' && (
          <div className={isDark ? currentTheme.card : "bg-white rounded-lg shadow p-6"}>
            <h2 className="text-lg font-medium mb-4">Attendance by Class</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={classAttendanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e5e5"} />
                  <XAxis dataKey="name" stroke={isDark ? "#9ca3af" : "#666"} />
                  <YAxis stroke={isDark ? "#9ca3af" : "#666"} />
                  <Tooltip 
                    contentStyle={isDark ? { backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' } : {}} 
                  />
                  <Legend />
                  <Bar dataKey="Present" stackId="a" fill={isDark ? "#10b981" : "#4ade80"} />
                  <Bar dataKey="Late" stackId="a" fill={isDark ? "#3b82f6" : "#facc15"} />
                  <Bar dataKey="Absent" stackId="a" fill={isDark ? "#ef4444" : "#f87171"} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className={isDark ? currentTheme.card : "bg-white rounded-lg shadow p-6"}>
            <h2 className="text-lg font-medium mb-4">Attendance by Course</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={courseAttendanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e5e5"} />
                  <XAxis dataKey="name" stroke={isDark ? "#9ca3af" : "#666"} />
                  <YAxis stroke={isDark ? "#9ca3af" : "#666"} />
                  <Tooltip 
                    contentStyle={isDark ? { backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' } : {}} 
                  />
                  <Legend />
                  <Bar dataKey="Present" stackId="a" fill={isDark ? "#10b981" : "#4ade80"} />
                  <Bar dataKey="Late" stackId="a" fill={isDark ? "#3b82f6" : "#facc15"} />
                  <Bar dataKey="Absent" stackId="a" fill={isDark ? "#ef4444" : "#f87171"} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className={isDark ? currentTheme.card : "bg-white rounded-lg shadow p-6"}>
            <h2 className="text-lg font-medium mb-4">Student Attendance Management</h2>
            <div className="flex flex-col space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className={isDark ? "block text-sm font-medium text-white mb-1" : "block text-sm font-medium text-gray-700 mb-1"}>
                    Search Student
                  </label>
                  <input
                    type="text"
                    className={isDark 
                      ? "w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      : "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }
                    placeholder="Enter student name or ID"
                  />
                </div>
                <div className="w-48">
                  <label className={isDark ? "block text-sm font-medium text-white mb-1" : "block text-sm font-medium text-gray-700 mb-1"}>
                    Status Filter
                  </label>
                  <select className={isDark 
                    ? "w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    : "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  }>
                    <option value="">All Status</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                  </select>
                </div>
              </div>
              
              <div className={isDark 
                ? "bg-gray-900 rounded-lg p-6 text-center text-gray-400" 
                : "bg-gray-100 rounded-lg p-6 text-center text-gray-500"
              }>
                <p>Search for a student to view detailed attendance records</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceDashboard;