// import React, { createContext, useState, useContext, useEffect } from 'react';

// // Create the theme context
// const ThemeContext = createContext();

// // Custom hook to use the theme context
// export const useTheme = () => useContext(ThemeContext);

// // Provider component
// export const ThemeProvider = ({ children }) => {
//   const [theme, setTheme] = useState('dark'); // 'dark' or 'light'

//   // Initialize theme from localStorage or system preference
//   useEffect(() => {
//     // Check if there's a saved preference
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme) {
//       setTheme(savedTheme);
//     } else {
//       // Check system preference
//       const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//       setTheme(prefersDark ? 'dark' : 'light');
//     }
//   }, []);

//   // Update localStorage when theme changes
//   useEffect(() => {
//     localStorage.setItem('theme', theme);
    
//     // Apply theme to body/html element if needed
//     if (theme === 'dark') {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [theme]);

//   // Toggle between dark and light theme
//   const toggleTheme = () => {
//     setTheme(theme === 'dark' ? 'light' : 'dark');
//   };

//   // Set theme explicitly
//   const setThemeExplicitly = (newTheme) => {
//     if (newTheme === 'dark' || newTheme === 'light') {
//       setTheme(newTheme);
//     }
//   };

//   // Helper function to get theme-specific class names
//   const getThemedClass = (darkClass, lightClass) => {
//     return theme === 'dark' ? darkClass : lightClass;
//   };

//   // Theme config object with Winster Crypto Dashboard-inspired color scheme
//   const themeConfig = {
//     // Deep dark blue background for main sections
//     background: 'bg-[#0F172A]', // Dark slate blue, similar to the dashboard background
    
//     // Sidebar and navbar styling
//     sidebar: 'bg-[#1E293B] text-white', // Slightly lighter blue for sidebar
//     navbar: 'bg-[#1E293B] text-white', // Same as sidebar
    
//     // Text colors
//     text: 'text-white', // Bright white for primary text
//     secondaryText: 'text-gray-400', // Muted gray for secondary text
    
//     // Card and container styling
//     card: 'bg-[#1E293B] border-[#334155] border', // Dark blue with subtle border
    
//     // Input styling
//     input: 'bg-[#334155] text-white border-[#475569]', // Slightly lighter blue for inputs
    
//     // Button styling inspired by the dashboard's blue gradient
//     button: {
//       primary: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600',
//       secondary: 'bg-gradient-to-r from-gray-600 to-gray-500 text-white hover:from-gray-700 hover:to-gray-600'
//     },
    
//     // Icon styling
//     icon: 'text-blue-400' // Soft blue for icons
//   };

//   const value = {
//     theme,
//     toggleTheme,
//     setTheme: setThemeExplicitly,
//     getThemedClass,
//     themeConfig,
//     isDark: theme === 'dark'
//   };

//   return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
// };

// export default ThemeProvider;

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

  // Theme config object with custom color scheme
  const themeConfig = {
    // Background with gradient
    background: 'bg-gradient-to-br from-[#1D2229] via-[#171D25] to-[#1B222B]',
    
    // Sidebar and navbar styling
    sidebar: 'bg-[#393E41] text-white', // Onyx color for sidebar
    navbar: 'bg-[#1C3B3C] text-white', // Dark slate gray for navbar
    
    // Text colors
    text: 'text-white', // White for primary text
    secondaryText: 'text-[#2F955A]', // Shamrock green for secondary text
    
    // Card and container styling
    card: 'bg-[#14181B] border-[#314373]', // Eerie black with Marian blue border
    
    // Input styling
    input: 'bg-[#1D2229] text-white border-[#F2683C]', // Raisin black background with Burnt Sienna border
    
    // Button styling 
    button: {
      primary: 'bg-[#F2683C] text-white hover:bg-[#314373]', // Burnt Sienna primary with Marian blue hover
      secondary: 'bg-[#2F955A] text-white hover:bg-[#314373]' // Shamrock green secondary
    },
    
    // Icon styling
    icon: 'text-[#F2683C]' // Burnt Sienna for icons
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