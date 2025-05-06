import React from 'react';
import { BookOpen, Users, Building2 } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeProvider';

const StudentInfo = ({ student, courses, group, department }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`${
      isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
    } border rounded-xl p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className={`${
            isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
          } w-10 h-10 rounded-full flex items-center justify-center mr-4 font-semibold text-lg`}>
            {student.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{student.name}</h3>
            <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
              Student ID: {student.id}
            </div>
          </div>
        </div>
        <div className={`${
          student.averageAttendance >= 90
            ? isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
            : student.averageAttendance >= 75
              ? isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
              : isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
        } px-3 py-1 rounded-md font-medium`}>
          {student.averageAttendance}% Attendance
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Department Info */}
        <div className={`${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
        } border rounded-lg p-4`}>
          <div className="flex items-center mb-2">
            <Building2 size={16} className={`${
              isDark ? 'text-purple-400' : 'text-purple-600'
            } mr-2`} />
            <h4 className="font-medium">Department</h4>
          </div>
          <p>{department ? department.name : 'Not assigned'}</p>
        </div>
        
        {/* Group Info */}
        <div className={`${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
        } border rounded-lg p-4`}>
          <div className="flex items-center mb-2">
            <Users size={16} className={`${
              isDark ? 'text-green-400' : 'text-green-600'
            } mr-2`} />
            <h4 className="font-medium">Group</h4>
          </div>
          <p>{group ? group.name : 'Not assigned'}</p>
        </div>
        
        {/* Courses Info */}
        <div className={`${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
        } border rounded-lg p-4`}>
          <div className="flex items-center mb-2">
            <BookOpen size={16} className={`${
              isDark ? 'text-blue-400' : 'text-blue-600'
            } mr-2`} />
            <h4 className="font-medium">Enrolled Courses</h4>
          </div>
          {courses.length === 0 ? (
            <p>No courses enrolled</p>
          ) : (
            <ul className="list-disc list-inside">
              {courses.map(course => (
                <li key={course.id}>
                  {course.courseName} 
                  <span className={`${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  } text-xs ml-1`}>
                    ({course.courseCode})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentInfo;