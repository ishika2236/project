import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Grid, BookOpen, Users } from 'lucide-react';
import { useTheme } from '../../../context/ThemeProvider';

const DepartmentStatistics = ({ departments, allGroups, courses, isLoading }) => {
  const { themeConfig, theme } = useTheme();
  const currentTheme = themeConfig[theme];
  
  // Calculate total groups from allGroups object
  const totalGroups = useMemo(() => {
    // allGroups is an object with departmentIds as keys and arrays of groups as values
    return Object.values(allGroups || {}).reduce((total, departmentGroups) => {
      return total + (departmentGroups ? departmentGroups.length : 0);
    }, 0);
  }, [allGroups]);
  
  // Calculate total courses from courses array
  const totalCourses = useMemo(() => {
    return courses ? courses.length : 0;
  }, [courses]);
  
  // Prepare department size data for chart
  const departmentSizeData = useMemo(() => {
    // Create a mapping of department courses
    const departmentCourseCounts = {};
    
    // Count courses per department
    if (courses && courses.length > 0) {
      courses.forEach(course => {
        if (course.department) {
          const deptId = typeof course.department === 'string' ? course.department : course.department._id;
          const deptName = departments.find(d => d._id === deptId)?.name || 'Unknown';
          
          if (!departmentCourseCounts[deptName]) {
            departmentCourseCounts[deptName] = 0;
          }
          departmentCourseCounts[deptName]++;
        }
      });
    }
    
    // Convert to array format for chart
    return Object.entries(departmentCourseCounts)
      .map(([name, count]) => ({ name, courses: count }))
      .sort((a, b) => b.courses - a.courses) // Sort by course count descending
      .slice(0, 6); // Show top 6 for readability
  }, [courses, departments]);
  
  // Prepare department group distribution data for pie chart
  const departmentGroupDistribution = useMemo(() => {
    const groupCounts = {};
    
    // Count groups per department
    Object.entries(allGroups || {}).forEach(([departmentId, groups]) => {
      if (groups && groups.length > 0) {
        const department = departments.find(d => d._id === departmentId);
        const deptName = department ? department.name : 'Unknown';
        
        groupCounts[deptName] = groups.length;
      }
    });
    
    // Convert to array format for pie chart
    return Object.entries(groupCounts)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value); // Sort by number of groups descending
  }, [allGroups, departments]);
  
  const COLORS = ['#2E67FF', '#2F955A', '#F2683C', '#6B46C1', '#8B5CF6', '#EC4899', '#F97316', '#14B8A6'];

  // Display loading state
  if (isLoading) {
    return (
      <div className={`${currentTheme.card} rounded-lg p-8 flex items-center justify-center`}>
        <p className={currentTheme.text}>Loading statistics...</p>
      </div>
    );
  }

  // Display empty state if no data
  if ((!courses || courses.length === 0) && (!allGroups || Object.keys(allGroups).length === 0)) {
    return (
      <div className={`${currentTheme.card} rounded-lg p-8 flex flex-col items-center justify-center`}>
        <p className={`${currentTheme.text} text-lg mb-4`}>No data available</p>
        <p className={currentTheme.secondaryText}>
          There are no courses or groups data to display statistics. Please add courses and groups to see analytics.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`${currentTheme.card} rounded-lg p-4 flex items-center`}>
          <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'} mr-4`}>
            <Grid size={24} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
          </div>
          <div>
            <p className={currentTheme.secondaryText}>Total Departments</p>
            <h3 className={`text-xl font-bold ${currentTheme.text}`}>{departments.length}</h3>
          </div>
        </div>
        
        <div className={`${currentTheme.card} rounded-lg p-4 flex items-center`}>
          <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'} mr-4`}>
            <Users size={24} className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} />
          </div>
          <div>
            <p className={currentTheme.secondaryText}>Total Groups</p>
            <h3 className={`text-xl font-bold ${currentTheme.text}`}>{totalGroups}</h3>
          </div>
        </div>
        
        <div className={`${currentTheme.card} rounded-lg p-4 flex items-center`}>
          <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-orange-900/30' : 'bg-orange-100'} mr-4`}>
            <BookOpen size={24} className={theme === 'dark' ? 'text-orange-400' : 'text-orange-600'} />
          </div>
          <div>
            <p className={currentTheme.secondaryText}>Total Courses</p>
            <h3 className={`text-xl font-bold ${currentTheme.text}`}>{totalCourses}</h3>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className={`${currentTheme.card} rounded-lg p-4`}>
          <h3 className={`${currentTheme.text} font-semibold mb-4`}>Course Distribution</h3>
          {departmentSizeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentSizeData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1E2733' : '#f0f0f0'} />
                <XAxis dataKey="name" tick={{ fill: theme === 'dark' ? '#fff' : '#333' }} />
                <YAxis tick={{ fill: theme === 'dark' ? '#fff' : '#333' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#121A22' : '#fff',
                    borderColor: theme === 'dark' ? '#1E2733' : '#ddd',
                    color: theme === 'dark' ? '#fff' : '#333'
                  }} 
                />
                <Legend />
                <Bar dataKey="courses" fill="#2E67FF" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={`flex items-center justify-center h-64 ${currentTheme.secondaryText}`}>
              No course data available
            </div>
          )}
        </div>
        
        <div className={`${currentTheme.card} rounded-lg p-4`}>
          <h3 className={`${currentTheme.text} font-semibold mb-4`}>Groups by Department</h3>
          {departmentGroupDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentGroupDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {departmentGroupDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} groups`, name]}
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#121A22' : '#fff',
                    borderColor: theme === 'dark' ? '#1E2733' : '#ddd',
                    color: theme === 'dark' ? '#fff' : '#333'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className={`flex items-center justify-center h-64 ${currentTheme.secondaryText}`}>
              No group data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentStatistics;