import React from 'react';
import CourseForm from '../CourseForm';

const EditCourseModal = ({ isOpen, onClose, onSubmit, formData, handleInputChange, colors, course, departments, teachers }) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${colors.card} rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto`}>
        <div className={`p-4 border-b border-gray-700 ${colors.cardHeader}`}>
          <h2 className={`text-xl font-bold ${colors.text}`}>Edit Course: {course.courseName}</h2>
        </div>
        
        <CourseForm 
          formData={formData}
          handleInputChange={handleInputChange}
          onSubmit={onSubmit}
          onCancel={onClose}
          colors={colors}
          isEditing={true}
          departments = {departments}
          teachers = {teachers}
        />
      </div>
    </div>
  );
};

export default EditCourseModal;
