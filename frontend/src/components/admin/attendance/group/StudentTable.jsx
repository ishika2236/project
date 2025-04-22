import React from 'react';
import { useTheme } from '../../../../context/ThemeProvider';

const StudentTable = ({ students, onStudentSelect }) => {
  const { isDark, themeConfig, theme } = useTheme();
  const currentTheme = themeConfig[theme];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className={isDark ? 'bg-gray-800' : 'bg-gray-50'}>
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Average Attendance</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Pending Leaves</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className={isDark ? 'bg-gray-900/50 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}>
          {students.map(student => (
            <tr key={student.id} className={isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium">{student.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  student.averageAttendance >= 90 ? (isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800') :
                  student.averageAttendance >= 75 ? (isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-800') :
                  (isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800')
                }`}>
                  {student.averageAttendance}%
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm ${student.pendingLeaves > 0 ? 'text-amber-500' : 'text-green-500'}`}>
                  {student.pendingLeaves}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button 
                  onClick={() => onStudentSelect(student)}
                  className={`${currentTheme.button.primary} px-3 py-1 rounded-md text-sm`}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
