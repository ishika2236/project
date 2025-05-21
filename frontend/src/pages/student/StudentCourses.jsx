import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getClassroomsByStudent } from '../../app/features/classroom/classroomThunks';
import { getMyAttendance } from '../../app/features/attendanceStats/attendanceStatsThunks';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeProvider';

// ExpandableSection Component
const ExpandableSection = ({ title, children, isOpen = false }) => {
  const [expanded, setExpanded] = useState(isOpen);
  const { theme } = useTheme();
  
  return (
    <div className="mb-4">
      <div 
        className={`flex justify-between items-center p-3 rounded-lg cursor-pointer ${
          theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="font-medium">{title}</h3>
        <div className="text-sm">
          {expanded ? 'Hide' : 'View more'}
        </div>
      </div>
      
      {expanded && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  );
};

// Classroom Card Component
const ClassroomCard = ({ classroom, onClick, isActive, theme }) => {
  const { themeConfig } = useTheme();
  const currentTheme = themeConfig[theme];
  
  // Calculate attendance percentage if attendance data exists
  const attendancePercentage = classroom.attendanceStats ? 
    Math.round(parseFloat(classroom.attendanceStats.attendancePercentage)) : 0;
  
  return (
    <div 
      className={`${currentTheme.card} p-4 rounded-lg cursor-pointer mb-4 transition-all duration-300 ${
        isActive ? 'ring-2 ring-offset-2 ring-indigo-600' : ''
      }`}
      onClick={() => onClick(classroom)}
    >
      <h3 className={`text-lg font-semibold mb-1 truncate ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        {classroom.course?.courseName || "Unnamed Course"}
      </h3>
      <div className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        {classroom.course?.courseCode || "No Code"} • {(classroom.assignedTeacher?.firstName + " "+ classroom.assignedTeacher?.lastName) || "Not assigned"}
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Attendance:</span>
        <span className={`text-sm font-medium ${
          attendancePercentage >= 80 ? 'text-emerald-500' : 
          attendancePercentage >= 60 ? 'text-amber-500' : 'text-rose-500'
        }`}>
          {attendancePercentage}%
        </span>
      </div>
      <div className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 mb-3`}>
        <div 
          className={`${
            attendancePercentage >= 80 ? 'bg-emerald-500' : 
            attendancePercentage >= 60 ? 'bg-amber-500' : 'bg-rose-500'
          } h-2 rounded-full`} 
          style={{ width: `${attendancePercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// Attendance Records Table Component
const AttendanceRecordsTable = ({ records, theme }) => {
  const [showAllRecords, setShowAllRecords] = useState(false);
  
  // Limit displayed records if not showing all
  const displayedRecords = showAllRecords ? records : records.slice(-5); // Show last 5 records
  
  // Helper function to get teacher name
  const getTeacherName = (record) => {
    if (record.teacher) {
      return `${record.teacher.firstName} ${record.teacher.lastName}`;
    } else if (record.markedBy === 'student') {
      return 'Self';
    } else {
      return `Auto (${record.markedBy})`;
    }
  };
  
  // Helper function to format date from record
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Helper function to get the day of week
  const getDayOfWeek = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { weekday: 'long' });
  };
  
  return (
    <div>
      <div className="overflow-x-auto max-h-64 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`sticky top-0 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <tr>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Date
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Day
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Status
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Marked By
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {displayedRecords && displayedRecords.length > 0 ? (
              displayedRecords.map((record, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? (theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-50') : ''}>
                  <td className={`px-6 py-3 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {formatDate(record.markedAt || record.createdAt)}
                  </td>
                  <td className={`px-6 py-3 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {getDayOfWeek(record.markedAt || record.createdAt)}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      record.status === 'present' ? 'bg-green-100 text-green-800' : 
                      record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                      record.status === 'excused' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                  <td className={`px-6 py-3 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {getTeacherName(record)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className={`px-6 py-4 text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  No attendance records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!showAllRecords && records && records.length > 5 && (
        <div className="mt-2 text-right">
          <button 
            onClick={() => setShowAllRecords(true)}
            className={`text-sm ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}`}
          >
            View all {records.length} records
          </button>
        </div>
      )}
      {showAllRecords && records && records.length > 5 && (
        <div className="mt-2 text-right">
          <button 
            onClick={() => setShowAllRecords(false)}
            className={`text-sm ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}`}
          >
            Show less
          </button>
        </div>
      )}
    </div>
  );
};

// Progress Chart Component for Attendance
const AttendanceProgressChart = ({ attendanceData, theme }) => {
  const { themeConfig } = useTheme();
  const currentTheme = themeConfig[theme];
  
  // Check if attendance data is properly structured
  if (!attendanceData || !attendanceData.records || attendanceData.records.length === 0) {
    return (
      <div className={`${currentTheme.card} p-6 rounded-lg flex items-center justify-center h-64`}>
        <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          No attendance data available
        </p>
      </div>
    );
  }
  
  // Extract records and stats from the attendance data
  const records = attendanceData.records || [];
  const stats = attendanceData.stats || { 
    presentCount: 0, 
    absentCount: 0, 
    lateCount: 0, 
    totalClasses: 0,
    attendancePercentage: "0.00"
  };
  
  // Transform attendance history for the line chart
  const sortedRecords = [...records].sort((a, b) => 
    new Date(a.markedAt || a.createdAt) - new Date(b.markedAt || b.createdAt)
  );
  
  // Calculate cumulative attendance percentage over time
  let present = 0;
  const cumulativeData = sortedRecords.map((record, index) => {
    if (record.status === 'present' || record.status === 'late') present++;
    return {
      day: index + 1,
      percentage: Math.round((present / (index + 1)) * 100),
      date: new Date(record.markedAt || record.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });
  
  // Pie chart data for present/absent/late/excused ratio
  const pieData = [
    { name: 'Present', value: stats.presentCount, color: '#10B981' },
    { name: 'Absent', value: stats.absentCount, color: '#EF4444' },
    { name: 'Late', value: stats.lateCount || 0, color: '#F59E0B' }
  ].filter(item => item.value > 0);

  return (
    <div className={`${currentTheme.card} p-6 rounded-lg`}>
      <h3 className={`text-xl font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        Attendance Statistics
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance over time (line chart) */}
        <div>
          <h4 className={`text-md font-medium mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Attendance Trend
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={cumulativeData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1E2733' : '#e5e7eb'} />
              <XAxis 
                dataKey="day" 
                stroke={theme === 'dark' ? '#5E6E82' : '#6B7280'}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke={theme === 'dark' ? '#5E6E82' : '#6B7280'} 
                domain={[0, 100]}
                tickFormatter={(tick) => `${tick}%`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#121A22' : 'white',
                  borderColor: theme === 'dark' ? '#1E2733' : '#e5e7eb',
                  color: theme === 'dark' ? 'white' : 'black'
                }}
                formatter={(value) => [`${value}%`, 'Attendance']}
                labelFormatter={(value, entry) => `Day ${value}: ${entry[0]?.payload?.date}`}
              />
              <Line 
                type="monotone" 
                dataKey="percentage" 
                stroke={theme === 'dark' ? '#506EE5' : '#4F46E5'} 
                strokeWidth={2} 
                dot={{ fill: theme === 'dark' ? '#506EE5' : '#4F46E5', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Attendance Status Pie Chart */}
        <div>
          <h4 className={`text-md font-medium mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Attendance Summary
          </h4>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    const radius = innerRadius + (outerRadius - innerRadius) * 1.1;
                    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                    return (
                      <text 
                        x={x} 
                        y={y} 
                        fill={theme === 'dark' ? 'white' : '#374151'} 
                        textAnchor={x > cx ? 'start' : 'end'} 
                        dominantBaseline="central"
                        fontSize={12}
                      >
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#121A22' : 'white',
                    borderColor: theme === 'dark' ? '#1E2733' : '#e5e7eb'
                  }}
                  formatter={(value) => [value, '']}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="text-center mt-2">
              <div className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                {stats.attendancePercentage ? `${Math.round(parseFloat(stats.attendancePercentage))}%` : 'N/A'}
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Overall Attendance
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Attendance Records Table in Expandable Section */}
      <ExpandableSection title="Attendance Records">
        <AttendanceRecordsTable 
          records={records} 
          theme={theme} 
        />
      </ExpandableSection>
    </div>
  );
};

// Main Student Attendance Page Component
const StudentAttendancePage = () => {
  const dispatch = useDispatch();
  const { theme, themeConfig } = useTheme();
  const currentTheme = themeConfig[theme];
  
  // Get data from Redux store
  const { data: studentClassrooms, isLoading: classroomsLoading } = useSelector(state => state.classrooms.studentClassrooms || {});
  const attendanceData = useSelector(state => state.attendanceStats.studentAttendance || {});
  const attendanceLoading = useSelector(state => state.attendanceStats.isLoading);
  
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [classroomsAttendanceData, setClassroomsAttendanceData] = useState({});
  
  // Fetch classrooms on component mount
  useEffect(() => {
    dispatch(getClassroomsByStudent());
  }, [dispatch]);
  
  // Fetch attendance data when a classroom is selected
  useEffect(() => {
    if (selectedClassroom) {
      dispatch(getMyAttendance(selectedClassroom._id));
    }
  }, [selectedClassroom, dispatch]);
  
  // Set first classroom as selected when classrooms are loaded
  useEffect(() => {
    if (studentClassrooms && studentClassrooms.length > 0 && !selectedClassroom) {
      setSelectedClassroom(studentClassrooms[0]);
    }
  }, [studentClassrooms, selectedClassroom]);
  
  // Process attendance data properly from the Redux store
  const processedAttendanceData = React.useMemo(() => {
    if (!attendanceData || !attendanceData.records || !attendanceData.stats) return null;
    
    // Extract the records and stats for the current classroom
    return {
      records: attendanceData?.records || [],
      stats: attendanceData?.stats || {
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        totalClasses: 0,
        attendancePercentage: "0.00"
      }
    };
  }, [attendanceData]);
  
  // Store attendance data for each classroom separately
  useEffect(() => {
    if (processedAttendanceData && selectedClassroom && selectedClassroom._id) {
      setClassroomsAttendanceData(prevData => ({
        ...prevData,
        [selectedClassroom._id]: processedAttendanceData
      }));
    }
  }, [processedAttendanceData, selectedClassroom]);
  
  // Get the attendance data for the currently selected classroom
  const currentClassroomAttendance = React.useMemo(() => {
    if (!selectedClassroom || !selectedClassroom._id) return null;
    // Use the attendance data specifically for this classroom
    return classroomsAttendanceData[selectedClassroom._id] || processedAttendanceData;
  }, [selectedClassroom, classroomsAttendanceData, processedAttendanceData]);
  
  if (classroomsLoading) {
    return (
      <div className={`${currentTheme.background} min-h-screen p-4 md:p-6 flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  // Calculate attendance percentages for classroom cards
  const classroomsWithStats = React.useMemo(() => {
    if (!Array.isArray(studentClassrooms)) return [];
    
    return studentClassrooms.map(classroom => {
      // Get attendance data specific for this classroom
      const classroomAttendance = classroomsAttendanceData[classroom._id];
      
      if (classroomAttendance && classroomAttendance.stats) {
        return {
          ...classroom,
          attendanceStats: classroomAttendance.stats
        };
      }
      
      // If the classroom is currently selected but we don't have stored data yet
      if (selectedClassroom && classroom._id === selectedClassroom._id && 
          processedAttendanceData && processedAttendanceData.stats) {
        return {
          ...classroom,
          attendanceStats: processedAttendanceData.stats
        };
      }
      
      return classroom;
    });
  }, [studentClassrooms, selectedClassroom, processedAttendanceData, classroomsAttendanceData]);
  
  // Calculate average attendance across all courses
  const averageAttendance = React.useMemo(() => {
    const classroomsWithAttendance = classroomsWithStats.filter(c => 
      c.attendanceStats && c.attendanceStats.attendancePercentage
    );
    
    if (classroomsWithAttendance.length === 0) return 0;
    
    const totalAttendance = classroomsWithAttendance.reduce((sum, classroom) => {
      return sum + parseFloat(classroom.attendanceStats.attendancePercentage || 0);
    }, 0);
    
    return Math.round(totalAttendance / classroomsWithAttendance.length);
  }, [classroomsWithStats]);
  
  return (
    <div className={`${currentTheme.background} min-h-screen p-4 md:p-6`}>
      <h1 className={`text-2xl md:text-3xl font-bold mb-6 ${currentTheme.gradient?.text || (theme === 'dark' ? 'text-white' : 'text-gray-800')}`}>
        My Attendance
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar with classroom cards */}
        <div className="lg:col-span-1">
          <div className="mb-6">
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              My Classrooms
            </h2>
            {classroomsWithStats.length > 0 ? (
              classroomsWithStats.map(classroom => (
                <ClassroomCard 
                  key={classroom._id}
                  classroom={classroom}
                  onClick={setSelectedClassroom}
                  isActive={selectedClassroom && selectedClassroom._id === classroom._id}
                  theme={theme}
                />
              ))
            ) : (
              <div className={`${currentTheme.card} p-4 rounded-lg`}>
                <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  No classrooms found. Please join classrooms to view attendance.
                </p>
              </div>
            )}
          </div>
          
          {/* Summary of attendance stats */}
          {classroomsWithStats.length > 0 && (
            <div className={`${currentTheme.card} p-4 rounded-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Overall Attendance
              </h3>
              
              {/* Overall average attendance */}
              <div className="mb-4 text-center py-3">
                <div className={`text-3xl font-bold ${
                  averageAttendance >= 80 ? 'text-emerald-500' : 
                  averageAttendance >= 60 ? 'text-amber-500' : 'text-rose-500'
                }`}>
                  {averageAttendance}%
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Average Attendance Across All Courses
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={classroomsWithStats
                    .filter(classroom => classroom.attendanceStats)
                    .map(classroom => ({
                      name: classroom.course?.courseCode || "No Code",
                      attendance: classroom.attendanceStats ? 
                        Math.round(parseFloat(classroom.attendanceStats.attendancePercentage)) : 0
                    }))}
                  margin={{ top: 5, right: 10, bottom: 20, left: -10 }}
                  barSize={20}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1E2733' : '#e5e7eb'} />
                  <XAxis 
                    dataKey="name" 
                    stroke={theme === 'dark' ? '#5E6E82' : '#6B7280'}
                    tick={{ fontSize: 12, fill: theme === 'dark' ? '#9CA3AF' : '#4B5563' }}
                  />
                  <YAxis 
                    stroke={theme === 'dark' ? '#5E6E82' : '#6B7280'}
                    tickFormatter={(tick) => `${tick}%`}
                    tick={{ fontSize: 12, fill: theme === 'dark' ? '#9CA3AF' : '#4B5563' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#121A22' : 'white',
                      borderColor: theme === 'dark' ? '#1E2733' : '#e5e7eb',
                      color: theme === 'dark' ? 'white' : 'inherit'
                    }}
                    formatter={(value) => [`${value}%`, 'Attendance']}
                  />
                  <Bar 
                    dataKey="attendance" 
                    name="Attendance" 
                    fill={theme === 'dark' ? '#506EE5' : '#4F46E5'} 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        
        {/* Main content area with selected classroom attendance details */}
        <div className="lg:col-span-2">
          {attendanceLoading ? (
            <div className={`${currentTheme.card} p-6 rounded-lg flex items-center justify-center h-64`}>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : selectedClassroom && currentClassroomAttendance ? (
            <AttendanceProgressChart 
              attendanceData={currentClassroomAttendance} 
              theme={theme} 
            />
          ) : (
            <div className={`${currentTheme.card} p-6 rounded-lg flex items-center justify-center h-64`}>
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {selectedClassroom ? 'No attendance data available for this classroom' : 'Select a classroom to view attendance statistics'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAttendancePage;