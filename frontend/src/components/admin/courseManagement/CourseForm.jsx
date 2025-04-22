// CourseForm.js
import React from 'react';

const CourseForm = ({ formData, setFormData, onSubmit, onCancel, colors, isEditing }) => {

  return (
    <form onSubmit={onSubmit} className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={`block mb-1 ${colors.text}`}>Course Name</label>
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={setFormData}
            className={`w-full p-2 rounded-md bg-gray-800 border border-gray-700 ${colors.text}`}
            required
          />
        </div>
        
        <div>
          <label className={`block mb-1 ${colors.text}`}>Course Code</label>
          <input
            type="text"
            name="courseCode"
            value={formData.courseCode}
            onChange={setFormData}
            className={`w-full p-2 rounded-md bg-gray-800 border border-gray-700 ${colors.text}`}
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label className={`block mb-1 ${colors.text}`}>Course Description</label>
          <textarea
            name="courseDescription"
            value={formData.courseDescription}
            onChange={setFormData}
            className={`w-full p-2 rounded-md bg-gray-800 border border-gray-700 ${colors.text}`}
            rows="3"
     
          />
        </div>
        
        <div>
          <label className={`block mb-1 ${colors.text}`}>Course Coordinator</label>
          <input
            type="text"
            name="courseCoordinator"
            value={formData.courseCoordinator}
            onChange={setFormData}
            className={`w-full p-2 rounded-md bg-gray-800 border border-gray-700 ${colors.text}`}
          
          />
        </div>
        
        <div>
          <label className={`block mb-1 ${colors.text}`}>Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={setFormData}
            className={`w-full p-2 rounded-md bg-gray-800 border border-gray-700 ${colors.text}`}
            required
          />
        </div>
        
        <div>
          <label className={`block mb-1 ${colors.text}`}>Academic Year</label>
          <input
            type="text"
            name="academicYear"
            value={formData.academicYear}
            onChange={setFormData}
            className={`w-full p-2 rounded-md bg-gray-800 border border-gray-700 ${colors.text}`}
            required
          />
        </div>
        
        <div>
          <label className={`block mb-1 ${colors.text}`}>Semester</label>
          <select
            name="semester"
            value={formData.semester}
            onChange={setFormData}
            className={`w-full p-2 rounded-md bg-gray-800 border border-gray-700 ${colors.text}`}
            required
          >
            <option value="">Select Semester</option>
            <option value="Fall">Fall</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
          </select>
        </div>
        
        <div>
          <label className={`block mb-1 ${colors.text}`}>Credits</label>
          <input
            type="number"
            name="credits"
            value={formData.credits}
            onChange={setFormData}
            className={`w-full p-2 rounded-md bg-gray-800 border border-gray-700 ${colors.text}`}
            min="1"
            required
          />
        </div>
        
        <div>
          <label className={`block mb-1 ${colors.text}`}>Max Capacity</label>
          <input
            type="number"
            name="maxCapacity"
            value={formData.maxCapacity}
            onChange={setFormData}
            className={`w-full p-2 rounded-md bg-gray-800 border border-gray-700 ${colors.text}`}
            min="1"
            required
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={setFormData}
            className="mr-2"
          />
          <label className={colors.text}>Active Course</label>
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <button
          type="button"
          className="py-2 px-4 rounded-lg bg-gray-700 text-white hover:bg-gray-600 mr-2"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`py-2 px-4 rounded-lg ${colors.button.green}`}
        >
          {isEditing ? 'Save Changes' : 'Create Course'}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;