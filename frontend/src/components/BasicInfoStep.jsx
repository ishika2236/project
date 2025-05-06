// import React from 'react';
// import { motion } from 'framer-motion';
// import { ArrowLeft, Check, X } from 'lucide-react';

// const BasicInfoStep = ({ 
//   formData, 
//   handleChange, 
//   validation, 
//   prevStep, 
//   nextStep, 
//   theme 
// }) => {
//   // Helper function to get theme-specific class names
//   const getThemedClass = (darkClass, lightClass) => {
//     return theme === 'dark' ? darkClass : lightClass;
//   };

//   // Validation status indicator
//   const ValidationIcon = ({ isValid }) => {
//     if (isValid === null) return null;
    
//     return isValid ? (
//       <Check size={16} className="text-green-500" />
//     ) : (
//       <X size={16} className="text-red-500" />
//     );
//   };

//   return (
//     <motion.div 
//       initial={{ opacity: 0, x: 100 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: -100 }}
//       className="w-full"
//     >
//       <h2 className={`text-xl font-semibold ${getThemedClass('text-white', 'text-blue-800')} mb-4`}>Basic Information</h2>
      
//       <div className="grid grid-cols-2 gap-3">
//         <div className="col-span-1">
//           <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>First Name</label>
//           <input
//             type="text"
//             name="firstName"
//             value={formData.firstName}
//             onChange={handleChange}
//             className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
//           />
//         </div>
        
//         <div className="col-span-1">
//           <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Last Name</label>
//           <input
//             type="text"
//             name="lastName"
//             value={formData.lastName}
//             onChange={handleChange}
//             className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
//           />
//         </div>
        
//         <div className="col-span-2 relative">
//           <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Email</label>
//           <div className="relative">
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className={`w-full p-2 ${getThemedClass('bg-slate-800/50 text-white', 'bg-white text-blue-800')} border rounded-lg focus:outline-none focus:ring-1 pr-8 ${
//                 validation.email === false ? 'border-red-500/70' : 
//                 validation.email === true ? (theme === 'dark' ? 'border-green-500/70' : 'border-green-600/70') : 
//                 getThemedClass('border-slate-700/30', 'border-blue-200')
//               }`}
//             />
//             <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//               <ValidationIcon isValid={validation.email} />
//             </div>
//           </div>
//         </div>
        
//         <div className="col-span-1 relative">
//           <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Password</label>
//           <div className="relative">
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className={`w-full p-2 ${getThemedClass('bg-slate-800/50 text-white', 'bg-white text-blue-800')} border rounded-lg focus:outline-none focus:ring-1 pr-8 ${
//                 validation.password === false ? 'border-red-500/70' : 
//                 validation.password === true ? (theme === 'dark' ? 'border-green-500/70' : 'border-green-600/70') : 
//                 getThemedClass('border-slate-700/30', 'border-blue-200')
//               }`}
//             />
//             <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//               <ValidationIcon isValid={validation.password} />
//             </div>
//           </div>
//         </div>
        
//         <div className="col-span-1 relative">
//           <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Confirm Password</label>
//           <div className="relative">
//             <input
//               type="password"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               className={`w-full p-2 ${getThemedClass('bg-slate-800/50 text-white', 'bg-white text-blue-800')} border rounded-lg focus:outline-none focus:ring-1 pr-8 ${
//                 validation.confirmPassword === false ? 'border-red-500/70' : 
//                 validation.confirmPassword === true ? (theme === 'dark' ? 'border-green-500/70' : 'border-green-600/70') : 
//                 getThemedClass('border-slate-700/30', 'border-blue-200')
//               }`}
//             />
//             <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//               <ValidationIcon isValid={validation.confirmPassword} />
//             </div>
//           </div>
//         </div>
        
//         <div className="col-span-1">
//           <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Mobile</label>
//           <input
//             type="tel"
//             name="mobile"
//             value={formData.mobile}
//             onChange={handleChange}
//             className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
//           />
//         </div>
        
//         <div className="col-span-1">
//           <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Date of Birth</label>
//           <input
//             type="date"
//             name="dateOfBirth"
//             value={formData.dateOfBirth}
//             onChange={handleChange}
//             className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-blue-200 text-blue-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
//           />
//         </div>
//       </div>
      
//       <div className="col-span-2 mt-3">
//         <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Gender</label>
//         <div className="flex space-x-4">
//           {['Male', 'Female', 'Other'].map((gender) => (
//             <div key={gender} className="flex items-center">
//               <input
//                 type="radio"
//                 id={gender.toLowerCase()}
//                 name="gender"
//                 value={gender.toLowerCase()}
//                 checked={formData.gender === gender.toLowerCase()}
//                 onChange={handleChange}
//                 className="mr-2 accent-green-500"
//               />
//               <label htmlFor={gender.toLowerCase()} className={`${getThemedClass('text-gray-300', 'text-blue-600')} text-sm`}>
//                 {gender}
//               </label>
//             </div>
//           ))}
//         </div>
//       </div>
      
//       <div className="flex justify-between mt-4">
//         <button
//           type="button"
//           onClick={prevStep}
//           className={`flex items-center px-3 py-1 ${getThemedClass('bg-slate-700/40 hover:bg-slate-700/60 text-white border-red-500/30 hover:border-red-500/50', 'bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-400/30 hover:border-pink-400/50')} rounded-lg border transition-colors`}
//         >
//           <ArrowLeft className="mr-1 text-red-500" size={12} /> Back
//         </button>
//         <button
//           type="button"
//           onClick={nextStep}
//           className={`px-4 py-1 ${getThemedClass('bg-slate-700 hover:bg-slate-600 text-white border-green-500/30 hover:border-green-500/50', 'bg-green-600 hover:bg-green-700 text-white border-green-500/50')} rounded-lg border transition-colors`}
//         >
//           Next
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// export default BasicInfoStep;
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, X } from 'lucide-react';

const BasicInfoStep = ({ 
  formData, 
  handleChange, 
  errors, // Changed from validation to errors
  prevStep, 
  nextStep,
  getThemedClass,
  theme 
}) => {
  // Validation status indicator
  const ValidationIcon = ({ field }) => {
    // Field is valid if there's no error for this field
    const isValid = !errors[field];
    
    // Don't show icon for untouched fields (no value yet)
    if (!formData[field]) return null;
    
    return isValid ? (
      <Check size={16} className="text-green-500" />
    ) : (
      <X size={16} className="text-red-500" />
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="w-full"
    >
      <h2 className={`text-xl font-semibold ${getThemedClass('text-white', 'text-blue-800')} mb-4`}>Basic Information</h2>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-1">
          <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full p-2 ${getThemedClass('bg-slate-800/50 text-white', 'bg-white text-blue-800')} border rounded-lg focus:outline-none focus:ring-1 ${
              errors.firstName ? 'border-red-500/70' : 
              formData.firstName ? (theme === 'dark' ? 'border-green-500/70' : 'border-green-600/70') : 
              getThemedClass('border-slate-700/30', 'border-blue-200')
            }`}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>
        
        <div className="col-span-1">
          <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full p-2 ${getThemedClass('bg-slate-800/50 text-white', 'bg-white text-blue-800')} border rounded-lg focus:outline-none focus:ring-1 ${
              errors.lastName ? 'border-red-500/70' : 
              formData.lastName ? (theme === 'dark' ? 'border-green-500/70' : 'border-green-600/70') : 
              getThemedClass('border-slate-700/30', 'border-blue-200')
            }`}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>
        
        <div className="col-span-2 relative">
          <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Email</label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 ${getThemedClass('bg-slate-800/50 text-white', 'bg-white text-blue-800')} border rounded-lg focus:outline-none focus:ring-1 pr-8 ${
                errors.email ? 'border-red-500/70' : 
                formData.email ? (theme === 'dark' ? 'border-green-500/70' : 'border-green-600/70') : 
                getThemedClass('border-slate-700/30', 'border-blue-200')
              }`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <ValidationIcon field="email" />
            </div>
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        
        <div className="col-span-1 relative">
          <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Password</label>
          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-2 ${getThemedClass('bg-slate-800/50 text-white', 'bg-white text-blue-800')} border rounded-lg focus:outline-none focus:ring-1 pr-8 ${
                errors.password ? 'border-red-500/70' : 
                formData.password ? (theme === 'dark' ? 'border-green-500/70' : 'border-green-600/70') : 
                getThemedClass('border-slate-700/30', 'border-blue-200')
              }`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <ValidationIcon field="password" />
            </div>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>
        
        <div className="col-span-1 relative">
          <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Confirm Password</label>
          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full p-2 ${getThemedClass('bg-slate-800/50 text-white', 'bg-white text-blue-800')} border rounded-lg focus:outline-none focus:ring-1 pr-8 ${
                errors.confirmPassword ? 'border-red-500/70' : 
                formData.confirmPassword ? (theme === 'dark' ? 'border-green-500/70' : 'border-green-600/70') : 
                getThemedClass('border-slate-700/30', 'border-blue-200')
              }`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <ValidationIcon field="confirmPassword" />
            </div>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>
        
        <div className="col-span-1">
          <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Mobile</label>
          <div className="relative">
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className={`w-full p-2 ${getThemedClass('bg-slate-800/50 text-white', 'bg-white text-blue-800')} border rounded-lg focus:outline-none focus:ring-1 pr-8 ${
                errors.mobile ? 'border-red-500/70' : 
                formData.mobile ? (theme === 'dark' ? 'border-green-500/70' : 'border-green-600/70') : 
                getThemedClass('border-slate-700/30', 'border-blue-200')
              }`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <ValidationIcon field="mobile" />
            </div>
          </div>
          {errors.mobile && (
            <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
          )}
        </div>
        
        <div className="col-span-1">
          <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={`w-full p-2 ${getThemedClass('bg-slate-800/50 text-white', 'bg-white text-blue-800')} border rounded-lg focus:outline-none focus:ring-1 ${
              errors.dateOfBirth ? 'border-red-500/70' : 
              formData.dateOfBirth ? (theme === 'dark' ? 'border-green-500/70' : 'border-green-600/70') : 
              getThemedClass('border-slate-700/30', 'border-blue-200')
            }`}
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>
          )}
        </div>
      </div>
      
      <div className="col-span-2 mt-3">
        <label className={`block ${getThemedClass('text-gray-300', 'text-blue-600')} mb-1 text-sm`}>Gender</label>
        <div className="flex space-x-4">
          {['Male', 'Female', 'Other'].map((gender) => (
            <div key={gender} className="flex items-center">
              <input
                type="radio"
                id={gender.toLowerCase()}
                name="gender"
                value={gender.toLowerCase()}
                checked={formData.gender === gender.toLowerCase()}
                onChange={handleChange}
                className="mr-2 accent-green-500"
              />
              <label htmlFor={gender.toLowerCase()} className={`${getThemedClass('text-gray-300', 'text-blue-600')} text-sm`}>
                {gender}
              </label>
            </div>
          ))}
        </div>
        {errors.gender && (
          <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
        )}
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

export default BasicInfoStep;