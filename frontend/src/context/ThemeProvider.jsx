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
    background: theme === 'dark' ? 'bg-slate-900' : 'bg-white',
    text: theme === 'dark' ? 'text-white' : 'text-blue-800',
    secondaryText: theme === 'dark' ? 'text-gray-300' : 'text-blue-600',
    card: theme === 'dark' ? 'bg-slate-800' : 'bg-white border border-gray-200',
    input: theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-white text-gray-900 border-gray-300',
    button: {
      primary: theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600',
      secondary: theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
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