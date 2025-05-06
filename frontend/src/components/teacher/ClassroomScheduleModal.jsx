import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, Clock, X, Check, MapPin, Users, Book } from 'lucide-react';
import { useTheme } from '../../context/ThemeProvider';
import { 
  addClassSchedule, 
  updateClassSchedule, 
  deleteClassSchedule 
} from '../../app/features/class/classThunks';

export default function ClassroomScheduleModal({ isOpen, onClose, mode = 'create', classData, onSave, classroom }) {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Get the current classroom data from props or redux state
  
  const currentClass = classroom
  console.log(currentClass)
  
  // Form state
  const [formData, setFormData] = useState({
    topic: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    materials: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { error, success, loading } = useSelector(state => state.classes);

  // Set initial form data when editing
  useEffect(() => {
    if (mode === 'edit' && classData) {
      setFormData({
        topic: classData.topic || '',
        date: formatDateForInput(classData.date) || '',
        startTime: classData.time?.split(' - ')[0] || '',
        endTime: classData.time?.split(' - ')[1] || '',
        location: classData.location || '',
        description: classData.description || '',
        materials: classData.materials || []
      });
    } else {
      // Reset form when opening for create
      setFormData({
        topic: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        description: '',
        materials: []
      });
    }
  }, [mode, classData, isOpen]);

  // Format date from "Month DD, YYYY" to YYYY-MM-DD for input field
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Format time for consistent display
    const formattedData = {
      ...formData,
      time: `${formData.startTime} - ${formData.endTime}`,
      course: classroom?.courseDetails?._id || classroom?.id,
      group: classroom?.relatedGroups?.length > 0 ? classroom.relatedGroups[0]._id : undefined
    };
    
    try {
      if (mode === 'create') {
        // Dispatch create action
        await dispatch(addClassSchedule({
          classId: classroom?.id || classroom?._id,
          scheduleData: formattedData
        }));
      } else if (mode === 'edit') {
        // Dispatch update action
        await dispatch(updateClassSchedule({
          classId: classroom?.id || classroom?._id,
          scheduleId: classData?.id,
          scheduleData: formattedData
        }));
      }
      
      // Call the onSave callback with the formData
      onSave(formattedData);
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error("Error saving schedule:", err);
      setIsSubmitting(false);
    }
  };

  // Handle class cancellation/deletion
  const handleDeleteClass = async () => {
    if (window.confirm("Are you sure you want to cancel this class?")) {
      setIsSubmitting(true);
      try {
        await dispatch(deleteClassSchedule({
          classId: classroom?.id || classroom?._id,
          scheduleId: classData?.id
        }));
        setIsSubmitting(false);
        onClose();
      } catch (err) {
        console.error("Error deleting schedule:", err);
        setIsSubmitting(false);
      }
    }
  };

  // Handle adding a material
  const [newMaterial, setNewMaterial] = useState('');
  
  const addMaterial = () => {
    if (newMaterial.trim()) {
      setFormData({
        ...formData,
        materials: [...formData.materials, newMaterial]
      });
      setNewMaterial('');
    }
  };

  // Handle removing a material
  const removeMaterial = (index) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter((_, i) => i !== index)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${
        isDark 
          ? 'bg-gradient-to-br from-[#121A22] to-[#0A0E13] border border-[#1E2733]' 
          : 'bg-white border border-indigo-100'
      }`}>
        {/* Header */}
        <div className={`p-6 border-b ${isDark ? 'border-[#1E2733]' : 'border-indigo-100'}`}>
          <div className="flex justify-between items-center">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-indigo-900'}`}>
              {mode === 'create' ? 'Schedule New Class' : 'Edit Class Schedule'}
            </h2>
            <button 
              onClick={onClose}
              className={`p-2 rounded-full ${
                isDark 
                  ? 'hover:bg-[#1E2733] text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-500'
              } transition-colors`}
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Course and Group Info - Read Only */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label 
                  className={`block mb-2 text-sm font-medium ${isDark ? 'text-[#5E6E82]' : 'text-indigo-700'}`}
                >
                  Course
                </label>
                <div className={`p-3 rounded-lg border ${
                  isDark ? 'border-[#1E2733] bg-[#0A0E13] text-gray-400' : 'border-indigo-200 bg-gray-50 text-gray-700'
                }`}>
                  {classroom?.courseName || classroom?.courseDetails?.name || "Not specified"}
                </div>
              </div>
              
              <div>
                <label 
                  className={`block mb-2 text-sm font-medium ${isDark ? 'text-[#5E6E82]' : 'text-indigo-700'}`}
                >
                  Group
                </label>
                <div className={`p-3 rounded-lg border ${
                  isDark ? 'border-[#1E2733] bg-[#0A0E13] text-gray-400' : 'border-indigo-200 bg-gray-50 text-gray-700'
                }`}>
                  {classroom?.groupName || (classroom?.relatedGroups?.length > 0 ? classroom.relatedGroups[0].name : "Unassigned")}
                </div>
              </div>
            </div>
            
            {/* Topic */}
            <div>
              <label 
                htmlFor="topic" 
                className={`block mb-2 text-sm font-medium ${isDark ? 'text-[#5E6E82]' : 'text-indigo-700'}`}
              >
                Topic*
              </label>
              <div className={`flex items-center rounded-lg border ${isDark ? 'border-[#1E2733] bg-[#0A0E13]' : 'border-indigo-200 bg-white'}`}>
                <span className={`px-3 ${isDark ? 'text-[#506EE5]' : 'text-indigo-500'}`}>
                  <Book size={18} />
                </span>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  required
                  className={`w-full p-3 rounded-lg rounded-l-none ${
                    isDark 
                      ? 'bg-[#0A0E13] text-white focus:ring-1 focus:ring-[#506EE5] border-0' 
                      : 'bg-white text-indigo-900 focus:ring-1 focus:ring-indigo-500 border-0'
                  } outline-none`}
                  placeholder="Class topic or title"
                />
              </div>
            </div>
            
            {/* Date and Time Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date */}
              <div>
                <label 
                  htmlFor="date" 
                  className={`block mb-2 text-sm font-medium ${isDark ? 'text-[#5E6E82]' : 'text-indigo-700'}`}
                >
                  Date*
                </label>
                <div className={`flex items-center rounded-lg border ${isDark ? 'border-[#1E2733] bg-[#0A0E13]' : 'border-indigo-200 bg-white'}`}>
                  <span className={`px-3 ${isDark ? 'text-[#506EE5]' : 'text-indigo-500'}`}>
                    <Calendar size={18} />
                  </span>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className={`w-full p-3 rounded-lg rounded-l-none ${
                      isDark 
                        ? 'bg-[#0A0E13] text-white focus:ring-1 focus:ring-[#506EE5] border-0' 
                        : 'bg-white text-indigo-900 focus:ring-1 focus:ring-indigo-500 border-0'
                    } outline-none`}
                  />
                </div>
              </div>
              
              {/* Start Time */}
              <div>
                <label 
                  htmlFor="startTime" 
                  className={`block mb-2 text-sm font-medium ${isDark ? 'text-[#5E6E82]' : 'text-indigo-700'}`}
                >
                  Start Time*
                </label>
                <div className={`flex items-center rounded-lg border ${isDark ? 'border-[#1E2733] bg-[#0A0E13]' : 'border-indigo-200 bg-white'}`}>
                  <span className={`px-3 ${isDark ? 'text-[#506EE5]' : 'text-indigo-500'}`}>
                    <Clock size={18} />
                  </span>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className={`w-full p-3 rounded-lg rounded-l-none ${
                      isDark 
                        ? 'bg-[#0A0E13] text-white focus:ring-1 focus:ring-[#506EE5] border-0' 
                        : 'bg-white text-indigo-900 focus:ring-1 focus:ring-indigo-500 border-0'
                    } outline-none`}
                  />
                </div>
              </div>
              
              {/* End Time */}
              <div>
                <label 
                  htmlFor="endTime" 
                  className={`block mb-2 text-sm font-medium ${isDark ? 'text-[#5E6E82]' : 'text-indigo-700'}`}
                >
                  End Time*
                </label>
                <div className={`flex items-center rounded-lg border ${isDark ? 'border-[#1E2733] bg-[#0A0E13]' : 'border-indigo-200 bg-white'}`}>
                  <span className={`px-3 ${isDark ? 'text-[#506EE5]' : 'text-indigo-500'}`}>
                    <Clock size={18} />
                  </span>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className={`w-full p-3 rounded-lg rounded-l-none ${
                      isDark 
                        ? 'bg-[#0A0E13] text-white focus:ring-1 focus:ring-[#506EE5] border-0' 
                        : 'bg-white text-indigo-900 focus:ring-1 focus:ring-indigo-500 border-0'
                    } outline-none`}
                  />
                </div>
              </div>
            </div>
            
            {/* Location */}
            <div>
              <label 
                htmlFor="location" 
                className={`block mb-2 text-sm font-medium ${isDark ? 'text-[#5E6E82]' : 'text-indigo-700'}`}
              >
                Location
              </label>
              <div className={`flex items-center rounded-lg border ${isDark ? 'border-[#1E2733] bg-[#0A0E13]' : 'border-indigo-200 bg-white'}`}>
                <span className={`px-3 ${isDark ? 'text-[#506EE5]' : 'text-indigo-500'}`}>
                  <MapPin size={18} />
                </span>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg rounded-l-none ${
                    isDark 
                      ? 'bg-[#0A0E13] text-white focus:ring-1 focus:ring-[#506EE5] border-0' 
                      : 'bg-white text-indigo-900 focus:ring-1 focus:ring-indigo-500 border-0'
                  } outline-none`}
                  placeholder="Room number or location"
                />
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label 
                htmlFor="description" 
                className={`block mb-2 text-sm font-medium ${isDark ? 'text-[#5E6E82]' : 'text-indigo-700'}`}
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className={`w-full p-3 rounded-lg ${
                  isDark 
                    ? 'bg-[#0A0E13] text-white focus:ring-1 focus:ring-[#506EE5] border border-[#1E2733]' 
                    : 'bg-white text-indigo-900 focus:ring-1 focus:ring-indigo-500 border border-indigo-200'
                } outline-none`}
                placeholder="Describe what will be covered in this class..."
              ></textarea>
            </div>
            
            {/* Materials */}
            <div>
              <label 
                className={`block mb-2 text-sm font-medium ${isDark ? 'text-[#5E6E82]' : 'text-indigo-700'}`}
              >
                Required Materials
              </label>
              
              <div className="flex mb-2">
                <input
                  type="text"
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  className={`flex-1 p-2 rounded-l-lg ${
                    isDark 
                      ? 'bg-[#0A0E13] text-white border border-[#1E2733]' 
                      : 'bg-white text-indigo-900 border border-indigo-200'
                  } outline-none`}
                  placeholder="Add materials students should bring..."
                />
                <button
                  type="button"
                  onClick={addMaterial}
                  className={`px-4 py-2 rounded-r-lg ${
                    isDark 
                      ? 'bg-[#1E2733] text-[#506EE5] hover:bg-[#1E2733]/80' 
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  }`}
                >
                  Add
                </button>
              </div>
              
              {/* Materials List */}
              {formData.materials.length > 0 && (
                <div className={`mt-2 p-3 rounded-lg ${
                  isDark ? 'bg-[#121A22] border border-[#1E2733]' : 'bg-indigo-50 border border-indigo-100'
                }`}>
                  <ul className="space-y-1">
                    {formData.materials.map((material, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span className={isDark ? 'text-white' : 'text-indigo-700'}>{material}</span>
                        <button
                          type="button"
                          onClick={() => removeMaterial(index)}
                          className={`p-1 rounded-full ${
                            isDark ? 'hover:bg-[#1E2733] text-[#F2683C]' : 'hover:bg-red-100 text-red-500'
                          }`}
                        >
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Error message */}
            {error && (
              <div className={`p-3 rounded-lg ${isDark ? 'bg-[#251A1A] text-red-400' : 'bg-red-50 text-red-600'}`}>
                {error}
              </div>
            )}
          </div>
          
          {/* Footer with Actions */}
          <div className="mt-8 flex justify-between">
            {/* Delete button (only for edit mode) */}
            {mode === 'edit' && (
              <button
                type="button"
                onClick={handleDeleteClass}
                disabled={isSubmitting || loading}
                className={`px-4 py-2 rounded-lg ${
                  isDark 
                    ? 'bg-[#251A1A] text-red-400 hover:bg-[#251A1A]/80' 
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                } transition-colors`}
              >
                Cancel Class
              </button>
            )}
            
            <div className="flex space-x-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting || loading}
                className={`px-4 py-2 rounded-lg ${
                  isDark 
                    ? 'bg-[#121A22] text-white border border-[#1E2733] hover:bg-[#1E2733]' 
                    : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50'
                } transition-colors`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  isDark 
                    ? 'bg-gradient-to-r from-[#506EE5]/60 to-[#1D2229] border border-[#1E4FFF]/30' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                } text-white shadow-md hover:shadow-lg transition-all ${(isSubmitting || loading) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting || loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                ) : (
                  <Check size={18} className="mr-2" />
                )}
                {mode === 'create' ? 'Schedule Class' : 'Update Class'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}