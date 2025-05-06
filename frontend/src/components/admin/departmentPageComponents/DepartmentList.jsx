import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ChevronDown, ChevronUp, Edit, BookOpen, Users, Trash2 } from 'lucide-react';
import { getDepartmentById, deleteDepartment } from '../../../app/features/departments/departmentThunks';
import DepartmentDetails from './DepartmentDetails';
// import DeleteConfirmationModal from '../common/DeleteConfirmationModal';

const DepartmentList = ({ 
  departments, 
  onEditDepartment, 
  currentTheme, 
  theme, 
  groupCounts, // Add this prop
  courseCounts, // Add this prop
  allGroups,    // Add this prop
  courses       // Add this prop
}) => {
  const dispatch = useDispatch();
  const [expandedDept, setExpandedDept] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  
  const toggleDeptExpansion = (deptId) => {
    if (expandedDept === deptId) {
      setExpandedDept(null);
    } else {
      setExpandedDept(deptId);
      dispatch(getDepartmentById(deptId));
    }
  };
  
  const handleDeleteDepartment = (dept) => {
    setDeleteConfirmation(dept);
  };
  
  const confirmDelete = () => {
    if (deleteConfirmation) {
      dispatch(deleteDepartment(deleteConfirmation._id));
      setDeleteConfirmation(null);
    }
  };

  if (departments.length === 0) {
    return (
      <div className={`${currentTheme.card} rounded-lg p-8 text-center mt-6`}>
        <p className={currentTheme.secondaryText}>No departments found. Create a department to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      {departments.map(dept => (
        <div key={dept._id} className={`${currentTheme.card} rounded-lg overflow-hidden border ${theme === 'dark' ? 'border-[#1E2733]' : 'border-gray-200'}`}>
          {/* Department Header */}
          <div className="flex justify-between items-center p-4">
            <div>
              <h3 className={`font-semibold ${currentTheme.text}`}>{dept.name}</h3>
              <p className={`${currentTheme.secondaryText} text-sm`}>{dept.description}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                className={`${theme === 'dark' ? 'hover:bg-[#1E2733]/50' : 'hover:bg-gray-100'} p-2 rounded-full transition-colors`}
                onClick={() => onEditDepartment(dept)}
                aria-label="Edit department"
              >
                <Edit size={16} className={currentTheme.secondaryText} />
              </button>
              
              <button
                className={`${theme === 'dark' ? 'hover:bg-[#1E2733]/50 text-red-400' : 'hover:bg-gray-100 text-red-600'} p-2 rounded-full transition-colors`}
                onClick={() => handleDeleteDepartment(dept)}
                aria-label="Delete department"
              >
                <Trash2 size={16} />
              </button>
              
              <button
                className={`${theme === 'dark' ? 'hover:bg-[#1E2733]/50' : 'hover:bg-gray-100'} p-2 rounded-full transition-colors`}
                onClick={() => toggleDeptExpansion(dept._id)}
                aria-label={expandedDept === dept._id ? "Collapse department" : "Expand department"}
              >
                {expandedDept === dept._id ? (
                  <ChevronUp size={16} className={currentTheme.secondaryText} />
                ) : (
                  <ChevronDown size={16} className={currentTheme.secondaryText} />
                )}
              </button>
            </div>
          </div>
          
          {/* Department Stats Row */}
          <div className={`px-4 py-2 border-t ${theme === 'dark' ? 'border-[#1E2733] bg-[#0A0E13]/30' : 'border-gray-100 bg-gray-50'} flex`}>
            <div className="flex items-center mr-6">
              <Users size={16} className={`${currentTheme.secondaryText} mr-2`} />
              <span className={currentTheme.text}>{groupCounts[dept._id] || 0} Groups</span>
            </div>
            <div className="flex items-center">
              <BookOpen size={16} className={`${currentTheme.secondaryText} mr-2`} />
              <span className={currentTheme.text}>{courseCounts[dept._id] || 0} Courses</span>
            </div>
          </div>
          
          {/* Expanded Details */}
          {expandedDept === dept._id && (
            <DepartmentDetails 
              departmentId={dept._id} 
              theme={theme} 
              currentTheme={currentTheme}
              departmentCourses={courses.filter(course => 
                course.department && course.department._id === dept._id
              )}
              departmentGroups={allGroups[dept._id] || []}
            />
          )}
        </div>
      ))}
      
      {/* Delete Confirmation Modal commented out in the original */}
    </div>
  );
};

export default DepartmentList;