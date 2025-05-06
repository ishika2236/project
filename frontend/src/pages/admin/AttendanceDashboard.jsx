// import React, { useState } from 'react';
// import { useTheme } from '../../context/ThemeProvider';

// // Import views
// import OverviewView from './../../components/admin/attendance/views/OverviewView'
// import CourseView from './../../components/admin/attendance/views/CourseView';
// import GroupView from '../../components/admin/attendance/views/GroupView';
// import StudentView from './../../components/admin/attendance/views/StudentView';
// import Header from './../../components/admin/attendance/Header';

// // Mock data
// const MOCK_COURSES = [
//   { id: '1', courseName: 'Advanced Mathematics', courseCode: 'MATH301', department: 'Mathematics' },
//   { id: '2', courseName: 'Data Structures', courseCode: 'CS201', department: 'Computer Science' },
//   { id: '3', courseName: 'Organic Chemistry', courseCode: 'CHEM202', department: 'Chemistry' }
// ];

// const MOCK_GROUPS = [
//   { id: '1', name: 'Group A', courseId: '1', studentCount: 25 },
//   { id: '2', name: 'Group B', courseId: '1', studentCount: 22 },
//   { id: '3', name: 'Group A', courseId: '2', studentCount: 30 },
//   { id: '4', name: 'Group B', courseId: '2', studentCount: 28 },
//   { id: '5', name: 'Group A', courseId: '3', studentCount: 20 }
// ];

// const MOCK_STUDENTS = [
//   { 
//     id: '1', 
//     name: 'Jane Smith', 
//     groupId: '1', 
//     courseId: '1', 
//     averageAttendance: 92,
//     attendance: [
//       { date: '2025-04-01', status: 'present', approved: true },
//       { date: '2025-04-03', status: 'present', approved: true },
//       { date: '2025-04-05', status: 'medical', approved: true },
//       { date: '2025-04-08', status: 'present', approved: true },
//       { date: '2025-04-10', status: 'duty', approved: false }
//     ],
//     pendingLeaves: 1
//   },
//   { 
//     id: '2', 
//     name: 'John Doe', 
//     groupId: '1', 
//     courseId: '1', 
//     averageAttendance: 88,
//     attendance: [
//       { date: '2025-04-01', status: 'present', approved: true },
//       { date: '2025-04-03', status: 'absent', approved: true },
//       { date: '2025-04-05', status: 'present', approved: true },
//       { date: '2025-04-08', status: 'present', approved: true },
//       { date: '2025-04-10', status: 'present', approved: true }
//     ],
//     pendingLeaves: 0
//   },
//   { 
//     id: '3', 
//     name: 'Mark Wilson', 
//     groupId: '2', 
//     courseId: '1', 
//     averageAttendance: 75,
//     attendance: [
//       { date: '2025-04-01', status: 'present', approved: true },
//       { date: '2025-04-03', status: 'absent', approved: true },
//       { date: '2025-04-05', status: 'medical', approved: false },
//       { date: '2025-04-08', status: 'absent', approved: true },
//       { date: '2025-04-10', status: 'present', approved: true }
//     ],
//     pendingLeaves: 1
//   }
// ];

// const AttendanceDashboard = () => {
//   const { themeConfig, theme, isDark } = useTheme();
//   const [activeView, setActiveView] = useState('overview'); // overview, course, group, student
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [students, setStudents] = useState(MOCK_STUDENTS);
  
//   const currentTheme = themeConfig[theme];
  
//   const handleCourseSelect = (course) => {
//     setSelectedCourse(course);
//     setSelectedGroup(null);
//     setSelectedStudent(null);
//     setActiveView('course');
//   };
  
//   const handleGroupSelect = (group) => {
//     setSelectedGroup(group);
//     setSelectedStudent(null);
//     setActiveView('group');
//   };
  
//   const handleStudentSelect = (student) => {
//     setSelectedStudent(student);
//     setActiveView('student');
//   };
  
//   const handleBack = () => {
//     if (activeView === 'student') {
//       setActiveView('group');
//       setSelectedStudent(null);
//     } else if (activeView === 'group') {
//       setActiveView('course');
//       setSelectedGroup(null);
//     } else if (activeView === 'course') {
//       setActiveView('overview');
//       setSelectedCourse(null);
//     }
//   };
  
//   const approveLeave = (studentId, date) => {
//     // This would connect to your backend API
//     console.log(`Approved leave for student ${studentId} on ${date}`);
    
//     // Update UI optimistically
//     const updatedStudents = students.map(student => {
//       if (student.id === studentId) {
//         const updatedAttendance = student.attendance.map(a => {
//           if (a.date === date) {
//             return { ...a, approved: true };
//           }
//           return a;
//         });
        
//         return { 
//           ...student, 
//           attendance: updatedAttendance, 
//           pendingLeaves: student.pendingLeaves - 1 
//         };
//       }
//       return student;
//     });
    
//     setStudents(updatedStudents);
    
//     // If the selected student is the one being updated, update that too
//     if (selectedStudent && selectedStudent.id === studentId) {
//       const updatedStudent = updatedStudents.find(s => s.id === studentId);
//       setSelectedStudent(updatedStudent);
//     }
//   };
  
//   return (
//     <div className={`min-h-screen ${currentTheme.background}`}>
//       <div className={`max-w-7xl mx-auto px-4 py-6 ${currentTheme.text}`}>
//         {/* Header */}
//         <Header 
//           activeView={activeView}
//           selectedCourse={selectedCourse}
//           selectedGroup={selectedGroup}
//           selectedStudent={selectedStudent}
//           searchTerm={searchTerm}
//           setSearchTerm={setSearchTerm}
//           handleBack={handleBack}
//         />
        
//         {/* Main Content */}
//         <div className={`${isDark ? currentTheme.gradientBackground : 'bg-white'} rounded-xl shadow-lg p-6`}>
//           {/* Overview */}
//           {activeView === 'overview' && (
//             <OverviewView 
//               courses={MOCK_COURSES} 
//               groups={MOCK_GROUPS} 
//               handleCourseSelect={handleCourseSelect} 
//             />
//           )}
          
//           {/* Course View */}
//           {activeView === 'course' && selectedCourse && (
//             <CourseView 
//               course={selectedCourse} 
//               groups={MOCK_GROUPS} 
//               handleGroupSelect={handleGroupSelect} 
//             />
//           )}
          
//           {/* Group View */}
//           {activeView === 'group' && selectedGroup && (
//             <GroupView 
//               group={selectedGroup}
//               course={selectedCourse}
//               students={students}
//               searchTerm={searchTerm}
//               onStudentSelect={handleStudentSelect}
//             />
//           )}
          
//           {/* Student View */}
//           {activeView === 'student' && selectedStudent && (
//             <StudentView 
//               student={selectedStudent}
//               courses={MOCK_COURSES}
//               groups={MOCK_GROUPS}
//               onApproveLeave={approveLeave}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttendanceDashboard;
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeProvider';

// Import views
import OverviewView from './../../components/admin/attendance/views/OverviewView';
import DepartmentView from './../../components/admin/attendance/views/DepartmentView';
import GroupView from '../../components/admin/attendance/views/GroupView';
import StudentView from './../../components/admin/attendance/views/StudentView';
import Header from './../../components/admin/attendance/Header';

// Mock data
const MOCK_DEPARTMENTS = [
  { id: '1', name: 'Mathematics', studentCount: 47 },
  { id: '2', name: 'Computer Science', studentCount: 58 },
  { id: '3', name: 'Chemistry', studentCount: 20 }
];

const MOCK_COURSES = [
  { id: '1', courseName: 'Advanced Mathematics', courseCode: 'MATH301', departmentId: '1' },
  { id: '2', courseName: 'Linear Algebra', courseCode: 'MATH202', departmentId: '1' },
  { id: '3', courseName: 'Data Structures', courseCode: 'CS201', departmentId: '2' },
  { id: '4', courseName: 'Algorithms Analysis', courseCode: 'CS303', departmentId: '2' },
  { id: '5', courseName: 'Organic Chemistry', courseCode: 'CHEM202', departmentId: '3' }
];

const MOCK_GROUPS = [
  { id: '1', name: 'Group A', departmentId: '1', studentCount: 25 },
  { id: '2', name: 'Group B', departmentId: '1', studentCount: 22 },
  { id: '3', name: 'Group A', departmentId: '2', studentCount: 30 },
  { id: '4', name: 'Group B', departmentId: '2', studentCount: 28 },
  { id: '5', name: 'Group A', departmentId: '3', studentCount: 20 }
];

