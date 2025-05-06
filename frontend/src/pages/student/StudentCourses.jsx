import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeProvider';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data - in a real app, this would come from your API
const SAMPLE_COURSES = [
  {
    _id: '1',
    name: 'Introduction to Computer Science',
    code: 'CS101',
    teacher: 'Dr. Sarah Johnson',
    schedule: [
      { day: 'Monday', startTime: '10:00', endTime: '11:30' },
      { day: 'Wednesday', startTime: '10:00', endTime: '11:30' }
    ],
    attendance: {
      present: 12,
      absent: 2,
      total: 14,
      history: [
        { date: '2025-04-01', status: 'present' },
        { date: '2025-04-03', status: 'present' },
        { date: '2025-04-08', status: 'absent' },
        { date: '2025-04-10', status: 'present' },
        { date: '2025-04-15', status: 'present' },
        { date: '2025-04-17', status: 'present' },
        { date: '2025-04-22', status: 'present' },
        { date: '2025-04-24', status: 'present' },
        { date: '2025-04-29', status: 'present' },
        { date: '2025-05-01', status: 'present' },
        { date: '2025-05-06', status: 'absent' },
        { date: '2025-05-08', status: 'present' },
        { date: '2025-05-13', status: 'present' },
        { date: '2025-05-15', status: 'present' }
      ]
    },
    progress: 65
  },
  {
    _id: '2',
    name: 'Data Structures and Algorithms',
    code: 'CS202',
    teacher: 'Prof. Michael Chen',
    schedule: [
      { day: 'Tuesday', startTime: '13:00', endTime: '14:30' },
      { day: 'Thursday', startTime: '13:00', endTime: '14:30' }
    ],
    attendance: {
      present: 13,
      absent: 1,
      total: 14,
      history: [
        { date: '2025-04-02', status: 'present' },
        { date: '2025-04-04', status: 'present' },
        { date: '2025-04-09', status: 'present' },
        { date: '2025-04-11', status: 'present' },
        { date: '2025-04-16', status: 'present' },
        { date: '2025-04-18', status: 'absent' },
        { date: '2025-04-23', status: 'present' },
        { date: '2025-04-25', status: 'present' },
        { date: '2025-04-30', status: 'present' },
        { date: '2025-05-02', status: 'present' },
        { date: '2025-05-07', status: 'present' },
        { date: '2025-05-09', status: 'present' },
        { date: '2025-05-14', status: 'present' },
        { date: '2025-05-16', status: 'present' }
      ]
    },
    progress: 78
  },
  {
    _id: '3',
    name: 'Database Management Systems',
    code: 'CS303',
    teacher: 'Dr. Emily Rodriguez',
    schedule: [
      { day: 'Monday', startTime: '14:00', endTime: '15:30' },
      { day: 'Friday', startTime: '10:00', endTime: '11:30' }
    ],
    attendance: {
      present: 10,
      absent: 4,
      total: 14,
      history: [
        { date: '2025-04-01', status: 'present' },
        { date: '2025-04-05', status: 'absent' },
        { date: '2025-04-08', status: 'present' },
        { date: '2025-04-12', status: 'present' },
        { date: '2025-04-15', status: 'present' },
        { date: '2025-04-19', status: 'present' },
        { date: '2025-04-22', status: 'absent' },
        { date: '2025-04-26', status: 'present' },
        { date: '2025-04-29', status: 'present' },
        { date: '2025-05-03', status: 'present' },
        { date: '2025-05-06', status: 'absent' },
        { date: '2025-05-10', status: 'present' },
        { date: '2025-05-13', status: 'present' },
        { date: '2025-05-17', status: 'absent' }
      ]
    },
    progress: 55
  }
];

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

// Course Card Component
const CourseCard = ({ course, onClick, isActive, theme }) => {
  const { themeConfig } = useTheme();
  const currentTheme = themeConfig[theme];
  const attendancePercentage = Math.round((course.attendance.present / course.attendance.total) * 100);
  
  return (
    <div 
      className={`${currentTheme.card} p-4 rounded-lg cursor-pointer mb-4 transition-all duration-300 ${
        isActive ? 'ring-2 ring-offset-2 ring-indigo-600' : ''
      }`}
      onClick={() => onClick(course)}
    >
      <h3 className={`text-lg font-semibold mb-1 truncate ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        {course.name}
      </h3>
      <div className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        {course.code} • {course.teacher}
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Progress:</span>
        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{course.progress}%</span>
      </div>
      <div className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 mb-3`}>
        <div 
          className={`${currentTheme.button.primary} h-2 rounded-full`} 
          style={{ width: `${course.progress}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between items-center">
        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Attendance:</span>
        <span className={`text-sm font-medium ${
          attendancePercentage >= 80 ? 'text-emerald-500' : 
          attendancePercentage >= 60 ? 'text-amber-500' : 'text-rose-500'
        }`}>
          {attendancePercentage}% ({course.attendance.present}/{course.attendance.total})
        </span>
      </div>
    </div>
  );
};

// Progress Chart Component
const ProgressChart = ({ course, theme }) => {
  const { themeConfig } = useTheme();
  const currentTheme = themeConfig[theme];
  const [showAllRecords, setShowAllRecords] = useState(false);
  
  // Transform attendance history for the line chart
  const attendanceData = course.attendance.history.map((record, index) => ({
    day: index + 1,
    status: record.status === 'present' ? 1 : 0,
    date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));
  
  // Calculate cumulative attendance percentage over time
  let present = 0;
  const cumulativeData = course.attendance.history.map((record, index) => {
    if (record.status === 'present') present++;
    return {
      day: index + 1,
      percentage: Math.round((present / (index + 1)) * 100),
      date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });
  
  // Pie chart data for present/absent ratio
  const pieData = [
    { name: 'Present', value: course.attendance.present, color: '#10B981' },
    { name: 'Absent', value: course.attendance.absent, color: '#EF4444' }
  ];

  // Limit displayed records if not showing all
  const displayedRecords = showAllRecords 
    ? course.attendance.history 
    : course.attendance.history.slice(-5); // Show last 5 records

  return (
    <div className={`${currentTheme.card} p-6 rounded-lg`}>
      <h3 className={`text-xl font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        {course.name} - Attendance Statistics
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance over time (line chart) */}
        <div>
          <h4 className={`text-md font-medium mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Attendance History
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
                labelFormatter={(value, entry) => `Day ${value}: ${entry[0].payload?.date}`}
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
        
        {/* Present/Absent Pie Chart */}
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
                {Math.round((course.attendance.present / course.attendance.total) * 100)}%
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
        <div className="overflow-x-auto max-h-64 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`sticky top-0 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Day
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {displayedRecords.map((record, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? (theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-50') : ''}>
                  <td className={`px-6 py-3 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className={`px-6 py-3 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      record.status === 'present' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {record.status === 'present' ? 'Present' : 'Absent'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!showAllRecords && course.attendance.history.length > 5 && (
          <div className="mt-2 text-right">
            <button 
              onClick={() => setShowAllRecords(true)}
              className={`text-sm ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}`}
            >
              View all {course.attendance.history.length} records
            </button>
          </div>
        )}
        {showAllRecords && (
          <div className="mt-2 text-right">
            <button 
              onClick={() => setShowAllRecords(false)}
              className={`text-sm ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}`}
            >
              Show less
            </button>
          </div>
        )}
      </ExpandableSection>
    </div>
  );
};

// Main Student Course Page Component
const StudentCoursesPage = () => {
  const { theme, themeConfig } = useTheme();
  const currentTheme = themeConfig[theme];
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch courses - in a real app, you'd call your API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCourses(SAMPLE_COURSES);
      setSelectedCourse(SAMPLE_COURSES[0]);
      setLoading(false);
    }, 800);
  }, []);
  
  // Attendance summary data for the bar chart
  const attendanceSummary = courses.map(course => ({
    name: course.code,
    present: Math.round((course.attendance.present / course.attendance.total) * 100),
    absent: Math.round((course.attendance.absent / course.attendance.total) * 100)
  }));
  
  if (loading) {
    return (
      <div className={`${currentTheme.background} min-h-screen p-4 md:p-6 flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return (
    <div className={`${currentTheme.background} min-h-screen p-4 md:p-6`}>
      <h1 className={`text-2xl md:text-3xl font-bold mb-6 ${currentTheme.gradient.text}`}>
        My Courses
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar with course cards */}
        <div className="lg:col-span-1">
          <div className="mb-6">
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Enrolled Courses
            </h2>
            {courses.map(course => (
              <CourseCard 
                key={course._id}
                course={course}
                onClick={setSelectedCourse}
                isActive={selectedCourse && selectedCourse._id === course._id}
                theme={theme}
              />
            ))}
          </div>
          
          {/* Cumulative attendance chart */}
          <div className={`${currentTheme.card} p-4 rounded-lg`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Overall Attendance
            </h3>
          
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={attendanceSummary}
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
                  formatter={(value) => [`${value}%`, '']}
                />
                <Legend wrapperStyle={{ color: theme === 'dark' ? 'white' : 'inherit' }} />
                <Bar 
                  dataKey="present" 
                  name="Present" 
                  fill="#10B981" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="absent" 
                  name="Absent" 
                  fill="#EF4444" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Main content area with selected course details */}
        <div className="lg:col-span-2">
          {selectedCourse ? (
            <ProgressChart course={selectedCourse} theme={theme} />
          ) : (
            <div className={`${currentTheme.card} p-6 rounded-lg flex items-center justify-center h-64`}>
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Select a course to view detailed statistics
              </p>
            </div>
          )}
          
          {/* Course schedule */}
          {selectedCourse && (
            <div className={`${currentTheme.card} p-6 rounded-lg mt-6`}>
              <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Course Schedule
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}>
                    <tr>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Day
                      </th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {selectedCourse.schedule.map((schedule, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? (theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-50') : ''}>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {schedule.day}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {schedule.startTime} - {schedule.endTime}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCoursesPage;