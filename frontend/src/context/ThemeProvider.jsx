import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the theme context
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark'); // 'dark' or 'light'

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    // Check if there's a saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Apply theme to body/html element if needed
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Toggle between dark and light theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Set theme explicitly
  const setThemeExplicitly = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setTheme(newTheme);
    }
  };

  // Helper function to get theme-specific class names
  const getThemedClass = (darkClass, lightClass) => {
    return theme === 'dark' ? darkClass : lightClass;
  };

  // Theme config object with common color mappings
  const themeConfig = {
    // Dark theme (unchanged)
    dark: {
      background: 'bg-[#0A0E13]',
      text: 'text-white',
      gradientBackground: 'bg-gradient-to-b from-[#121A22] to-[#0A0E13]',
      card: 'bg-gradient-to-br from-[#121A22] to-[#0A0E13]/50 border border-[#1E2733] shadow-xl',
      icon: 'text-white',
      secondaryText: 'text-[#5E6E82]',
      button: {
        primary: 'bg-gradient-to-r from-[#506EE5]/60 via-[#222C42]/40 to-[#1D2229] text-white ' +
                 'hover:from-[#506EE5] hover:to-[#1D2229] ' +
                 'border-2 border-[#1E4FFF]/30 border-rounded-lg ' +
                 'transition-all duration-300 ease-in-out',
        gradient: 'bg-gradient-to-r from-[#F2683C]/20 to-[#2F955A]/20',
        green: 'bg-gradient-to-r from-[#1A2520]/80 to-[#0A0E13]/90 text-white ' +
               'hover:from-[#2F955A]/20 hover:to-[#0A0E13]/80 ' +
               'border-2 border-[#2F955A]/50 rounded-lg ' +
               'shadow-[inset_0_0_15px_rgba(47,149,90,0.3)] ' +
               'transition-all duration-300 ease-in-out',
        orange: 'bg-gradient-to-r from-[#251A1A]/80 to-[#0A0E13]/90 text-white ' +
                'hover:from-[#F2683C]/20 hover:to-[#0A0E13]/80 ' +
                'border-2 border-[#F2683C]/50 rounded-lg ' +
                'shadow-[inset_0_0_15px_rgba(242,104,60,0.3)] ' +
                'transition-all duration-300 ease-in-out'
      },
      gradient: {
        text: 'bg-gradient-to-r from-[#2E67FF] to-[#2F955A] bg-clip-text text-transparent',
        accent: 'bg-gradient-to-r from-[#F2683C] to-[#2F955A]'
      }
    },
  
    // Light theme (updated to match AWS Console)
    light: {
      background: 'bg-white',
      text: 'text-gray-800',
      gradientBackground: 'bg-white',
      sidebar: 'bg-gray-100',
      card: 'bg-white border border-gray-200 shadow-sm',
      icon: 'text-gray-600',
      secondaryText: 'text-gray-500',
      button: {
        primary: 'bg-blue-600 text-white ' +
                 'hover:bg-blue-700 ' +
                 'border border-blue-600 rounded-md ' +
                 'transition-all duration-300 ease-in-out',
        gradient: 'bg-gray-100 text-gray-800',
        green: 'bg-green-600 text-white ' +
               'hover:bg-green-700 ' +
               'border border-green-600 rounded-md ' +
               'transition-all duration-300 ease-in-out',
        orange: 'bg-orange-500 text-white ' +
                'hover:bg-orange-600 ' +
                'border border-orange-500 rounded-md ' +
                'transition-all duration-300 ease-in-out',
        lavender: 'bg-blue-600 text-white ' +
                  'hover:bg-blue-700 ' +
                  'border border-blue-600 rounded-md ' +
                  'transition-all duration-300 ease-in-out',
        brown: 'bg-gray-500 text-white ' +
               'hover:bg-gray-600 ' +
               'border border-gray-500 rounded-md ' +
               'transition-all duration-300 ease-in-out'
      },
      gradient: {
        text: 'text-blue-600 font-medium',
        accent: 'text-orange-500 font-medium'
      }
    }
  };
  
  const value = {
    theme,
    toggleTheme,
    setTheme: setThemeExplicitly,
    getThemedClass,
    themeConfig,
    isDark: theme === 'dark'
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;