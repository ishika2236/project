import React from "react";
import { useState } from "react";
import { useTheme } from "../../../../context/ThemeProvider";

export default  function ToggleSetting({ label, defaultChecked = false, colors }) {
    const [isChecked, setIsChecked] = useState(defaultChecked);
    const { theme } = useTheme();
    
    return (
      <div className="flex items-center justify-between max-w-md">
        <span className={`text-sm ${colors.text}`}>{label}</span>
        <button
          onClick={() => setIsChecked(!isChecked)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${
            isChecked 
              ? theme === 'dark' ? 'bg-gradient-to-r from-[#2F955A] to-[#1E4FFF]/70' : 'bg-blue-600' 
              : theme === 'dark' ? 'bg-[#121A22]' : 'bg-gray-200'
          }`}
          role="switch"
          aria-checked={isChecked}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
              isChecked ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    );
  }