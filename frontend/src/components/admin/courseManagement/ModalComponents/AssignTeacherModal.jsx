import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AssignTeacherModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  course, 
  groups, 
  teachers, 
  colors,
  isLoading 
}) => {
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  

  // Reset form when modal is opened/closed or course changes
  useEffect(() => {
    if (isOpen && course) {
      setSelectedTeacher('');
      setSelectedGroup('');
      
      // Filter teachers by department
      console.log(teachers)
      console.log(course)
      if (teachers && course.department) {
        const deptTeachers = teachers.filter(
          teacher => teacher.department && teacher?.department?._id?.toString() === course?.department?._id?.toString()
        );
        setFilteredTeachers(deptTeachers);
        console.log("filteredTeachers: ",filteredTeachers )
      } else {
        setFilteredTeachers(teachers || []);
      }
      
      // Filter groups by department
      if (groups && course.department) {
        const deptGroups = [];
        Object.keys(groups).forEach(deptId => {
          if (deptId === course.department._id) {
            deptGroups.push(...groups[deptId]);
          }
        });
        setFilteredGroups(deptGroups);
      } else {
        setFilteredGroups([]);
      }
    }
  }, [isOpen, course, teachers, groups]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${colors.card} p-6 rounded-lg w-full max-w-md relative`}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className={`text-xl font-semibold mb-4 ${colors.gradient.text}`}>
          Assign Teacher to Course
        </h2>
        
        <div className="mb-4">
          <p className={`text-sm ${colors.secondaryText} mb-2`}>
            Course: <span className={colors.text}>{course?.courseName} ({course?.courseCode})</span>
          </p>
          <p className={`text-sm ${colors.secondaryText} mb-2`}>
            Department: <span className={colors.text}>{course?.department?.name || 'N/A'}</span>
          </p>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            courseId: course._id,
            teacherId: selectedTeacher,
            groupId: selectedGroup,
          });
        }}>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${colors.text}`}>
              Teacher
            </label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className={`w-full p-2 border rounded-md bg-gray-700 text-white`}
              required
            >
              <option value="">Select a teacher</option>
              {filteredTeachers.map(teacher => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.firstName} {teacher.lastName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${colors.text}`}>
              Group
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className={`w-full p-2 border rounded-md bg-gray-700 text-white`}
              required
            >
              <option value="">Select a group</option>
              {filteredGroups.map(group => (
                <option key={group._id} value={group._id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className={`mr-2 px-4 py-2 rounded-md ${colors.button.secondary}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md ${colors.button.primary}`}
              disabled={isLoading || !selectedTeacher || !selectedGroup}
            >
              {isLoading ? 'Assigning...' : 'Assign Teacher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTeacherModal;