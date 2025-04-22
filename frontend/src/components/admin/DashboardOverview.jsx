// import React, { useState } from 'react';
// import { useTheme } from '../../context/ThemeProvider';
// import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Treemap } from 'recharts';
// import { Users, Book, CalendarCheck, BarChart2, ChevronRight, ArrowUpRight, Layers, Grid } from 'lucide-react';
// import GroupDistribution from './GroupDistribution'
// // Mock data for demonstration
// const studentData = {
//   total: 856,
//   newThisMonth: 48,
//   growth: 12.5,
//   sections: [
//     { name: 'Computer Science', students: 320, color: '#2E67FF' },
//     { name: 'Data Science', students: 280, color: '#2F955A' },
//     { name: 'Digital Marketing', students: 156, color: '#F2683C' },
//     { name: 'Graphic Design', students: 100, color: '#506EE5' }
//   ]
// };

// const courseData = {
//   total: 24,
//   sections: [
//     { name: 'Web Development', students: 210, color: '#2E67FF' },
//     { name: 'AI & Machine Learning', students: 185, color: '#2F955A' },
//     { name: 'UI/UX Design', students: 130, color: '#F2683C' },
//     { name: 'Digital Marketing', students: 120, color: '#506EE5' },
//     { name: 'Others', students: 211, color: '#8884d8' }
//   ]
// };

// // Enhanced course and group data
// const courseGroupData = [
//   { 
//     name: 'Web Development',
//     totalGroups: 7,
//     students: 210,
//     color: '#2E67FF',
//     groups: [
//       { name: 'Group A', students: 30 },
//       { name: 'Group B', students: 32 },
//       { name: 'Group C', students: 29 },
//       { name: 'Group D', students: 30 },
//       { name: 'Group E', students: 31 },
//       { name: 'Group F', students: 28 },
//       { name: 'Group G', students: 30 }
//     ]
//   },
//   { 
//     name: 'AI & Machine Learning',
//     totalGroups: 6,
//     students: 185,
//     color: '#2F955A',
//     groups: [
//       { name: 'Group A', students: 32 },
//       { name: 'Group B', students: 30 },
//       { name: 'Group C', students: 31 },
//       { name: 'Group D', students: 32 },
//       { name: 'Group E', students: 30 },
//       { name: 'Group F', students: 30 }
//     ]
//   },
//   { 
//     name: 'UI/UX Design',
//     totalGroups: 3,
//     students: 130,
//     color: '#F2683C',
//     groups: [
//       { name: 'Group A', students: 45 },
//       { name: 'Group B', students: 42 },
//       { name: 'Group C', students: 43 }
//     ]
//   },
//   { 
//     name: 'Digital Marketing',
//     totalGroups: 2,
//     students: 120,
//     color: '#506EE5',
//     groups: [
//       { name: 'Group A', students: 58 },
//       { name: 'Group B', students: 62 }
//     ]
//   },
//   { 
//     name: 'Blockchain',
//     totalGroups: 2,
//     students: 65,
//     color: '#8884d8',
//     groups: [
//       { name: 'Group A', students: 32 },
//       { name: 'Group B', students: 33 }
//     ]
//   },
//   { 
//     name: 'Game Development',
//     totalGroups: 3,
//     students: 86,
//     color: '#82ca9d',
//     groups: [
//       { name: 'Group A', students: 28 },
//       { name: 'Group B', students: 30 },
//       { name: 'Group C', students: 28 }
//     ]
//   },
//   { 
//     name: 'Cybersecurity',
//     totalGroups: 2,
//     students: 60,
//     color: '#ffc658',
//     groups: [
//       { name: 'Group A', students: 30 },
//       { name: 'Group B', students: 30 }
//     ]
//   }
// ];

// // Prepare treemap data
// const treemapData = courseGroupData.map(course => ({
//   name: course.name,
//   size: course.students,
//   color: course.color,
//   children: course.groups.map(group => ({
//     name: `${group.name} (${group.students})`,
//     size: group.students,
//     color: course.color
//   }))
// }));

// const attendanceData = [
//   { name: 'Web Dev', attendance: 88 },
//   { name: 'AI/ML', attendance: 76 },
//   { name: 'UI/UX', attendance: 92 },
//   { name: 'Digital', attendance: 68 },
//   { name: 'Others', attendance: 79 }
// ];

// const groupAttendanceData = [
//   { name: 'Group A', attendance: 93 },
//   { name: 'Group B', attendance: 78 },
//   { name: 'Group C', attendance: 85 },
//   { name: 'Group D', attendance: 67 },
//   { name: 'Group E', attendance: 89 }
// ];

// export default function DashboardOverview() {
//   const { themeConfig, theme } = useTheme();
//   const colors = themeConfig[theme];
  
//   // For section stat cards animation on hover
//   const [hoveredCard, setHoveredCard] = useState(null);
  
//   // For selected course to view its groups
//   const [selectedCourse, setSelectedCourse] = useState(courseGroupData[0]);
//   const [selectedView, setSelectedView] = useState('overview'); // 'overview' or 'detail'

//   const StatCard = ({ title, value, icon, subtext, trend, onClick, id }) => (
//     <div 
//       className={`${colors.card} rounded-xl p-6 cursor-pointer transition-all duration-300 transform ${hoveredCard === id ? 'scale-105' : ''}`}
//       onMouseEnter={() => setHoveredCard(id)}
//       onMouseLeave={() => setHoveredCard(null)}
//       onClick={onClick}
//     >
//       <div className="flex items-center justify-between mb-4">
//         <div className={`rounded-full p-3 ${theme === 'dark' ? 'bg-[#1E2733]/50' : 'bg-gray-100'}`}>
//           {icon}
//         </div>
//         {trend && (
//           <div className="flex items-center gap-1">
//             <ArrowUpRight size={14} className="text-green-500" />
//             <span className="text-green-500 text-sm font-medium">{trend}%</span>
//           </div>
//         )}
//       </div>
//       <h3 className={`${colors.secondaryText} text-sm font-medium mb-1`}>{title}</h3>
//       <div className="flex items-end justify-between">
//         <h2 className={`${colors.text} text-2xl font-bold`}>{value}</h2>
//         {subtext && <p className={`${colors.secondaryText} text-xs`}>{subtext}</p>}
//       </div>
//     </div>
//   );

//   const ViewMoreButton = ({ text, onClick }) => (
//     <button 
//       onClick={onClick} 
//       className={`flex items-center gap-2 mt-4 ${colors.button.primary} py-2 px-4 rounded-lg text-sm font-medium`}
//     >
//       {text}
//       <ChevronRight size={16} />
//     </button>
//   );

//   const SectionHeader = ({ title, subtitle }) => (
//     <div className="mb-4">
//       <h2 className={`${colors.text} text-xl font-bold`}>{title}</h2>
//       {subtitle && <p className={`${colors.secondaryText} text-sm`}>{subtitle}</p>}
//     </div>
//   );

//   const SwitchButton = ({ active, label, onClick }) => (
//     <button
//       onClick={onClick}
//       className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//         active 
//           ? `${theme === 'dark' ? 'bg-[#1E2733]' : 'bg-gray-200'} ${colors.text}` 
//           : `${theme === 'dark' ? 'bg-transparent' : 'bg-transparent'} ${colors.secondaryText}`
//       }`}
//     >
//       {label}
//     </button>
//   );

//   const handleNavigateToStudentPage = () => {
//     console.log("Navigating to student details page");
//     // Implement your navigation logic here
//   };

//   const handleNavigateToCourseInfo = () => {
//     console.log("Navigating to course info page");
//     // Implement your navigation logic here
//   };

//   // Enhanced treemap data for visualization
//   const processedTreemapData = {
//     name: 'Courses',
//     children: treemapData
//   };

//   return (
//     <div className={`${colors.background} min-h-screen p-6`}>
//       <div className={`${colors.gradientBackground} rounded-2xl p-6 shadow-xl`}>
//         {/* Welcome Header with Gradient */}
//         <div className="mb-8">
//           <h1 className={`text-3xl font-bold ${colors.gradient.text}`}>Admin Dashboard</h1>
//           <p className={`${colors.secondaryText} mt-2`}>Welcome back! Here's what's happening with your institution today.</p>
//         </div>

//         {/* Section 1: Student Enrollment Stats */}
//         <div className="mb-10">
//           <SectionHeader 
//             title="Student Enrollment" 
//             subtitle="Overview of students enrolled across different sections"
//           />
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//             <StatCard 
//               id="total-students"
//               title="Total Students"
//               value={studentData.total}
//               icon={<Users size={24} className={colors.icon} />}
//               subtext="Across all sections"
//             />
            
//             {studentData.sections.map((section, index) => (
//               <StatCard
//                 key={index}
//                 id={`section-${index}`}
//                 title={section.name}
//                 value={section.students}
//                 icon={<Users size={24} style={{ color: section.color }} />}
//                 trend={index === 0 ? 8.2 : (index === 1 ? 12.5 : (index === 2 ? 5.3 : 3.8))}
//               />
//             ))}
//           </div>
          
//           <div className="flex justify-end">
//             <ViewMoreButton text="View Student Details" onClick={handleNavigateToStudentPage} />
//           </div>
//         </div>

//         {/* Section 2: Course Info with Pie Chart */}
//         <div className={`${theme === 'dark' ? 'bg-[#121A22]/40' : 'bg-white'} rounded-xl p-6 mb-10 border ${theme === 'dark' ? 'border-[#1E2733]' : 'border-gray-200'}`}>
//           <SectionHeader 
//             title="Course Distribution" 
//             subtitle="Distribution of students across different courses"
//           />
          
//           <div className="flex flex-col lg:flex-row items-center justify-between">
//             <div className="w-full lg:w-2/5">
//               <div className={`${colors.card} p-6 rounded-xl`}>
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className={`rounded-full p-2 ${theme === 'dark' ? 'bg-[#1E2733]/50' : 'bg-gray-100'}`}>
//                     <Book size={20} className={colors.icon} />
//                   </div>
//                   <div>
//                     <h3 className={`${colors.secondaryText} text-sm`}>Total Courses</h3>
//                     <h2 className={`${colors.text} text-2xl font-bold`}>{courseGroupData.length}</h2>
//                   </div>
//                 </div>
                
//                 <div className="space-y-4">
//                   {courseGroupData.map((course, index) => (
//                     <div 
//                       key={index} 
//                       className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
//                         selectedCourse && selectedCourse.name === course.name 
//                           ? theme === 'dark' ? 'bg-[#1E2733]/50' : 'bg-gray-100'
//                           : ''
//                       }`}
//                       onClick={() => setSelectedCourse(course)}
//                     >
//                       <div className="flex items-center gap-2">
//                         <div className="w-3 h-3 rounded-full" style={{ backgroundColor: course.color }}></div>
//                         <span className={`${colors.text} text-sm`}>{course.name}</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className={`${colors.secondaryText} text-sm font-medium`}>{course.students}</span>
//                         <span className={`${colors.secondaryText} text-xs`}>students</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
            
//             <div className="w-full lg:w-3/5 mt-6 lg:mt-0 flex justify-center">
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={courseGroupData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={100}
//                     paddingAngle={5}
//                     dataKey="students"
//                     label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                   >
//                     {courseGroupData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip 
//                     formatter={(value, name, props) => [`${value} students`, props.payload.name]}
//                     contentStyle={{ 
//                       backgroundColor: theme === 'dark' ? '#121A22' : '#fff',
//                       borderColor: theme === 'dark' ? '#1E2733' : '#ddd',
//                       color: theme === 'dark' ? '#fff' : '#333'
//                     }}
//                   />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
          
//           <div className="flex justify-end mt-4">
//             <ViewMoreButton text="View Course Details" onClick={handleNavigateToCourseInfo} />
//           </div>
//         </div>

//         {/* NEW SECTION: Course Group Distribution */}
//         <GroupDistribution 
//                 courseGroupData={courseGroupData}
//                 selectedCourse={selectedCourse}
//                 setSelectedCourse={setSelectedCourse}
//                 theme={theme}
//                 colors={colors}
//               />

//         {/* Charts Container for Attendance Data */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//           {/* Section 3: Average Attendance Course-wise */}
//           <div className={`${theme === 'dark' ? 'bg-[#121A22]/40' : 'bg-white'} rounded-xl p-6 border ${theme === 'dark' ? 'border-[#1E2733]' : 'border-gray-200'}`}>
//             <SectionHeader 
//               title="Course Attendance" 
//               subtitle="Average attendance percentage by course"
//             />
            
//             <div className="flex items-center gap-3 mb-4">
//               <div className={`rounded-full p-2 ${theme === 'dark' ? 'bg-[#1E2733]/50' : 'bg-gray-100'}`}>
//                 <CalendarCheck size={20} className={colors.icon} />
//               </div>
//               <div>
//                 <h3 className={`${colors.secondaryText} text-sm`}>Overall Average</h3>
//                 <h2 className={`${colors.text} text-2xl font-bold`}>81%</h2>
//               </div>
//             </div>
            
//             <ResponsiveContainer width="100%" height={250}>
//               <BarChart data={attendanceData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1E2733' : '#eee'} />
//                 <XAxis 
//                   dataKey="name" 
//                   tick={{ fill: theme === 'dark' ? '#5E6E82' : '#2E4053' }} 
//                 />
//                 <YAxis 
//                   domain={[0, 100]}
//                   tick={{ fill: theme === 'dark' ? '#5E6E82' : '#2E4053' }} 
//                 />
//                 <Tooltip 
//                   formatter={(value) => [`${value}%`, 'Attendance']}
//                   contentStyle={{ 
//                     backgroundColor: theme === 'dark' ? '#121A22' : '#fff',
//                     borderColor: theme === 'dark' ? '#1E2733' : '#ddd',
//                     color: theme === 'dark' ? '#fff' : '#333'
//                   }}
//                 />
//                 <Legend />
//                 <Bar 
//                   dataKey="attendance" 
//                   name="Attendance Rate" 
//                   fill={theme === 'dark' ? '#2E67FF' : '#2E4053'}
//                   radius={[4, 4, 0, 0]}
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Section 4: Average Attendance Group-wise */}
//           <div className={`${theme === 'dark' ? 'bg-[#121A22]/40' : 'bg-white'} rounded-xl p-6 border ${theme === 'dark' ? 'border-[#1E2733]' : 'border-gray-200'}`}>
//             <SectionHeader 
//               title="Group Attendance" 
//               subtitle="Average attendance percentage by student groups"
//             />
            
//             <div className="flex items-center gap-3 mb-4">
//               <div className={`rounded-full p-2 ${theme === 'dark' ? 'bg-[#1E2733]/50' : 'bg-gray-100'}`}>
//                 <BarChart2 size={20} className={colors.icon} />
//               </div>
//               <div>
//                 <h3 className={`${colors.secondaryText} text-sm`}>Group Performance</h3>
//                 <h2 className={`${colors.text} text-2xl font-bold`}>82%</h2>
//               </div>
//             </div>
            
//             <ResponsiveContainer width="100%" height={250}>
//               <BarChart data={groupAttendanceData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1E2733' : '#eee'} />
//                 <XAxis 
//                   dataKey="name" 
//                   tick={{ fill: theme === 'dark' ? '#5E6E82' : '#2E4053' }} 
//                 />
//                 <YAxis 
//                   domain={[0, 100]}
//                   tick={{ fill: theme === 'dark' ? '#5E6E82' : '#2E4053' }} 
//                 />
//                 <Tooltip 
//                   formatter={(value) => [`${value}%`, 'Attendance']}
//                   contentStyle={{ 
//                     backgroundColor: theme === 'dark' ? '#121A22' : '#fff',
//                     borderColor: theme === 'dark' ? '#1E2733' : '#ddd',
//                     color: theme === 'dark' ? '#fff' : '#333'
//                   }}
//                 />
//                 <Legend />
//                 <Bar 
//                   dataKey="attendance" 
//                   name="Attendance Rate" 
//                   fill={theme === 'dark' ? '#2F955A' : '#2E4053'}
//                   radius={[4, 4, 0, 0]}
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React from 'react';
import { useTheme } from '../../context/ThemeProvider';
import HeroSection from '../../components/admin/dashboard/HeroSection'
import StudentEnrollmentSection from '../admin/dashboard/StudentEnrollment';
import CourseDistributionSection from '../admin/dashboard/CourseDistributionSection';
import GroupDistribution from '../admin/GroupDistribution';
import AttendanceCharts from '../admin/dashboard/AttendanceCharts';

// Import the original data from a separate file
import { 
  studentData, 
  courseData,
  courseGroupData, 
  attendanceData, 
  groupAttendanceData
} from '../admin/dashboard/mockData';

export default function DashboardOverview() {
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];
  
  return (
    <div className={`${colors.background} min-h-screen p-6`}>
      <div className={`${colors.gradientBackground} rounded-2xl p-6 shadow-xl`}>
        {/* Enhanced Hero Section */}
        <HeroSection />
        
        {/* Student Enrollment Stats Section */}
        <StudentEnrollmentSection studentData={studentData} />
        
        {/* Course Distribution Section */}
        <CourseDistributionSection courseGroupData={courseGroupData} />
        
        {/* Group Distribution Section */}
        <GroupDistribution 
          courseGroupData={courseGroupData}
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