import React from 'react';
import { Check, Clock, X, BriefcaseMedicalIcon, Briefcase, BriefcaseMedical } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeProvider';

const AttendanceRecords = ({ studentId, attendance, courses, onApproveLeave }) => {
  const { isDark } = useTheme();
  
  // Format date to display in a more readable format
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    }).format(date);
  };
  
  // Get course name from id
  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.courseName : 'Unknown Course';
  };
  
  // Get status icon based on attendance status
  const getStatusIcon = (status) => {
    switch(status) {
      case 'present':
        return <Check size={16} className={`${isDark ? 'text-green-400' : 'text-green-600'}`} />;
      case 'absent':
        return <X size={16} className={`${isDark ? 'text-red-400' : 'text-red-500'}`} />;
      case 'medical':
        return <BriefcaseMedical size={16} className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`} />;
      case 'duty':
        return <Briefcase size={16} className={`${isDark ? 'text-amber-400' : 'text-amber-600'}`} />;
      default:
        return null;
    }
  };
  
  // Get status text and style based on attendance status
  const getStatusInfo = (status) => {
    let text = '';
    let bgColor = '';
    let textColor = '';
    
    switch(status) {
      case 'present':
        text = 'Present';
        bgColor = isDark ? 'bg-green-900/30' : 'bg-green-100';
        textColor = isDark ? 'text-green-400' : 'text-green-700';
        break;
      case 'absent':
        text = 'Absent';
        bgColor = isDark ? 'bg-red-900/30' : 'bg-red-100';
        textColor = isDark ? 'text-red-400' : 'text-red-700';
        break;
      case 'medical':
        text = 'Medical Leave';
        bgColor = isDark ? 'bg-blue-900/30' : 'bg-blue-100';
        textColor = isDark ? 'text-blue-400' : 'text-blue-700';
        break;
      case 'duty':
        text = 'Official Duty';
        bgColor = isDark ? 'bg-amber-900/30' : 'bg-amber-100';
        textColor = isDark ? 'text-amber-400' : 'text-amber-700';
        break;
      default:
        text = 'Unknown';
        bgColor = isDark ? 'bg-gray-800' : 'bg-gray-100';
        textColor = isDark ? 'text-gray-400' : 'text-gray-700';
    }
    
    return { text, bgColor, textColor };
  };
  
  return (
    <div className={`${
      isDark ? 'border-gray-700' : 'border-gray-200'
    } border rounded-xl overflow-x-auto`}>
      <table className="w-full min-w-full">
        <thead>
          <tr className={`${
            isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-700'
          }`}>
            <th className="text-left py-3 px-4">Date</th>
            <th className="text-left py-3 px-4">Course</th>
            <th className="text-left py-3 px-4">Status</th>
            <th className="text-left py-3 px-4">Approval</th>
            <th className="text-right py-3 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
  {attendance.length === 0 ? (
    <tr>
      <td colSpan={5} className="text-center py-6 text-gray-500">
        No attendance records found
      </td>
    </tr>
  ) : (
    <>
      {[...attendance].sort((a, b) => new Date(b.date) - new Date(a.date)).map((record, index) => {
        const { text, bgColor, textColor } = getStatusInfo(record.status);
        return (
          <tr 
                  key={index} 
                  className={`${
                    isDark 
                      ? 'border-gray-700 hover:bg-gray-800/50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  } border-t transition-colors`}
                >
                  <td className="py-3 px-4">{formatDate(record.date)}</td>
                  <td className="py-3 px-4">{getCourseName(record.courseId)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {getStatusIcon(record.status)}
                      <span className={`${bgColor} ${textColor} ml-2 px-2 py-1 rounded-md text-xs`}>
                        {text}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {(record.status === 'medical' || record.status === 'duty') && (
                      record.approved ? (
                        <span className={`${
                          isDark ? 'text-green-400' : 'text-green-600'
                        } flex items-center`}>
                          <Check size={16} className="mr-1" />
                          Approved
                        </span>
                      ) : (
                        <span className={`${
                          isDark ? 'text-amber-400' : 'text-amber-600'
                        } flex items-center`}>
                          <Clock size={16} className="mr-1" />
                          Pending
                        </span>
                      )
                    ) }: (
                      <span className={`${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        N/A
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {(record.status === 'medical' || record.status === 'duty') && !record.approved && (
                      <button
                        onClick={() => onApproveLeave(studentId, record.date, record.courseId)}
                        className={`${
                          isDark 
                            ? 'bg-blue-900/30 hover:bg-blue-800/50 text-blue-400 border-blue-800' 
                            : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                        } border px-3 py-1 rounded-md text-sm transition-colors`}
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
        );
      })}
    </>
  )}
</tbody>

      </table>
    </div>
  );
};

export default AttendanceRecords;