import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { COUNTRIES, STATES_BY_COUNTRY, CITIES_BY_STATE, PINCODE_PATTERNS } from './locationData';

const AddressInfoStep = ({ 
  formData, 
  handleChange, 
  handleSameAddressCheck, 
  prevStep, 
  nextStep, 
  theme, 
  errors = {},
  setErrors
}) => {
  const getThemedClass = (darkClass, lightClass) => theme === 'dark' ? darkClass : lightClass;
  
  const inputClass = `w-full p-2 ${getThemedClass(
    'bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 
    'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50'
  )} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`;
  
  const selectClass = `w-full p-2 ${getThemedClass(
    'bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 
    'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50'
  )} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1 appearance-none relative`;
  
  const errorClass = `text-red-500 text-xs mt-1`;
  const labelClass = `block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`;

  const [availableStates, setAvailableStates] = useState({
    permanentAddress: [],
    currentAddress: []
  });
  
  const [availableCities, setAvailableCities] = useState({
    permanentAddress: [],
    currentAddress: []
  });

  // Update available states when country changes
  useEffect(() => {
    const newAvailableStates = { ...availableStates };
    
    if (formData.permanentAddress.country) {
      newAvailableStates.permanentAddress = STATES_BY_COUNTRY[formData.permanentAddress.country] || [];
    }
    
    if (formData.currentAddress.country) {
      newAvailableStates.currentAddress = STATES_BY_COUNTRY[formData.currentAddress.country] || [];
    }
    
    setAvailableStates(newAvailableStates);
  }, [formData.permanentAddress.country, formData.currentAddress.country]);

  // Update available cities when state changes
  useEffect(() => {
    const newAvailableCities = { ...availableCities };
    
    if (formData.permanentAddress.state) {
      // Use the state directly as the key for CITIES_BY_STATE
      newAvailableCities.permanentAddress = CITIES_BY_STATE[formData.permanentAddress.state] || [];
    }
    
    if (formData.currentAddress.state) {
      // Use the state directly as the key for CITIES_BY_STATE
      newAvailableCities.currentAddress = CITIES_BY_STATE[formData.currentAddress.state] || [];
    }
    
    setAvailableCities(newAvailableCities);
  }, [formData.permanentAddress.state, formData.currentAddress.state]);

  // Custom handler for dropdown changes with validation
  const handleAddressChange = (e, addressType) => {
    const { name, value } = e.target;
    const fieldName = name.split('.')[1]; // Extract field name (e.g., 'country', 'state')
    
    // Update form data
    const updatedAddress = { ...formData[addressType], [fieldName]: value };
    
    // Handle cascading resets
    if (fieldName === 'country') {
      updatedAddress.state = '';
      updatedAddress.city = '';
      updatedAddress.pincode = '';
    } else if (fieldName === 'state') {
      updatedAddress.city = '';
      updatedAddress.pincode = '';
    }
    
    // Create synthetic event to use with parent's handleChange
    const syntheticEvent = {
      target: {
        name: `${addressType}.${fieldName}`,
        value: value
      }
    };
    
    handleChange(syntheticEvent);
    
    // Clear errors for the changed field
    if (errors[addressType] && errors[addressType][fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        if (newErrors[addressType]) {
          delete newErrors[addressType][fieldName];
          if (Object.keys(newErrors[addressType]).length === 0) {
            delete newErrors[addressType];
          }
        }
        return newErrors;
      });
    }
  };

  // Validate pincode based on country's pattern
  const validatePincode = (pincode, country) => {
    if (!pincode || !country) return true;
    const pattern = PINCODE_PATTERNS[country];
    if (!pattern) return true;
    
    return pattern.test(pincode);
  };

  // Handle pincode validation on blur
  const handlePincodeBlur = (e, addressType) => {
    const { value } = e.target;
    const country = formData[addressType].country;
    
    if (!validatePincode(value, country)) {
      setErrors(prev => ({
        ...prev,
        [addressType]: {
          ...(prev[addressType] || {}),
          pincode: `Invalid pincode format for ${country}`
        }
      }));
    }
  };

  const renderAddressFields = (addressType) => (
    <div className="grid grid-cols-2 gap-2">
      <div className="col-span-2">
        <label className={labelClass}>Street</label>
        <input 
          type="text" 
          name={`${addressType}.street`} 
          value={formData[addressType].street} 
          onChange={handleChange} 
          className={`${inputClass} ${errors[addressType]?.street ? 'border-red-500' : ''}`}
        />
        {errors[addressType]?.street && (
          <p className={errorClass}>{errors[addressType].street}</p>
        )}
      </div>

      <div className="relative">
        <label className={labelClass}>Country</label>
        <div className="relative">
          <select
            name={`${addressType}.country`}
            value={formData[addressType].country}
            onChange={(e) => handleAddressChange(e, addressType)}
            className={`${selectClass} ${errors[addressType]?.country ? 'border-red-500' : ''}`}
          >
            <option value="">Select Country</option>
            {Object.keys(STATES_BY_COUNTRY).map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          <ChevronDown size={16} className={`absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none ${getThemedClass('text-gray-400', 'text-blue-600')}`} />
        </div>
        {errors[addressType]?.country && (
          <p className={errorClass}>{errors[addressType].country}</p>
        )}
      </div>

      <div className="relative">
        <label className={labelClass}>State</label>
        <div className="relative">
          <select
            name={`${addressType}.state`}
            value={formData[addressType].state}
            onChange={(e) => handleAddressChange(e, addressType)}
            className={`${selectClass} ${errors[addressType]?.state ? 'border-red-500' : ''}`}
            disabled={!formData[addressType].country}
          >
            <option value="">Select State</option>
            {availableStates[addressType].map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          <ChevronDown size={16} className={`absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none ${getThemedClass('text-gray-400', 'text-blue-600')}`} />
        </div>
        {errors[addressType]?.state && (
          <p className={errorClass}>{errors[addressType].state}</p>
        )}
      </div>

      <div className="relative">
        <label className={labelClass}>City</label>
        <div className="relative">
          <select
            name={`${addressType}.city`}
            value={formData[addressType].city}
            onChange={(e) => handleAddressChange(e, addressType)}
            className={`${selectClass} ${errors[addressType]?.city ? 'border-red-500' : ''}`}
            disabled={!formData[addressType].state}
          >
            <option value="">Select City</option>
            {availableCities[addressType].map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <ChevronDown size={16} className={`absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none ${getThemedClass('text-gray-400', 'text-blue-600')}`} />
        </div>
        {errors[addressType]?.city && (
          <p className={errorClass}>{errors[addressType].city}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>Pincode</label>
        <input 
          type="text" 
          name={`${addressType}.pincode`} 
          value={formData[addressType].pincode}
          onChange={handleChange}
          onBlur={(e) => handlePincodeBlur(e, addressType)}
          className={`${inputClass} ${errors[addressType]?.pincode ? 'border-red-500' : ''}`}
          placeholder={formData[addressType].country === 'India' ? '6 digits' : 'Enter pincode'}
        />
        {errors[addressType]?.pincode && (
          <p className={errorClass}>{errors[addressType].pincode}</p>
        )}
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
      
      <div className="mb-4">
        <h3 className={`text-sm ${getThemedClass('text-slate-300', 'text-blue-600')} mb-1`}>Permanent Address</h3>
        {renderAddressFields('permanentAddress')}
      </div>
      
      <div className="mb-3 flex items-center">
        <input 
          type="checkbox" 
          id="sameAsPermAddress" 
          className="mr-2 accent-green-500" 
          onChange={handleSameAddressCheck} 
        />
        <label htmlFor="sameAsPermAddress" className={`${getThemedClass('text-gray-300', 'text-blue-600')} text-xs`}>
          Current address same as permanent address
        </label>
      </div>
      
      <div className="mb-4">
        <h3 className={`text-sm ${getThemedClass('text-slate-300', 'text-blue-600')} mb-1`}>Current Address</h3>
        {renderAddressFields('currentAddress')}
      </div>
      
      <div className="flex justify-between mt-4">
        <button 
          type="button" 
          onClick={prevStep} 
          className={`flex items-center px-3 py-1 ${getThemedClass(
            'bg-slate-700/40 hover:bg-slate-700/60 text-white border-red-500/30 hover:border-red-500/50', 
            'bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-400/30 hover:border-pink-400/50'
          )} rounded-lg border transition-colors`}
        >
          <ArrowLeft className="mr-1 text-red-500" size={12} /> Back
        </button>
        <button 
          type="button" 
          onClick={nextStep} 
          className={`px-4 py-1 ${getThemedClass(
            'bg-slate-700 hover:bg-slate-600 text-white border-green-500/30 hover:border-green-500/50', 
            'bg-green-600 hover:bg-green-700 text-white border-green-500/50'
          )} rounded-lg border transition-colors`}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default AddressInfoStep;