import React from 'react';
import { Search } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeProvider';

const SearchInput = ({ value, onChange, placeholder = "Search..." }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`relative ${isDark ? 'bg-gray-800/50' : 'bg-white'} rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`pl-10 pr-4 py-2 rounded-lg ${isDark ? 'bg-gray-800/50 text-white' : 'bg-white text-gray-800'} focus:outline-none`}
      />
    </div>
  );
};

export default SearchInput;