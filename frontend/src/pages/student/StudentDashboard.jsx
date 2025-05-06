
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeProvider';
import StudentDashboardOverview from '../../components/student/StudentDashboardOverview';
import StudentCourseDetail from './StudentCourseDetails';
import Navbar from '../../components/Navbar';
const StudentDashboard = () => {
  const { themeConfig, theme } = useTheme();
  const location = useLocation();
  const params = useParams();

  // State for tracking selected items to pass to Sidebar
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  
  // Mock attendance data for dashboard charts
  const [attendanceData, setAttendanceData] = useState([]);
  
  useEffect(() => {
    // In a real app, fetch from API
    setAttendanceData([
      { name: 'Programming 101', present: 12, absent: 2, total: 14, percentage: 86 },
      { name: 'Data Structures', present: 8, absent: 1, total: 9, percentage: 89 },
      { name: 'Web Development', present: 15, absent: 3, total: 18, percentage: 83 },
      { name: 'Mobile Apps', present: 7, absent: 0, total: 7, percentage: 100 },
    ]);
  }, []);

  

  // Load selected entities based on URL parameters
  useEffect(() => {
    const fetchEntities = async () => {
      // In a real app, you'd fetch these from your API based on the IDs in the URL
      if (params.courseId) {
        setSelectedCourse({ _id: params.courseId, name: `Course ${params.courseId}` });
      }
      
      if (params.classId) {
        setSelectedClass({ _id: params.classId, name: `Class ${params.classId}` });
      }
    };
    
    fetchEntities();
  }, [params.courseId, params.classId]);

  // Dashboard view with attendance charts
 

  return (
    <div className={`${themeConfig[theme].background} min-h-screen flex flex-col`}>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
        />
        <div className="w-full">
          <Navbar/>
        <main className={`flex-1 overflow-y-auto p-6 ${themeConfig[theme].gradientBackground}`}>
          
          <Outlet/>
      
          
      
      </main>
        </div>
        
      </div>
    </div>
  );
};

export default StudentDashboard;