import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeProvider';
import { Edit, Plus, Users } from 'lucide-react';
import GroupStudentList from './GroupStudentList';
import AddStudentsModal from './AddStudentsModal';

const GroupDetails = ({ 
  group, 
  onEdit, 
  onAddStudents, 
  onRemoveStudent,
  allStudents = [], 
  isAddingStudents = false,
  isRemovingStudent = false
}) => {
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];
  
  const [isAddStudentsModalOpen, setIsAddStudentsModalOpen] = useState(false);
  
  // Get the IDs of students already in the group
  const currentStudentIds = group.students?.map(student => student._id || student.id) || [];
  
  const handleAddStudents = async (selectedStudents) => {
    if (selectedStudents.length === 0) return;
    
    // Extract just the IDs if onAddStudents expects only IDs
    const studentIds = selectedStudents.map(student => student._id || student.id);
    await onAddStudents(group._id, studentIds);
  };
  
  return (
    <div className={`${colors.card} rounded-lg shadow-md p-6`}>
      <div className="flex justify-between items-start mb-6">
        <h2 className={`text-xl font-bold ${colors.text}`}>{group.name}</h2>
        <button
          onClick={onEdit}
          className={`${colors.button.secondary} px-3 py-2 rounded-md flex items-center`}
        >
          <Edit size={16} className="mr-1" />
          <span>Edit</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className={`text-md font-semibold mb-2 ${colors.text}`}>Group Information</h3>
          <div className={`${colors.secondaryCard} rounded-md p-4`}>
            <p className={`${colors.secondaryText} mb-2`}>
              <span className="font-semibold">Department:</span>{' '}
              {group.department?.name || 'Not assigned'}
            </p>
            <p className={`${colors.secondaryText} mb-2`}>
              <span className="font-semibold">Mentor:</span>{' '}
              {group.mentor?.firstName && group.mentor?.lastName
                ? `${group.mentor.firstName} ${group.mentor.lastName}`
                : 'Not assigned'}
            </p>
            <p className={`${colors.secondaryText}`}>
              <span className="font-semibold">Students:</span>{' '}
              {group.students?.length || 0}
            </p>
          </div>
        </div>
        
        <div>
          <h3 className={`text-md font-semibold mb-2 ${colors.text}`}>Additional Details</h3>
          <div className={`${colors.secondaryCard} rounded-md p-4`}>
            {group.description ? (
              <p className={`${colors.secondaryText}`}>{group.description}</p>
            ) : (
              <p className={`${colors.secondaryText} italic`}>No description available</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className={`text-md font-semibold ${colors.text}`}>Students</h3>
          <button
            onClick={() => setIsAddStudentsModalOpen(true)}
            className={`${colors.button.primary} px-3 py-2 rounded-md flex items-center`}
          >
            <Plus size={16} className="mr-1" />
            <span>Add Students</span>
          </button>
        </div>
        
        {/* Student list with remove functionality */}
        <div className={`${colors.secondaryCard} rounded-md`}>
          <GroupStudentList 
            group={group} 
            isAdmin={true} 
            onRemoveStudent={onRemoveStudent}
            isRemovingStudent={isRemovingStudent}
          />
        </div>
      </div>
      
      {/* Add Students Modal */}
      <AddStudentsModal
        isOpen={isAddStudentsModalOpen}
        onClose={() => setIsAddStudentsModalOpen(false)}
        onAddStudents={handleAddStudents}
        allStudents={allStudents}
        currentStudentIds={currentStudentIds}
        isLoading={isAddingStudents}
      />
    </div>
  );
};

export default GroupDetails;
