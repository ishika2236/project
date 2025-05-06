import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateDepartment, deleteDepartment} from '../../../../app/features/departments/departmentThunks';
import { X, AlertTriangle } from 'lucide-react';

const EditDepartmentModal = ({ department, onClose, currentTheme, theme }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: ''
  });
  const [errors, setErrors] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || '',
        description: department.description || '',
        code: department.code || ''
      });
    }
  }, [department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Department name is required';
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'Department code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      dispatch(updateDepartment({
        id: department._id,
        departmentData: formData
      }))
        .unwrap()
        .then(() => {
          onClose();
        })
        .catch((error) => {
          // Handle API errors if needed
          if (error.includes('name')) {
            setErrors(prev => ({ ...prev, name: error }));
          } else if (error.includes('code')) {
            setErrors(prev => ({ ...prev, code: error }));
          }
        });
    }
  };

  const handleDelete = () => {
    dispatch(deleteDepartment(department._id))
      .unwrap()
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error('Error deleting department:', error);
      });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`${currentTheme.card} rounded-xl p-6 w-full max-w-lg mx-4`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`${currentTheme.text} text-xl font-semibold`}>Edit Department</h3>
          <button 
            className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-[#1E2733]/50' : 'hover:bg-gray-100'}`}
            onClick={onClose}
          >
            <X size={20} className={currentTheme.secondaryText} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <div>
              <label className={`block ${currentTheme.secondaryText} mb-2`}>Department Name*</label>
              <input
                type="text"
                name="name"
                className={`w-full px-3 py-2 rounded-md ${theme === 'dark' ? 'bg-[#0A0E13] border-[#1E2733]' : 'bg-white border-gray-300'} border ${currentTheme.text} ${errors.name ? 'border-red-500' : ''}`}
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className={`block ${currentTheme.secondaryText} mb-2`}>Department Code*</label>
              <input
                type="text"
                name="code"
                className={`w-full px-3 py-2 rounded-md ${theme === 'dark' ? 'bg-[#0A0E13] border-[#1E2733]' : 'bg-white border-gray-300'} border ${currentTheme.text} ${errors.code ? 'border-red-500' : ''}`}
                value={formData.code}
                onChange={handleChange}
              />
              {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
            </div>
            
            <div>
              <label className={`block ${currentTheme.secondaryText} mb-2`}>Description</label>
              <textarea
                name="description"
                rows="3"
                className={`w-full px-3 py-2 rounded-md ${theme === 'dark' ? 'bg-[#0A0E13] border-[#1E2733]' : 'bg-white border-gray-300'} border ${currentTheme.text}`}
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="flex justify-between">
            <button 
              type="button"
              className={`${theme === 'dark' ? 'bg-red-900/30 text-red-400 border border-red-900/50' : 'bg-red-100 text-red-600 border border-red-200'} px-4 py-2 rounded-lg`}
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Department
            </button>
            
            <div className="flex space-x-3">
              <button 
                type="button"
                className={`${theme === 'dark' ? 'bg-[#1A1A1A] text-white border border-[#333]' : 'bg-gray-200 text-gray-700'} px-4 py-2 rounded-lg`}
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className={`${currentTheme.button?.green || 'bg-green-600 text-white'} px-4 py-2 rounded-lg`}
              >
                Update Department
              </button>
            </div>
          </div>
        </form>
        
        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className={`${currentTheme.card} rounded-xl p-6 w-full max-w-md`}>
              <div className="flex items-center mb-4">
                <AlertTriangle size={24} className="text-red-500 mr-3" />
                <h3 className={`${currentTheme.text} text-lg font-semibold`}>Confirm Deletion</h3>
              </div>
              
              <p className={`${currentTheme.secondaryText} mb-6`}>
                Are you sure you want to delete the department <span className="font-semibold">{department.name}</span>? This action cannot be undone and will remove all associated data.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button 
                  className={`${theme === 'dark' ? 'bg-[#1A1A1A] text-white border border-[#333]' : 'bg-gray-200 text-gray-700'} px-4 py-2 rounded-lg`}
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button 
                  className={`bg-red-600 text-white px-4 py-2 rounded-lg`}
                  onClick={handleDelete}
                >
                  Delete Department
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditDepartmentModal;