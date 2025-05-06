import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeProvider';
import { 
  BarChart3, 
  Calendar, 
  ChevronDown, 
  Filter, 
  User2,
  Search, 
  User, 
  UserCheck, 
  UserX 
} from 'lucide-react';

// Main Students Page Component
const StudentsPage = () => {
  const { themeConfig, theme, isDark } = useTheme();
  const [selectedDepartment, setSelectedDepartment] = useState('Computer Science');
  const [selectedGroup, setSelectedGroup] = useState('Group A');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock departments and groups data
  const departments = [
    { id: 1, name: 'Computer Science' },
    { id: 2, name: 'Information Technology' },
    { id: 3, name: 'Electrical Engineering' }
  ];
  
  const groups = {
    'Computer Science': ['Group A', 'Group B'],
    'Information Technology': ['Group C', 'Group D'],
    'Electrical Engineering': ['Group E', 'Group F']
  };
  
  // Mock students data
  const students = [
    {
      id: 1,
      name: "Alice Johnson",
      rollNumber: "CS21001",
      email: "alice.j@university.edu",
      department: "Computer Science",
      group: "Group A",
      attendanceRate: 94,
      lastAttendance: "Today, 10:00 AM",
      recentActivity: "Present in Advanced Mathematics",
      profileImage: "A"
    },
    {
      id: 2,
      name: "Bob Smith",
      rollNumber: "CS21002",
      email: "bob.s@university.edu",
      department: "Computer Science",
      group: "Group A",
      attendanceRate: 88,
      lastAttendance: "Today, 10:05 AM",
      recentActivity: "Present in Advanced Mathematics",
      profileImage: "B"
    },
    {
      id: 3,
      name: "Charlie Davis",
      rollNumber: "CS21003",
      email: "charlie.d@university.edu",
      department: "Computer Science",
      group: "Group A",
      attendanceRate: 76,
      lastAttendance: "Yesterday, 11:15 AM",
      recentActivity: "Absent in Computer Networks",
      profileImage: "C"
    },
    {
      id: 4,
      name: "Diana Miller",
      rollNumber: "CS21004",
      email: "diana.m@university.edu",
      department: "Computer Science",
      group: "Group A",
      attendanceRate: 92,
      lastAttendance: "Today, 10:02 AM",
      recentActivity: "Present in Advanced Mathematics",
      profileImage: "D"
    },
    {
      id: 5,
      name: "Edward Wilson",
      rollNumber: "CS21005",
      email: "edward.w@university.edu",
      department: "Computer Science",
      group: "Group A",
      attendanceRate: 90,
      lastAttendance: "Today, 10:01 AM",
      recentActivity: "Present in Advanced Mathematics",
      profileImage: "E"
    }
  ];
  
  // Filter students based on department, group, and search query
  const filteredStudents = students.filter(student => 
    student.department === selectedDepartment && 
    student.group === selectedGroup &&
    (searchQuery === '' || student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <div className={`${themeConfig[theme].background} min-h-screen p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${themeConfig[theme].text}`}>Students</h2>
        
        <div className="flex items-center space-x-3">
          <div className={`flex items-center px-3 py-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
            <Search size={18} className={`mr-2 ${themeConfig[theme].secondaryText}`} />
            <input
              type="text"
              placeholder="Search students..."
              className={`bg-transparent outline-none ${themeConfig[theme].text} w-40`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button 
            className={`flex items-center px-3 py-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 border border-gray-200'}`}
            onClick={() => setShowFilterPanel(!showFilterPanel)}
          >
            <Filter size={18} className={`mr-2 ${themeConfig[theme].secondaryText}`} />
            <span className={themeConfig[theme].text}>Filter</span>
          </button>
        </div>
      </div>
      
      {/* Department and Group Selection */}
      <div className={`p-4 mb-6 rounded-lg ${themeConfig[theme].card}`}>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className={`block mb-2 text-sm font-medium ${themeConfig[theme].secondaryText}`}>Department</label>
            <div className="relative">
              <select
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setSelectedGroup(groups[e.target.value][0]);
                }}
                className={`w-full p-2.5 rounded-lg appearance-none ${
                  isDark 
                    ? 'bg-gray-800 text-white border border-gray-700' 
                    : 'bg-white text-gray-900 border border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {departments.map(dept => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown size={16} className={themeConfig[theme].secondaryText} />
              </div>
            </div>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className={`block mb-2 text-sm font-medium ${themeConfig[theme].secondaryText}`}>Group</label>
            <div className="relative">
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className={`w-full p-2.5 rounded-lg appearance-none ${
                  isDark 
                    ? 'bg-gray-800 text-white border border-gray-700' 
                    : 'bg-white text-gray-900 border border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {groups[selectedDepartment].map((group, index) => (
                  <option key={index} value={group}>{group}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown size={16} className={themeConfig[theme].secondaryText} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${themeConfig[theme].card}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className={`text-sm ${themeConfig[theme].secondaryText}`}>Total Students</p>
              <p className={`text-2xl font-bold mt-1 ${themeConfig[theme].text}`}>{filteredStudents.length}</p>
            </div>
            <div className={`p-3 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <User size={20} className={themeConfig[theme].gradient.text} />
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${themeConfig[theme].card}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className={`text-sm ${themeConfig[theme].secondaryText}`}>Present Today</p>
              <p className={`text-2xl font-bold mt-1 ${themeConfig[theme].text}`}>
                {filteredStudents.filter(s => s.lastAttendance.includes('Today')).length}
              </p>
            </div>
            <div className={`p-3 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <UserCheck size={20} className="text-green-500" />
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${themeConfig[theme].card}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className={`text-sm ${themeConfig[theme].secondaryText}`}>Absent Today</p>
              <p className={`text-2xl font-bold mt-1 ${themeConfig[theme].text}`}>
                {filteredStudents.filter(s => !s.lastAttendance.includes('Today')).length}
              </p>
            </div>
            <div className={`p-3 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <UserX size={20} className="text-red-500" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Filter Panel (Conditionally Rendered) */}
      {showFilterPanel && (
        <div className={`p-4 mb-6 rounded-lg ${themeConfig[theme].card} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className={`text-sm font-semibold mb-3 ${themeConfig[theme].text}`}>Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block mb-2 text-xs ${themeConfig[theme].secondaryText}`}>Attendance Rate</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Min %"
                  className={`w-full p-2 rounded-md ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border`}
                />
                <span className={themeConfig[theme].secondaryText}>to</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Max %"
                  className={`w-full p-2 rounded-md ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border`}
                />
              </div>
            </div>
            
            <div>
              <label className={`block mb-2 text-xs ${themeConfig[theme].secondaryText}`}>Date Range</label>
              <input
                type="date"
                className={`w-full p-2 rounded-md ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border`}
              />
            </div>
            
            <div className="flex items-end">
              <button className={`w-full p-2 rounded-md ${themeConfig[theme].button.primary}`}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Student Listing */}
      <div className="mt-6">
        <h3 className={`text-lg font-semibold mb-4 ${themeConfig[theme].text}`}>
          Students in {selectedGroup}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map(student => (
            <StudentCard 
              key={student.id}
              student={student}
              onClick={() => setSelectedStudent(student)}
              themeConfig={themeConfig}
              theme={theme}
              isDark={isDark}
            />
          ))}
        </div>
      </div>
      
      {/* Student Details Modal */}
      {selectedStudent && (
        <StudentDetailsModal 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)}
          themeConfig={themeConfig}
          theme={theme}
          isDark={isDark}
        />
      )}
    </div>
  );
};

// Student Card Component
const StudentCard = ({ student, onClick, themeConfig, theme, isDark }) => {
  // Function to determine attendance status color
  const getAttendanceStatusColor = (rate) => {
    if (rate >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (rate >= 75) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };
  
  return (
    <div 
      className={`${themeConfig[theme].card} p-5 rounded-lg cursor-pointer transition-transform hover:scale-[1.02]`}
      onClick={onClick}
    >
      <div className="flex items-center mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
          isDark ? 'bg-indigo-600' : 'bg-blue-500'
        }`}>
          {student.profileImage}
        </div>
        <div className="ml-3">
          <h3 className={`font-semibold ${themeConfig[theme].text}`}>{student.name}</h3>
          <p className={`text-sm ${themeConfig[theme].secondaryText}`}>{student.rollNumber}</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className={`text-sm ${themeConfig[theme].secondaryText}`}>Attendance</span>
          <span className={`text-xs px-2 py-1 rounded-full ${getAttendanceStatusColor(student.attendanceRate)}`}>
            {student.attendanceRate}%
          </span>
        </div>
        
        <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-1.5">
          <div 
            className={`rounded-full h-1.5 ${
              student.attendanceRate >= 90 ? 'bg-green-500' : 
              student.attendanceRate >= 75 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${student.attendanceRate}%` }}
          ></div>
        </div>
        
        <div className="pt-2">
          <div className="flex items-center">
            <Calendar size={14} className={`mr-2 ${themeConfig[theme].secondaryText}`} />
            <span className={`text-xs ${themeConfig[theme].secondaryText}`}>Last seen: {student.lastAttendance}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Student Details Modal Component
const StudentDetailsModal = ({ student, onClose, themeConfig, theme, isDark }) => {
  // Mock attendance data for the chart
  const attendanceData = [
    { date: 'Apr 24', status: 'present' },
    { date: 'Apr 25', status: 'present' },
    { date: 'Apr 26', status: 'absent' },
    { date: 'Apr 27', status: 'present' },
    { date: 'Apr 28', status: 'present' },
    { date: 'Apr 29', status: 'present' },
    { date: 'Apr 30', status: 'absent' },
    { date: 'May 1', status: 'present' },
    { date: 'May 2', status: 'present' },
    { date: 'May 3', status: 'present' },
    { date: 'May 4', status: 'present' },
  ];
  
  // Mock course data
  const courses = [
    { name: 'Advanced Mathematics', attendance: 94 },
    { name: 'Computer Networks', attendance: 86 },
    { name: 'Artificial Intelligence', attendance: 92 },
    { name: 'Database Systems', attendance: 78 },
  ];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${themeConfig[theme].card} rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto`}>
        {/* Header */}
        <div className={`flex justify-between items-center p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-lg ${
              isDark ? 'bg-indigo-600' : 'bg-blue-500'
            }`}>
              {student.profileImage}
            </div>
            <div className="ml-3">
              <h2 className={`text-xl font-bold ${themeConfig[theme].text}`}>{student.name}</h2>
              <p className={`text-sm ${themeConfig[theme].secondaryText}`}>{student.rollNumber} • {student.department}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${themeConfig[theme].text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${themeConfig[theme].text}`}>Student Information</h3>
              <div className="space-y-3">
                <div>
                  <p className={`text-sm ${themeConfig[theme].secondaryText}`}>Email</p>
                  <p className={`font-medium ${themeConfig[theme].text}`}>{student.email}</p>
                </div>
                <div>
                  <p className={`text-sm ${themeConfig[theme].secondaryText}`}>Department</p>
                  <p className={`font-medium ${themeConfig[theme].text}`}>{student.department}</p>
                </div>
                <div>
                  <p className={`text-sm ${themeConfig[theme].secondaryText}`}>Group</p>
                  <p className={`font-medium ${themeConfig[theme].text}`}>{student.group}</p>
                </div>
                <div>
                  <p className={`text-sm ${themeConfig[theme].secondaryText}`}>Recent Activity</p>
                  <p className={`font-medium ${themeConfig[theme].text}`}>{student.recentActivity}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${themeConfig[theme].text}`}>Attendance Overview</h3>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-medium ${themeConfig[theme].text}`}>Overall Attendance</span>
                  <span className={`text-sm font-bold ${
                    student.attendanceRate >= 90 ? 'text-green-500' : 
                    student.attendanceRate >= 75 ? 'text-yellow-500' : 'text-red-500'
                  }`}>{student.attendanceRate}%</span>
                </div>
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 mb-4">
                  <div 
                    className={`rounded-full h-2 ${
                      student.attendanceRate >= 90 ? 'bg-green-500' : 
                      student.attendanceRate >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${student.attendanceRate}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs mb-1">
                  <span className={themeConfig[theme].secondaryText}>Last 30 days</span>
                </div>
                <div className="flex space-x-1">
                  {attendanceData.map((day, index) => (
                    <div 
                      key={index} 
                      className={`h-4 w-full rounded-sm ${
                        day.status === 'present' 
                          ? 'bg-green-500' 
                          : day.status === 'absent' 
                            ? 'bg-red-500' 
                            : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      title={`${day.date}: ${day.status}`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Course Attendance */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${themeConfig[theme].text}`}>Course Attendance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course, index) => (
                <div key={index} className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${themeConfig[theme].text}`}>{course.name}</span>
                    <span className={`text-sm ${
                      course.attendance >= 90 ? 'text-green-500' : 
                      course.attendance >= 75 ? 'text-yellow-500' : 'text-red-500'
                    }`}>{course.attendance}%</span>
                  </div>
                  <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                    <div 
                      className={`rounded-full h-1.5 ${
                        course.attendance >= 90 ? 'bg-green-500' : 
                        course.attendance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${course.attendance}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className={`flex justify-end p-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <button 
            className={`px-4 py-2 rounded-lg ${themeConfig[theme].button.green}`}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;