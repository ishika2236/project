import React from 'react';
import { BriefcaseMedical, Briefcase, X } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeProvider';

const LeaveSummary = ({ attendance, courses }) => {
  const { isDark } = useTheme();
  
  // Calculate leave counts
  const calculateLeaves = () => {
    const medicalLeaves = attendance.filter(a => a.status === 'medical').length;
    const dutyLeaves = attendance.filter(a => a.status === 'duty').length;
    const absences = attendance.filter(a => a.status === 'absent').length;
    
    return { medicalLeaves, dutyLeaves, absences };
  };
  
  const { medicalLeaves, dutyLeaves, absences } = calculateLeaves();
  
  // Get course-specific leave data
  const getCourseLeaveData = () => {
    const courseData = {};
    
    // Initialize courseData with 0 counts for each course
    courses.forEach(course => {
      courseData[course.id] = {
        id: course.id,
        name: course.courseName,
        code: course.courseCode,
        medicalLeaves: 0,
        dutyLeaves: 0,
        absences: 0
      };
    });
    
    // Count leaves by course
    attendance.forEach(record => {
      if (courseData[record.courseId]) {
        if (record.status === 'medical') {
          courseData[record.courseId].medicalLeaves++;
        } else if (record.status === 'duty') {
          courseData[record.courseId].dutyLeaves++;
        } else if (record.status === 'absent') {
          courseData[record.courseId].absences++;
        }
      }
    });
    
    return Object.values(courseData);
  };
  
  const courseLeaveData = getCourseLeaveData();
  
  return (
    <div className={`${
      isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
    } border rounded-xl p-6`}>
      <h3 className="text-lg font-semibold mb-4">Leave Summary</h3>
      
      {/* Overall Leave Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`${
          isDark ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'
        } border rounded-lg p-4 flex flex-col items-center justify-center`}>
          <BriefcaseMedical size={20} className={`${isDark ? 'text-blue-400' : 'text-blue-600'} mb-2`} />
          <span className="block text-xl font-semibold">{medicalLeaves}</span>
          <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Medical Leaves</span>
        </div>
        
        <div className={`${
          isDark ? 'bg-amber-900/30 border-amber-800' : 'bg-amber-50 border-amber-200'
        } border rounded-lg p-4 flex flex-col items-center justify-center`}>
          <Briefcase size={20} className={`${isDark ? 'text-amber-400' : 'text-amber-600'} mb-2`} />
          <span className="block text-xl font-semibold">{dutyLeaves}</span>
          <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Official Duties</span>
        </div>
        
        <div className={`${
          isDark ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200'
        } border rounded-lg p-4 flex flex-col items-center justify-center`}>
          <X size={20} className={`${isDark ? 'text-red-400' : 'text-red-600'} mb-2`} />
          <span className="block text-xl font-semibold">{absences}</span>
          <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Absences</span>
        </div>
      </div>
      
      {/* Course-specific Leave Summary */}
      <div>
        <h4 className={`${
          isDark ? 'text-gray-300' : 'text-gray-700'
        } font-medium mb-3`}>Leaves by Course</h4>
        
        {courseLeaveData.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No course data available</p>
        ) : (
          <div className="space-y-3">
            {courseLeaveData.map(course => (
              <div 
                key={course.id}
                className={`${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                } border rounded-lg p-3`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{course.name}</span>
                  <span className={`${
                    isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                  } px-2 py-1 rounded text-xs`}>
                    {course.code}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className={`${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  } text-sm`}>
                    <span className="block font-semibold">{course.medicalLeaves}</span>
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>Medical</span>
                  </div>
                  <div className={`${
                    isDark ? 'text-amber-400' : 'text-amber-600'
                  } text-sm`}>
                    <span className="block font-semibold">{course.dutyLeaves}</span>
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>Duty</span>
                  </div>
                  <div className={`${
                    isDark ? 'text-red-400' : 'text-red-600'
                  } text-sm`}>
                    <span className="block font-semibold">{course.absences}</span>
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>Absent</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveSummary;