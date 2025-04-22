import React from 'react';
import { Check, X, FileText } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeProvider';
import StatusBadge from '../utils/StatusBadge';

const AttendanceRecords = ({ studentId, attendance, onApproveLeave }) => {
  const { themeConfig, theme, isDark } = useTheme();
  const currentTheme = themeConfig[theme];

  return (
    <div className={`${currentTheme.card} rounded-xl overflow-hidden`}>
      <div className="p-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Details</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {attendance.map((record, index) => (
              <tr key={index} className={isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={record.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {(record.status === 'medical' || record.status === 'duty') && (
                    <span className={record.approved ? 'text-green-500' : 'text-amber-500'}>
                      {record.approved ? 'Approved' : 'Pending Approval'}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {(record.status === 'medical' || record.status === 'duty') && !record.approved && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => onApproveLeave(studentId, record.date)}
                        className={`${isDark ? 'bg-green-900/20 text-green-500 hover:bg-green-900/30' : 'bg-green-100 text-green-700 hover:bg-green-200'} px-2 py-1 rounded-md text-xs flex items-center`}
                      >
                        <Check size={14} className="mr-1" />
                        Approve
                      </button>
                      <button 
                        className={`${isDark ? 'bg-red-900/20 text-red-500 hover:bg-red-900/30' : 'bg-red-100 text-red-700 hover:bg-red-200'} px-2 py-1 rounded-md text-xs flex items-center`}
                      >
                        <X size={14} className="mr-1" />
                        Reject
                      </button>
                    </div>
                  )}
                  {(record.status === 'medical' || record.status === 'duty') && record.approved && (
                    <button
                      className={`${isDark ? 'bg-blue-900/20 text-blue-500 hover:bg-blue-900/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'} px-2 py-1 rounded-md text-xs flex items-center`}
                    >
                      <FileText size={14} className="mr-1" />
                      View Document
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceRecords;