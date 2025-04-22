import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Layers, Grid, Search, ChevronDown, Filter, List, BarChart2 } from 'lucide-react';

// Redesigned Group Distribution with minimalistic style, gradients, and better visual hierarchy
const GroupDistribution = ({ courseGroupData, selectedCourse, setSelectedCourse, theme, colors }) => {
  const [viewMode, setViewMode] = useState('courses'); // 'courses' or 'groups'
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [groupsPerPage, setGroupsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('size-desc'); // 'name-asc', 'name-desc', 'size-asc', 'size-desc'
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Prepare data for horizontal bar chart
  const coursesChartData = useMemo(() => courseGroupData.map(course => ({
    name: course.name,
    students: course.students,
    groups: course.totalGroups,
    color: course.color
  })), [courseGroupData]);
  
  // Flatten all groups into a single array for filtering/sorting
  const allGroups = useMemo(() => {
    return courseGroupData.reduce((acc, course) => {
      const courseGroups = course.groups.map(group => ({
        ...group,
        courseName: course.name,
        courseColor: course.color
      }));
      return [...acc, ...courseGroups];
    }, []);
  }, [courseGroupData]); // Only recalculate when courseGroupData changes
  
  // Filter and sort groups based on search query and sort order
  useEffect(() => {
    // Skip effect if allGroups is empty
    if (allGroups.length === 0) return;
    
    let filtered = [...allGroups]; // Create a copy to avoid mutation
    
    // Filter by selected course if in 'groups' view
    if (viewMode === 'groups' && selectedCourse) {
      filtered = filtered.filter(group => group.courseName === selectedCourse.name);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(group => 
        group.name.toLowerCase().includes(query) || 
        group.courseName.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortOrder === 'name-asc') return a.name.localeCompare(b.name);
      if (sortOrder === 'name-desc') return b.name.localeCompare(a.name);
      if (sortOrder === 'size-asc') return a.students - b.students;
      if (sortOrder === 'size-desc') return b.students - a.students;
      return 0;
    });
    
    setFilteredGroups(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, sortOrder, selectedCourse, viewMode, allGroups]);
  
  // Pagination calculation
  const totalPages = Math.ceil(filteredGroups.length / groupsPerPage);
  const paginatedGroups = useMemo(() => {
    return filteredGroups.slice(
      (currentPage - 1) * groupsPerPage,
      currentPage * groupsPerPage
    );
  }, [filteredGroups, currentPage, groupsPerPage]);
  
  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
    setDropdownOpen(false);
  };
  
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setViewMode('groups');
  };
  
  const handleBackToCourses = () => {
    setViewMode('courses');
    setSearchQuery('');
  };

  // Custom gradient definitions for chart
  const gradientOffset = () => {
    const maxValue = Math.max(...coursesChartData.map(item => item.students));
    return maxValue ? 1 : 0;
  };
  return (
    <div className={`${theme === 'dark' ? 'bg-transparent' : 'bg-white'} rounded-xl p-6 mb-10 border border-opacity-30 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'} shadow-sm`}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <h2 className={`${colors.text} text-xl font-bold`}>Group Distribution</h2>
          <p className={`${colors.secondaryText} text-sm`}>
            {viewMode === 'courses' 
              ? 'Overview of all courses and their groups' 
              : `Viewing groups in ${selectedCourse?.name}`}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-4 lg:mt-0 w-full lg:w-auto">
          {viewMode === 'groups' && (
            <button 
              onClick={handleBackToCourses}
              className={`px-4 py-2 text-sm rounded-lg font-medium border transition-all ${
                theme === 'dark' 
                  ? 'border-gray-700 hover:bg-gray-800 bg-transparent' 
                  : 'border-gray-200 hover:bg-gray-50 bg-white'
              } ${colors.text}`}
            >
              ← Back to Courses
            </button>
          )}
          
          <div className="relative flex items-center flex-grow">
            <Search size={16} className={`absolute left-3 ${colors.secondaryText}`} />
            <input
              type="text"
              placeholder={viewMode === 'courses' ? "Search courses..." : "Search groups..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2 w-full rounded-lg text-sm border transition-all ${
                theme === 'dark' 
                  ? 'bg-transparent border-gray-700 text-white placeholder-gray-500 focus:border-blue-500' 
                  : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-400'
              } outline-none focus:ring-1 focus:ring-blue-400`}
            />
          </div>
          
          <div className="relative inline-block text-left">
            <button
              className={`inline-flex justify-between items-center px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                theme === 'dark' 
                  ? 'border-gray-700 hover:bg-gray-800 bg-transparent' 
                  : 'border-gray-200 hover:bg-gray-50 bg-white'
              } ${colors.text}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <Filter size={16} className="mr-2" />
              Sort by
              <ChevronDown size={16} className="ml-2" />
            </button>
            
            {dropdownOpen && (
              <div 
                className={`absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md shadow-lg ${
                  theme === 'dark' ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-100'
                }`}
              >
                <div className="py-1">
                  <button
                    onClick={() => handleSortChange('name-asc')}
                    className={`block px-4 py-2 text-sm w-full text-left hover:opacity-80 ${
                      sortOrder === 'name-asc' 
                        ? theme === 'dark' ? 'bg-blue-600/20 text-blue-300' : 'bg-blue-50 text-blue-700'
                        : colors.text
                    }`}
                  >
                    Name (A-Z)
                  </button>
                  <button
                    onClick={() => handleSortChange('name-desc')}
                    className={`block px-4 py-2 text-sm w-full text-left hover:opacity-80 ${
                      sortOrder === 'name-desc' 
                        ? theme === 'dark' ? 'bg-blue-600/20 text-blue-300' : 'bg-blue-50 text-blue-700'
                        : colors.text
                    }`}
                  >
                    Name (Z-A)
                  </button>
                  <button
                    onClick={() => handleSortChange('size-desc')}
                    className={`block px-4 py-2 text-sm w-full text-left hover:opacity-80 ${
                      sortOrder === 'size-desc' 
                        ? theme === 'dark' ? 'bg-blue-600/20 text-blue-300' : 'bg-blue-50 text-blue-700'
                        : colors.text
                    }`}
                  >
                    Size (Largest first)
                  </button>
                  <button
                    onClick={() => handleSortChange('size-asc')}
                    className={`block px-4 py-2 text-sm w-full text-left hover:opacity-80 ${
                      sortOrder === 'size-asc' 
                        ? theme === 'dark' ? 'bg-blue-600/20 text-blue-300' : 'bg-blue-50 text-blue-700'
                        : colors.text
                    }`}
                  >
                    Size (Smallest first)
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('courses')}
              className={`p-2 ${
                viewMode === 'courses'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                  : theme === 'dark' ? 'bg-transparent text-gray-400' : 'bg-white text-gray-500'
              }`}
            >
              <BarChart2 size={16} />
            </button>
            <button
              onClick={() => {
                if (selectedCourse) {
                  setViewMode('groups');
                } else if (courseGroupData.length > 0) {
                  setSelectedCourse(courseGroupData[0]);
                  setViewMode('groups');
                }
              }}
              className={`p-2 ${
                viewMode === 'groups'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                  : theme === 'dark' ? 'bg-transparent text-gray-400' : 'bg-white text-gray-500'
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Content based on view mode */}
      {viewMode === 'courses' ? (
        // Course Overview with horizontal bar chart
        <div className="mb-6">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">

            <BarChart
  data={coursesChartData.filter(course => 
    !searchQuery || course.name.toLowerCase().includes(searchQuery.toLowerCase())
  )}
  layout="vertical"
  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
>
  {/* Define gradients for each course */}
  <defs>
    {coursesChartData.map((entry, index) => (
      <linearGradient key={`gradient-${index}`} id={`colorGradient-${entry.name}`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={entry.color} stopOpacity={0.9} />
        <stop offset="100%" stopColor={entry.color} stopOpacity={0.4} />
      </linearGradient>
    ))}
  </defs>
  
  <CartesianGrid 
    strokeDasharray="3 3" 
    horizontal={true} 
    vertical={false} 
    stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} 
  />

  <XAxis 
    type="number" 
    tick={{ fill: theme === 'dark' ? '#E5E7EB' : '#4B5563' }} 
    axisLine={{ stroke: theme === 'dark' ? '#4B5563' : '#9CA3AF' }}
    tickLine={{ stroke: theme === 'dark' ? '#4B5563' : '#9CA3AF' }}
  />
  
  <YAxis 
    type="category" 
    dataKey="name" 
    tick={{ fill: theme === 'dark' ? 'white' : '#5E6E82', fontWeight: 400, fontSize: 12 }}
    axisLine={{ stroke: theme === 'dark' ? '#4B5563' : '#9CA3AF' }}
    tickLine={{ stroke: theme === 'dark' ? '#4B5563' : '#9CA3AF' }}
    width={90}
  />
  
  <Tooltip
    contentStyle={{
      backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
      borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
      borderRadius: '6px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}
    formatter={(value, name) => [value, name === 'students' ? 'Students' : 'Groups']}
    labelFormatter={(label) => `Course: ${label}`}
    cursor={{ fill: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }}
  />
  
 
  <Bar 
    dataKey="students" 
    background={{ fill: 'transparent' }}
    onClick={(data) => {
      const course = courseGroupData.find(c => c.name === data.name);
      handleCourseSelect(course);
    }}
    cursor="pointer"
    radius={[0, 4, 4, 0]}
    fill= "#121A22"
    fillOpacity={0.8}
    name="Students"
    stroke="#2F955A"
    strokeWidth={1}
  >
    <LabelList 
      dataKey="students" 
      position="right" 
      fill={theme === 'dark' ? '#F9FAFB' : '#111827'} 
      style={{ fontWeight: 500 }}
    />
  </Bar>
</BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Course cards for selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
            {courseGroupData
              .filter(course => !searchQuery || course.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((course, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg cursor-pointer transition-all border ${
                    theme === 'dark' 
                      ? 'border-gray-800 hover:border-blue-500/30 bg-transparent' 
                      : 'border-gray-100 hover:border-blue-200 bg-white'
                  }`}
                  onClick={() => handleCourseSelect(course)}
                  style={{
                    boxShadow: theme === 'dark' 
                      ? '0 4px 12px rgba(0, 0, 0, 0.1)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.03)'
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ 
                        backgroundColor: course.color,
                        boxShadow: `0 0 8px ${course.color}40`
                      }}></div>
                      <h3 className={`${colors.text} font-medium`}>{course.name}</h3>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${colors.text} ${
                      theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
                    } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      {course.totalGroups} groups
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <p className={`${colors.secondaryText} text-xs`}>Total Students</p>
                      <p className={`${colors.text} font-medium`}>{course.students}</p>
                    </div>
                    <div>
                      <p className={`${colors.secondaryText} text-xs`}>Avg / Group</p>
                      <p className={`${colors.text} font-medium`}>
                        {Math.round(course.students / course.totalGroups)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="w-full bg-transparent rounded-full h-1.5 overflow-hidden border border-opacity-20"
                      style={{ borderColor: theme === 'dark' ? '#4A5568' : '#E2E8F0' }}>
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${Math.min(100, (course.students / Math.max(...courseGroupData.map(c => c.students))) * 100)}%`,
                          background: `linear-gradient(90deg, ${course.color}BB, ${course.color}33)`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        // Groups view with paginated list
        <div>
          {/* Group stats header */}
          <div className={`bg-transparent border rounded-xl p-4 mb-6 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-3 mb-2 sm:mb-0">
                <div className="rounded-full p-2" style={{
                  background: theme === 'dark' 
                    ? `linear-gradient(135deg, ${selectedCourse.color}40, transparent)` 
                    : `linear-gradient(135deg, ${selectedCourse.color}20, ${selectedCourse.color}05)`
                }}>
                  <Layers size={20} style={{ color: selectedCourse.color }} />
                </div>
                <div>
                  <h3 className={`${colors.text} text-lg font-medium`}>{selectedCourse.name}</h3>
                  <p className={`${colors.secondaryText} text-sm`}>
                    {selectedCourse.students} students in {selectedCourse.totalGroups} groups
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className={`rounded-lg px-4 py-2 border ${theme === 'dark' ? 'border-gray-800 bg-transparent' : 'border-gray-100 bg-white'}`}>
                  <p className={`${colors.secondaryText} text-xs`}>Avg. Group Size</p>
                  <p className={`${colors.text} font-bold`}>
                    {Math.round(selectedCourse.students / selectedCourse.totalGroups)}
                  </p>
                </div>
                
                <div className={`rounded-lg px-4 py-2 border ${theme === 'dark' ? 'border-gray-800 bg-transparent' : 'border-gray-100 bg-white'}`}>
                  <p className={`${colors.secondaryText} text-xs`}>Largest Group</p>
                  <p className={`${colors.text} font-bold`}>
                    {Math.max(...selectedCourse.groups.map(g => g.students))}
                  </p>
                </div>
                
                <div className={`rounded-lg px-4 py-2 border ${theme === 'dark' ? 'border-gray-800 bg-transparent' : 'border-gray-100 bg-white'}`}>
                  <p className={`${colors.secondaryText} text-xs`}>Smallest Group</p>
                  <p className={`${colors.text} font-bold`}>
                    {Math.min(...selectedCourse.groups.map(g => g.students))}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Paginated group grid */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <p className={`${colors.secondaryText} text-sm`}>
                Showing {paginatedGroups.length} of {filteredGroups.length} groups
              </p>
              
              <select
                value={groupsPerPage}
                onChange={(e) => setGroupsPerPage(Number(e.target.value))}
                className={`px-2 py-1 rounded text-sm border ${
                  theme === 'dark' 
                    ? 'bg-transparent text-white border-gray-700' 
                    : 'bg-white text-gray-800 border-gray-200'
                }`}
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
            </div>
            
            <div className="space-y-2">
              {paginatedGroups.map((group, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-all ${
                    theme === 'dark' 
                      ? 'border-gray-800 hover:border-opacity-50' 
                      : 'border-gray-100 hover:border-gray-200'
                  } bg-transparent hover:shadow-sm`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Grid size={16} style={{ color: group.courseColor }} />
                      <div>
                        <h4 className={`${colors.text} font-medium flex items-center gap-1`}>
                          {group.name}
                          {viewMode === 'groups' && searchQuery && (
                            <span className={`text-xs ${colors.secondaryText}`}>
                              ({group.courseName})
                            </span>
                          )}
                        </h4>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`${colors.secondaryText} text-sm`}>
                        Students
                      </span>
                      <span
                        className={`px-2 py-1 text-sm rounded-full ${colors.text} font-medium border ${
                          theme === 'dark' ? 'border-gray-700 bg-transparent' : 'border-gray-100 bg-white'
                        }`}
                      >
                        {group.students}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="w-full bg-transparent rounded-full h-1.5 overflow-hidden border border-opacity-10"
                      style={{ borderColor: theme === 'dark' ? '#4A5568' : '#E2E8F0' }}>
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${(group.students / Math.max(...filteredGroups.map(g => g.students))) * 100}%`,
                          background: `linear-gradient(90deg, ${group.courseColor}BB, ${group.courseColor}33)`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination controls - Simplified and more elegant */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-lg text-sm border transition-all ${
                    currentPage === 1
                      ? theme === 'dark' ? 'border-gray-800 text-gray-600' : 'border-gray-100 text-gray-400'
                      : theme === 'dark' ? 'border-gray-700 text-white hover:border-blue-500/30' : 'border-gray-200 text-gray-800 hover:border-blue-300'
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-all ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                            : theme === 'dark' ? 'bg-transparent border border-gray-800 text-white' : 'bg-white border border-gray-100 text-gray-800'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className={colors.secondaryText}>...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm border ${
                          theme === 'dark' ? 'bg-transparent border-gray-800 text-white' : 'bg-white border-gray-100 text-gray-800'
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-lg text-sm border transition-all ${
                    currentPage === totalPages
                      ? theme === 'dark' ? 'border-gray-800 text-gray-600' : 'border-gray-100 text-gray-400'
                      : theme === 'dark' ? 'border-gray-700 text-white hover:border-blue-500/30' : 'border-gray-200 text-gray-800 hover:border-blue-300'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
            
            {/* Empty state */}
            {filteredGroups.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search size={48} className={`${colors.secondaryText} opacity-20 mb-4`} />
                <p className={`text-lg font-medium ${colors.text}`}>No groups found</p>
                <p className={`text-sm ${colors.secondaryText}`}>Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDistribution;