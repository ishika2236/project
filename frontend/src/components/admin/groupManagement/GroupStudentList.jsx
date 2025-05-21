import React, { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { removeStudentFromGroup } from '../../../app/features/groups/groupThunks';
import { useTheme } from '../../../context/ThemeProvider';

const GroupStudentList = ({ 
  group, 
  isAdmin = false, 
  onRemoveStudent, 
  isRemovingStudent = false 
}) => {
  const dispatch = useDispatch();
  const [removingStudentId, setRemovingStudentId] = useState(null);
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];

  const handleRemoveStudent = async (studentId) => {
    if (!group || !studentId) return;
    
    if (window.confirm(`Are you sure you want to remove this student from ${group.name}?`)) {
      setRemovingStudentId(studentId);
      
      if (onRemoveStudent) {
        // Use the passed handler if available (recommended)
        await onRemoveStudent(studentId);
        setRemovingStudentId(null);
      } else {
        // Fall back to local implementation if no handler passed
        try {
          const result = await dispatch(removeStudentFromGroup({
            groupId: group._id,
            studentId: studentId
          }));
          
          if (result.meta.requestStatus === 'fulfilled') {
            // Success message could be shown here
            console.log(`Student ${studentId} removed from group ${group._id}`);
          }
        } catch (error) {
          console.error('Error removing student from group:', error);
        } finally {
          setRemovingStudentId(null);
        }
      }
    }
  };

  // If no students or group is not properly loaded
  if (!group?.students || !Array.isArray(group.students) || group.students.length === 0) {
    return (
      <div className={`${colors.secondaryText} italic p-4 text-center`}>
        No students assigned to this group.
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-96">
      <table className={`min-w-full ${theme === 'dark' ? 'bg-[#121A22]' : 'bg-white'}`}>
        <thead className={theme === 'dark' ? 'bg-[#0A0E13]' : 'bg-slate-50'}>
          <tr>
            <th className={`px-6 py-3 text-left text-xs font-medium ${colors.secondaryText} uppercase tracking-wider`}>
              Name
            </th>
            <th className={`px-6 py-3 text-left text-xs font-medium ${colors.secondaryText} uppercase tracking-wider`}>
              ID
            </th>
            {isAdmin && (
              <th className={`px-6 py-3 text-right text-xs font-medium ${colors.secondaryText} uppercase tracking-wider`}>
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className={theme === 'dark' ? 'divide-y divide-[#1E2733]' : 'divide-y divide-slate-200'}>
          {group.students.map((student) => (
            <tr key={student._id} className={theme === 'dark' ? 'hover:bg-[#121A22]/70' : 'hover:bg-slate-50'}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="ml-4">
                    <div className={`text-sm font-medium ${colors.text}`}>
                      {student.firstName} {student.lastName}
                    </div>
                    <div className={`text-sm ${colors.secondaryText}`}>
                      {student.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${colors.secondaryText}`}>
                {student.rollNumber}
              </td>
              {isAdmin && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {isRemovingStudent && removingStudentId === student._id ? (
                    <span className={colors.secondaryText}>
                      <Loader2 size={18} className="animate-spin" />
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRemoveStudent(student._id)}
                      className={`text-red-500 hover:text-red-700 focus:outline-none transition-colors duration-200`}
                      title="Remove student from group"
                      disabled={isRemovingStudent}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GroupStudentList;