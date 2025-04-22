import React from 'react';
import { useTheme } from '../../../context/ThemeProvider';
import { CalendarCheck, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SectionHeader from './commonComponents/SectionHeader';

export default function AttendanceCharts({ attendanceData, groupAttendanceData }) {
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Course Attendance Chart */}
      <div className={`${theme === 'dark' ? 'bg-[#121A22]/40' : 'bg-white'} rounded-xl p-6 border ${theme === 'dark' ? 'border-[#1E2733]' : 'border-gray-200'}`}>
        <SectionHeader 
          title="Course Attendance" 
          subtitle="Average attendance percentage by course"
        />
        
        <div className="flex items-center gap-3 mb-4">
          <div className={`rounded-full p-2 ${theme === 'dark' ? 'bg-[#1E2733]/50' : 'bg-gray-100'}`}>
            <CalendarCheck size={20} className={colors.icon} />
          </div>
          <div>
            <h3 className={`${colors.secondaryText} text-sm`}>Overall Average</h3>
            <h2 className={`${colors.text} text-2xl font-bold`}>81%</h2>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1E2733' : '#eee'} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: theme === 'dark' ? '#5E6E82' : '#2E4053' }} 
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fill: theme === 'dark' ? '#5E6E82' : '#2E4053' }} 
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Attendance']}
              contentStyle={{ 
                backgroundColor: theme === 'dark' ? '#121A22' : '#fff',
                borderColor: theme === 'dark' ? '#1E2733' : '#ddd',
                color: theme === 'dark' ? '#fff' : '#333'
              }}
            />
            <Legend />
            <Bar 
              dataKey="attendance" 
              name="Attendance Rate" 
              fill={theme === 'dark' ? '#2E67FF' : '#232F3E'}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Group Attendance Chart */}
      <div className={`${theme === 'dark' ? 'bg-[#121A22]/40' : 'bg-white'} rounded-xl p-6 border ${theme === 'dark' ? 'border-[#1E2733]' : 'border-gray-200'}`}>
        <SectionHeader 
          title="Group Attendance" 
          subtitle="Average attendance percentage by student groups"
        />
        
        <div className="flex items-center gap-3 mb-4">
          <div className={`rounded-full p-2 ${theme === 'dark' ? 'bg-[#1E2733]/50' : 'bg-gray-100'}`}>
            <BarChart2 size={20} className={colors.icon} />
          </div>
          <div>
            <h3 className={`${colors.secondaryText} text-sm`}>Group Performance</h3>
            <h2 className={`${colors.text} text-2xl font-bold`}>82%</h2>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={groupAttendanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1E2733' : '#eee'} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: theme === 'dark' ? '#5E6E82' : '#2E4053' }} 
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fill: theme === 'dark' ? '#5E6E82' : '#2E4053' }} 
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Attendance']}
              contentStyle={{ 
                backgroundColor: theme === 'dark' ? '#121A22' : '#fff',
                borderColor: theme === 'dark' ? '#1E2733' : '#ddd',
                color: theme === 'dark' ? '#fff' : '#333'
              }}
            />
            <Legend />
            <Bar 
              dataKey="attendance" 
              name="Attendance Rate" 
              fill={theme === 'dark' ? '#2F955A' : '#FF9900'}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}