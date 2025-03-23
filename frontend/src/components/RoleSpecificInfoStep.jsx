import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Loader, Check, X } from 'lucide-react';

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
  theme
}) => {
  const fileInputRef = useRef(null);
  
  // Helper function to get theme-specific class names
  const getThemedClass = (darkClass, lightClass) => {
    return theme === 'dark' ? darkClass : lightClass;
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
            <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Roll Number</label>
            <input
              type="text"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
            />
          </div>
          
          <div className="col-span-1">
            <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Admission Year</label>
            <input
              type="number"
              name="admissionYear"
              value={formData.admissionYear}
              onChange={handleChange}
              className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
            />
          </div>
          
          <div className="col-span-2">
            <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Group/Class</label>
            <input
              type="text"
              name="group"
              value={formData.group}
              onChange={handleChange}
              className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          <div className="col-span-1">
            <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Employee ID</label>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
            />
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
          
          <label
            htmlFor="profileImage"
            className={`flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-green-500/30 hover:border-green-500/50 rounded-lg cursor-pointer ${getThemedClass('bg-slate-800/30 hover:bg-slate-800/50', 'bg-blue-50 hover:bg-blue-100')} transition-colors`}
          >
            <div className="flex flex-col items-center justify-center py-2">
              <Upload className="w-6 h-6 mb-1 text-green-400" />
              <p className={`text-xs ${getThemedClass('text-slate-300', 'text-blue-600')}`}>
                {profileImagePreview ? 'Change image' : 'Click to upload'}
              </p>
              <p className={`text-xs ${getThemedClass('text-slate-400', 'text-blue-400')} mt-1`}>
                (JPG, PNG, GIF, max 5MB)
              </p>
            </div>
            <input 
              id="profileImage" 
              type="file" 
              className="hidden" 
              accept="image/jpeg,image/png,image/gif" 
              onChange={handleImageChange}
              ref={fileInputRef}
            />
          </label>
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