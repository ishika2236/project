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
  
    // Updated light theme (without purple-blue)
    light: {
      background: 'bg-white',
      text: 'text-slate-800',
      gradientBackground: 'bg-gradient-to-br from-slate-50 to-white',
      
      // Card with clean styling (no purple)
      card: 'bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300',
      
      icon: 'text-blue-600',
      secondaryText: 'text-slate-500',
    
      // Updated button styles with blue tones instead of purple
      button: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-sm transition-all duration-300',
        gradient: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-md rounded-lg transition-all duration-300',
        green: 'bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg shadow-sm transition-all duration-300',
        orange: 'bg-amber-500 text-white hover:bg-amber-600 rounded-lg shadow-sm transition-all duration-300',
        subtle: 'bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg border border-slate-200 transition-all duration-300',
      },
      
      gradient: {
        text: 'text-blue-600 font-medium',
        accent: 'text-blue-600 font-medium',
        success: 'text-emerald-500 font-medium',
        premium: 'bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent font-medium'
      },
      
      // Additional decorative elements
      decoration: {
        glassMorphism: 'bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm',
        glow: 'shadow-md shadow-blue-100',
        highlight: 'ring-2 ring-blue-200 ring-offset-2',
        divider: 'h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent'
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