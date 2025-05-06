import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeProvider';
import { Users, User, Calendar, Edit, UserPlus } from 'lucide-react';
import StudentsList from './StudentsList';
import AddStudentsModal from './AddStudentsModal';

const GroupDetails = ({ 
  group, 
  onEdit, 
  onAddStudents, 
  allStudents = [],
  isAddingStudents = false 
}) => {
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];
  
  const [activeTab, setActiveTab] = useState('details');
  const [isAddStudentsModalOpen, setIsAddStudentsModalOpen] = useState(false);

  const handleAddStudentsSubmit = (selectedStudents) => {
    // Extract just the IDs from the selected students
    const studentIds = selectedStudents.map(student => student._id || student.id);
    
   
    onAddStudents(group._id, studentIds);
  };

  // Get the actual student objects for the group
  const groupStudents = group.students || [];
  
  return (
    <div className={`${colors.card} rounded-lg overflow-hidden`}>
      <div className={`p-6 border-b border-gray-700`}>
        <div className="flex justify-between items-center">
          <h2 className={`text-xl font-semibold ${colors.text}`}>{group.name}</h2>
          <button
            onClick={onEdit}
            className={`${colors.button.primary} px-3 py-1 rounded-md flex items-center`}
          >
            <Edit size={14} className="mr-1" />
            Edit Group
          </button>
        </div>
        {console.log(group)}
        <div className={`mt-2 ${colors.secondaryText}`}>
          Course: {group?.courses && group?.courses?.length > 0 ? (
                  group.courses.map(course => (
                    <li key={course._id}>{course.courseName}</li>
                  ))
                ) : (
                  <li>No instructors assigned</li>
                )}
        </div>
      </div>
      
      <div className="flex border-b border-gray-700">
        <button
          className={`px-4 py-3 ${activeTab === 'details' ? `${colors.text} border-b-2 border-blue-500` : colors.secondaryText}`}
          onClick={() => setActiveTab('details')}
        >
          Group Details
        </button>
        <button
          className={`px-4 py-3 ${activeTab === 'students' ? `${colors.text} border-b-2 border-blue-500` : colors.secondaryText}`}
          onClick={() => setActiveTab('students')}
        >
          Students ({groupStudents.length})
        </button>
      </div>
      
      {activeTab === 'details' ? (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className={`text-lg font-medium mb-4 ${colors.text}`}>Group Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar size={20} className={`${colors.secondaryText} mr-3 mt-1`} />
                  <div>
                    <p className={`${colors.secondaryText} text-sm`}>Created On</p>
                    <p className={colors.text}>{group.createdAt}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users size={20} className={`${colors.secondaryText} mr-3 mt-1`} />
                  <div>
                    <p className={`${colors.secondaryText} text-sm`}>Student Count</p>
                    <p className={colors.text}>{groupStudents.length} students</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className={`text-lg font-medium mb-4 ${colors.text}`}>Teacher Information</h3>
              
              <div className="flex items-start">
                <User size={20} className={`${colors.secondaryText} mr-3 mt-1`} />
                <div>
                  <p className={`${colors.secondaryText} text-sm`}>Teacher</p>
                  <p className={colors.text}>{group?.mentor?.firstName + " "+ group?.mentor?.lastName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-medium ${colors.text}`}>
              Students in Group
            </h3>
            <button
              className={`${colors.button.green} px-3 py-1 rounded-md flex items-center text-sm`}
              onClick={() => setIsAddStudentsModalOpen(true)}
              disabled={isAddingStudents}
            >
              {isAddingStudents ? (
                <>
                  <div className="w-4 h-4 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus size={14} className="mr-1" />
                  Add Student
                </>
              )}
            </button>
          </div>
          
          <StudentsList students={groupStudents} />
          
          {/* Add Students Modal */}
          <AddStudentsModal 
            isOpen={isAddStudentsModalOpen}
            onClose={() => setIsAddStudentsModalOpen(false)}
            onAddStudents={handleAddStudentsSubmit}
            allStudents={allStudents}
            currentStudentIds={groupStudents.map(s => s._id || s.id)}
            isLoading={isAddingStudents}
          />
        </div>
      )}
    </div>
  );
};

export default GroupDetails;