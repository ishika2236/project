import React from 'react';
import { BookOpen, Users } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeProvider';
import CircularProgressBar from '../utils/CircularProgressBar';

const StudentInfo = ({ student, courses, groups }) => {
  const { themeConfig, theme, isDark } = useTheme();
  const currentTheme = themeConfig[theme];
  
  const course = courses.find(c => c.id === student.courseId);
  const group = groups.find(g => g.id === student.groupId);

  return (
    <div className={`${currentTheme.card} rounded-xl p-6`}>
      <div className="flex flex-col md:flex-row justify-between">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-semibold mb-2">{student.name}</h2>
          <div className="flex flex-wrap gap-2">
            <div className={`flex items-center px-3 py-1 rounded-md ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
              <BookOpen size={14} className="mr-1" />
              {course?.courseName}
            </div>
            <div className={`flex items-center px-3 py-1 rounded-md ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
              <Users size={14} className="mr-1" />
              {group?.name}
            </div>
          </div>
        </div>
        <CircularProgressBar 
          percentage={student.averageAttendance} 
          size={24} 
          label="Attendance Rate" 
        />
      </div>
    </div>
  );
};

export default StudentInfo;