import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ClassSchedulingModal = ({ isDark, currentTheme, classroom, onClose, onSave, classToEdit }) => {
    const [formData, setFormData] = useState({
      title: '',
      isExtraClass: false,
      course: '',
      department: '',
      groups: [],
      teacher: '',
      schedule: {
        startDate: '',
        endDate: '',
        daysOfWeek: [],
        startTime: '',
        endTime: ''
      },
      extraClassDate: '',
      topics: [],
      notes: '',
      specialRequirements: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [newTopic, setNewTopic] = useState('');
    const [formErrors, setFormErrors] = useState({});
  
    // Days of week options
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
    useEffect(() => {
      // If editing, populate form with class data
      if (classToEdit) {
        setFormData({
          ...classToEdit,
          // Use classroom data directly instead of offering selection
          course: classroom?.courseDetails?._id || '',
          department: classroom?.departmentDetails?._id || '',
          teacher: classroom?.teacherDetails?._id || '',
          groups: classroom?.groupDetails?._id ? [classroom.groupDetails._id] : [],
        });
      } else {
        // For new class, pre-fill with classroom data
        setFormData({
          ...formData,
          course: classroom?.courseDetails?._id || '',
          department: classroom?.departmentDetails?._id || '',
          teacher: classroom?.teacherDetails?._id || '',
          groups: classroom?.groupDetails?._id ? [classroom.groupDetails._id] : [],
        });
      }
    }, [classToEdit, classroom]);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      
      if (name.includes('.')) {
        // Handle nested object properties (like schedule.startTime)
        const [parent, child] = name.split('.');
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: value
          }
        });
      } else {
        // Handle top-level properties
        setFormData({ ...formData, [name]: value });
      }
      
      // Clear any error for this field
      if (formErrors[name]) {
        setFormErrors({ ...formErrors, [name]: null });
      }
    };
  
    const handleCheckboxChange = (e) => {
      const { name, checked } = e.target;
      setFormData({ ...formData, [name]: checked });
    };
  
    const handleDayToggle = (day) => {
      const currentDays = [...formData.schedule.daysOfWeek];
      if (currentDays.includes(day)) {
        setFormData({
          ...formData,
          schedule: {
            ...formData.schedule,
            daysOfWeek: currentDays.filter(d => d !== day)
          }
        });
      } else {
        setFormData({
          ...formData,
          schedule: {
            ...formData.schedule,
            daysOfWeek: [...currentDays, day]
          }
        });
      }
    };
  
    const addTopic = () => {
      if (newTopic.trim()) {
        setFormData({
          ...formData,
          topics: [...formData.topics, newTopic.trim()]
        });
        setNewTopic('');
      }
    };
  
    const removeTopic = (index) => {
      const updatedTopics = [...formData.topics];
      updatedTopics.splice(index, 1);
      setFormData({ ...formData, topics: updatedTopics });
    };
  
    const validateForm = () => {
      const errors = {};
      
      if (!formData.title) errors.title = 'Title is required';
      
      if (formData.isExtraClass) {
        if (!formData.extraClassDate) errors.extraClassDate = 'Date is required for extra class';
      } else {
        if (!formData.schedule.startDate) errors['schedule.startDate'] = 'Start date is required';
        if (!formData.schedule.endDate) errors['schedule.endDate'] = 'End date is required';
        if (formData.schedule.daysOfWeek.length === 0) errors.daysOfWeek = 'Select at least one day';
      }
      
      if (!formData.schedule.startTime) errors['schedule.startTime'] = 'Start time is required';
      if (!formData.schedule.endTime) errors['schedule.endTime'] = 'End time is required';
      
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) return;
      
      setLoading(true);
      try {
        // Mock successful response
        await new Promise(resolve => setTimeout(resolve, 800));
        
        onSave({
          ...formData,
          _id: classToEdit?._id || Date.now().toString()
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error saving class:', error);
        setLoading(false);
      }
    };
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div 
          className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl ${
            isDark 
              ? 'bg-[#0F1419] border border-[#1E2733]' 
              : 'bg-white'
          }`}
        >
          <div className={`p-4 border-b ${isDark ? 'border-[#1E2733]' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {classToEdit ? 'Edit Class' : 'Schedule New Class'}
              </h3>
              <button 
                onClick={onClose}
                className={`p-2 rounded-full ${
                  isDark 
                    ? 'hover:bg-[#1E2733] text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Class Type */}
            <div className="flex items-center gap-4">
              <label className={`font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>
                Class Type:
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="radio" 
                  id="regularClass" 
                  name="isExtraClass" 
                  checked={!formData.isExtraClass} 
                  onChange={() => setFormData({ ...formData, isExtraClass: false })}
                  className="w-4 h-4"
                />
                <label 
                  htmlFor="regularClass" 
                  className={isDark ? 'text-gray-300' : 'text-gray-700'}
                >
                  Regular Class
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="radio" 
                  id="extraClass" 
                  name="isExtraClass" 
                  checked={formData.isExtraClass} 
                  onChange={() => setFormData({ ...formData, isExtraClass: true })}
                  className="w-4 h-4"
                />
                <label 
                  htmlFor="extraClass" 
                  className={isDark ? 'text-gray-300' : 'text-gray-700'}
                >
                  Extra Class
                </label>
              </div>
            </div>
            
            {/* Basic Information */}
            <div>
              <label 
                className={`block mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Title*
              </label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange}
                className={`w-full p-2 rounded-lg border ${
                  isDark 
                    ? 'bg-[#1E2733] border-[#304050] text-white focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:border-indigo-500'
                } outline-none transition`}
                placeholder="Class Title"
              />
              {formErrors.title && (
                <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
              )}
            </div>
            
            {/* Schedule */}
            <div>
              <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Schedule
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.isExtraClass ? (
                  <div>
                    <label 
                      className={`block mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      Date*
                    </label>
                    <input 
                      type="date" 
                      name="extraClassDate" 
                      value={formData.extraClassDate} 
                      onChange={handleInputChange}
                      className={`w-full p-2 rounded-lg border ${
                        isDark 
                          ? 'bg-[#1E2733] border-[#304050] text-white focus:border-blue-500' 
                          : 'bg-white border-gray-300 focus:border-indigo-500'
                      } outline-none transition`}
                    />
                    {formErrors.extraClassDate && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.extraClassDate}</p>
                    )}
                  </div>
                ) : (
                  <>
                    <div>
                      <label 
                        className={`block mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        Start Date*
                      </label>
                      <input 
                        type="date" 
                        name="schedule.startDate" 
                        value={formData.schedule.startDate} 
                        onChange={handleInputChange}
                        className={`w-full p-2 rounded-lg border ${
                          isDark 
                            ? 'bg-[#1E2733] border-[#304050] text-white focus:border-blue-500' 
                            : 'bg-white border-gray-300 focus:border-indigo-500'
                        } outline-none transition`}
                      />
                      {formErrors['schedule.startDate'] && (
                        <p className="mt-1 text-sm text-red-500">{formErrors['schedule.startDate']}</p>
                      )}
                    </div>
                    
                    <div>
                      <label 
                        className={`block mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        End Date*
                      </label>
                      <input 
                        type="date" 
                        name="schedule.endDate" 
                        value={formData.schedule.endDate} 
                        onChange={handleInputChange}
                        className={`w-full p-2 rounded-lg border ${
                          isDark 
                            ? 'bg-[#1E2733] border-[#304050] text-white focus:border-blue-500' 
                            : 'bg-white border-gray-300 focus:border-indigo-500'
                        } outline-none transition`}
                      />
                      {formErrors['schedule.endDate'] && (
                        <p className="mt-1 text-sm text-red-500">{formErrors['schedule.endDate']}</p>
                      )}
                    </div>
                  </>
                )}
                
                <div>
                  <label 
                    className={`block mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Start Time*
                  </label>
                  <input 
                    type="time" 
                    name="schedule.startTime" 
                    value={formData.schedule.startTime} 
                    onChange={handleInputChange}
                    className={`w-full p-2 rounded-lg border ${
                      isDark 
                        ? 'bg-[#1E2733] border-[#304050] text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 focus:border-indigo-500'
                    } outline-none transition`}
                  />
                  {formErrors['schedule.startTime'] && (
                    <p className="mt-1 text-sm text-red-500">{formErrors['schedule.startTime']}</p>
                  )}
                </div>
                
                <div>
                  <label 
                    className={`block mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    End Time*
                  </label>
                  <input 
                    type="time" 
                    name="schedule.endTime" 
                    value={formData.schedule.endTime} 
                    onChange={handleInputChange}
                    className={`w-full p-2 rounded-lg border ${
                      isDark 
                        ? 'bg-[#1E2733] border-[#304050] text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 focus:border-indigo-500'
                    } outline-none transition`}
                  />
                  {formErrors['schedule.endTime'] && (
                    <p className="mt-1 text-sm text-red-500">{formErrors['schedule.endTime']}</p>
                  )}
                </div>
              </div>
              
              {!formData.isExtraClass && (
                <div className="mt-4">
                  <label 
                    className={`block mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Days of Week*
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDayToggle(day)}
                        className={`px-3 py-2 text-sm rounded-lg ${
                          formData.schedule.daysOfWeek.includes(day)
                            ? (isDark 
                                ? 'bg-blue-500/30 text-blue-400 border border-blue-500/30' 
                                : 'bg-indigo-100 text-indigo-700 border border-indigo-200')
                            : (isDark 
                                ? 'bg-[#1E2733] text-gray-400 border border-[#304050] hover:border-gray-500' 
                                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200')
                        }`}
                      >
                        {day.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                  {formErrors.daysOfWeek && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.daysOfWeek}</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Topics */}
            <div>
              <label 
                className={`block mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Topics
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.topics.map((topic, index) => (
                  <div 
                    key={index} 
                    className={`px-3 py-1 rounded-full flex items-center gap-1 ${
                      isDark 
                        ? 'bg-[#1E2733] text-blue-400 border border-[#304050]' 
                        : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    <span className="text-sm">{topic}</span>
                    <button 
                      type="button" 
                      onClick={() => removeTopic(index)}
                      className="text-opacity-70 hover:text-opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input 
                  type="text" 
                  value={newTopic} 
                  onChange={(e) => setNewTopic(e.target.value)}
                  className={`flex-grow p-2 rounded-l-lg border ${
                    isDark 
                      ? 'bg-[#1E2733] border-[#304050] text-white focus:border-blue-500' 
                      : 'bg-white border-gray-300 focus:border-indigo-500'
                  } outline-none transition`}
                  placeholder="Add topic"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                />
                <button 
                  type="button" 
                  onClick={addTopic}
                  className={`px-4 py-2 rounded-r-lg ${
                    isDark 
                      ? 'bg-[#1E2733] text-gray-300 border border-l-0 border-[#304050] hover:bg-[#283747]' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  Add
                </button>
              </div>
            </div>
            
            {/* Notes */}
            <div>
              <label 
                className={`block mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Notes
              </label>
              <textarea 
                name="notes" 
                value={formData.notes} 
                onChange={handleInputChange}
                rows="3"
                className={`w-full p-2 rounded-lg border ${
                  isDark 
                    ? 'bg-[#1E2733] border-[#304050] text-white focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:border-indigo-500'
                } outline-none transition`}
                placeholder="Any additional notes about this class"
              ></textarea>
            </div>
            
            {/* Special Requirements */}
            <div>
              <label 
                className={`block mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Special Requirements
              </label>
              <textarea 
                name="specialRequirements" 
                value={formData.specialRequirements} 
                onChange={handleInputChange}
                rows="2"
                className={`w-full p-2 rounded-lg border ${
                  isDark 
                    ? 'bg-[#1E2733] border-[#304050] text-white focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:border-indigo-500'
                } outline-none transition`}
                placeholder="Any special requirements for this class"
              ></textarea>
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg ${
                  isDark 
                    ? 'bg-transparent text-gray-300 border border-[#304050] hover:bg-[#1E2733]' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                  isDark 
                    ? currentTheme.button.primary 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{classToEdit ? 'Update Class' : 'Schedule Class'}</span>
                )}
              </button>
            </div>
        </form>
    </div>
</div>
    )}
export default ClassSchedulingModal;