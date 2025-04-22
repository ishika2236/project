import React from "react";
import {useTheme} from "../../context/ThemeProvider";
const Header = () => {
    const { themeConfig, theme, toggleTheme } = useTheme();
  
    return (
      <header className={`${theme === 'dark' ? 'bg-[#121A22]' : 'bg-white border-b border-gray-200'} py-4 px-6 flex justify-between items-center`}>
        <div className="flex items-center">
          <h1 className={`text-xl font-bold ${themeConfig[theme].gradient.text}`}>
            EduTrack
          </h1>
          <span className={`ml-2 ${themeConfig[theme].secondaryText}`}>
            Teacher Dashboard
          </span>
        </div>
  
        <div className="flex items-center space-x-4">
          <button 
            className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-[#1E2733]' : 'hover:bg-gray-100'}`}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <Sun size={20} className={themeConfig[theme].icon} />
            ) : (
              <Moon size={20} className={themeConfig[theme].icon} />
            )}
          </button>
          <button className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-[#1E2733]' : 'hover:bg-gray-100'}`}>
            <Bell size={20} className={themeConfig[theme].icon} />
          </button>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-[#506EE5]/30' : 'bg-blue-100'}`}>
            <User size={18} className={theme === 'dark' ? 'text-blue-300' : 'text-blue-600'} />
          </div>
        </div>
      </header>
    );
  };
export default Header;  