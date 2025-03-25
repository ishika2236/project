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
    background: theme === 'dark' ? 'bg-slate-900' : 'bg-[#f1faee]', // Honeydew
    text: theme === 'dark' ? 'text-white' : 'text-[#1d3557]', // Berkeley Blue
    secondaryText: theme === 'dark' ? 'text-gray-300' : 'text-[#457b9d]', // Cerulean
    card: theme === 'dark' ? 'bg-slate-800' : 'bg-[#f1faee] border border-[#a8dadc]', // Honeydew with Non Photo Blue border
    input: theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-white text-[#1d3557] border-[#a8dadc]', // Berkeley Blue text, Non Photo Blue border
    button: {
      primary: theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#e63946] hover:bg-[#eb5f6b] text-white', // Red Pantone
      secondary: theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-[#a8dadc] hover:bg-[#b9e2e3] text-[#1d3557]' // Non Photo Blue
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