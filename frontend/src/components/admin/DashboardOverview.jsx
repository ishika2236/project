
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useTheme } from '../../context/ThemeProvider';
// import HeroSection from '../../components/admin/dashboard/HeroSection';
// import StudentEnrollmentSection from '../admin/dashboard/StudentEnrollment';
// import CourseDistributionSection from '../admin/dashboard/CourseDistributionSection';
// import GroupDistribution from '../admin/GroupDistribution';
// import AttendanceCharts from '../admin/dashboard/AttendanceCharts';
// import LoadingSpinner from './departmentPageComponents/LoadingSpinner';

// // Import thunks
// import { fetchStudents } from '../../app/features/users/userThunks';
// import { fetchAdminCourses } from '../../app/features/courses/courseThunks';
// import { fetchAllGroups } from '../../app/features/groups/groupThunks';
// import { fetchDepartments } from '../../app/features/departments/departmentThunks';


// export default function DashboardOverview() {
//   const { themeConfig, theme } = useTheme();
//   const colors = themeConfig[theme];
//   const dispatch = useDispatch();
  
//   // Get data from Redux store
//   const { students, loading: studentsLoading } = useSelector(state => ({
//     students: state.users.students,
//     loading: state.users.loading.students
//   }));
  
//   const { courses, isLoading: coursesLoading } = useSelector(state => state.courses);
  
//   const { allGroups, loading: groupsLoading } = useSelector(state => state.groups);
  
//   const { departments, isLoading: departmentsLoading } = useSelector(state => state.departments);
  
//   // Local state for aggregated and processed data
//   const [studentData, setStudentData] = useState({
//     total: 0,
//     newThisMonth: 0,
//     growth: 0,
//     sections: []
//   });
  
  
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [groupAttendanceData, setGroupAttendanceData] = useState([]);
  
//   // Fetch data on component mount
//   useEffect(() => {
//     dispatch(fetchStudents());
//     dispatch(fetchAdminCourses());
//     dispatch(fetchAllGroups());
//     dispatch(fetchDepartments());
//   }, [dispatch]);
  
//   // Process student data
//   useEffect(() => {
//     if (students.length > 0 && departments.length > 0) {
//       // Count students by department
//       const deptCounts = {};
//       departments.forEach(dept => {
//         deptCounts[dept._id] = 0;
//       });
      
//       students.forEach(student => {
//         if (student.department && deptCounts[student.department]) {
//           deptCounts[student.department]++;
//         }
//       });
      
//       // Calculate new students this month
//       const now = new Date();
//       const thisMonth = now.getMonth();
//       const thisYear = now.getFullYear();
      
//       const newStudents = students.filter(student => {
//         const createdAt = new Date(student.createdAt);
//         return createdAt.getMonth() === thisMonth && createdAt.getFullYear() === thisYear;
//       });
      
//       // Generate colors for sections
//       const colorPalette = ['#2E67FF', '#2F955A', '#F2683C', '#506EE5', '#8884d8'];
      
//       // Create sections data
//       const sections = departments.map((dept, index) => ({
//         name: dept.name,
//         students: deptCounts[dept._id] || 0,
//         color: colorPalette[index % colorPalette.length]
//       })).filter(section => section.students > 0);
      
//       // Calculate growth (example calculation - modify as needed)
//       const growth = students.length > 0 ? (newStudents.length / students.length) * 100 : 0;
      
//       setStudentData({
//         total: students.length,
//         newThisMonth: newStudents.length,
//         growth: growth.toFixed(1),
//         sections
//       });
//     }
//   }, [students, departments]);
  
//   // Process courses and groups data
//   useEffect(() => {
//     if (courses.length > 0 && Object.keys(allGroups).length > 0) {
//       const colorPalette = ['#2E67FF', '#2F955A', '#F2683C', '#506EE5', '#8884d8', '#82ca9d', '#ffc658'];
      
//       // Map courses to the format needed by charts
//       const courseData = courses.map((course, index) => {
//         // Find all groups for this course
//         const courseGroups = [];
//         Object.values(allGroups).forEach(departmentGroups => {
//           departmentGroups.forEach(group => {
//             if (group.course && group.course._id === course._id) {
//               courseGroups.push(group);
//             }
//           });
//         });
        
