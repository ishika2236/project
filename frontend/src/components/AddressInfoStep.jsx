import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const AddressInfoStep = ({ formData, handleChange, handleSameAddressCheck, prevStep, nextStep, theme }) => {
  const getThemedClass = (darkClass, lightClass) => theme === 'dark' ? darkClass : lightClass;
  
  const inputClass = `w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`;
  const labelClass = `block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`;

  const renderAddressFields = (addressType) => (
    <div className="grid grid-cols-2 gap-2">
      <div className="col-span-2">
        <label className={labelClass}>Street</label>
        <input type="text" name={`${addressType}.street`} value={formData[addressType].street} onChange={handleChange} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>City</label>
        <input type="text" name={`${addressType}.city`} value={formData[addressType].city} onChange={handleChange} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>State</label>
        <input type="text" name={`${addressType}.state`} value={formData[addressType].state} onChange={handleChange} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Pincode</label>
        <input type="text" name={`${addressType}.pincode`} value={formData[addressType].pincode} onChange={handleChange} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Country</label>
        <input type="text" name={`${addressType}.country`} value={formData[addressType].country} onChange={handleChange} className={inputClass} />
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="w-full"
    >
      <h2 className={`text-lg font-semibold ${getThemedClass('text-white', 'text-blue-800')} mb-2`}>Address Information</h2>
      
      <div className="mb-2">
        <h3 className={`text-sm ${getThemedClass('text-slate-300', 'text-blue-600')} mb-1`}>Permanent Address</h3>
        {renderAddressFields('permanentAddress')}
      </div>
      
      <div className="mb-2 flex items-center">
        <input type="checkbox" id="sameAsPermAddress" className="mr-2 accent-green-500" onChange={handleSameAddressCheck} />
        <label htmlFor="sameAsPermAddress" className={`${getThemedClass('text-gray-300', 'text-blue-600')} text-xs`}>
          Current address same as permanent address
        </label>
      </div>
      
      <div className="mb-2">
        <h3 className={`text-sm ${getThemedClass('text-slate-300', 'text-blue-600')} mb-1`}>Current Address</h3>
        {renderAddressFields('currentAddress')}
      </div>
      
      <div className="flex justify-between mt-3">
        <button type="button" onClick={prevStep} className={`flex items-center px-3 py-1 ${getThemedClass('bg-slate-700/40 hover:bg-slate-700/60 text-white border-red-500/30 hover:border-red-500/50', 'bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-400/30 hover:border-pink-400/50')} rounded-lg border transition-colors`}>
          <ArrowLeft className="mr-1 text-red-500" size={12} /> Back
        </button>
        <button type="button" onClick={nextStep} className={`px-4 py-1 ${getThemedClass('bg-slate-700 hover:bg-slate-600 text-white border-green-500/30 hover:border-green-500/50', 'bg-green-600 hover:bg-green-700 text-white border-green-500/50')} rounded-lg border transition-colors`}>
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default AddressInfoStep;