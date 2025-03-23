import React from 'react';
import { motion } from 'framer-motion';
import { School, User } from 'lucide-react';

const RoleSelectionStep = ({ handleRoleSelect, getThemedClass, theme }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center space-y-4 w-full"
    >
      <h2 className={`text-xl font-semibold ${getThemedClass('text-white', 'text-blue-800')} mb-4`}>Choose your role</h2>
      
      <div className="flex gap-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex flex-col items-center justify-center p-4 ${getThemedClass('bg-slate-800/30 border-green-500/30 hover:border-green-500/50 hover:bg-slate-700/40', 'bg-white border-green-600/40 hover:border-green-600/70 hover:bg-blue-50')} rounded-lg border w-32 h-32 transition-all`}
          onClick={() => handleRoleSelect('student')}
        >
          <School className="text-green-500 mb-2" size={32} />
          <span className={getThemedClass('text-white', 'text-blue-800')}>Student</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex flex-col items-center justify-center p-4 ${getThemedClass('bg-slate-800/30 border-green-500/30 hover:border-green-500/50 hover:bg-slate-700/40', 'bg-white border-green-600/40 hover:border-green-600/70 hover:bg-blue-50')} rounded-lg border w-32 h-32 transition-all`}
          onClick={() => handleRoleSelect('teacher')}
        >
          <User className="text-green-500 mb-2" size={32} />
          <span className={getThemedClass('text-white', 'text-blue-800')}>Teacher</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RoleSelectionStep;