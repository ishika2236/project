import React from 'react';
import { useTheme } from '../../../../context/ThemeProvider';

const StatusBadge = ({ status }) => {
  const { theme, isDark } = useTheme();
  
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
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBg(status)} ${getStatusColor(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;