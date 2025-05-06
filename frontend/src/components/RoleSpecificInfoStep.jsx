import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Loader, Check, X, Camera } from 'lucide-react';
import ProfileCameraCapture from './ProfileCameraCapture';
import { useDispatch } from 'react-redux';

const RoleSpecificInfoStep = ({ 
  formData, 
  handleChange,
  handleImageChange,
  profileImagePreview,
  setProfileImage,
  setProfileImagePreview,
  role,
  prevStep,
  handleSubmit,
  isSubmitting,
  setFaceEmbedding,
  theme, 
  departments,
  isDepartmentsLoading,
  errors // Add errors prop to receive validation errors
}) => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [availableGroups, setAvailableGroups] = useState([]);
  const [availableRollNumbers, setAvailableRollNumbers] = useState([]);

  // Helper function to get theme-specific class names
  const getThemedClass = (darkClass, lightClass) => {
    return theme === 'dark' ? darkClass : lightClass;
  };

  // Create a custom change handler that uses the parent handleChange
  const handleCustomChange = (e) => {
    // Pass the event directly to parent's handleChange function
    handleChange(e);
  };

  // Debug logging for departments data
  useEffect(() => {
    console.log("departments in role info: ", departments);
  }, [departments]);

  // Handle department selection change
  useEffect(() => {
    if (formData.department && departments && departments.length > 0) {
      const dept = departments.find(d => d._id === formData.department);
      if (dept && dept.groups) {
        setAvailableGroups(dept.groups);
        // Reset group selection when department changes if not already set
        if (formData.group) {
          // Check if current group is valid for this department
          const isValidGroup = dept.groups.some(g => g._id === formData.group);
          if (!isValidGroup) {
            // Create synthetic event to clear group selection
            const syntheticEvent = {
              target: { name: 'group', value: '' }
            };
            handleChange(syntheticEvent);
            
            // Clear roll number as well
            const rollEvent = {
              target: { name: 'rollNumber', value: '' }
            };
            handleChange(rollEvent);
          }
        }
      }
    } else {
      setAvailableGroups([]);
    }
  }, [formData.department, departments, handleChange]);

  // Handle group selection change
  useEffect(() => {
    if (formData.group && formData.department && formData.admissionYear && departments && departments.length > 0) {
      const selectedDept = departments.find(d => d._id === formData.department);
      if (!selectedDept) return;
      
      const selectedGroup = selectedDept.groups.find(g => g._id === formData.group);
      if (!selectedGroup) return;
      
      // Generate roll numbers based on maxCapacity
      const rollNumbers = Array.from({ length: selectedGroup.maxCapacity }, (_, i) => {
        const deptCode = selectedDept ? selectedDept.code : '';
        const groupName = selectedGroup.name.replace('group-', '');
        const yearPrefix = formData.admissionYear ? formData.admissionYear.toString().slice(-2) : 'XX';
        // Create roll number format: YYDEPTGROUPXXX (e.g., 24CS10001)
        return `${yearPrefix}${deptCode}${groupName}${String(i + 1).padStart(3, '0')}`;
      });
      setAvailableRollNumbers(rollNumbers);
      
      // If current roll number is invalid, reset it
      if (formData.rollNumber && !rollNumbers.includes(formData.rollNumber)) {
        const syntheticEvent = {
          target: { name: 'rollNumber', value: '' }
        };
        handleChange(syntheticEvent);
      }
    } else {
      setAvailableRollNumbers([]);
      // Clear roll number if any dependent field is empty
      if (formData.rollNumber) {
        const syntheticEvent = {
          target: { name: 'rollNumber', value: '' }
        };
        handleChange(syntheticEvent);
      }
    }
  }, [formData.group, formData.department, formData.admissionYear, departments, handleChange]);

  // Add handler for camera capture
  const handleImageCapture = (imageFile, faceEmbedding) => {
    // Create a URL for the captured image
    const imageUrl = URL.createObjectURL(imageFile);
    
    // Update the profile image and preview
    setProfileImage(imageFile);
    setFaceEmbedding(faceEmbedding);
    setProfileImagePreview(imageUrl);
  };

  // Show loading state if departments are still loading
  if (isDepartmentsLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className="w-full flex justify-center items-center p-8"
      >
        <div className="flex flex-col items-center">
          <Loader className={`animate-spin ${getThemedClass('text-green-400', 'text-green-600')}`} size={24} />
          <p className={`mt-3 ${getThemedClass('text-white', 'text-blue-800')}`}>
            Loading departments data...
          </p>
        </div>
      </motion.div>
    );
  }

  // Show error state if departments are empty but not loading
  if (!isDepartmentsLoading && (!departments || departments.length === 0)) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className="w-full flex justify-center items-center p-8"
      >
        <div className="flex flex-col items-center">
          <X className="text-red-500" size={24} />
          <p className={`mt-3 ${getThemedClass('text-white', 'text-blue-800')}`}>
            Unable to load departments data. Please try again later.
          </p>
          <button
            type="button"
            onClick={prevStep}
            className={`flex items-center px-3 py-1 mt-4 ${getThemedClass('bg-slate-700/40 hover:bg-slate-700/60 text-white border-red-500/30 hover:border-red-500/50', 'bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-400/30 hover:border-pink-400/50')} rounded-lg border transition-colors`}
          >
            <ArrowLeft className="mr-1 text-red-500" size={12} /> Back
          </button>
        </div>
      </motion.div>
    );
  }

  // Helper function to render error message
  const renderError = (fieldName) => {
    if (errors && errors[fieldName]) {
      return (
        <p className={`text-xs mt-1 ${getThemedClass('text-red-400', 'text-red-500')}`}>
          {errors[fieldName]}
        </p>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="w-full"
    >
      <h2 className={`text-xl font-semibold ${getThemedClass('text-white', 'text-blue-800')} mb-3`}>
        {role === 'student' ? 'Student Information' : 'Teacher Information'}
      </h2>
      
      {role === 'student' ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-1">
            <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Admission Year</label>
            <select
              name="admissionYear"
              value={formData.admissionYear || ''}
              onChange={handleCustomChange}
              className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50')} border ${errors && errors.admissionYear ? getThemedClass('border-red-500', 'border-red-500') : 'focus:border-green-500/50'} rounded-lg focus:outline-none focus:ring-1`}
            >
              <option value="">Select Year</option>
              {[...Array(5)].map((_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
            {renderError('admissionYear')}
          </div>
          
          <div className="col-span-1">
            <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Department</label>
            <select
              name="department"
              value={formData.department || ''}
              onChange={handleCustomChange}
              className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50')} border ${errors && errors.department ? getThemedClass('border-red-500', 'border-red-500') : 'focus:border-green-500/50'} rounded-lg focus:outline-none focus:ring-1`}
            >
              <option value="">Select Department</option>
              {Array.isArray(departments) && departments.map(dept => (
                <option key={dept._id} value={dept._id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
            {renderError('department')}
          </div>
          
          <div className="col-span-1">
            <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Group/Class</label>
            <select
              name="group"
              value={formData.group || ''}
              onChange={handleCustomChange}
              disabled={!formData.department}
              className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50')} border ${errors && errors.group ? getThemedClass('border-red-500', 'border-red-500') : 'focus:border-green-500/50'} rounded-lg focus:outline-none focus:ring-1 ${!formData.department ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <option value="">Select Group</option>
              {availableGroups.map(group => (
                <option key={group._id} value={group._id}>
                  {group.name} (Max: {group.maxCapacity})
                </option>
              ))}
            </select>
            {renderError('group')}
          </div>
          
          <div className="col-span-1">
            <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Roll Number</label>
            <select
              name="rollNumber"
              value={formData.rollNumber || ''}
              onChange={handleCustomChange}
              disabled={!formData.group || !formData.admissionYear || !formData.department}
              className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50')} border ${errors && errors.rollNumber ? getThemedClass('border-red-500', 'border-red-500') : 'focus:border-green-500/50'} rounded-lg focus:outline-none focus:ring-1 ${(!formData.group || !formData.admissionYear || !formData.department) ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <option value="">Select Roll Number</option>
              {availableRollNumbers.map(roll => (
                <option key={roll} value={roll}>
                  {roll}
                </option>
              ))}
            </select>
            {renderError('rollNumber')}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          <div className="col-span-1">
            <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Employee ID</label>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId || ''}
              onChange={handleChange}
              className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50')} border ${errors && errors.employeeId ? getThemedClass('border-red-500', 'border-red-500') : 'focus:border-green-500/50'} rounded-lg focus:outline-none focus:ring-1`}
            />
            {renderError('employeeId')}
          </div>
          
          <div className="col-span-1">
            <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Department</label>
            <select
              name="department"
              value={formData.department || ''}
              onChange={handleCustomChange}
              className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50')} border ${errors && errors.department ? getThemedClass('border-red-500', 'border-red-500') : 'focus:border-green-500/50'} rounded-lg focus:outline-none focus:ring-1`}
            >
              <option value="">Select Department</option>
              {Array.isArray(departments) && departments.map(dept => (
                <option key={dept._id} value={dept._id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
            {renderError('department')}
          </div>
        </div>
      )}
      
      <div className="mt-4">
        <h3 className={`text-md ${getThemedClass('text-slate-300', 'text-blue-600')} mb-2`}>Profile Image</h3>
        <div className="flex flex-col items-center justify-center w-full">
          {profileImagePreview ? (
            <div className="relative mb-3">
              <img 
                src={profileImagePreview} 
                alt="Profile preview" 
                className="w-24 h-24 rounded-full object-cover border-2 border-green-500"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setProfileImage(null);
                  setProfileImagePreview(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
              >
                <X size={12} className="text-white" />
              </button>
            </div>
          ) : null}
          
          <div className="flex flex-col w-full gap-2">
            <ProfileCameraCapture onImageCapture={handleImageCapture} />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={prevStep}
          className={`flex items-center px-3 py-1 ${getThemedClass('bg-slate-700/40 hover:bg-slate-700/60 text-white border-red-500/30 hover:border-red-500/50', 'bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-400/30 hover:border-pink-400/50')} rounded-lg border transition-colors`}
          disabled={isSubmitting}
        >
          <ArrowLeft className="mr-1 text-red-500" size={12} /> Back
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`flex items-center px-4 py-2 ${getThemedClass('bg-slate-700 hover:bg-slate-600 text-white border-green-500/30 hover:border-green-500/50', 'bg-green-600 hover:bg-green-700 text-white border-green-500/50')} rounded-lg border transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <>
              <Loader className="mr-2 animate-spin text-green-400" size={16} /> 
              Processing...
            </>
          ) : (
            <>
              <Check className="mr-2 text-green-400" size={16} />
              Sign Up
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default RoleSpecificInfoStep;