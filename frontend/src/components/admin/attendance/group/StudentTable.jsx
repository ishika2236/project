import React from 'react';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeProvider';

const StudentTable = ({ students, onStudentSelect, courses }) => {
  const { isDark } = useTheme();
  
  const getStudentCourseCount = (student) => {
    return student.courses ? student.courses.length : 0;
  };
  
  const hasPendingLeaves = (student) => {
    return student.pendingLeaves > 0;
  };
  
  return (
    <div className={`${
      isDark ? 'border-gray-700' : 'border-gray-200'
    } border rounded-xl overflow-hidden`}>
      <table className="w-full">
        <thead>
          <tr className={`${
            isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-700'
          }`}>
            <th className="text-left py-3 px-4">Student Name</th>
            <th className="text-center py-3 px-4">Courses</th>
            <th className="text-center py-3 px-4">Attendance</th>
            <th className="text-center py-3 px-4">Status</th>
            <th className="text-right py-3 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-6 text-gray-500">
                No students found
              </td>
            </tr>
          ) : (
            students.map(student => (
              <tr 
                key={student.id} 
                className={`${
                  isDark 
                    ? 'border-gray-700 hover:bg-gray-800/50' 
                    : 'border-gray-200 hover:bg-gray-50'
                } border-t cursor-pointer transition-colors`}
                onClick={() => onStudentSelect(student)}
              >
                <td className="py-3 px-4">{student.name}</td>
                <td className="py-3 px-4 text-center">{getStudentCourseCount(student)}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-block rounded-full px-2 py-1 text-xs ${
                    student.averageAttendance >= 90
                      ? isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                      : student.averageAttendance >= 75
                        ? isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                        : isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
                  }`}>
                    {student.averageAttendance}%
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  {hasPendingLeaves(student) ? (
                    <div className="flex items-center justify-center">
                      <AlertCircle size={16} className={`${
                        isDark ? 'text-amber-400' : 'text-amber-500'
                      } mr-1`} />
                      <span className={`text-xs ${
                        isDark ? 'text-amber-400' : 'text-amber-500'
                      }`}>
                        Pending
                      </span>
                    </div>
                  ) : (
                    <span className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Regular
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <ChevronRight size={16} className={`${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  } inline-block`} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;