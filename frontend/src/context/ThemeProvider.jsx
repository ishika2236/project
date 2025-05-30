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
    // Dark theme 
    dark: {
      background: 'bg-[#0A0E13]',
      text: 'text-white',
      secondaryText: 'text-[#5E6E82]',
      gradientBackground: 'bg-gradient-to-b from-[#121A22] to-[#0A0E13]',
      card: 'bg-gradient-to-br from-[#121A22] to-[#0A0E13]/50 border border-[#1E2733] shadow-xl',
      icon: 'text-white',
      button: {
        primary: 'bg-gradient-to-r from-[#506EE5]/60 via-[#222C42]/40 to-[#1D2229] text-white ' +
                'hover:from-[#506EE5] hover:to-[#1D2229] ' +
                'border-2 border-[#1E4FFF]/30 rounded-lg ' +
                'transition-all duration-300 ease-in-out',
        secondary: 'bg-[#1A1D25] text-white hover:bg-[#252A35] ' +
                  'border border-[#2E3441] rounded-lg ' +
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
                'transition-all duration-300 ease-in-out',
        danger: 'bg-gradient-to-r from-[#251A1A]/80 to-[#0A0E13]/90 text-white ' +
               'hover:from-[#F2683C]/30 hover:to-[#0A0E13]/80 ' +
               'border-2 border-[#F2683C]/60 rounded-lg ' +
               'shadow-[inset_0_0_15px_rgba(242,104,60,0.3)] ' +
               'transition-all duration-300 ease-in-out'
      },
      input: 'bg-[#151921] border border-[#2E3441] text-white rounded-lg focus:ring-[#506EE5]/50 focus:border-[#506EE5]/50',
      select: 'bg-[#151921] border border-[#2E3441] text-white rounded-lg focus:ring-[#506EE5]/50 focus:border-[#506EE5]/50',
      gradient: {
        text: 'bg-gradient-to-r from-[#2E67FF] to-[#2F955A] bg-clip-text text-transparent',
        accent: 'bg-gradient-to-r from-[#F2683C] to-[#2F955A]'
      },
      table: {
        header: 'bg-[#1A1D25] text-white font-medium p-4 rounded-t-lg',
        row: 'border-b border-[#2E3441] hover:bg-[#1A1D25]/50',
        cell: 'px-4 py-3',
        accent1: 'text-[#2F955A] font-medium',
        accent2: 'text-[#F2683C] font-medium'
      },
      nav: {
        sidebar: 'bg-[#0F141A] border-r border-[#2E3441]',
        active: 'bg-[#506EE5]/20 text-[#506EE5]',
        inactive: 'text-[#5E6E82] hover:text-white hover:bg-[#1A1D25]/50'
      }
    },
  
    // Updated light theme based on the dashboard image
    light: {
      background: 'bg-[#F3F6FA]', // Light gray-blue background from dashboard
      text: 'text-slate-800',
      secondaryText: 'text-slate-500',
      gradientBackground: 'bg-white',  // Pure white navbar
      
      // Card styling matching the dashboard cards
      card: 'bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300',
      
      // Using the blue/teal colors from the dashboard for icons (matching sidebar icons)
      icon: 'text-[#31B7AF]',
      
      // Button styles with dashboard colors
      button: {
        primary: 'bg-gradient-to-r from-[#4E8CEC] to-[#6D84C1] text-white ' +
                'hover:from-[#3E7BD9] hover:to-[#5C73B0] ' +
                'border-none rounded-lg ' +
                'transition-all duration-300 ease-in-out',
        secondary: 'bg-white text-slate-700 hover:bg-slate-50 ' +
                  'border border-slate-200 rounded-lg ' +
                  'transition-all duration-300 ease-in-out',
        gradient: 'bg-gradient-to-r from-[#31B7AF]/20 to-[#4E8CEC]/20',
        green: 'bg-[#31B7AF] text-white ' +
              'hover:bg-[#2AA39B] ' +
              'border-none rounded-lg ' +
              'shadow-sm ' +
              'transition-all duration-300 ease-in-out',
        orange: 'bg-[#FF9F5A] text-white ' +
               'hover:bg-[#F08F4A] ' +
               'border-none rounded-lg ' +
               'shadow-sm ' +
               'transition-all duration-300 ease-in-out',
        danger: 'bg-[#FF5A5A] text-white ' +
               'hover:bg-[#E55050] ' +
               'border-none rounded-lg ' +
               'shadow-sm ' +
               'transition-all duration-300 ease-in-out',
        lavender: 'bg-[#6D77D8] text-white ' +
                'hover:bg-[#5C66C7] ' +
                'border-none rounded-lg ' +
                'shadow-sm ' +
                'transition-all duration-300 ease-in-out'
      },
      input: 'bg-white border border-slate-200 text-slate-800 rounded-lg focus:ring-[#4E8CEC]/50 focus:border-[#4E8CEC]/50',
      select: 'bg-white border border-slate-200 text-slate-800 rounded-lg focus:ring-[#4E8CEC]/50 focus:border-[#4E8CEC]/50',
      
      // Gradient styles matching dashboard
      gradient: {
        text: 'bg-gradient-to-r from-[#4E8CEC] to-[#31B7AF] bg-clip-text text-transparent',
        accent: 'bg-gradient-to-r from-[#FF5A5A] to-[#31B7AF]'
      },
      
      // Card colors from the dashboard
      statCard: {
        teal: 'bg-[#31B7AF] text-white rounded-xl shadow-md',  // Left card
        blue: 'bg-[#4E8CEC] text-white rounded-xl shadow-md',  // Middle left card
        purple: 'bg-[#6D77D8] text-white rounded-xl shadow-md', // Table header purple
        lavender: 'bg-[#6D84C1] text-white rounded-xl shadow-md', // Right card
      },
      
      // Chart colors from the image
      chart: {
        line1: 'stroke-[#31B7AF]', // Teal line (uniques)
        line2: 'stroke-[#6D77D8]', // Purple line (impressions)
        dot: 'fill-[#31B7AF] stroke-white',
        grid: 'stroke-slate-200',
        label: 'text-slate-500'
      },
      
      // Table styles from the image earnings section
      table: {
        header: 'bg-[#6D77D8] text-white font-medium p-4 rounded-t-lg',
        row: 'border-b border-slate-200 hover:bg-slate-50',
        cell: 'px-4 py-3',
        accent1: 'text-[#31B7AF] font-medium', // Level Commission (teal)
        accent2: 'text-[#FF5A5A] font-medium'   // Rank Commission (red)
      },
      
      // Navigation styles - updated to match the dashboard sidebar and nav
      nav: {
        sidebar: 'bg-white border-r border-slate-200 shadow-sm',
        active: 'bg-[#6D77D8]/10 text-[#6D77D8] border-l-4 border-[#6D77D8]',
        inactive: 'text-slate-500 hover:text-[#31B7AF] hover:bg-slate-100/50'
      },
      
      // Stats counter cards from dashboard
      counter: {
        value: 'text-4xl font-bold',
        label: 'text-sm text-slate-500 uppercase tracking-wider'
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

//   // Theme config object with common color mappings
//   const themeConfig = {
//     // Dark theme (unchanged)
//     dark: {
//       background: 'bg-[#0A0E13]',
//       text: 'text-white',
//       gradientBackground: 'bg-gradient-to-b from-[#121A22] to-[#0A0E13]',
//       card: 'bg-gradient-to-br from-[#121A22] to-[#0A0E13]/50 border border-[#1E2733] shadow-xl',
//       icon: 'text-white',
//       secondaryText: 'text-[#5E6E82]',
//       button: {
//         primary: 'bg-gradient-to-r from-[#506EE5]/60 via-[#222C42]/40 to-[#1D2229] text-white ' +
//                 'hover:from-[#506EE5] hover:to-[#1D2229] ' +
//                 'border-2 border-[#1E4FFF]/30 border-rounded-lg ' +
//                 'transition-all duration-300 ease-in-out',
//         gradient: 'bg-gradient-to-r from-[#F2683C]/20 to-[#2F955A]/20',
//         green: 'bg-gradient-to-r from-[#1A2520]/80 to-[#0A0E13]/90 text-white ' +
//               'hover:from-[#2F955A]/20 hover:to-[#0A0E13]/80 ' +
//               'border-2 border-[#2F955A]/50 rounded-lg ' +
//               'shadow-[inset_0_0_15px_rgba(47,149,90,0.3)] ' +
//               'transition-all duration-300 ease-in-out',
//         orange: 'bg-gradient-to-r from-[#251A1A]/80 to-[#0A0E13]/90 text-white ' +
//                 'hover:from-[#F2683C]/20 hover:to-[#0A0E13]/80 ' +
//                 'border-2 border-[#F2683C]/50 rounded-lg ' +
//                 'shadow-[inset_0_0_15px_rgba(242,104,60,0.3)] ' +
//                 'transition-all duration-300 ease-in-out'
//       },
//       gradient: {
//         text: 'bg-gradient-to-r from-[#2E67FF] to-[#2F955A] bg-clip-text text-transparent',
//         accent: 'bg-gradient-to-r from-[#F2683C] to-[#2F955A]'
//       }
//     },
  
//     // Updated light theme based on the dashboard design
//     light: {
//       background: 'bg-[#F3F6FA]', // Light gray-blue background from dashboard
//       text: 'text-slate-800',
//       gradientBackground: 'bg-gradient-to-br from-[#F8FAFD] to-[#F3F6FA]',
      
//       // Card styling matching the dashboard cards
//       card: 'bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300',
      
//       // Using the blue color from the dashboard for icons
//       icon: 'text-[#4E8CEC]',
      
//       // Using slate from the dashboard
//       secondaryText: 'text-slate-500',
    
//       // Button styles with dashboard colors - maintaining structure similar to dark theme
//       button: {
//         primary: 'bg-gradient-to-r from-[#4E8CEC] to-[#6D84C1] text-white ' +
//                 'hover:from-[#3E7BD9] hover:to-[#5C73B0] ' +
//                 'border-2 border-[#4E8CEC]/30 rounded-lg ' +
//                 'transition-all duration-300 ease-in-out',
//         gradient: 'bg-gradient-to-r from-[#31B7AF]/20 to-[#4E8CEC]/20',
//         green: 'bg-[#31B7AF] text-white ' +
//               'hover:bg-[#2AA39B] ' +
//               'border-2 border-[#31B7AF]/50 rounded-lg ' +
//               'shadow-[inset_0_0_15px_rgba(49,183,175,0.2)] ' +
//               'transition-all duration-300 ease-in-out',
//         orange: 'bg-[#FF5A5A] text-white ' +
//                'hover:bg-[#E55050] ' +
//                'border-2 border-[#FF5A5A]/50 rounded-lg ' +
//                'shadow-[inset_0_0_15px_rgba(255,90,90,0.2)] ' +
//                'transition-all duration-300 ease-in-out'
//       },
      
//       // Gradient styles matching dashboard while keeping the same structure as dark theme
//       gradient: {
//         text: 'bg-gradient-to-r from-[#4E8CEC] to-[#31B7AF] bg-clip-text text-transparent',
//         accent: 'bg-gradient-to-r from-[#FF5A5A] to-[#31B7AF]'
//       },
      
//       // Additional styles needed for dashboard elements but keeping structure similar
//       statCard: {
//         teal: 'bg-[#31B7AF] text-white rounded-xl shadow-md',
//         blue: 'bg-[#4E8CEC] text-white rounded-xl shadow-md',
//         purple: 'bg-[#6D84C1] text-white rounded-xl shadow-md'
//       },
      
//       chart: {
//         line1: 'stroke-[#31B7AF]', // Teal line
//         line2: 'stroke-[#6D77D8]', // Purple line
//         dot: 'fill-[#31B7AF] stroke-white'
//       },
      
//       // Dashboard specific elements as extensions
//       table: {
//         header: 'bg-[#6D77D8] text-white font-medium p-4 rounded-t-lg',
//         row: 'border-b border-slate-200 hover:bg-slate-50',
//         cell: 'px-4 py-3',
//         tealText: 'text-[#31B7AF] font-medium',
//         redText: 'text-[#FF5A5A] font-medium'
//       },
      
//       nav: {
//         sidebar: 'bg-white border-r border-slate-200',
//         active: 'bg-[#6D77D8]/10 text-[#6D77D8]',
//         inactive: 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
//       }
//     }
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