const MOCK_STUDENTS = [
  { 
    id: '1', 
    name: 'Jane Smith', 
    groupId: '1', 
    departmentId: '1', 
    courses: ['1', '2'], // Taking both Math courses
    averageAttendance: 92,
    attendance: [
      { date: '2025-04-01', courseId: '1', status: 'present', approved: true },
      { date: '2025-04-03', courseId: '1', status: 'present', approved: true },
      { date: '2025-04-05', courseId: '1', status: 'medical', approved: true },
      { date: '2025-04-08', courseId: '2', status: 'present', approved: true },
      { date: '2025-04-10', courseId: '2', status: 'duty', approved: false }
    ],
    pendingLeaves: 1
  },
  { 
    id: '2', 
    name: 'John Doe', 
    groupId: '1', 
    departmentId: '1', 
    courses: ['1'], // Taking only Advanced Mathematics
    averageAttendance: 88,
    attendance: [
      { date: '2025-04-01', courseId: '1', status: 'present', approved: true },
      { date: '2025-04-03', courseId: '1', status: 'absent', approved: true },
      { date: '2025-04-05', courseId: '1', status: 'present', approved: true },
      { date: '2025-04-08', courseId: '1', status: 'present', approved: true },
      { date: '2025-04-10', courseId: '1', status: 'present', approved: true }
    ],
    pendingLeaves: 0
  },
  { 
    id: '3', 
    name: 'Mark Wilson', 
    groupId: '2', 
    departmentId: '1', 
    courses: ['1', '2'], // Taking both Math courses
    averageAttendance: 75,
    attendance: [
      { date: '2025-04-01', courseId: '1', status: 'present', approved: true },
      { date: '2025-04-03', courseId: '1', status: 'absent', approved: true },
      { date: '2025-04-05', courseId: '2', status: 'medical', approved: false },
      { date: '2025-04-08', courseId: '2', status: 'absent', approved: true },
      { date: '2025-04-10', courseId: '1', status: 'present', approved: true }
    ],
    pendingLeaves: 1
  }
];

const AttendanceDashboard = () => {
  const { themeConfig, theme, isDark } = useTheme();
  const [activeView, setActiveView] = useState('overview'); // overview, department, group, student
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState(MOCK_STUDENTS);
  
  const currentTheme = themeConfig[theme];
  
  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
    setSelectedGroup(null);
    setSelectedStudent(null);
    setActiveView('department');
  };
  
  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setSelectedStudent(null);
    setActiveView('group');
  };
  
  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setActiveView('student');
  };
  
  const handleBack = () => {
    if (activeView === 'student') {
      setActiveView('group');
      setSelectedStudent(null);
    } else if (activeView === 'group') {
      setActiveView('department');
      setSelectedGroup(null);
    } else if (activeView === 'department') {
      setActiveView('overview');
      setSelectedDepartment(null);
    }
  };
  
  const approveLeave = (studentId, date, courseId) => {
    // This would connect to your backend API
    console.log(`Approved leave for student ${studentId} on ${date} for course ${courseId}`);
    
    // Update UI optimistically
    const updatedStudents = students.map(student => {
      if (student.id === studentId) {
        const updatedAttendance = student.attendance.map(a => {
          if (a.date === date && a.courseId === courseId) {
            return { ...a, approved: true };
          }
          return a;
        });
        
        return { 
          ...student, 
          attendance: updatedAttendance, 
          pendingLeaves: student.pendingLeaves - 1 
        };
      }
      return student;
    });
    
    setStudents(updatedStudents);
    
    // If the selected student is the one being updated, update that too
    if (selectedStudent && selectedStudent.id === studentId) {
      const updatedStudent = updatedStudents.find(s => s.id === studentId);
      setSelectedStudent(updatedStudent);
    }
  };
  
  return (
    <div className={`min-h-screen ${currentTheme.background}`}>
      <div className={`max-w-7xl mx-auto px-4 py-6 ${currentTheme.text}`}>
        {/* Header */}
        <Header 
          activeView={activeView}
          selectedDepartment={selectedDepartment}
          selectedGroup={selectedGroup}
          selectedStudent={selectedStudent}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleBack={handleBack}
        />
        
        {/* Main Content */}
        <div className={`${isDark ? currentTheme.gradientBackground : 'bg-white'} rounded-xl shadow-lg p-6`}>
          {/* Overview */}
          {activeView === 'overview' && (
            <OverviewView 
              departments={MOCK_DEPARTMENTS}
              handleDepartmentSelect={handleDepartmentSelect} 
            />
          )}
          
          {/* Department View */}
          {activeView === 'department' && selectedDepartment && (
            <DepartmentView 
              department={selectedDepartment} 
              groups={MOCK_GROUPS} 
              courses={MOCK_COURSES}
              handleGroupSelect={handleGroupSelect} 
            />
          )}
          
          {/* Group View */}
          {activeView === 'group' && selectedGroup && (
            <GroupView 
              group={selectedGroup}
              department={selectedDepartment}
              students={students}
              courses={MOCK_COURSES}
              searchTerm={searchTerm}
              onStudentSelect={handleStudentSelect}
            />
          )}
          
          {/* Student View */}
          {activeView === 'student' && selectedStudent && (
            <StudentView 
              student={selectedStudent}
              courses={MOCK_COURSES}
              groups={MOCK_GROUPS}
              departments={MOCK_DEPARTMENTS}
              onApproveLeave={approveLeave}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceDashboard;