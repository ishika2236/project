

// import React, { useState, useEffect } from 'react';
// import { useTheme } from '../../context/ThemeProvider';
// import Sidebar from '../../components/sidebar';
// import CourseOverview from '../../components/teacher/CourseOverview';
// import CourseDetails from '../../components/teacher/CourseDetails';
// import ClassManagement from '../../components/teacher/ClassManagement';
// import AttendanceManagement from '../../components/teacher/AttendanceManagement';
// import AttendanceControl from '../../components/teacher/AttendanceControl';
// import MaterialsSharing from '../../components/teacher/MaterialsSharing';

// const TeacherDashboard = () => {
//   const { themeConfig, theme } = useTheme();
//   const [activeView, setActiveView] = useState('overview');
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [selectedClass, setSelectedClass] = useState(null);



// // useEffect(() => {
 
// //     console.log('Sidebar:', Sidebar);
// //   console.log('CourseOverview:', CourseOverview);
// //   console.log('CourseDetails:', CourseDetails);
// //   console.log('ClassManagement:', ClassManagement);
// //   console.log('AttendanceManagement:', AttendanceManagement);
// //   console.log('AttendanceControl:', AttendanceControl);
// //   console.log('MaterialsSharing:', MaterialsSharing);

// // }, []);

//   // Navigation handler
//   const handleNavigation = (view, course = null, group = null, cls = null) => {
//     setActiveView(view);
//     if (course !== null) setSelectedCourse(course);
//     if (group !== null) setSelectedGroup(group);
//     if (cls !== null) setSelectedClass(cls);
//   };

//   // Render the appropriate view
//   const renderView = () => {
//     switch (activeView) {
//       case 'overview':
//         return <CourseOverview onSelectCourse={(course) => handleNavigation('courseDetails', course)} />;
//       case 'courseDetails':
//         return (
//           <CourseDetails 
//             course={selectedCourse} 
//             onSelectGroup={(group) => handleNavigation('classManagement', selectedCourse, group)} 
//           />
//         );
//       case 'classManagement':
//         return (
//           <ClassManagement 
//             course={selectedCourse} 
//             group={selectedGroup}
//             onSelectClass={(cls) => handleNavigation('attendanceManagement', selectedCourse, selectedGroup, cls)} 
//           />
//         );
//       case 'attendanceManagement':
//         return (
//           <AttendanceManagement 
//             course={selectedCourse} 
//             group={selectedGroup} 
//             classItem={selectedClass} 
//           />
//         );
//       case 'attendanceControl':
//         return (
//           <AttendanceControl 
//             course={selectedCourse} 
//             group={selectedGroup} 
//             classItem={selectedClass} 
//           />
//         );
//       case 'materialsSharing':
//         return (
//           <MaterialsSharing 
//             course={selectedCourse} 
//             group={selectedGroup} 
//             classItem={selectedClass} 
//           />
//         );
//       default:
//         return <CourseOverview onSelectCourse={(course) => handleNavigation('courseDetails', course)} />;
//     }
//   };

//   return (
//     <div className={`${themeConfig[theme].background} min-h-screen flex flex-col`}>
//       {/* <Header /> */}
//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar 
//           activeView={activeView} 
//           selectedCourse={selectedCourse}
//           selectedGroup={selectedGroup}
//           selectedClass={selectedClass}
//           onNavigate={handleNavigation}
//         />
//         <main className={`flex-1 overflow-y-auto p-6 ${themeConfig[theme].gradientBackground}`}>
//           {renderView()}
//         </main>
//         {/* <AttendanceControl/> */}
        
//       </div>

//     </div>
//   );
// };

// export default TeacherDashboard;


import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeProvider';
import Sidebar from '../../components/sidebar';
import Navbar from '../../components/Navbar';
const TeacherDashboard = () => {
  const { themeConfig, theme } = useTheme();
  const location = useLocation();
  const params = useParams();

  // State for tracking selected items to pass to Sidebar
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  
  // Determine active view based on current URL path
  const getActiveViewFromPath = () => {
    if (location.pathname.includes('/classes/') && location.pathname.endsWith('/attendance')) {
      return 'attendanceManagement';
    } else if (location.pathname.includes('/classes/') && location.pathname.endsWith('/control')) {
      return 'attendanceControl';
    } else if (location.pathname.includes('/classes/') && location.pathname.endsWith('/materials')) {
      return 'materialsSharing';
    } else if (location.pathname.includes('/groups/')) {
      return 'classManagement';
    } else if (location.pathname.includes('/courses/')) {
      return 'courseDetails';
    } else {
      return 'overview';
    }
  };

  // Load selected entities based on URL parameters
  useEffect(() => {
    const fetchEntities = async () => {
      // In a real app, you'd fetch these from your API based on the IDs in the URL
      if (params.courseId) {
        // Example API call to get course details
        // const response = await api.getCourseById(params.courseId);
        // setSelectedCourse(response.data);
        
        // For now, we'll use a placeholder
        setSelectedCourse({ _id: params.courseId, name: `Course ${params.courseId}` });
      }
      
      if (params.groupId) {
        // Example API call for group
        setSelectedGroup({ _id: params.groupId, name: `Group ${params.groupId}` });
      }
      
      if (params.classId) {
        // Example API call for class
        setSelectedClass({ _id: params.classId, name: `Class ${params.classId}` });
      }
    };
    
    fetchEntities();
  }, [params.courseId, params.groupId, params.classId]);

  return (
    <div className={`${themeConfig[theme].background} min-h-screen flex flex-col`}>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeView={getActiveViewFromPath()}
          selectedCourse={selectedCourse}
          selectedGroup={selectedGroup}
          selectedClass={selectedClass}
        />
        <div className="">
          <Navbar/>
          <main className={`flex-1 overflow-y-auto p-6 ${themeConfig[theme].gradientBackground}`}>
            <Outlet />
          </main>
        </div>
        
      </div>
    </div>
  );
};

export default TeacherDashboard;