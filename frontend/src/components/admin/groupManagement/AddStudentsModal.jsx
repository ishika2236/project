import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeProvider';
import { Search, X, UserPlus, Check } from 'lucide-react';

const AddStudentsModal = ({ 
  isOpen, 
  onClose, 
  onAddStudents, 
  allStudents, 
  currentStudentIds = [],
  isLoading = false
}) => {
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Set up available students whenever the modal opens or allStudents/currentStudentIds change
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      
      console.log("students in add modal: ", allStudents);
      // Make sure allStudents is an array before filtering
      const studentsArray = Array.isArray(allStudents) ? allStudents : [];
      
      // Filter out students already in the group
      const filtered = studentsArray.filter(student => 
        !currentStudentIds.includes(student._id || student.id)
      );
      
      setAvailableStudents(filtered);
      setLoading(false);
    }
  }, [isOpen, allStudents, currentStudentIds])
  
  // Reset selected students when the modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedStudents([]);
      setSearchQuery('');
    }
  }, [isOpen]);
  
  // Filter students based on search query
  const filteredStudents = availableStudents.filter(student => {
    const query = searchQuery.toLowerCase();
    return (
      (student.firstName?.toLowerCase() + ' ' + student.lastName?.toLowerCase()).includes(query) ||
      student.email?.toLowerCase().includes(query) || 
      student.studentId?.toLowerCase().includes(query)
    );
  });
  
  const toggleStudentSelection = (student) => {
    setSelectedStudents(prev => {
      const isSelected = prev.some(s => (s._id || s.id) === (student._id || student.id));
      if (isSelected) {
        return prev.filter(s => (s._id || s.id) !== (student._id || student.id));
      } else {
        return [...prev, student];
      }
    });
  };
  
  const handleAddStudents = () => {
    onAddStudents(selectedStudents);
    onClose();
  };
  
  const handleCancel = () => {
    setSelectedStudents([]);
    setSearchQuery('');
    onClose();
  };
  
  if (!isOpen) return null;
  
  // Format student name function
  const formatStudentName = (student) => {
    if (student.firstName && student.lastName) {
      return `${student.firstName} ${student.lastName}`;
    }
    return student.name || 'Unknown Student';
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity" 
          aria-hidden="true"
          onClick={handleCancel}
        >
          <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black' : 'bg-gray-500'} opacity-75`}></div>
        </div>
        
        {/* Modal */}
        <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h3 className={`text-lg font-medium ${colors.text}`}>Add Students to Group</h3>
            <button 
              onClick={handleCancel}
              className={`${colors.secondaryText} hover:text-white p-1 rounded-full`}
              disabled={isLoading}
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-4">
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, email or student ID..."
                  className={`w-full p-2 pl-8 border rounded-md ${theme === 'dark' ? 'bg-transparent' : colors.background} ${colors.text} ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={isLoading}
                />
                <Search size={16} className={`absolute left-2 top-3 ${colors.icon}`} />
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className={`${colors.text} animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500`}></div>
              </div>
            ) : (
              <div className={`max-h-60 overflow-y-auto ${filteredStudents.length === 0 && 'py-8'}`}>
                {filteredStudents.length === 0 ? (
                  <p className={`text-center ${colors.secondaryText}`}>
                    {searchQuery ? 'No matching students found' : 'No students available to add'}
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-700">
                    {filteredStudents.map(student => (
                      <li 
                        key={student._id || student.id}
                        className={`p-3 flex items-center justify-between cursor-pointer ${
                          selectedStudents.some(s => (s._id || s.id) === (student._id || student.id)) ? 
                            (theme === 'dark' ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50') : 
                            'hover:bg-opacity-10 hover:bg-blue-500'
                        }`}
                        onClick={() => toggleStudentSelection(student)}
                      >
                        <div className="flex flex-col">
                          <span className={colors.text}>{formatStudentName(student)}</span>
                          <span className={`text-sm ${colors.secondaryText}`}>
                            {student.email} {student.studentId && `• ID: ${student.studentId}`}
                          </span>
                        </div>
                        <div className={`w-6 h-6 rounded-full border ${
                          selectedStudents.some(s => (s._id || s.id) === (student._id || student.id)) ? 
                            'bg-blue-500 border-blue-500' : 
                            theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                        } flex items-center justify-center`}>
                          {selectedStudents.some(s => (s._id || s.id) === (student._id || student.id)) && (
                            <Check size={14} className="text-white" />
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            
            <div className="mt-4 bg-opacity-10 p-2 rounded-md">
              <div className={`${colors.secondaryText} text-sm mb-2`}>
                Selected Students ({selectedStudents.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedStudents.length === 0 ? (
                  <span className={`${colors.secondaryText} text-sm italic`}>
                    No students selected
                  </span>
                ) : (
                  selectedStudents.map(student => (
                    <div 
                      key={student._id || student.id}
                      className={`${colors.button.primary} text-sm px-2 py-1 rounded-full flex items-center`}
                    >
                      {formatStudentName(student)}
                      <button 
                        className="ml-1 focus:outline-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStudentSelection(student);
                        }}
                        disabled={isLoading}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-opacity-10 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className={`${colors.button.primary} w-full inline-flex justify-center rounded-md px-4 py-2 sm:ml-3 sm:w-auto sm:text-sm`}
              onClick={handleAddStudents}
              disabled={selectedStudents.length === 0 || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus size={16} className="mr-2" />
                  Add {selectedStudents.length} {selectedStudents.length === 1 ? 'Student' : 'Students'}
                </>
              )}
            </button>
            <button
              type="button"
              className={`mt-3 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${colors.text} w-full inline-flex justify-center rounded-md px-4 py-2 sm:mt-0 sm:w-auto sm:text-sm`}
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentsModal;