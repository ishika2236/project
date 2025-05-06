
// CreateDepartmentModal.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createDepartment } from '../../../../app/features/departments/departmentThunks';
import { X } from 'lucide-react';

const CreateDepartmentModal = ({ onClose, currentTheme, theme }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: ''
  });
  const [errors, setErrors] = useState({});

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
      dispatch(createDepartment(formData))
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`${currentTheme.card} rounded-xl p-6 w-full max-w-lg mx-4`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`${currentTheme.text} text-xl font-semibold`}>Create Department</h3>
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
                placeholder="e.g., CS, EE, ME"
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
          
          <div className="flex justify-end space-x-3">
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
              Create Department
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDepartmentModal;