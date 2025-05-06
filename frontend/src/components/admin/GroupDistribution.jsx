// import React, { useState, useEffect, useMemo } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
// import { Layers, Grid, Search, ChevronDown, Filter, List, BarChart2 } from 'lucide-react';
// import CourseView from './dashboard/CourseView';
// import GroupView from './dashboard/GroupView';
// import { useSelector, useDispatch } from 'react-redux';


// const GroupDistribution = ({ courseGroupData, allGroups: propAllGroups, theme, colors }) => {
//   const [viewMode, setViewMode] = useState('courses');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredGroups, setFilteredGroups] = useState([]);
//   const [groupsPerPage, setGroupsPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortOrder, setSortOrder] = useState('size-desc');
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [selectedCourse, setSelectedCourse] = useState(null);
  
//   // Use the allGroups prop if provided, otherwise compute it from courseGroupData
//   const allGroups = useMemo(() => {
//     if (propAllGroups && propAllGroups.length > 0) {
//       return propAllGroups;
//     }
    
//     // If no propAllGroups provided, calculate from courseGroupData
//     return courseGroupData.reduce((acc, course) => {
//       const courseGroups = course.groups.map(group => ({
//         ...group,
//         courseName: course.name,
//         courseColor: course.color
//       }));
//       return [...acc, ...courseGroups];
//     }, []);
//   }, [courseGroupData, propAllGroups]);
//   console.log(courseGroupData)
  
//   // Filter and sort groups based on search query and sort order
//   useEffect(() => {
//     // Skip effect if allGroups is empty
//     if (allGroups.length === 0) return;
    
//     let filtered = [...allGroups]; // Create a copy to avoid mutation
    
//     // Filter by selected course if in 'groups' view
//     if (viewMode === 'groups' && selectedCourse) {
//       filtered = filtered.filter(group => group.courseName === selectedCourse.name);
//     }
    
//     // Apply search filter
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter(group => 
//         group.name.toLowerCase().includes(query) || 
//         group.courseName.toLowerCase().includes(query)
//       );
//     }
    
//     // Apply sorting
//     filtered.sort((a, b) => {
//       if (sortOrder === 'name-asc') return a.name.localeCompare(b.name);
//       if (sortOrder === 'name-desc') return b.name.localeCompare(a.name);
//       if (sortOrder === 'size-asc') return a.students - b.students;
//       if (sortOrder === 'size-desc') return b.students - a.students;
//       return 0;
//     });
    
//     setFilteredGroups(filtered);
//     setCurrentPage(1); // Reset to first page when filters change
//   }, [searchQuery, sortOrder, selectedCourse, viewMode, allGroups]);
  
//   const handleSortChange = (newSortOrder) => {
//     setSortOrder(newSortOrder);
//     setDropdownOpen(false);
//   };
  
//   const handleCourseSelect = (course) => {
//     setSelectedCourse(course);
//     setViewMode('groups');
//   };
  
//   const handleBackToCourses = () => {
//     setViewMode('courses');
//     setSelectedCourse(null);
//     setSearchQuery('');
//   };

//   return (
//     <div className={`${theme === 'dark' ? 'bg-transparent' : 'bg-white'} rounded-xl p-6 mb-10 border border-opacity-30 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'} shadow-sm`}>
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
//         <div>
//           <h2 className={`${colors.text} text-xl font-bold`}>Group Distribution</h2>
//           <p className={`${colors.secondaryText} text-sm`}>
//             {viewMode === 'courses' 
//               ? 'Overview of all courses and their groups' 
//               : `Viewing groups in ${selectedCourse?.name}`}
//           </p>
//         </div>
        
//         <div className="flex flex-wrap gap-3 mt-4 lg:mt-0 w-full lg:w-auto">
//           {viewMode === 'groups' && (
//             <button 
//               onClick={handleBackToCourses}
//               className={`px-4 py-2 text-sm rounded-lg font-medium border transition-all ${
//                 theme === 'dark' 
//                   ? 'border-gray-700 hover:bg-gray-800 bg-transparent' 
//                   : 'border-gray-200 hover:bg-gray-50 bg-white'
//               } ${colors.text}`}
//             >
//               ← Back to Courses
//             </button>
//           )}
          
//           <div className="relative flex items-center flex-grow">
//             <Search size={16} className={`absolute left-3 ${colors.secondaryText}`} />
//             <input
//               type="text"
//               placeholder={viewMode === 'courses' ? "Search courses..." : "Search groups..."}
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className={`pl-10 pr-4 py-2 w-full rounded-lg text-sm border transition-all ${
//                 theme === 'dark' 
//                   ? 'bg-transparent border-gray-700 text-white placeholder-gray-500 focus:border-blue-500' 
//                   : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-400'
//               } outline-none focus:ring-1 focus:ring-blue-400`}
//             />
//           </div>
          
//           <div className="relative inline-block text-left">
//             <button
//               className={`inline-flex justify-between items-center px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
//                 theme === 'dark' 
//                   ? 'border-gray-700 hover:bg-gray-800 bg-transparent' 
//                   : 'border-gray-200 hover:bg-gray-50 bg-white'
//               } ${colors.text}`}
//               onClick={() => setDropdownOpen(!dropdownOpen)}
//             >
//               <Filter size={16} className="mr-2" />
//               Sort by
//               <ChevronDown size={16} className="ml-2" />
//             </button>
            
//             {dropdownOpen && (
//               <div 
//                 className={`absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md shadow-lg ${
//                   theme === 'dark' ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-100'
//                 }`}
//               >
//                 <div className="py-1">
//                   <button
//                     onClick={() => handleSortChange('name-asc')}
//                     className={`block px-4 py-2 text-sm w-full text-left hover:opacity-80 ${
//                       sortOrder === 'name-asc' 
//                         ? theme === 'dark' ? 'bg-blue-600/20 text-blue-300' : 'bg-blue-50 text-blue-700'
//                         : colors.text
//                     }`}
//                   >
//                     Name (A-Z)
//                   </button>
//                   <button
//                     onClick={() => handleSortChange('name-desc')}
//                     className={`block px-4 py-2 text-sm w-full text-left hover:opacity-80 ${
//                       sortOrder === 'name-desc' 
//                         ? theme === 'dark' ? 'bg-blue-600/20 text-blue-300' : 'bg-blue-50 text-blue-700'
//                         : colors.text
//                     }`}
//                   >
//                     Name (Z-A)
//                   </button>
//                   <button
//                     onClick={() => handleSortChange('size-desc')}
//                     className={`block px-4 py-2 text-sm w-full text-left hover:opacity-80 ${
//                       sortOrder === 'size-desc' 
//                         ? theme === 'dark' ? 'bg-blue-600/20 text-blue-300' : 'bg-blue-50 text-blue-700'
//                         : colors.text
//                     }`}
//                   >
//                     Size (Largest first)
//                   </button>
//                   <button
//                     onClick={() => handleSortChange('size-asc')}
//                     className={`block px-4 py-2 text-sm w-full text-left hover:opacity-80 ${
//                       sortOrder === 'size-asc' 
//                         ? theme === 'dark' ? 'bg-blue-600/20 text-blue-300' : 'bg-blue-50 text-blue-700'
//                         : colors.text
//                     }`}
//                   >
//                     Size (Smallest first)
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
          
//           <div className="flex items-center border rounded-lg overflow-hidden">
//             <button
//               onClick={() => setViewMode('courses')}
//               className={`p-2 ${
//                 viewMode === 'courses'
//                   ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
//                   : theme === 'dark' ? 'bg-transparent text-gray-400' : 'bg-white text-gray-500'
//               }`}
//             >
//               <BarChart2 size={16} />
//             </button>
//             <button
//               onClick={() => {
//                 if (selectedCourse) {
//                   setViewMode('groups');
//                 } else if (courseGroupData.length > 0) {
//                   setSelectedCourse(courseGroupData[0]);
//                   setViewMode('groups');
//                 }
//               }}
//               className={`p-2 ${
//                 viewMode === 'groups'
//                   ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
//                   : theme === 'dark' ? 'bg-transparent text-gray-400' : 'bg-white text-gray-500'
//               }`}
//             >
//               <List size={16} />
//             </button>
//           </div>
//         </div>
//       </div>
      
//       {/* Render appropriate view based on viewMode */}
//       {viewMode === 'courses' ? (
//         <CourseView 
//           courseGroupData={courseGroupData}
//           searchQuery={searchQuery}
//           handleCourseSelect={handleCourseSelect}
//           theme={theme}
//           colors={colors}
//         />
//       ) : (
//         <GroupView 
//           selectedCourse={selectedCourse}
//           filteredGroups={filteredGroups}
//           paginatedGroups={filteredGroups.slice(
//             (currentPage - 1) * groupsPerPage,
//             currentPage * groupsPerPage
//           )}
//           currentPage={currentPage}
//           setCurrentPage={setCurrentPage}
//           totalPages={Math.ceil(filteredGroups.length / groupsPerPage)}
//           groupsPerPage={groupsPerPage}
//           setGroupsPerPage={setGroupsPerPage}
//           theme={theme}
//           colors={colors}
//         />
//       )}
//     </div>
//   );
// };

// export default GroupDistribution;
// import React, { useState } from 'react';
// import { 
//   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
//   PieChart, Pie, Cell, Legend
// } from 'recharts';

// export default function GroupDistribution({ departmentData, theme, colors }) {
//   const [activeTabIndex, setActiveTabIndex] = useState(0);
//   const [viewType, setViewType] = useState('departments'); // 'departments' or 'groups'
  
//   // Handle empty data case
//   if (!departmentData || departmentData.length === 0) {
//     return (
//       <div className={`mt-8 p-6 ${colors.cardBackground} rounded-xl shadow-lg`}>
//         <h2 className={`text-xl font-semibold ${colors.headingText}`}>
//           Group Distribution
//         </h2>
//         <div className="mt-4 text-center py-8">
//           <p className={`${colors.text}`}>No department or group data available</p>
//         </div>
//       </div>
//     );
//   }

//   // Prepare data for the charts
//   const departmentChartData = departmentData.map(dept => ({
//     name: dept.departmentCode || dept.departmentName.substring(0, 10),
//     groups: dept.totalGroups,
//     courses: dept.totalCourses,
//     students: dept.totalStudents,
//     color: dept.color
//   }));

//   // Prepare data for the groups view
//   const allGroups = departmentData.flatMap(dept => dept.groups);
//   const groupsChartData = allGroups.map(group => ({
//     name: group.name,
//     departmentName: group.departmentName,
//     students: group.students,
//     color: group.departmentColor
//   }));

//   // Tab headers for the chart views
//   const tabHeaders = [
//     { title: "Departments Overview", key: "departments" },
//     { title: "Groups Overview", key: "groups" }
//   ];

//   // Custom tooltip for the bar chart
//   const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       const data = payload[0].payload;
//       return (
//         <div className={`p-2 ${colors.tooltipBackground} rounded shadow-md`}>
//           <p className={`font-semibold ${colors.tooltipText}`}>
//             {viewType === 'departments' ? data.name : data.name}
//           </p>
//           {viewType === 'departments' ? (
//             <div>
//               <p className={colors.tooltipText}>Courses: {data.courses}</p>
//               <p className={colors.tooltipText}>Groups: {data.groups}</p>
//               <p className={colors.tooltipText}>Students: {data.students}</p>
//             </div>
//           ) : (
//             <div>
//               <p className={colors.tooltipText}>Department: {data.departmentName}</p>
//               <p className={colors.tooltipText}>Students: {data.students}</p>
//             </div>
//           )}
//         </div>
//       );
//     }
//     return null;
//   };

//   // Handle tab change
//   const handleTabChange = (index) => {
//     setActiveTabIndex(index);
//     setViewType(tabHeaders[index].key);
//   };

//   // Get the right data for the current view
//   const currentChartData = viewType === 'departments' ? departmentChartData : groupsChartData;
  
//   // Calculate total students for pie chart
//   const totalStudents = departmentData.reduce((acc, dept) => acc + dept.totalStudents, 0);
  
//   return (
//     <div className={`mt-8 p-6 ${colors.cardBackground} rounded-xl shadow-lg`}>
//       <h2 className={`text-xl font-semibold ${colors.headingText}`}>
//         Group Distribution
//       </h2>
      
//       {/* Tabs for switching between views */}
//       <div className="flex border-b mt-4">
//         {tabHeaders.map((tab, index) => (
//           <button
//             key={tab.key}
//             className={`py-2 px-4 font-medium text-sm focus:outline-none ${
//               activeTabIndex === index
//                 ? `${colors.activeTab} border-b-2 ${colors.activeBorder}`
//                 : colors.inactiveTab
//             }`}
//             onClick={() => handleTabChange(index)}
//           >
//             {tab.title}
//           </button>
//         ))}
//       </div>
      
//       <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Bar Chart */}
//         <div className={`${colors.chartBackground} p-4 rounded-lg shadow`}>
//           <h3 className={`text-lg font-medium mb-3 ${colors.subheadingText}`}>
//             {viewType === 'departments' ? 'Departments by Groups' : 'Groups by Students'}
//           </h3>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 data={currentChartData}
//                 margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
//               >
//                 <XAxis 
//                   dataKey="name" 
//                   tick={{ fill: theme === 'dark' ? '#e0e0e0' : '#333' }} 
//                   angle={-45}
//                   textAnchor="end"
//                   height={50}
//                 />
//                 <YAxis 
//                   tick={{ fill: theme === 'dark' ? '#e0e0e0' : '#333' }} 
//                 />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar 
//                   dataKey={viewType === 'departments' ? 'groups' : 'students'} 
//                   name={viewType === 'departments' ? 'Groups' : 'Students'}
//                 >
//                   {currentChartData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
        
//         {/* Pie Chart */}
//         <div className={`${colors.chartBackground} p-4 rounded-lg shadow`}>
//           <h3 className={`text-lg font-medium mb-3 ${colors.subheadingText}`}>
//             {viewType === 'departments' ? 'Students by Department' : 'Students by Group'}
//           </h3>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={currentChartData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey={viewType === 'departments' ? 'students' : 'students'}
//                   nameKey="name"
//                   label={({ name, students, percent }) => 
//                     `${name}: ${students} (${(percent * 100).toFixed(0)}%)`
//                   }
//                 >
//                   {currentChartData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip formatter={(value) => `${value} students`} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
      
//       {/* Stats Summary */}
//       <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <div className={`${colors.statBackground} p-4 rounded-lg shadow text-center`}>
//           <p className={`text-lg font-medium ${colors.statHeading}`}>Departments</p>
//           <p className={`text-2xl font-bold ${colors.statValue}`}>{departmentData.length}</p>
//         </div>
//         <div className={`${colors.statBackground} p-4 rounded-lg shadow text-center`}>
//           <p className={`text-lg font-medium ${colors.statHeading}`}>Total Groups</p>
//           <p className={`text-2xl font-bold ${colors.statValue}`}>{allGroups.length}</p>
//         </div>
//         <div className={`${colors.statBackground} p-4 rounded-lg shadow text-center`}>
//           <p className={`text-lg font-medium ${colors.statHeading}`}>Total Courses</p>
//           <p className={`text-2xl font-bold ${colors.statValue}`}>
//             {departmentData.reduce((acc, dept) => acc + dept.totalCourses, 0)}
//           </p>
//         </div>
//         <div className={`${colors.statBackground} p-4 rounded-lg shadow text-center`}>
//           <p className={`text-lg font-medium ${colors.statHeading}`}>Total Students</p>
//           <p className={`text-2xl font-bold ${colors.statValue}`}>{totalStudents}</p>
//         </div>
//       </div>
      
//       {/* Department Details */}
//       {viewType === 'departments' && (
//         <div className="mt-6">
//           <h3 className={`text-lg font-medium mb-3 ${colors.subheadingText}`}>
//             Department Details
//           </h3>
//           <div className="overflow-x-auto">
//             <table className={`min-w-full ${colors.tableBackground} rounded-lg overflow-hidden`}>
//               <thead className={colors.tableHeaderBackground}>
//                 <tr>
//                   <th className={`px-4 py-3 text-left ${colors.tableHeaderText}`}>Department</th>
//                   <th className={`px-4 py-3 text-left ${colors.tableHeaderText}`}>Code</th>
//                   <th className={`px-4 py-3 text-center ${colors.tableHeaderText}`}>Courses</th>
//                   <th className={`px-4 py-3 text-center ${colors.tableHeaderText}`}>Groups</th>
//                   <th className={`px-4 py-3 text-center ${colors.tableHeaderText}`}>Students</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                 {departmentData.map((dept, index) => (
//                   <tr key={dept.departmentId || index} className={index % 2 === 0 ? colors.tableRowEven : colors.tableRowOdd}>
//                     <td className={`px-4 py-3 ${colors.tableText}`}>{dept.departmentName}</td>
//                     <td className={`px-4 py-3 ${colors.tableText}`}>{dept.departmentCode}</td>
//                     <td className={`px-4 py-3 text-center ${colors.tableText}`}>{dept.totalCourses}</td>
//                     <td className={`px-4 py-3 text-center ${colors.tableText}`}>{dept.totalGroups}</td>
//                     <td className={`px-4 py-3 text-center ${colors.tableText}`}>{dept.totalStudents}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
      
//       {/* Groups Details */}
//       {viewType === 'groups' && allGroups.length > 0 && (
//         <div className="mt-6">
//           <h3 className={`text-lg font-medium mb-3 ${colors.subheadingText}`}>
//             Groups Details
//           </h3>
//           <div className="overflow-x-auto">
//             <table className={`min-w-full ${colors.tableBackground} rounded-lg overflow-hidden`}>
//               <thead className={colors.tableHeaderBackground}>
//                 <tr>
//                   <th className={`px-4 py-3 text-left ${colors.tableHeaderText}`}>Group Name</th>
//                   <th className={`px-4 py-3 text-left ${colors.tableHeaderText}`}>Department</th>
//                   <th className={`px-4 py-3 text-center ${colors.tableHeaderText}`}>Students</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                 {allGroups.map((group, index) => (
//                   <tr key={index} className={index % 2 === 0 ? colors.tableRowEven : colors.tableRowOdd}>
//                     <td className={`px-4 py-3 ${colors.tableText}`}>{group.name}</td>
//                     <td className={`px-4 py-3 ${colors.tableText}`}>{group.departmentName}</td>
//                     <td className={`px-4 py-3 text-center ${colors.tableText}`}>{group.students}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, Area, AreaChart, CartesianGrid,
  LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { ChevronDown, ChevronUp, BarChart3, PieChart as PieChartIcon, Activity, Users, BookOpen, Grid, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeProvider'; // Import the theme context

export default function GroupDistribution({ departmentData }) {
  // Access theme context
  const { theme, themeConfig, isDark } = useTheme();
  
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [viewType, setViewType] = useState('departments'); // 'departments' or 'groups'
  const [selectedChart, setSelectedChart] = useState('bar'); // 'bar', 'pie', 'radar', 'area'
  const [expandedDept, setExpandedDept] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [hoveredStat, setHoveredStat] = useState(null);
  
  const currentTheme = themeConfig[theme];
  
  // This useEffect needs to be here, not conditionally placed
  useEffect(() => {
    setAnimateIn(true);
  }, [viewType, selectedChart]);
  
  // Handle empty data case
  if (!departmentData || departmentData.length === 0) {
    return (
      <div className={`mt-8 rounded-xl overflow-hidden shadow-lg ${currentTheme.gradientBackground}`}>
        <div className="p-6">
          <h2 className={`text-xl font-semibold ${currentTheme.text}`}>
            Group Distribution
          </h2>
          <div className="mt-4 text-center py-8">
            <p className={currentTheme.secondaryText}>No department or group data available</p>
          </div>
        </div>
      </div>
    );
  }

  // Prepare data for the charts
  const departmentChartData = departmentData.map(dept => ({
    name: dept.departmentCode || dept.departmentName.substring(0, 10),
    fullName: dept.departmentName,
    groups: dept.totalGroups,
    courses: dept.totalCourses,
    students: dept.totalStudents,
    color: dept.color
  }));

  // Prepare data for the groups view
  const allGroups = departmentData.flatMap(dept => dept.groups);
  const groupsChartData = allGroups.map(group => ({
    name: group.name,
    fullName: group.name,
    departmentName: group.departmentName,
    students: group.students,
    color: group.departmentColor
  }));

  // Tab headers for the chart views
  const tabHeaders = [
    { title: "Departments Overview", key: "departments", icon: <Grid size={16} /> },
    { title: "Groups Overview", key: "groups", icon: <Users size={16} /> }
  ];
  
  // Chart types
  const chartTypes = [
    { type: 'bar', icon: <BarChart3 size={18} /> },
    { type: 'pie', icon: <PieChartIcon size={18} /> },
    { type: 'radar', icon: <Activity size={18} /> },
    { type: 'area', icon: <ArrowUpRight size={18} /> }
  ];

  // Custom tooltip for the charts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`${isDark ? 'bg-[#121A22]' : 'bg-white'} p-3 rounded-lg shadow-xl border ${isDark ? 'border-[#1E2733]' : 'border-gray-200'}`}>
          <p className={`font-semibold ${currentTheme.text} mb-1`}>
            {data.fullName || data.name}
          </p>
          {viewType === 'departments' ? (
            <div>
              <p className={`${currentTheme.secondaryText} flex items-center`}>
                <BookOpen size={14} className="mr-1" /> Courses: <span className="ml-auto font-medium">{data.courses}</span>
              </p>
              <p className={`${currentTheme.secondaryText} flex items-center`}>
                <Grid size={14} className="mr-1" /> Groups: <span className="ml-auto font-medium">{data.groups}</span>
              </p>
              <p className={`${currentTheme.secondaryText} flex items-center`}>
                <Users size={14} className="mr-1" /> Students: <span className="ml-auto font-medium">{data.students}</span>
              </p>
            </div>
          ) : (
            <div>
              <p className={`${currentTheme.secondaryText} flex items-center`}>
                <Grid size={14} className="mr-1" /> Department: <span className="ml-auto font-medium">{data.departmentName}</span>
              </p>
              <p className={`${currentTheme.secondaryText} flex items-center`}>
                <Users size={14} className="mr-1" /> Students: <span className="ml-auto font-medium">{data.students}</span>
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Handle tab change
  const handleTabChange = (index) => {
    setAnimateIn(false);
    setTimeout(() => {
      setActiveTabIndex(index);
      setViewType(tabHeaders[index].key);
      setAnimateIn(true);
    }, 300);
  };

  // Get the right data for the current view
  const currentChartData = viewType === 'departments' ? departmentChartData : groupsChartData;
  
  // Calculate total students for pie chart
  const totalStudents = departmentData.reduce((acc, dept) => acc + dept.totalStudents, 0);
  
  const renderChart = () => {
    const gridStroke = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const tickColor = isDark ? '#5E6E82' : '#6B7280';
    
    switch(selectedChart) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={currentChartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
              className={`transition-opacity duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: tickColor }} 
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fill: tickColor }} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey={viewType === 'departments' ? 'groups' : 'students'} 
                name={viewType === 'departments' ? 'Groups' : 'Students'}
                animationDuration={1500}
              >
                {currentChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart className={`transition-opacity duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
              <Pie
                data={currentChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey={viewType === 'departments' ? 'students' : 'students'}
                nameKey="name"
                label={({ name, students, percent }) => 
                  `${name}: ${students} (${(percent * 100).toFixed(0)}%)`
                }
                animationDuration={1500}
              >
                {currentChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} students`} content={<CustomTooltip />} />
              <Legend formatter={(value) => <span className={currentTheme.text}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'radar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart 
              cx="50%" 
              cy="50%" 
              outerRadius={90} 
              data={currentChartData.slice(0, 8)} // Limit to 8 items for radar clarity
              className={`transition-opacity duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}
            >
              <PolarGrid stroke={gridStroke} />
              <PolarAngleAxis 
                dataKey="name"
                tick={{ fill: tickColor }}
              />
              <PolarRadiusAxis stroke={gridStroke} />
              <Radar 
                name={viewType === 'departments' ? 'Students per Department' : 'Students per Group'} 
                dataKey="students" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.6}
                animationDuration={1500}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={currentChartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
              className={`transition-opacity duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: tickColor }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fill: tickColor }} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey={viewType === 'departments' ? 'students' : 'students'} 
                stroke="#8884d8" 
                fill="url(#colorGradient)"
                animationDuration={1500}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isDark ? "#506EE5" : "#3B82F6"} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={isDark ? "#506EE5" : "#3B82F6"} stopOpacity={0.2}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };
  
  const toggleDepartment = (deptId) => {
    if (expandedDept === deptId) {
      setExpandedDept(null);
    } else {
      setExpandedDept(deptId);
    }
  };
  
  return (
    <div className="mt-8 rounded-xl overflow-hidden shadow-lg">
      {/* Gradient Header */}
      <div className={currentTheme.gradientBackground}>
        <div className="p-6 border-b border-opacity-20 border-white">
          <h2 className={`text-2xl font-bold ${currentTheme.text} flex items-center`}>
            Group Distribution
            <span className={`ml-2 text-xs ${isDark ? 'bg-[#1E2733]' : 'bg-[#E5E7EB]'} rounded-full px-2 py-1 ${currentTheme.secondaryText}`}>
              {departmentData.length} Departments
            </span>
          </h2>
          <p className={currentTheme.secondaryText + " mt-1"}>
            Analyze distribution across departments and groups
          </p>
        </div>
      </div>
      
      <div className={currentTheme.background}>
        {/* Tabs & Chart Type Selection */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between border-b ${isDark ? 'border-[#1E2733]' : 'border-[#E5E7EB]'} px-6`}>
          <div className="flex overflow-x-auto">
            {tabHeaders.map((tab, index) => (
              <button
                key={tab.key}
                className={`py-4 px-6 font-medium text-sm flex items-center whitespace-nowrap focus:outline-none transition-all ${
                  activeTabIndex === index
                    ? `border-b-2 ${isDark ? 'border-[#506EE5]' : 'border-[#3B82F6]'} ${isDark ? 'text-[#506EE5]' : 'text-[#3B82F6]'}`
                    : currentTheme.secondaryText + ' hover:opacity-80'
                }`}
                onClick={() => handleTabChange(index)}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.title}
              </button>
            ))}
          </div>
          
          <div className={`flex items-center space-x-1 p-2 ${isDark ? 'bg-[#121A22]' : 'bg-[#F3F4F6]'} rounded-lg my-3 md:my-0`}>
            {chartTypes.map(chart => (
              <button 
                key={chart.type}
                onClick={() => {
                  setAnimateIn(false);
                  setTimeout(() => {
                    setSelectedChart(chart.type);
                    setAnimateIn(true);
                  }, 300);
                }}
                className={`p-2 rounded-md transition-all ${
                  selectedChart === chart.type 
                  ? isDark 
                    ? 'bg-[#1E2733] text-[#506EE5]' 
                    : 'bg-white text-[#3B82F6]' 
                  : currentTheme.secondaryText + ' hover:opacity-80'
                }`}
                title={`Switch to ${chart.type} chart`}
              >
                {chart.icon}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Chart */}
            <div className={`${currentTheme.card} rounded-xl p-5 h-80`}>
              <h3 className={`text-lg font-medium mb-3 ${currentTheme.text}`}>
                {viewType === 'departments' ? 'Department Distribution' : 'Group Distribution'}
              </h3>
              <div className="h-64">
                {renderChart()}
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div 
                className={`${currentTheme.card} rounded-xl p-5 transition-transform ${hoveredStat === 'departments' ? 'scale-105' : ''}`}
                onMouseEnter={() => setHoveredStat('departments')}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className={currentTheme.secondaryText + " text-sm"}>Departments</p>
                    <h4 className={`text-3xl font-bold mt-1 ${currentTheme.text}`}>{departmentData.length}</h4>
                  </div>
                  <div className={`${isDark ? 'bg-[#1E2733]' : 'bg-[#E5E7EB]'} p-2 rounded-lg`}>
                    <Grid size={24} className={currentTheme.icon} />
                  </div>
                </div>
                <div className={`mt-4 text-xs ${currentTheme.secondaryText}`}>
                  {Math.round(departmentData.reduce((acc, dept) => acc + dept.totalCourses, 0) / departmentData.length)} courses per department avg.
                </div>
              </div>
              
              <div 
                className={`${currentTheme.card} rounded-xl p-5 transition-transform ${hoveredStat === 'groups' ? 'scale-105' : ''}`}
                onMouseEnter={() => setHoveredStat('groups')}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className={currentTheme.secondaryText + " text-sm"}>Groups</p>
                    <h4 className={`text-3xl font-bold mt-1 ${currentTheme.text}`}>{allGroups.length}</h4>
                  </div>
                  <div className={`${isDark ? 'bg-[#1E2733]' : 'bg-[#E5E7EB]'} p-2 rounded-lg`}>
                    <Users size={24} className={currentTheme.icon} />
                  </div>
                </div>
                <div className={`mt-4 text-xs ${currentTheme.secondaryText}`}>
                  {Math.round(allGroups.length / departmentData.length)} groups per department avg.
                </div>
              </div>
              
              <div 
                className={`${currentTheme.card} rounded-xl p-5 transition-transform ${hoveredStat === 'courses' ? 'scale-105' : ''}`}
                onMouseEnter={() => setHoveredStat('courses')}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className={currentTheme.secondaryText + " text-sm"}>Courses</p>
                    <h4 className={`text-3xl font-bold mt-1 ${currentTheme.text}`}>
                      {departmentData.reduce((acc, dept) => acc + dept.totalCourses, 0)}
                    </h4>
                  </div>
                  <div className={`${isDark ? 'bg-[#1E2733]' : 'bg-[#E5E7EB]'} p-2 rounded-lg`}>
                    <BookOpen size={24} className={currentTheme.icon} />
                  </div>
                </div>
                <div className={`mt-4 text-xs ${currentTheme.secondaryText}`}>
                  {(departmentData.reduce((acc, dept) => acc + dept.totalCourses, 0) / allGroups.length).toFixed(1)} courses per group avg.
                </div>
              </div>
              
              <div 
                className={`${currentTheme.card} rounded-xl p-5 transition-transform ${hoveredStat === 'students' ? 'scale-105' : ''}`}
                onMouseEnter={() => setHoveredStat('students')}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className={currentTheme.secondaryText + " text-sm"}>Students</p>
                    <h4 className={`text-3xl font-bold mt-1 ${currentTheme.text}`}>{totalStudents}</h4>
                  </div>
                  <div className={`${isDark ? 'bg-[#1E2733]' : 'bg-[#E5E7EB]'} p-2 rounded-lg`}>
                    <Users size={24} className={currentTheme.icon} />
                  </div>
                </div>
                <div className={`mt-4 text-xs ${currentTheme.secondaryText}`}>
                  {(totalStudents / allGroups.length).toFixed(1)} students per group avg.
                </div>
              </div>
            </div>
          </div>
          
          {/* Department or Group Details */}
          <div className="mt-8">
            <h3 className={`text-lg font-medium mb-4 ${currentTheme.text}`}>
              {viewType === 'departments' ? 'Department Details' : 'Group Details'}
            </h3>
            
            <div className={`${currentTheme.card} rounded-xl overflow-hidden`}>
              {viewType === 'departments' ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className={isDark ? 'bg-[#121A22]' : 'bg-[#F9FAFB]'}>
                      <tr>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${currentTheme.secondaryText} uppercase tracking-wider`}>Department</th>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${currentTheme.secondaryText} uppercase tracking-wider`}>Code</th>
                        <th className={`px-6 py-3 text-center text-xs font-medium ${currentTheme.secondaryText} uppercase tracking-wider`}>Courses</th>
                        <th className={`px-6 py-3 text-center text-xs font-medium ${currentTheme.secondaryText} uppercase tracking-wider`}>Groups</th>
                        <th className={`px-6 py-3 text-center text-xs font-medium ${currentTheme.secondaryText} uppercase tracking-wider`}>Students</th>
                        <th className={`px-6 py-3 text-right text-xs font-medium ${currentTheme.secondaryText} uppercase tracking-wider`}>Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {departmentData.map((dept, index) => (
                        <React.Fragment key={dept.departmentId || index}>
                          <tr className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                            expandedDept === dept.departmentId 
                            ? isDark 
                              ? 'bg-[#1E2733] bg-opacity-30' 
                              : 'bg-[#EFF6FF] bg-opacity-50' 
                            : ''
                          }`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: dept.color }}></div>
                                <div className={`font-medium ${currentTheme.text}`}>{dept.departmentName}</div>
                              </div>
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap ${currentTheme.secondaryText}`}>{dept.departmentCode}</td>
                            <td className={`px-6 py-4 whitespace-nowrap text-center ${currentTheme.secondaryText}`}>{dept.totalCourses}</td>
                            <td className={`px-6 py-4 whitespace-nowrap text-center ${currentTheme.secondaryText}`}>{dept.totalGroups}</td>
                            <td className={`px-6 py-4 whitespace-nowrap text-center font-medium ${currentTheme.text}`}>{dept.totalStudents}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <button 
                                onClick={() => toggleDepartment(dept.departmentId)}
                                className={`${isDark ? 'text-[#506EE5]' : 'text-[#3B82F6]'} hover:opacity-80 font-medium`}
                              >
                                {expandedDept === dept.departmentId ? (
                                  <ChevronUp size={18} />
                                ) : (
                                  <ChevronDown size={18} />
                                )}
                              </button>
                            </td>
                          </tr>
                          {expandedDept === dept.departmentId && (
                            <tr className={isDark ? 'bg-[#121A22]' : 'bg-[#F9FAFB]'}>
                              <td colSpan="6" className="px-6 py-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {/* Groups in this department */}
                                  <div>
                                    <h4 className={`text-sm font-semibold ${currentTheme.secondaryText} mb-2`}>Groups</h4>
                                    <div className="space-y-2">
                                      {dept.groups.map((group, idx) => (
                                        <div key={idx} className={`${currentTheme.card} p-2 rounded-md flex items-center justify-between`}>
                                          <span className={currentTheme.text}>{group.name}</span>
                                          <span className={currentTheme.secondaryText + " text-sm"}>{group.students} students</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  {/* Courses in this department */}
                                  <div>
                                    <h4 className={`text-sm font-semibold ${currentTheme.secondaryText} mb-2`}>Courses</h4>
                                    <div className="space-y-2">
                                      {dept.courses.map((course, idx) => (
                                        <div key={idx} className={`${currentTheme.card} p-2 rounded-md flex items-center justify-between`}>
                                          <span className={currentTheme.text}>{course.name}</span>
                                          <span className={currentTheme.secondaryText + " text-sm"}>{course.code}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className={isDark ? 'bg-[#121A22]' : 'bg-[#F9FAFB]'}>
                      <tr>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${currentTheme.secondaryText} uppercase tracking-wider`}>Group Name</th>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${currentTheme.secondaryText} uppercase tracking-wider`}>Department</th>
                        <th className={`px-6 py-3 text-center text-xs font-medium ${currentTheme.secondaryText} uppercase tracking-wider`}>Students</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {allGroups.map((group, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: group.departmentColor }}></div>
                              <div className={`font-medium ${currentTheme.text}`}>{group.name}</div>
                            </div>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap ${currentTheme.secondaryText}`}>{group.departmentName}</td>
                          <td className={`px-6 py-4 whitespace-nowrap text-center font-medium ${currentTheme.text}`}>{group.students}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}