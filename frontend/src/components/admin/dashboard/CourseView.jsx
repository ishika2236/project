import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

const CourseView = ({ courseGroupData, searchQuery, handleCourseSelect, theme, colors }) => {
  // Prepare data for horizontal bar chart
  const coursesChartData = useMemo(() => courseGroupData.map(course => ({
    name: course.name,
    students: course.students,
    groups: course.totalGroups,
    color: course.color
  })), [courseGroupData]);
  
  // Filter courses based on search query
  const filteredCourses = courseGroupData.filter(course => 
    !searchQuery || course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="mb-6">
      {/* Course Bar Chart */}
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
              fill="#121A22"
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
        {filteredCourses.map((course, index) => (
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
  );
};

export default CourseView;