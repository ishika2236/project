import React from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeProvider';

const CourseCard = ({ course, groups, onClick }) => {
  const { themeConfig, theme, isDark } = useTheme();
  const currentTheme = themeConfig[theme];
  
  const courseGroups = groups.filter(g => g.courseId === course.id);

  return (
    <div 
      onClick={() => onClick(course)}
      className={`${currentTheme.card} rounded-xl p-5 cursor-pointer transition-all duration-300 hover:scale-105`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg mb-1">{course.courseName}</h3>
          <p className={`${currentTheme.secondaryText} text-sm`}>{course.courseCode}</p>
          <p className={`${currentTheme.secondaryText} text-sm`}>{course.department}</p>
        </div>
        <BookOpen size={24} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className={`${currentTheme.secondaryText} text-sm`}>
          {courseGroups.length} Groups
        </span>
        <ChevronRight size={18} className="text-gray-400" />
      </div>
    </div>
  );
};

export default CourseCard;