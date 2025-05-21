import React, { useState } from "react";
import Sidebar from '../../components/sidebar'
import Navbar from '../../components/navbar'
import { useTheme } from "../../context/ThemeProvider"; 

const StudentEnroll = () => {
  const [courseName, setCourseName] = useState("");
  const [message, setMessage] = useState("");
  const { themeConfig, theme, isDark } = useTheme();

  const handleEnroll = (e) => {
    e.preventDefault();
    if (courseName.trim() === "") {
      setMessage("Please enter a course name.");
      return;
    }
    setMessage(`Enrollment request for "${courseName}" sent!`);
    setCourseName("");
  };

  // Get current theme's styles
  const currentTheme = themeConfig[theme];

  return (
    <div className="flex">
     
      <div className="flex-1 flex flex-col">
        
        
        {/* Main Dashboard Section with themed background */}
        <div className={`flex-1 min-h-screen ${currentTheme.background} p-6`}>
          <div className="max-w-md mx-auto">
            <h1 className={`text-2xl font-bold mb-4 ${currentTheme.text}`}>
              Enroll in a New Course
            </h1>
            
            {/* Card with themed styling */}
            <div className={`${currentTheme.card} p-6 rounded-lg`}>
              <form onSubmit={handleEnroll}>
                <label className={`block mb-2 text-sm font-medium ${currentTheme.text}`}>
                  Course Name
                </label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="Enter course name..."
                  className={`w-full p-2 border rounded-lg ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-white" 
                      : "bg-white border-indigo-100 text-gray-800"
                  }`}
                />
                
                {/* Themed button based on current theme */}
                <button 
                  type="submit" 
                  className={`mt-4 w-full p-2 rounded-lg ${currentTheme.button.primary}`}
                >
                  Enroll
                </button>
                
                {/* Success message with themed text */}
                {message && (
                  <p className={`mt-2 ${currentTheme.gradient.text}`}>
                    {message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentEnroll;