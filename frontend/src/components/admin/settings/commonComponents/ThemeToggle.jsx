import React from "react";
import { useTheme } from "../../../../context/ThemeProvider";
import { Eye } from "lucide-react";
export default  function ThemeToggleButton({ theme, currentTheme, toggleTheme, label, colors }) {
    const isActive = theme === currentTheme;
    
    return (
      <button
        onClick={toggleTheme}
        className={`relative px-4 py-2 rounded-md transition-all duration-200 ${
          isActive
            ? theme === 'dark'
              ? 'bg-gradient-to-r from-[#121A22] to-[#0A0E13]/80 border-2 border-[#506EE5]/40 shadow-[inset_0_0_10px_rgba(80,110,229,0.2)]'
              : 'bg-blue-50 border border-blue-300 text-blue-700'
            : theme === 'dark'
              ? 'bg-[#0A0E13]/40 border border-[#1E2733] hover:border-[#506EE5]/30'
              : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
        } ${colors.text}`}
      >
        <div className="flex items-center justify-center space-x-2">
          {currentTheme === 'light' ? <Eye size={18} /> : <Lock size={18} />}
          <span>{label}</span>
        </div>
      </button>
    );
  }