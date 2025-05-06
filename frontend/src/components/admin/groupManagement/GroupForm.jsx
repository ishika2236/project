import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeProvider';
import { Save, X } from 'lucide-react';

const GroupForm = ({ departments, isEditing, groupData, onSave, onCancel, teachers }) => {
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];

  // Simplified state management with default values
  const [formData, setFormData] = useState({
    name: '',
    departmentId: '',
    departmentName: '',
    mentorId: '',
    mentorName: '',
    maxCapacity: 100,
    description: ''
  });

  // Initialize form data based on editing state
  useEffect(() => {
    if (isEditing && groupData) {
      // When editing, explicitly extract values from groupData
      const selectedMentor = teachers.find(t => t?._id?.toString() === groupData.mentor?._id?.toString());
      const selectedDepartment = departments.find(d => d?._id?.toString() === groupData.department?._id?.toString());

      setFormData({
        name: groupData.name || '',
        departmentId: selectedDepartment ? selectedDepartment._id : '',
        departmentName: selectedDepartment ? selectedDepartment.name : '',
        mentorId: selectedMentor ? selectedMentor._id : '',
        mentorName: selectedMentor ? 
          `${selectedMentor.firstName} ${selectedMentor.lastName}` : '',
        maxCapacity: groupData.maxCapacity || 100,
        description: groupData.description || ''
      });
    } else {
      // Default to first options if available
      const defaultDepartmentId = departments.length > 0 ? departments[0]._id : '';
      const defaultMentorId = teachers.length > 0 ? teachers[0]._id : '';
      
      setFormData({
        name: '',
        departmentId: defaultDepartmentId,
        departmentName: departments.length > 0 ? departments[0].name : '',
        mentorId: defaultMentorId,
        mentorName: teachers.length > 0 ? 
          `${teachers[0].firstName} ${teachers[0].lastName}` : '',
        maxCapacity: 100,
        description: ''
      });
    }
  }, [isEditing, groupData, departments, teachers]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'mentorId') {
      // Find the selected teacher to get their name
      const selectedTeacher = teachers.find(t => t._id.toString() === value.toString());
      setFormData({
        ...formData,
        mentorId: value,
        mentorName: selectedTeacher ? `${selectedTeacher.firstName} ${selectedTeacher.lastName}` : ''
      });
    } else if (name === 'departmentId') {
      const selectedDepartment = departments.find(d => d._id.toString() === value.toString());
      setFormData({
        ...formData,
        departmentId: value,
        departmentName: selectedDepartment ? selectedDepartment.name : '',
      });
    } else {
      // For other fields, just update the value directly
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ensure we submit the form data with proper values
    const submissionData = {
      name: formData.name,
      departmentId: formData.departmentId,
      mentorId: formData.mentorId,
      maxCapacity: parseInt(formData.maxCapacity),
      description: formData.description
    };
    
    onSave(submissionData);
  };

  // Get background class based on theme
  const getSelectBgClass = () => {
    return theme === 'dark' ? 'bg-neutral-900' : 'bg-white';
  };

  return (
    <div className={`${colors.card} rounded-lg p-6`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-semibold ${colors.text}`}>
          {isEditing ? 'Edit Group' : 'Create New Group'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 rounded-full hover:bg-gray-700"
        >
          <X size={18} className={colors.secondaryText} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-1 ${colors.text}`}>
            Group Name
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="Enter group name"
            className={`w-full p-2 border rounded-md bg-transparent ${colors.text} border-gray-600`}
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className={`block text-sm font-medium mb-1 ${colors.text}`}>
            Department
          </label>
          <select
            name="departmentId"
            required
            className={`w-full p-2 border rounded-md ${getSelectBgClass()} ${colors.text} border-gray-600`}
            value={formData.departmentId}
            onChange={handleChange}
          >
            <option value="">Select a department</option>
            {departments.map(department => (
              <option key={department._id} value={department._id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className={`block text-sm font-medium mb-1 ${colors.text}`}>
            Assign Mentor (Teacher)
          </label>
          <select
            name="mentorId"
            className={`w-full p-2 border rounded-md ${getSelectBgClass()} ${colors.text} border-gray-600`}
            value={formData.mentorId}
            onChange={handleChange}
          >
            <option value="">Assign a mentor (optional)</option>
            {teachers.map(teacher => (
              <option key={teacher._id} value={teacher._id}>
                {`${teacher.firstName} ${teacher.lastName}`}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className={`block text-sm font-medium mb-1 ${colors.text}`}>
            Max Capacity
          </label>
          <input
            type="number"
            name="maxCapacity"
            min="1"
            required
            placeholder="Enter maximum capacity"
            className={`w-full p-2 border rounded-md bg-transparent ${colors.text} border-gray-600`}
            value={formData.maxCapacity}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label className={`block text-sm font-medium mb-1 ${colors.text}`}>
            Description
          </label>
          <textarea
            name="description"
            placeholder="Enter group description"
            className={`w-full p-2 border rounded-md bg-transparent ${colors.text} border-gray-600`}
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2 border border-gray-600 rounded-md ${colors.secondaryText}`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`${colors.button.primary} px-4 py-2 rounded-md flex items-center`}
          >
            <Save size={16} className="mr-2" />
            {isEditing ? 'Update Group' : 'Create Group'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupForm;