import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeProvider';
import { Book, ChevronRight } from 'lucide-react';
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import SectionHeader from './commonComponents/SectionHeader';

export default function CourseDistributionSection({ courseGroupData }) {
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];
  
  const [selectedCourse, setSelectedCourse] = useState(courseGroupData[0]);
  
  const handleNavigateToCourseInfo = () => {
    console.log("Navigating to course info page");
    // Implement your navigation logic here
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-[#121A22]/40' : 'bg-white'} rounded-xl p-6 mb-10 border ${theme === 'dark' ? 'border-[#1E2733]' : 'border-gray-200'}`}>
      <SectionHeader 
        title="Course Distribution" 
        subtitle="Distribution of students across different courses"
      />
      
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="w-full lg:w-2/5">
          <div className={`${colors.card} p-6 rounded-xl`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`rounded-full p-2 ${theme === 'dark' ? 'bg-[#1E2733]/50' : 'bg-gray-100'}`}>
                <Book size={20} className={colors.icon} />
              </div>
              <div>
                <h3 className={`${colors.secondaryText} text-sm`}>Total Courses</h3>
                <h2 className={`${colors.text} text-2xl font-bold`}>{courseGroupData.length}</h2>
              </div>
            </div>
            
            <div className="space-y-4">
              {courseGroupData.map((course, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                    selectedCourse && selectedCourse.name === course.name 
                      ? theme === 'dark' ? 'bg-[#1E2733]/50' : 'bg-blue-100'
                      : ''
                  }`}
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: course.color }}></div>
                    <span className={`${colors.text} text-sm`}>{course.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`${colors.secondaryText} text-sm font-medium`}>{course.students}</span>
                    <span className={`${colors.secondaryText} text-xs`}>students</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-3/5 mt-6 lg:mt-0 flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={courseGroupData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="students"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {courseGroupData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [`${value} students`, props.payload.name]}
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#121A22' : '#fff',
                  borderColor: theme === 'dark' ? '#1E2733' : '#ddd',
                  color: theme === 'dark' ? '#fff' : '#333'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <button 
          onClick={handleNavigateToCourseInfo} 
          className={`flex items-center gap-2 ${colors.button.primary} py-2 px-4 rounded-lg text-sm font-medium`}
        >
          View Course Details
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}