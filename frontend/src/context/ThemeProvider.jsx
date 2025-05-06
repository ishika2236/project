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
  
    // Enhanced premium light theme
    light: {
      // Sophisticated background with subtle gradients
      background: 'bg-gradient-to-br from-indigo-50 via-blue-50 to-violet-50',
      text: 'text-slate-800',
      gradientBackground: 'bg-gradient-to-b from-white to-indigo-50/70',
      
      // Refined sidebar with glass effect
      sidebar: 'bg-white/80 backdrop-blur-lg border-r border-indigo-100 shadow-lg shadow-indigo-100/20',
      
      // Premium card design with subtle effects
      card: 'bg-white/90 rounded-xl shadow-lg border border-indigo-100 hover:shadow-xl hover:border-indigo-200 backdrop-blur-sm transition-all duration-300',
      
      // Eye-catching icons
      icon: 'text-indigo-600',
      secondaryText: 'text-slate-600',
      
      // Premium button styles
      button: {
        primary: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white ' +
                 'hover:from-indigo-700 hover:to-violet-700 hover:shadow-lg hover:shadow-indigo-200/40 ' +
                 'rounded-lg shadow-md shadow-indigo-200/30 ' +
                 'transition-all duration-300 ease-in-out',
                 
        gradient: 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white ' +
                  'hover:from-sky-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-indigo-200/40 ' +
                  'rounded-lg shadow-md shadow-indigo-200/30 ' +
                  'transition-all duration-300 ease-in-out',
                  
        green: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white ' +
               'hover:from-emerald-600 hover:to-teal-700 hover:shadow-lg hover:shadow-emerald-200/40 ' +
               'rounded-lg shadow-md shadow-emerald-200/30 ' +
               'transition-all duration-300 ease-in-out',
               
        red: 'bg-gradient-to-r from-rose-500 to-pink-600 text-white ' +
             'hover:from-rose-600 hover:to-pink-700 hover:shadow-lg hover:shadow-rose-200/40 ' +
             'rounded-lg shadow-md shadow-rose-200/30 ' +
             'transition-all duration-300 ease-in-out',
             
        orange: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white ' +
                'hover:from-amber-600 hover:to-orange-700 hover:shadow-lg hover:shadow-amber-200/40 ' +
                'rounded-lg shadow-md shadow-amber-200/30 ' +
                'transition-all duration-300 ease-in-out',
                
        purple: 'bg-gradient-to-r from-violet-500 to-purple-600 text-white ' +
                'hover:from-violet-600 hover:to-purple-700 hover:shadow-lg hover:shadow-violet-200/40 ' +
                'rounded-lg shadow-md shadow-violet-200/30 ' +
                'transition-all duration-300 ease-in-out',
                
        subtle: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all rounded-lg border border-indigo-100 shadow-sm hover:shadow-md hover:shadow-indigo-100/30'
      },
      
      // Eye-catching gradient texts
      gradient: {
        text: 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 font-medium',
        accent: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-pink-600 font-medium',
        success: 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 font-medium',
        premium: 'text-transparent bg-clip-text bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-600 font-medium'
      },
      
      // Additional premium elements
      decoration: {
        glassMorphism: 'bg-white/40 backdrop-blur-md border border-white/50 shadow-xl shadow-indigo-200/20',
        glow: 'shadow-lg shadow-indigo-200/50',
        highlight: 'ring-2 ring-indigo-200 ring-offset-2',
        divider: 'h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent'
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