import React, { useState } from 'react';
import { X } from 'lucide-react';

const ClassInfoUpdateModal = ({
  isOpen,
  onClose,
  onSave,
  classToEdit,
  isDark,
  currentTheme
}) => {
  const [classInfo, setClassInfo] = useState({
    title: classToEdit?.title || '',
    description: classToEdit?.description || '',
    notes: classToEdit?.notes || '',
    topics: classToEdit?.topics || [],
    specialRequirements: classToEdit?.specialRequirements || '',
  });

  const [topicInput, setTopicInput] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleTopicInputChange = (e) => {
    setTopicInput(e.target.value);
  };

  const addTopic = () => {
    if (!topicInput.trim()) return;
    
    setClassInfo(prev => ({
      ...prev,
      topics: [...prev.topics, topicInput.trim()]
    }));
    
    setTopicInput('');
  };

  const removeTopic = (index) => {
    setClassInfo(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate title (required)
    const newErrors = {};
    if (!classInfo.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSave(classInfo);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`w-full max-w-lg p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh] ${
          isDark ? 'bg-[#121A22] border border-[#1E2733]' : 'bg-white'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Update Class Information
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${
              isDark ? 'hover:bg-[#1E2733]' : 'hover:bg-gray-100'
            }`}
          >
            <X size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className={`block mb-1 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Class Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={classInfo.title}
                onChange={handleChange}
                placeholder="Enter class title"
                className={`w-full p-2 border rounded-md ${
                  errors.title ? 'border-red-500' : ''
                } ${
                  isDark
                    ? 'bg-[#1E2733] border-[#283647] text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className={`block mb-1 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={classInfo.description}
                onChange={handleChange}
                placeholder="Brief description of the class"
                rows={2}
                className={`w-full p-2 border rounded-md ${
                  isDark
                    ? 'bg-[#1E2733] border-[#283647] text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                }`}
              />
            </div>

            {/* Topics */}
            <div>
              <label
                className={`block mb-1 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Topics
              </label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={topicInput}
                  onChange={handleTopicInputChange}
                  placeholder="Add topic"
                  className={`flex-1 p-2 border rounded-l-md ${
                    isDark
                      ? 'bg-[#1E2733] border-[#283647] text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTopic();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addTopic}
                  className={`px-4 py-2 rounded-r-md ${
                    isDark
                      ? 'bg-[#1E2733] text-white hover:bg-[#283647]'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Add
                </button>
              </div>
              
              {classInfo.topics.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {classInfo.topics.map((topic, index) => (
                    <div
                      key={index}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        isDark
                          ? 'bg-[#1E2733] text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <span>{topic}</span>
                      <button
                        type="button"
                        onClick={() => removeTopic(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  No topics added yet
                </p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className={`block mb-1 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Class Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={classInfo.notes}
                onChange={handleChange}
                placeholder="Additional notes for this class"
                rows={3}
                className={`w-full p-2 border rounded-md ${
                  isDark
                    ? 'bg-[#1E2733] border-[#283647] text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                }`}
              />
            </div>

            {/* Special Requirements */}
            <div>
              <label
                htmlFor="specialRequirements"
                className={`block mb-1 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Special Requirements
              </label>
              <textarea
                id="specialRequirements"
                name="specialRequirements"
                value={classInfo.specialRequirements}
                onChange={handleChange}
                placeholder="Any special materials or requirements for this class"
                rows={2}
                className={`w-full p-2 border rounded-md ${
                  isDark
                    ? 'bg-[#1E2733] border-[#283647] text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                }`}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-md ${
                  isDark
                    ? 'bg-[#1E2733] text-white hover:bg-[#283647]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md ${
                  isDark
                    ? currentTheme.button.primary
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassInfoUpdateModal;