import React from "react";
import SettingsRow from "./commonComponents/SettingsRow";
import { useTheme } from "../../../context/ThemeProvider";
import ThemeToggleButton from "./commonComponents/ThemeToggle";
import { Settings } from "lucide-react";

export default function AppearanceSettings({ colors }) {
  const { toggleTheme, theme } = useTheme();
    return (
      <div className={`${colors.card} rounded-lg p-6`}>
        <h2 className={`text-xl font-semibold ${colors.text} mb-6`}>Appearance Settings</h2>
        
        <div className="space-y-6">
          <SettingsRow
            title="Theme"
            description="Choose between light and dark mode"
            colors={colors}
          >
            <div className="flex space-x-4">
              <ThemeToggleButton 
                theme={theme}
                currentTheme="light"
                toggleTheme={toggleTheme}
                label="Light"
                colors={colors}
              />
              <ThemeToggleButton 
                theme={theme}
                currentTheme="dark"
                toggleTheme={toggleTheme}
                label="Dark"
                colors={colors}
              />
            </div>
          </SettingsRow>
          
          <SettingsRow
            title="Branding"
            description="Upload custom logo and set institution colors"
            colors={colors}
          >
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${colors.secondaryText} mb-2`}>
                  Institution Logo
                </label>
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-md flex items-center justify-center ${
                    theme === 'dark' ? 'bg-[#121A22]' : 'bg-gray-100'
                  }`}>
                    <Settings size={24} className={colors.text} />
                  </div>
                  <button className={`${
                    theme === 'dark' 
                      ? 'bg-[#121A22] border border-[#1E2733] text-white hover:bg-[#1E2733]' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  } px-3 py-1.5 rounded-md text-sm`}>
                    Upload New Logo
                  </button>
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${colors.secondaryText} mb-2`}>
                  Primary Color
                </label>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600"></div>
                  <input 
                    type="text" 
                    value="#2563EB" 
                    className={`p-1.5 rounded-md border ${
                      theme === 'dark' ? 'border-[#1E2733] bg-[#0A0E13]/80' : 'border-gray-300 bg-white'
                    } ${colors.text} w-32`}
                  />
                </div>
              </div>
            </div>
          </SettingsRow>
          
          <SettingsRow
            title="Default Layout"
            description="Set default layout preferences for dashboard"
            colors={colors}
          >
            <select className={`w-full max-w-md p-2 rounded-md border ${
              theme === 'dark' ? 'border-[#1E2733] bg-[#0A0E13]/80' : 'border-gray-300 bg-white'
            } ${colors.text}`}>
              <option>Compact View</option>
              <option>Detailed View</option>
              <option>Card Layout</option>
            </select>
          </SettingsRow>
          
          <div className="pt-4">
            <button className={colors.button.primary + " px-4 py-2 rounded-md"}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }