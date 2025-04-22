import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import CourseForm from '../CourseForm';

const EditCourseModal = ({ isOpen, course, onClose, onSubmit, formData, handleInputChange, colors }) => {
  // If modal isn't open or no course is selected, don't render anything
  if (!isOpen || !course) return null;
  
  // Use form submission with preventDefault to avoid page reloads
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${colors.card} rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className={`text-xl font-semibold ${colors.gradient.text}`}>Edit Course</h2>
          <button 
            className={`${colors.icon} hover:text-gray-400`}
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <CourseForm
          formData={formData}
          setFormData={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={onClose}
          colors={colors}
          isEditing={true}
        />
      </div>
    </div>
  );
};

export default EditCourseModal;