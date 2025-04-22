import React from 'react';
import { useTheme } from '../../../../context/ThemeProvider';

const AttendanceDistribution = ({ attendance }) => {
  const { themeConfig, theme, isDark } = useTheme();
  const currentTheme = themeConfig[theme];
  
  const getStatusColor = (status) => {
    if (status === 'present') return 'text-green-500';
    if (status === 'absent') return 'text-red-500';
    if (status === 'medical') return 'text-orange-500';
    if (status === 'duty') return 'text-blue-500';
    return 'text-gray-500';
  };
  
  const getStatusBg = (status) => {
    if (status === 'present') return isDark ? 'bg-green-500/20' : 'bg-green-100';
    if (status === 'absent') return isDark ? 'bg-red-500/20' : 'bg-red-100';
    if (status === 'medical') return isDark ? 'bg-orange-500/20' : 'bg-orange-100';
    if (status === 'duty') return isDark ? 'bg-blue-500/20' : 'bg-blue-100';
    return isDark ? 'bg-gray-500/20' : 'bg-gray-100';
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Attendance Distribution</h3>
      <div className={`${currentTheme.card} rounded-xl p-6`}>
        <div className="flex items-center justify-around h-32">
          {['present', 'absent', 'medical', 'duty'].map(status => {
            const count = attendance.filter(a => a.status === status).length;
            const percentage = Math.round((count / attendance.length) * 100);
            
            return (
              <div key={status} className="flex flex-col items-center">
                <div className="relative w-4 bg-gray-700/30 rounded-full mb-2" style={{ height: '100px' }}>
                  <div 
                    className={`absolute bottom-0 left-0 right-0 rounded-full ${getStatusBg(status)}`} 
                    style={{ height: `${percentage}px` }}
                  ></div>
                </div>
                <span className={`text-xs ${getStatusColor(status)}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
                <span className="text-xs mt-1">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AttendanceDistribution;