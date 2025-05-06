import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTheme } from '../../../../context/ThemeProvider';

const AttendanceDistribution = ({ attendance, courses }) => {
  const { isDark } = useTheme();
  
  // Calculate attendance distribution
  const calculateDistribution = () => {
    const present = attendance.filter(a => a.status === 'present').length;
    const medical = attendance.filter(a => a.status === 'medical').length;
    const duty = attendance.filter(a => a.status === 'duty').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    
    const total = present + medical + duty + absent;
    
    if (total === 0) return [];
    
    return [
      { name: 'Present', value: present, color: isDark ? '#4ADE80' : '#22C55E' },
      { name: 'Medical', value: medical, color: isDark ? '#60A5FA' : '#3B82F6' },
      { name: 'Duty', value: duty, color: isDark ? '#FBBF24' : '#F59E0B' },
      { name: 'Absent', value: absent, color: isDark ? '#F87171' : '#EF4444' }
    ].filter(item => item.value > 0);
  };
  
  const data = calculateDistribution();
  
  const totalClasses = attendance.length;
  const presentCount = attendance.filter(a => a.status === 'present').length;
  const approvedLeaveCount = attendance.filter(a => 
    (a.status === 'medical' || a.status === 'duty') && a.approved
  ).length;
  
  const attendancePercentage = totalClasses > 0 
    ? Math.round(((presentCount + approvedLeaveCount) / totalClasses) * 100) 
    : 0;
  
  return (
    <div className={`${
      isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
    } border rounded-xl p-6`}>
      <h3 className="text-lg font-semibold mb-4">Attendance Distribution</h3>
      
      {data.length === 0 ? (
        <div className="py-8 text-center text-gray-500">No attendance data available</div>
      ) : (
        <>
          <div className="mb-4 text-center">
            <div className={`${
              attendancePercentage >= 90
                ? isDark ? 'text-green-400' : 'text-green-600'
                : attendancePercentage >= 75
                  ? isDark ? 'text-yellow-400' : 'text-yellow-600'
                  : isDark ? 'text-red-400' : 'text-red-600'
            } text-3xl font-bold`}>
              {attendancePercentage}%
            </div>
            <div className={`${
              isDark ? 'text-gray-400' : 'text-gray-500'
            } text-sm`}>
              Overall Attendance
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#374151' : '#fff',
                    borderColor: isDark ? '#4B5563' : '#E5E7EB',
                    color: isDark ? '#F9FAFB' : '#111827'
                  }}
                  formatter={(value) => [`${value} classes`, '']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default AttendanceDistribution;