import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const AddressInfoStep = ({ 
  formData, 
  handleChange, 
  handleSameAddressCheck, 
  prevStep, 
  nextStep, 
  theme 
}) => {
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
      <h2 className={`text-xl font-semibold ${getThemedClass('text-white', 'text-blue-800')} mb-3`}>Address Information</h2>
      
      <div className="mb-3">
        <h3 className={`text-md ${getThemedClass('text-slate-300', 'text-blue-600')} mb-2`}>Permanent Address</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Street</label>
            <input
              type="text"
              name="permanentAddress.street"
              value={formData.permanentAddress.street}
              onChange={handleChange}
              className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
            />
          </div>
          
          <div className="col-span-1">
            <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>City</label>
            <input
              type="text"
              name="permanentAddress.city"
              value={formData.permanentAddress.city}
              onChange={handleChange}
              className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
            />
          </div>
          
          <div className="col-span-1">
            <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>State</label>
            <input
              type="text"
              name="permanentAddress.state"
              value={formData.permanentAddress.state}
              onChange={handleChange}
              className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
            />
          </div>
          
          <div className="col-span-1">
            <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Pincode</label>
            <input
              type="text"
              name="permanentAddress.pincode"
              value={formData.permanentAddress.pincode}
              onChange={handleChange}
              className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
            />
          </div>
          
          <div className="col-span-1">
            <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Country</label>
            <input
              type="text"
              name="permanentAddress.country"
              value={formData.permanentAddress.country}
              onChange={handleChange}
              className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
            />
          </div>
        </div>
      </div>
      
      <div className="mb-3 flex items-center">
        <input
          type="checkbox"
          id="sameAsPermAddress"
          className="mr-2 accent-green-500"
          onChange={handleSameAddressCheck}
        />
        <label htmlFor="sameAsPermAddress" className={`${getThemedClass('text-gray-300', 'text-blue-600')} text-sm`}>
          Current address same as permanent address
        </label>
      </div>
      
      <div className="mb-3">
        <h3 className={`text-md ${getThemedClass('text-slate-300', 'text-blue-600')} mb-2`}>Current Address</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Street</label>
            <input
              type="text"
              name="currentAddress.street"
              value={formData.currentAddress.street}
              onChange={handleChange}
              className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
            />
          </div>
          
          <div className="col-span-1">
            <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>City</label>
            <input
              type="text"
              name="currentAddress.city"
              value={formData.currentAddress.city}
              onChange={handleChange}
              className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
            />
          </div>
          
          <div className="col-span-1">
            <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>State</label>
            <input
              type="text"
              name="currentAddress.state"
              value={formData.currentAddress.state}
              onChange={handleChange}
              className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
            />
          </div>
          
          <div className="col-span-1">
            <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Pincode</label>
            <input
              type="text"
              name="currentAddress.pincode"
              value={formData.currentAddress.pincode}
              onChange={handleChange}
              className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
            />
          </div>
          
          <div className="col-span-1">
            <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Country</label>
            <input
              type="text"
              name="currentAddress.country"
              value={formData.currentAddress.country}
              onChange={handleChange}
              className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={prevStep}
          className={`flex items-center px-3 py-1 ${getThemedClass('bg-slate-700/40 hover:bg-slate-700/60 text-white border-red-500/30 hover:border-red-500/50', 'bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-400/30 hover:border-pink-400/50')} rounded-lg border transition-colors`}
        >
          <ArrowLeft className="mr-1 text-red-500" size={12} /> Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          className={`px-4 py-1 ${getThemedClass('bg-slate-700 hover:bg-slate-600 text-white border-green-500/30 hover:border-green-500/50', 'bg-green-600 hover:bg-green-700 text-white border-green-500/50')} rounded-lg border transition-colors`}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default AddressInfoStep;