//         // Count students in this course (combining all groups)
//         const studentCount = courseGroups.reduce((total, group) => {
//           return total + (group.students ? group.students.length : 0);
//         }, 0);
        
//         // Map groups for this course
//         const groups = courseGroups.map((group, gIndex) => ({
//           name: `Group ${String.fromCharCode(65 + gIndex)}`, // Group A, B, C, etc.
//           students: group.students ? group.students.length : 0
//         }));
        
//         return {
//           name: course.title,
//           totalGroups: courseGroups.length,
//           students: studentCount,
//           color: colorPalette[index % colorPalette.length],
//           groups
//         };
//       }).filter(course => course.students > 0);
      
//       setCourseGroupData(courseData);
      
//       // Generate attendance data for courses (placeholder data - replace with actual data when available)
//       setAttendanceData(courseData.map(course => ({
//         name: course.name.length > 6 ? course.name.substring(0, 6) : course.name,
//         attendance: Math.floor(65 + Math.random() * 30) // Random attendance between 65-95%
//       })));
      
//       // Generate attendance data for groups (placeholder - replace with actual data when available)
//       const allGroupsFlattened = courseData.flatMap(course => course.groups);
//       setGroupAttendanceData(allGroupsFlattened.slice(0, 5).map(group => ({
//         name: group.name,
//         attendance: Math.floor(65 + Math.random() * 30)
//       })));

//     }
//   }, [courses, allGroups]);

//   // Check if data is loading
//   const isLoading = studentsLoading || coursesLoading || groupsLoading || departmentsLoading;
  
//   if (isLoading) {
//     return (
//       <div className={`${colors.background} min-h-screen p-6 flex items-center justify-center`}>
//         <LoadingSpinner />
//       </div>
//     );
//   }
//   const processDataForGroupDistribution = () => {
//     // Define color palette properly
//     const courseColors = ['#2E67FF', '#2F955A', '#F2683C', '#506EE5', '#8884d8', '#82ca9d', '#ffc658'];
    
//     // We'll need to assign groups to courses manually since there's no direct relationship
//     // For demonstration, we'll distribute groups across courses evenly
    
//     // Format courses data
//     const courseGroupData = courses.map((course, index) => {
//       const color = courseColors[index % courseColors.length];
      
//       // For each course, we'll find or assign some groups
//       // In a real application, you'd need a proper relationship or logic here
//       const departmentIds = Object.keys(allGroups);
//       const departmentId = course.department ? course.department._id : 
//                            (departmentIds.length > 0 ? departmentIds[index % departmentIds.length] : null);
      
//       // If we have a department, assign some groups from this department
//       let courseGroups = [];
//       if (departmentId && allGroups[departmentId]) {
//         // Take a subset of groups for this course (just for demonstration)
//         const startIdx = index % Math.max(1, allGroups[departmentId].length);
//         const groupsToTake = Math.min(3, Math.max(1, allGroups[departmentId].length / courses.length));
        
//         courseGroups = allGroups[departmentId]
//           .slice(startIdx, startIdx + groupsToTake)
//           .map((group, groupIndex) => ({
//             name: group.name || `Group ${String.fromCharCode(65 + groupIndex)}`,
//             students: group.students ? group.students.length : 0
//           }));
//       }
      
//       // Format the course object with its groups
//       return {
//         name: course.courseName || course.title || "Unnamed Course",
//         code: course.courseCode || "",
//         totalGroups: courseGroups.length,
//         students: courseGroups.reduce((sum, group) => sum + group.students, 0),
//         color: color,
//         groups: courseGroups
//       };
//     }).filter(course => course.totalGroups > 0); // Only include courses with groups
    
//     // Create flattened groups array for group view
//     const allGroupsFlattened = [];
    
//     // Distribute all groups across courses
//     let courseIndex = 0;
    
//     Object.keys(allGroups).forEach(departmentId => {
//       allGroups[departmentId].forEach(group => {
//         // Assign this group to a course in round-robin fashion
//         const course = courses[courseIndex % courses.length];
//         courseIndex++;
        
//         if (course) {
//           const colorIndex = courses.indexOf(course) % courseColors.length;
          
//           allGroupsFlattened.push({
//             name: group.name || `Group ${group._id.slice(-4)}`,
//             courseName: course.courseName || course.title || "Unnamed Course",
//             courseColor: courseColors[colorIndex],
//             students: group.students ? group.students.length : 0,
//             courseId: course._id
//           });
//         }
//       });
//     });
    
//     return { courseGroupData, allGroupsFlattened };
//   };
  
//   // Get the processed data
//   const { courseGroupData, allGroupsFlattened } = processDataForGroupDistribution();
  
//   return (
//     <div className={`${colors.background} min-h-screen p-6`}>
//       <div className={`${colors.gradientBackground} rounded-2xl p-6 shadow-xl`}>
//         {/* Enhanced Hero Section */}
//         <HeroSection />
        
//         {/* Student Enrollment Stats Section */}
//         <StudentEnrollmentSection studentData={studentData} />
        
//         {/* Course Distribution Section */}
//         <CourseDistributionSection coursesData={courses} />
        
//         {/* Group Distribution Section */}
//         {console.log("courses in dashboard Overview: ", courses)}
//         <GroupDistribution 
//           courseGroupData={courseGroupData}
//           allGroups={allGroupsFlattened}
//           theme={theme}
//           colors={colors}
//         />
        
//         {/* Attendance Charts */}
//         <AttendanceCharts 
//           theme={theme}
//           colors={colors}
//           attendanceData={attendanceData}
//           groupAttendanceData={groupAttendanceData}
//         />
//       </div>
//     </div>
//   );
// }
// // import React, { useEffect, useState } from 'react';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { useTheme } from '../../context/ThemeProvider';
// // import HeroSection from '../../components/admin/dashboard/HeroSection';
// // import StudentEnrollmentSection from '../admin/dashboard/StudentEnrollment';
// // import CourseDistributionSection from '../admin/dashboard/CourseDistributionSection';
// // import GroupDistribution from '../admin/GroupDistribution';
// // import AttendanceCharts from '../admin/dashboard/AttendanceCharts';
// // import LoadingSpinner from './departmentPageComponents/LoadingSpinner';

// // // Import thunks
// // import { fetchStudents } from '../../app/features/users/userThunks';
// // import { fetchAdminCourses } from '../../app/features/courses/courseThunks';
// // import { fetchAllGroups } from '../../app/features/groups/groupThunks';
// // import { fetchDepartments } from '../../app/features/departments/departmentThunks';


// // export default function DashboardOverview() {
// //   const { themeConfig, theme } = useTheme();
// //   const colors = themeConfig[theme];
// //   const dispatch = useDispatch();
  
// //   // Get data from Redux store
// //   const { students, loading: studentsLoading } = useSelector(state => ({
// //     students: state.users.students,
// //     loading: state.users.loading.students
// //   }));
  
// //   const { courses, isLoading: coursesLoading } = useSelector(state => state.courses);
  
// //   const { allGroups, loading: groupsLoading } = useSelector(state => state.groups);
  
// //   const { departments, isLoading: departmentsLoading } = useSelector(state => state.departments);
  
// //   // Local state for aggregated and processed data
// //   const [studentData, setStudentData] = useState({
// //     total: 0,
// //     newThisMonth: 0,
// //     growth: 0,
// //     sections: []
// //   });
  
// //   const [attendanceData, setAttendanceData] = useState([]);
// //   const [groupAttendanceData, setGroupAttendanceData] = useState([]);
// //   const [courseGroupData, setCourseGroupData] = useState([]);
// //   const [processedGroups, setProcessedGroups] = useState([]);
  
// //   // Fetch data on component mount
// //   useEffect(() => {
// //     dispatch(fetchStudents());
// //     dispatch(fetchAdminCourses());
// //     dispatch(fetchAllGroups());
// //     dispatch(fetchDepartments());
// //   }, [dispatch]);
  
// //   // Process student data
// //   useEffect(() => {
// //     if (students.length > 0 && departments.length > 0) {
// //       // Count students by department
// //       const deptCounts = {};
// //       departments.forEach(dept => {
// //         deptCounts[dept._id] = 0;
// //       });
      
// //       students.forEach(student => {
// //         if (student.department && deptCounts[student.department]) {
// //           deptCounts[student.department]++;
// //         }
// //       });
      
// //       // Calculate new students this month
// //       const now = new Date();
// //       const thisMonth = now.getMonth();
// //       const thisYear = now.getFullYear();
      
// //       const newStudents = students.filter(student => {
// //         const createdAt = new Date(student.createdAt);
// //         return createdAt.getMonth() === thisMonth && createdAt.getFullYear() === thisYear;
// //       });
      
// //       // Generate colors for sections
// //       const colorPalette = ['#2E67FF', '#2F955A', '#F2683C', '#506EE5', '#8884d8'];
      
// //       // Create sections data
// //       const sections = departments.map((dept, index) => ({
// //         name: dept.name,
// //         students: deptCounts[dept._id] || 0,
// //         color: colorPalette[index % colorPalette.length]
// //       })).filter(section => section.students > 0);
      
// //       // Calculate growth (example calculation - modify as needed)
// //       const growth = students.length > 0 ? (newStudents.length / students.length) * 100 : 0;
      
// //       setStudentData({
// //         total: students.length,
// //         newThisMonth: newStudents.length,
// //         growth: growth.toFixed(1),
// //         sections
// //       });
// //     }
// //   }, [students, departments]);
  
// //   // Process courses and groups data
// //   useEffect(() => {
// //     if (courses.length > 0 && Object.keys(allGroups).length > 0) {
// //       const colorPalette = ['#2E67FF', '#2F955A', '#F2683C', '#506EE5', '#8884d8', '#82ca9d', '#ffc658'];
      
// //       // Map courses to the format needed by charts
// //       const courseData = courses.map((course, index) => {
// //         // Find all groups for this course
// //         const courseGroups = [];
// //         Object.values(allGroups).forEach(departmentGroups => {
// //           departmentGroups.forEach(group => {
// //             if (group.course && group.course._id === course._id) {
// //               courseGroups.push(group);
// //             }
// //           });
// //         });
        
// //         // Count students in this course (combining all groups)
// //         const studentCount = courseGroups.reduce((total, group) => {
// //           return total + (group.students ? group.students.length : 0);
// //         }, 0);
        
// //         // Map groups for this course
// //         const groups = courseGroups.map((group, gIndex) => ({
// //           name: `Group ${String.fromCharCode(65 + gIndex)}`, // Group A, B, C, etc.
// //           students: group.students ? group.students.length : 0
// //         }));
        
// //         return {
// //           name: course.title,
// //           totalGroups: courseGroups.length,
// //           students: studentCount,
// //           color: colorPalette[index % colorPalette.length],
// //           groups
// //         };
// //       }).filter(course => course.students > 0);
      
// //       setCourseGroupData(courseData);
      
// //       // Generate attendance data for courses (placeholder data - replace with actual data when available)
// //       setAttendanceData(courseData.map(course => ({
// //         name: course.name.length > 6 ? course.name.substring(0, 6) : course.name,
// //         attendance: Math.floor(65 + Math.random() * 30) // Random attendance between 65-95%
// //       })));
      
// //       // Generate attendance data for groups (placeholder - replace with actual data when available)
// //       const allGroupsFlattened = courseData.flatMap(course => course.groups);
// //       setGroupAttendanceData(allGroupsFlattened.slice(0, 5).map(group => ({
// //         name: group.name,
// //         attendance: Math.floor(65 + Math.random() * 30)
// //       })));

// //       // Process groups for GroupDistribution component
// //       const flattenedGroups = [];
      
// //       courseData.forEach(course => {
// //         course.groups.forEach(group => {
// //           flattenedGroups.push({
// //             name: group.name,
// //             courseName: course.name,
// //             courseColor: course.color,
// //             students: group.students,
// //             courseId: course._id || `course-${Math.random().toString(36).substr(2, 9)}`
// //           });
// //         });
// //       });
      
// //       setProcessedGroups(flattenedGroups);
// //     }
// //   }, [courses, allGroups]);

// //   // Check if data is loading
// //   const isLoading = studentsLoading || coursesLoading || groupsLoading || departmentsLoading;
  
// //   if (isLoading) {
// //     return (
// //       <div className={`${colors.background} min-h-screen p-6 flex items-center justify-center`}>
// //         <LoadingSpinner />
// //       </div>
// //     );
// //   }
  
// //   return (
// //     <div className={`${colors.background} min-h-screen p-6`}>
// //       <div className={`${colors.gradientBackground} rounded-2xl p-6 shadow-xl`}>
// //         {/* Enhanced Hero Section */}
// //         <HeroSection />
        
// //         {/* Student Enrollment Stats Section */}
// //         <StudentEnrollmentSection studentData={studentData} />
        
// //         {/* Course Distribution Section */}
// //         <CourseDistributionSection coursesData={courses} />
        
// //         {/* Group Distribution Section */}
// //         <GroupDistribution 
// //           allGroups={processedGroups}
// //           courseGroupData={courseGroupData}
// //           theme={theme}
// //           colors={colors}
// //         />
        
// //         {/* Attendance Charts */}
// //         <AttendanceCharts 
// //           theme={theme}
// //           colors={colors}
// //           attendanceData={attendanceData}
// //           groupAttendanceData={groupAttendanceData}
// //         />
// //       </div>
// //     </div>
// //   );
// // }
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeProvider';
import HeroSection from '../../components/admin/dashboard/HeroSection';
import StudentEnrollmentSection from '../admin/dashboard/StudentEnrollment';
import CourseDistributionSection from '../admin/dashboard/CourseDistributionSection';
import GroupDistribution from '../admin/GroupDistribution';
import AttendanceCharts from '../admin/dashboard/AttendanceCharts';
import LoadingSpinner from './departmentPageComponents/LoadingSpinner';

// Import thunks
import { fetchStudents } from '../../app/features/users/userThunks';
import { fetchAdminCourses } from '../../app/features/courses/courseThunks';
import { fetchAllGroups } from '../../app/features/groups/groupThunks';
import { fetchDepartments } from '../../app/features/departments/departmentThunks';

export default function DashboardOverview() {
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];
  const dispatch = useDispatch();
  
  // Get data from Redux store
  const { students, loading: studentsLoading } = useSelector(state => ({
    students: state.users.students,
    loading: state.users.loading.students
  }));
  
  const { courses, isLoading: coursesLoading } = useSelector(state => state.courses);
  
  const { allGroups, loading: groupsLoading } = useSelector(state => state.groups);
  
  const { departments, isLoading: departmentsLoading } = useSelector(state => state.departments);
  
  // Local state for aggregated and processed data
  const [studentData, setStudentData] = useState({
    total: 0,
    newThisMonth: 0,
    growth: 0,
    sections: []
  });
  
  const [attendanceData, setAttendanceData] = useState([]);
  const [groupAttendanceData, setGroupAttendanceData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  
  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchAdminCourses());
    dispatch(fetchAllGroups());
    dispatch(fetchDepartments());
  }, [dispatch]);
  
  // Process student data
  useEffect(() => {
    if (students.length > 0 && departments.length > 0) {
      // Count students by department
      const deptCounts = {};
      departments.forEach(dept => {
        deptCounts[dept._id] = 0;
      });
      
      students.forEach(student => {
        if (student.department && deptCounts[student.department]) {
          deptCounts[student.department]++;
        }
      });
      
      // Calculate new students this month
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      
      const newStudents = students.filter(student => {
        const createdAt = new Date(student.createdAt);
        return createdAt.getMonth() === thisMonth && createdAt.getFullYear() === thisYear;
      });
      
      // Generate colors for sections
      const colorPalette = ['#2E67FF', '#2F955A', '#F2683C', '#506EE5', '#8884d8'];
      
      // Create sections data
      const sections = departments.map((dept, index) => ({
        name: dept.name,
        students: deptCounts[dept._id] || 0,
        color: colorPalette[index % colorPalette.length]
      })).filter(section => section.students > 0);
      
      // Calculate growth (example calculation - modify as needed)
      const growth = students.length > 0 ? (newStudents.length / students.length) * 100 : 0;
      
      setStudentData({
        total: students.length,
        newThisMonth: newStudents.length,
        growth: growth.toFixed(1),
        sections
      });
    }
  }, [students, departments]);
  
  // Process departments, courses and groups data
  useEffect(() => {
    if (departments.length > 0 && courses.length > 0 && Object.keys(allGroups).length > 0) {
      const colorPalette = ['#2E67FF', '#2F955A', '#F2683C', '#506EE5', '#8884d8', '#82ca9d', '#ffc658'];
      
      // Create department data with courses and groups
      const departmentDataArray = departments.map((dept, index) => {
        // Find courses for this department
        const deptCourses = courses.filter(course => 
          course.department && course.department._id === dept._id
        );
        
        // Find groups for this department
        const deptGroups = allGroups[dept._id] || [];
        
        // Count students in all groups for this department
        let totalStudentsInGroups = 0;
        deptGroups.forEach(group => {
          if (group.students) {
            totalStudentsInGroups += group.students.length;
          }
        });
        
        // Create groups data for this department
        const groupsData = deptGroups.map((group, gIndex) => ({
          name: group.name || `Group ${String.fromCharCode(65 + gIndex)}`,
          departmentName: dept.name,
          departmentColor: colorPalette[index % colorPalette.length],
          students: group.students ? group.students.length : 0,
          departmentId: dept._id
        }));
        
        return {
          departmentId: dept._id,
          departmentName: dept.name,
          departmentCode: dept.code,
          color: colorPalette[index % colorPalette.length],
          totalCourses: deptCourses.length,
          totalGroups: deptGroups.length,
          totalStudents: totalStudentsInGroups,
          courses: deptCourses.map(course => ({
            id: course._id,
            name: course.courseName || course.title,
            code: course.courseCode
          })),
          groups: groupsData
        };
      }).filter(dept => dept.totalGroups > 0 || dept.totalCourses > 0);
      
      setDepartmentData(departmentDataArray);
      
      // Generate attendance data (placeholder data)
      const attendanceDataArray = departmentDataArray
        .filter(dept => dept.totalGroups > 0)
        .map(dept => ({
          name: dept.departmentCode || dept.departmentName.substring(0, 6),
          attendance: Math.floor(65 + Math.random() * 30) // Random attendance between 65-95%
        }));
      
      setAttendanceData(attendanceDataArray);
      
      // Generate group attendance data (placeholder data)
      const allGroupsFlattened = departmentDataArray.flatMap(dept => dept.groups);
      setGroupAttendanceData(allGroupsFlattened.slice(0, 5).map(group => ({
        name: group.name,
        attendance: Math.floor(65 + Math.random() * 30)
      })));
    }
  }, [departments, courses, allGroups]);

  // Check if data is loading
  const isLoading = studentsLoading || coursesLoading || groupsLoading || departmentsLoading;
  
  if (isLoading) {
    return (
      <div className={`${colors.background} min-h-screen p-6 flex items-center justify-center`}>
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div className={`${colors.background} min-h-screen p-6`}>
      <div className={`${colors.gradientBackground} rounded-2xl p-6 shadow-xl`}>
        {/* Hero Section */}
        <HeroSection />
        
        {/* Student Enrollment Stats Section */}
        <StudentEnrollmentSection studentData={studentData} />
        
        {/* Course Distribution Section */}
        <CourseDistributionSection coursesData={courses} />
        
        {/* Group Distribution Section */}
        <GroupDistribution 
          departmentData={departmentData}
          theme={theme}
          colors={colors}
        />
        
        {/* Attendance Charts */}
        <AttendanceCharts 
          theme={theme}
          colors={colors}
          attendanceData={attendanceData}
          groupAttendanceData={groupAttendanceData}
        />
      </div>
    </div>
  );
}