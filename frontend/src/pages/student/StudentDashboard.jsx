// import React from "react";
// import Sidebar from "../../components/Sidebar";
// import Navbar from "../../components/Navbar";
// import { Book, ClipboardList, Calendar, FilePlus, Activity } from "lucide-react";
// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from "chart.js";
// import { useTheme } from "../../context/ThemeProvider"; 

// // Register Chart.js components
// ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

// const StudentDashboard = () => {
//   const { themeConfig, isDark } = useTheme(); 

//   const courses = [
//     { id: 1, name: "Mathematics", attendance: "92%" },
//     { id: 2, name: "Physics", attendance: "85%" },
//     { id: 3, name: "Computer Science", attendance: "97%" },
//   ];

//   const pieChartData = {
//     labels: ["Mathematics", "Physics", "Computer Science"],
//     datasets: [
//       {
//         label: "Course Attendance",
//         data: [92, 85, 97],
//         backgroundColor: ["#4caf50", "#ff9800", "#2196f3"],
//         borderColor: "#fff",
//         borderWidth: 2,
//       },
//     ],
//   };

//   const recentActivities = [
//     { id: 1, action: "Completed assignment for Mathematics", time: "2 hours ago" },
//     { id: 2, action: "Joined Physics study group", time: "5 hours ago" },
//     { id: 3, action: "Attended Computer Science class", time: "1 day ago" },
//   ];

//   return (
//     <div className={`flex ${isDark ? 'dark:bg-gray-950' : 'bg-gray-100'}`}>
//       {/* Sidebar */}
//       <Sidebar role="student" />

//       {/* Main Dashboard Section */}
//       <div className={`flex-1 min-h-screen ${isDark ? 'dark:bg-gray-950' : 'bg-gray-100'} p-6`}>
//         {/* Navbar */}
//         <Navbar userName="Student" />

//         {/* Dashboard Content */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//           {/* Enrolled Courses */}
//           <div className={`p-6 rounded-lg shadow-md ${isDark ? 'dark:bg-gray-900' : 'bg-white'}`}>
//             <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
//               <Book className="text-blue-500" /> Enrolled Courses
//             </h2>
//             <ul className="mt-4 space-y-3">
//               {courses.map((course) => (
//                 <li key={course.id} className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'} text-${isDark ? 'white' : 'gray-900'}`}>
//                   {course.name} – <span className="font-bold">{course.attendance}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Attendance Status */}
//           <div className={`p-6 rounded-lg shadow-md ${isDark ? 'dark:bg-gray-900' : 'bg-white'}`}>
//             <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
//               <ClipboardList className="text-green-500" /> Attendance Status
//             </h2>
//             <p className={`mt-4 ${isDark ? 'dark:text-white' : 'text-lg'}`}>
//               Overall Attendance: <span className="font-bold text-green-500">91%</span>
//             </p>
//           </div>

//           {/* Upcoming Classes */}
//           <div className={`p-6 rounded-lg shadow-md ${isDark ? 'dark:bg-gray-900' : 'bg-white'}`}>
//             <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
//               <Calendar className="text-yellow-500" /> Upcoming Classes
//             </h2>
//             <p className={`mt-4 ${isDark ? 'dark:text-white' : 'text-lg'}`}>Mathematics – Tomorrow at 10:00 AM</p>
//             <p className={`mt-4 ${isDark ? 'dark:text-white' : 'text-lg'}`}>Physics – Wednesday at 2:00 PM</p>
//           </div>

//           {/* Join New Course */}
//           <div className={`p-6 rounded-lg shadow-md flex items-center justify-between ${isDark ? 'dark:bg-gray-900' : 'bg-white'}`}>
//             <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
//               <FilePlus className="text-red-500" /> Join New Course
//             </h2>
//             <button className="bg-blue-500 text-white px-5 py-3 rounded-lg">Request</button>
//           </div>

//           {/* Pie Chart */}
//           <div className={`p-6 rounded-lg shadow-md col-span-2 lg:col-span-1 ${isDark ? 'dark:bg-gray-900' : 'bg-white'}`}>
//             <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
//               <Activity className="text-purple-500" /> Course Attendance Distribution
//             </h2>
//             <Pie data={pieChartData} />
//           </div>

//           {/* Recent Activities */}
//           <div className={`p-6 rounded-lg shadow-md col-span-2 lg:col-span-1 ${isDark ? 'dark:bg-gray-900' : 'bg-white'}`}>
//             <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
//               <Activity className="text-teal-500" /> Recent Activity
//             </h2>
//             <ul className="mt-4 space-y-3">
//               {recentActivities.map((activity) => (
//                 <li key={activity.id} className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'} text-${isDark ? 'white' : 'gray-900'}`}>
//                   <span className="font-bold">{activity.action}</span> – <span className="text-gray-500">{activity.time}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentDashboard;
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeProvider';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import StudentDashboardOverview from '../../components/student/StudentDashboardOverview';
import StudentCourseDetail from './StudentCourseDetails';
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
        <main className={`flex-1 overflow-y-auto p-6 ${themeConfig[theme].gradientBackground}`}>
          
            <Outlet/>
        
            
        
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;