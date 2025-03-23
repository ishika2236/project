import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="absolute top-4 right-4 p-2 rounded-full z-20 border transition-colors"
      style={{
        backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        borderColor: theme === 'dark' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(22, 163, 74, 0.3)',
      }}
    >
      {theme === 'dark' ? (
        <Sun size={20} className="text-yellow-300" />
      ) : (
        <Moon size={20} className="text-blue-700" />
      )}
    </button>
  );
};

export default ThemeToggle;