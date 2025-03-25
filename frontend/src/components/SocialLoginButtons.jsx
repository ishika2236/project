import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Twitter, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
const SocialLoginButtons = ({ getThemedClass }) => {
  return (
    <div className="mt-4 space-y-2">
      <Link to="/login">
        <motion.button 
          whileHover={{ scale: 1.01 }}
          className={`flex items-center justify-center w-full p-2 rounded-full bg-transparent border-2 ${
            getThemedClass(
              'border-green-500/30 text-white hover:bg-green-700/20 hover:border-green-500/50', 
              'border-green-500/50 text-green-400 hover:bg-green-900/20 hover:border-green-500/70'
            )} transition-colors`}
        >
          <Mail className="mr-2 text-green-400" size={16} /> Sign in with Email
        </motion.button>
      </Link>
      
      <div className="relative my-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-600"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-2 bg-slate-900 text-xs text-gray-400">or continue with</span>
        </div>
      </div>
      
      <motion.button 
        whileHover={{ scale: 1.01 }}
        className={`flex items-center justify-center w-full p-2 rounded-full bg-transparent border-2 ${
          getThemedClass(
            'border-slate-700/50 text-white hover:bg-slate-700', 
            'border-slate-500/50 text-slate-300 hover:bg-slate-800'
          )} transition-colors`}
      >
        <Mail className="mr-2" size={16} /> Continue with Google
      </motion.button>
      
      <motion.button 
        whileHover={{ scale: 1.01 }}
        className={`flex items-center justify-center w-full p-2 rounded-full bg-transparent border-2 ${
          getThemedClass(
            'border-red-500/30 text-white hover:bg-red-700/20 hover:border-red-500/50', 
            'border-red-500/50 text-red-400 hover:bg-red-900/20 hover:border-red-500/70'
          )} transition-colors`}
      >
        <Twitter className="mr-2 text-red-400" size={16} /> Continue with Twitter
      </motion.button>
      
      <motion.button 
        whileHover={{ scale: 1.01 }}
        className={`flex items-center justify-center w-full p-2 rounded-full ${
          getThemedClass(
            'bg-gray-700 text-white hover:bg-gray-600 border-2 border-green-500/30 hover:border-green-500/50', 
            'bg-gray-800 text-white hover:bg-gray-700 border-2 border-green-500/50 hover:border-green-500/70'
          )} transition-colors`}
      >
        <Github className="mr-2 text-green-400" size={16} /> Continue with Github
      </motion.button>
    </div>
  );
};

export default SocialLoginButtons;