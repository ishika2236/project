import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeProvider';
import { Save, X } from 'lucide-react';

const GroupForm = ({ courses, isEditing, groupData, onSave, onCancel, teachers }) => {
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];

  // Simplified state management with default values
  const [formData, setFormData] = useState({
    name: '',
    courseId: '',
    courseName:'',
    teacherId: '',
    teacherName: ''
  });

  // Initialize form data based on editing state
  useEffect(() => {
    if (isEditing && groupData) {
      // When editing, explicitly extract values from groupData
      const selectedTeacher = teachers.find(t => t?.id?.toString() === groupData.teacherId?.toString());
      const selectedCourse = courses.find(c => c?.id?.toString() === groupData.courseId?.toString());

      setFormData({
        name: groupData.name || '',
        courseId: selectedCourse ? selectedCourse.id : '',
        teacherId: selectedTeacher ? selectedTeacher.id : '',
        teacherName: selectedTeacher ? 
          `${selectedTeacher.firstName} ${selectedTeacher.lastName}` : ''
      });
    } else {
      // Default to first options if available
      const defaultCourseId = courses.length > 0 ? courses[0].id : '';
      const defaultTeacherId = teachers.length > 0 ? teachers[0].id : '';
      
      setFormData({
        name: '',
        courseId: defaultCourseId,
        teacherId: defaultTeacherId,
        teacherName: teachers.length > 0 ? 
          `${teachers[0].firstName} ${teachers[0].lastName}` : ''
      });
    }
  }, [isEditing]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'teacherId') {
      // Find the selected teacher to get their name
      const selectedTeacher = teachers.find(t => `${t.firstName + " "+ t.lastName}`.toString() === value?.toString());
      setFormData({
        ...formData,
        teacherId: selectedTeacher._id,
        teacherName: value
      });
    } else if (name === 'courseId') {
      // console.log("courses: ", courses);
      // console.log(courses[0].courseName.toString() === value.toString());
      const selectedCourse = courses.find(c => c?.courseName?.toString() == value?.toString());
      // console.log(name + " "+ value + " "+ selectedCourse._id)

      setFormData({
        ...formData,
        courseId: selectedCourse ? selectedCourse._id : value,
        courseName: value,
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
      courseId: formData.courseId,
      teacherId: formData.teacherId,
      teacherName: formData.teacherName
    };
    console.log(submissionData)
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
            Course
          </label>
          <select
            name="courseId"
            required
            className={`w-full p-2 border rounded-md ${getSelectBgClass()} ${colors.text} border-gray-600`}
            value={formData.courseName}
            onChange={handleChange}
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className={`block text-sm font-medium mb-1 ${colors.text}`}>
            Assign Teacher
          </label>
          <select
            name="teacherId"
            required
            className={`w-full p-2 border rounded-md ${getSelectBgClass()} ${colors.text} border-gray-600`}
            value={formData.teacherName}
            onChange={handleChange}
          >
            <option value="">Assign a teacher</option>
            {teachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {`${teacher.firstName} ${teacher.lastName}`}
              </option>
            ))}
          </select>
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