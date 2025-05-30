// import React, { useMemo } from 'react';
// import { 
//   PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
//   BarChart, Bar, XAxis, YAxis, CartesianGrid
// } from 'recharts';
// import { Grid, BookOpen, Users } from 'lucide-react';
// import { useTheme } from '../../../context/ThemeProvider';

// const DepartmentStatistics = ({ departments, allGroups, courses, isLoading }) => {
//   const { themeConfig, theme } = useTheme();
//   const currentTheme = themeConfig[theme];
  
//   // Calculate total groups from allGroups object
//   const totalGroups = useMemo(() => {
//     return Object.values(allGroups || {}).reduce((total, departmentGroups) => {
//       return total + (departmentGroups ? departmentGroups.length : 0);
//     }, 0);
//   }, [allGroups]);
  
//   // Calculate total courses from courses array
//   const totalCourses = useMemo(() => {
//     return courses ? courses.length : 0;
//   }, [courses]);
  
//   // Prepare department size data for chart
//   const departmentSizeData = useMemo(() => {
//     // Create a mapping of department courses
//     const departmentCourseCounts = {};
    
//     // Count courses per department
//     if (courses && courses.length > 0) {
//       courses.forEach(course => {
//         if (course.department) {
//           const deptId = typeof course.department === 'string' ? course.department : course.department._id;
//           const deptName = departments.find(d => d._id === deptId)?.name || 'Unknown';
          
//           if (!departmentCourseCounts[deptName]) {
//             departmentCourseCounts[deptName] = 0;
//           }
//           departmentCourseCounts[deptName]++;
//         }
//       });
//     }
    
//     // Convert to array format for chart
//     return Object.entries(departmentCourseCounts)
//       .map(([name, count]) => ({ name, courses: count }))
//       .sort((a, b) => b.courses - a.courses) // Sort by course count descending
//       .slice(0, 6); // Show top 6 for readability
//   }, [courses, departments]);
  
//   // Prepare department group distribution data for pie chart
//   const departmentGroupDistribution = useMemo(() => {
//     const groupCounts = {};
    
//     // Count groups per department
//     Object.entries(allGroups || {}).forEach(([departmentId, groups]) => {
//       if (groups && groups.length > 0) {
//         const department = departments.find(d => d._id === departmentId);
//         const deptName = department ? department.name : 'Unknown';
        
//         groupCounts[deptName] = groups.length;
//       }
//     });
    
//     // Convert to array format for pie chart
//     return Object.entries(groupCounts)
//       .map(([name, value]) => ({ name, value }))
//       .filter(item => item.value > 0)
//       .sort((a, b) => b.value - a.value); // Sort by number of groups descending
//   }, [allGroups, departments]);
  
//   // Set chart colors based on theme
//   const chartColors = theme === 'dark' 
//     ? ['#2E67FF', '#2F955A', '#F2683C', '#6B46C1', '#8B5CF6', '#EC4899', '#F97316', '#14B8A6']
//     : ['#4E8CEC', '#31B7AF', '#FF5A5A', '#6D77D8', '#6D84C1', '#FF9F5A', '#5C66C7', '#2AA39B'];

//   // Display loading state
//   if (isLoading) {
//     return (
//       <div className={`${currentTheme.card} rounded-lg p-8 flex items-center justify-center h-64`}>
//         <p className={currentTheme.text}>Loading statistics...</p>
//       </div>
//     );
//   }

//   // Display empty state if no data
//   if ((!courses || courses.length === 0) && (!allGroups || Object.keys(allGroups).length === 0)) {
//     return (
//       <div className={`${currentTheme.card} rounded-lg p-8 flex flex-col items-center justify-center h-64`}>
//         <p className={`${currentTheme.text} text-lg mb-4`}>No data available</p>
//         <p className={currentTheme.secondaryText}>
//           There are no courses or groups data to display statistics. Please add courses and groups to see analytics.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className={`${currentTheme.card} rounded-lg p-6 flex items-center`}>
//           <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'} mr-4`}>
//             <Grid size={24} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
//           </div>
//           <div>
//             <p className={currentTheme.secondaryText}>Total Departments</p>
//             <h3 className={`text-2xl font-bold ${currentTheme.text}`}>{departments.length}</h3>
//           </div>
//         </div>
        
//         <div className={`${currentTheme.card} rounded-lg p-6 flex items-center`}>
//           <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'} mr-4`}>
//             <Users size={24} className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} />
//           </div>
//           <div>
//             <p className={currentTheme.secondaryText}>Total Groups</p>
//             <h3 className={`text-2xl font-bold ${currentTheme.text}`}>{totalGroups}</h3>
//           </div>
//         </div>
        
//         <div className={`${currentTheme.card} rounded-lg p-6 flex items-center`}>
//           <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-orange-900/30' : 'bg-orange-100'} mr-4`}>
//             <BookOpen size={24} className={theme === 'dark' ? 'text-orange-400' : 'text-orange-600'} />
//           </div>
//           <div>
//             <p className={currentTheme.secondaryText}>Total Courses</p>
//             <h3 className={`text-2xl font-bold ${currentTheme.text}`}>{totalCourses}</h3>
//           </div>
//         </div>
//       </div>
      
//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         <div className={`${currentTheme.card} rounded-lg p-6`}>
//           <h3 className={`${currentTheme.text} font-semibold text-lg mb-6`}>Course Distribution by Department</h3>
//           {departmentSizeData.length > 0 ? (
//             <ResponsiveContainer width="100%" height={320}>
//               <BarChart 
//                 data={departmentSizeData}
//                 margin={{ top: 10, right: 30, left: 0, bottom: 60 }}
//               >
//                 <CartesianGrid 
//                   strokeDasharray="3 3" 
//                   stroke={theme === 'dark' ? '#1E2733' : '#EEF1F5'} 
//                   vertical={false}
//                 />
//                 <XAxis 
//                   dataKey="name" 
//                   tick={{ fill: theme === 'dark' ? '#CBD5E1' : '#64748B', fontSize: 12 }}
//                   angle={-45}
//                   textAnchor="end"
//                   height={60}
//                   tickMargin={5}
//                   axisLine={{ stroke: theme === 'dark' ? '#2E3441' : '#E2E8F0' }}
//                 />
//                 <YAxis 
//                   tick={{ fill: theme === 'dark' ? '#CBD5E1' : '#64748B', fontSize: 12 }}
//                   axisLine={{ stroke: theme === 'dark' ? '#2E3441' : '#E2E8F0' }}
//                   tickLine={{ stroke: theme === 'dark' ? '#2E3441' : '#E2E8F0' }}
//                 />
//                 <Tooltip 
//                   cursor={{ fill: theme === 'dark' ? 'rgba(30, 39, 51, 0.4)' : 'rgba(241, 245, 249, 0.6)' }}
//                   contentStyle={{ 
//                     backgroundColor: theme === 'dark' ? '#121A22' : '#fff',
//                     borderColor: theme === 'dark' ? '#1E2733' : '#E2E8F0',
//                     borderRadius: '8px',
//                     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
//                     color: theme === 'dark' ? '#fff' : '#333'
//                   }}
//                   labelStyle={{ 
//                     fontWeight: 'bold', 
//                     color: theme === 'dark' ? '#CBD5E1' : '#334155',
//                     marginBottom: '4px'
//                   }}
//                 />
//                 <Legend 
//                   wrapperStyle={{ 
//                     paddingTop: 20, 
//                     fontSize: 12,
//                     color: theme === 'dark' ? '#CBD5E1' : '#64748B' 
//                   }}
//                 />
//                 <Bar 
//                   dataKey="courses" 
//                   name="Number of Courses" 
//                   fill={theme === 'dark' ? '#2E67FF' : '#4E8CEC'}
//                   radius={[4, 4, 0, 0]}
//                   barSize={30}
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className={`flex items-center justify-center h-64 ${currentTheme.secondaryText}`}>
//               No course data available
//             </div>
//           )}
//         </div>
        
//         <div className={`${currentTheme.card} rounded-lg p-6`}>
//           <h3 className={`${currentTheme.text} font-semibold text-lg mb-6`}>Groups Distribution by Department</h3>
//           {departmentGroupDistribution.length > 0 ? (
//             <ResponsiveContainer width="100%" height={320}>
//               <PieChart>
//                 <Pie
//                   data={departmentGroupDistribution}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={{ stroke: theme === 'dark' ? '#5E6E82' : '#94A3B8', strokeWidth: 1 }}
//                   outerRadius={110}
//                   innerRadius={60}
//                   paddingAngle={2}
//                   fill="#8884d8"
//                   dataKey="value"
//                   nameKey="name"
//                   label={({name, percent}) => 
//                     `${name} ${(percent * 100).toFixed(0)}%`
//                   }
//                   labelStyle={{ 
//                     fill: theme === 'dark' ? '#CBD5E1' : '#334155',
//                     fontSize: 12,
//                     fontWeight: '500'
//                   }}
//                 >
//                   {departmentGroupDistribution.map((_, index) => (
//                     <Cell 
//                       key={`cell-${index}`} 
//                       fill={chartColors[index % chartColors.length]} 
//                       stroke={theme === 'dark' ? '#121A22' : '#FFFFFF'}
//                       strokeWidth={2}
//                     />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   formatter={(value, name) => [`${value} groups`, name]}
//                   contentStyle={{ 
//                     backgroundColor: theme === 'dark' ? '#121A22' : '#fff',
//                     borderColor: theme === 'dark' ? '#1E2733' : '#E2E8F0',
//                     borderRadius: '8px',
//                     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
//                     color: theme === 'dark' ? '#CBD5E1' : '#334155'
//                   }}
//                   itemStyle={{
//                     color: theme === 'dark' ? '#CBD5E1' : '#334155'
//                   }}
//                 />
//                 <Legend 
//                   layout="horizontal" 
//                   verticalAlign="bottom" 
//                   align="center"
//                   wrapperStyle={{
//                     paddingTop: 20,
//                     fontSize: 12,
//                     color: theme === 'dark' ? '#CBD5E1' : '#64748B'
//                   }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className={`flex items-center justify-center h-64 ${currentTheme.secondaryText}`}>
//               No group data available
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DepartmentStatistics;
import React from 'react';
import { 
  PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area
} from 'recharts';
import { useTheme } from '../../../context/ThemeProvider';
import { 
  getGradeDistribution, 
  getDepartmentDistribution, 
  getEnrollmentTrend,
  getCourseStatusDistribution,
  getCourseCapacityData,
  getInstructorDistribution,
  getCreditsDistribution,
  getSemesterDistribution
} from './chartUtils';

/**
 * Enhanced Dashboard Charts Component
 * Provides sophisticated data visualization for course management system
 */
const DashboardCharts = ({ courses }) => {
  // Get theme context
  const { theme, themeConfig } = useTheme();
  const colors = themeConfig[theme];
  
  // Define chart palettes based on theme
  const chartPalette = {
    dark: {
      primary: ['#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A'],
      secondary: ['#22C55E', '#16A34A', '#15803D', '#166534', '#14532D'],
      accent: ['#F59E0B', '#D97706', '#B45309', '#92400E', '#78350F'],
      neutral: ['#6B7280', '#4B5563', '#374151', '#1F2937', '#111827'],
      backgroundOpacity: '10',
      gridLines: '#1F2937',
      tooltipBackground: '#374151',
      tooltipText: '#F3F4F6'
    },
    light: {
      primary: ['#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF'],
      secondary: ['#4ADE80', '#22C55E', '#16A34A', '#15803D', '#166534'],
      accent: ['#FBBF24', '#F59E0B', '#D97706', '#B45309', '#92400E'],
      neutral: ['#D1D5DB', '#9CA3AF', '#6B7280', '#4B5563', '#374151'],
      backgroundOpacity: '40',
      gridLines: '#E5E7EB',
      tooltipBackground: '#F9FAFB',
      tooltipText: '#1F2937'
    }
  };
  
  // Use current theme's palette
  const palette = chartPalette[theme];
  
  // Custom tooltip styles
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-2 rounded shadow border ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Top Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Status Distribution */}
        <div className={`p-6 rounded-xl ${colors.card}`}>
          <h3 className={`text-lg font-medium mb-4 ${colors.text}`}>Course Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getCourseStatusDistribution(courses)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell key="active-cell" fill={palette.secondary[1]} />
                  <Cell key="inactive-cell" fill={palette.neutral[2]} />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span className={colors.text}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution */}
        <div className={`p-6 rounded-xl ${colors.card}`}>
          <h3 className={`text-lg font-medium mb-4 ${colors.text}`}>Department Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getDepartmentDistribution(courses)}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={palette.gridLines}
                  vertical={false}
                />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: theme === 'dark' ? '#E5E7EB' : '#374151' }}
                  axisLine={{ stroke: palette.gridLines }}
                />
                <YAxis 
                  tick={{ fill: theme === 'dark' ? '#E5E7EB' : '#374151' }}
                  axisLine={{ stroke: palette.gridLines }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  fill={palette.primary[1]} 
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                  animationDuration={1500}
                >
                  {getDepartmentDistribution(courses).map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={palette.primary[index % palette.primary.length]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enrollment Trend */}
        <div className={`p-6 rounded-xl ${colors.card}`}>
          <h3 className={`text-lg font-medium mb-4 ${colors.text}`}>Enrollment Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getEnrollmentTrend()}>
                <defs>
                  <linearGradient id="enrollmentFill" x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="5%" 
                      stopColor={palette.primary[0]} 
                      stopOpacity={0.8}
                    />
                    <stop 
                      offset="95%" 
                      stopColor={palette.primary[0]} 
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={palette.gridLines} 
                  vertical={false}
                />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: theme === 'dark' ? '#E5E7EB' : '#374151' }}
                  axisLine={{ stroke: palette.gridLines }}
                />
                <YAxis 
                  tick={{ fill: theme === 'dark' ? '#E5E7EB' : '#374151' }}
                  axisLine={{ stroke: palette.gridLines }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke={palette.primary[1]} 
                  strokeWidth={2}
                  fill="url(#enrollmentFill)"
                  activeDot={{ 
                    r: 6, 
                    strokeWidth: 2, 
                    stroke: theme === 'dark' ? '#1F2937' : 'white' 
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Second Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <div className={`p-6 rounded-xl ${colors.card}`}>
          <h3 className={`text-lg font-medium mb-4 ${colors.text}`}>Grade Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getGradeDistribution(courses[0])}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  dataKey="count"
                >
                  <Cell key="grade-a" fill={palette.secondary[0]} />
                  <Cell key="grade-b" fill={palette.secondary[1]} />
                  <Cell key="grade-c" fill={theme === 'dark' ? '#9CA3AF' : palette.secondary[2]} />
                  <Cell key="grade-d" fill={palette.accent[1]} />
                  <Cell key="grade-f" fill={theme === 'dark' ? '#EF4444' : '#F87171'} />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span className={colors.text}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Instructor Distribution */}
        <div className={`p-6 rounded-xl ${colors.card}`}>
          <h3 className={`text-lg font-medium mb-4 ${colors.text}`}>Top Instructors by Course Load</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={getInstructorDistribution(courses)}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={palette.gridLines}
                  horizontal={true}
                  vertical={false}
                />
                <XAxis 
                  type="number" 
                  tick={{ fill: theme === 'dark' ? '#E5E7EB' : '#374151' }}
                  axisLine={{ stroke: palette.gridLines }}
                />
                <YAxis 
                  dataKey="name" 
                  type="category"
                  width={100}
                  tick={{ fill: theme === 'dark' ? '#E5E7EB' : '#374151' }}
                  axisLine={{ stroke: palette.gridLines }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="courses" 
                  fill={palette.primary[1]}
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                  animationDuration={1500}
                >
                  {getInstructorDistribution(courses).map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={palette.primary[index % palette.primary.length]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Third Row - Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Semester Distribution */}
        <div className={`p-6 rounded-xl ${colors.card}`}>
          <h3 className={`text-lg font-medium mb-4 ${colors.text}`}>Semester Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart 
                cx="50%" 
                cy="50%" 
                outerRadius="80%" 
                data={getSemesterDistribution(courses)}
              >
                <PolarGrid stroke={palette.gridLines} />
                <PolarAngleAxis 
                  dataKey="name"
                  tick={{ fill: theme === 'dark' ? '#E5E7EB' : '#374151' }}
                />
                <PolarRadiusAxis 
                  tick={{ fill: theme === 'dark' ? '#E5E7EB' : '#374151' }}
                  angle={30}
                />
                <Radar 
                  name="Courses" 
                  dataKey="count" 
                  stroke={palette.accent[1]} 
                  fill={palette.accent[1]} 
                  fillOpacity={0.5} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value) => <span className={colors.text}>{value}</span>} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Credits Distribution */}
        <div className={`p-6 rounded-xl ${colors.card}`}>
          <h3 className={`text-lg font-medium mb-4 ${colors.text}`}>Credits Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getCreditsDistribution(courses)}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={palette.gridLines}
                  vertical={false}
                />
                <XAxis 
                  dataKey="credits" 
                  tick={{ fill: theme === 'dark' ? '#E5E7EB' : '#374151' }}
                  axisLine={{ stroke: palette.gridLines }}
                  label={{ 
                    value: 'Credits', 
                    position: 'insideBottom', 
                    offset: -5,
                    fill: theme === 'dark' ? '#E5E7EB' : '#374151'
                  }}
                />
                <YAxis 
                  tick={{ fill: theme === 'dark' ? '#E5E7EB' : '#374151' }}
                  axisLine={{ stroke: palette.gridLines }}
                  label={{ 
                    value: 'Number of Courses', 
                    angle: -90, 
                    position: 'insideLeft',
                    fill: theme === 'dark' ? '#E5E7EB' : '#374151'
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  fill={palette.secondary[1]} 
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                >
                  {getCreditsDistribution(courses).map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={palette.secondary[index % palette.secondary.length]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;