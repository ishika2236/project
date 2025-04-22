import React from "react";
import { useTheme } from "../../../context/ThemeProvider";
import SettingsRow from "./commonComponents/SettingsRow";

export default function GeneralSettings({ colors, toggleTheme, theme }) {
    return (
      <div className={`${colors.card} rounded-lg p-6`}>
        <h2 className={`text-xl font-semibold ${colors.text} mb-6`}>General Settings</h2>
        
        <div className="space-y-6">
          <SettingsRow
            title="Institution Name"
            description="The name of your educational institution"
            colors={colors}
          >
            <input 
              type="text" 
              defaultValue="Tech University"
              className={`w-full max-w-md p-2 rounded-md border ${
                theme === 'dark' ? 'border-[#1E2733] bg-[#0A0E13]/80' : 'border-gray-300 bg-white'
              } ${colors.text}`}
            />
          </SettingsRow>
          
          <SettingsRow
            title="Academic Term"
            description="Set current academic term for reports and analytics"
            colors={colors}
          >
            <select className={`w-full max-w-md p-2 rounded-md border ${
              theme === 'dark' ? 'border-[#1E2733] bg-[#0A0E13]/80' : 'border-gray-300 bg-white'
            } ${colors.text}`}>
              <option>Fall 2024-2025</option>
              <option>Spring 2024-2025</option>
              <option>Summer 2024-2025</option>
            </select>
          </SettingsRow>
          
          <SettingsRow
            title="Default Attendance Policy"
            description="Set the default attendance policy for new courses"
            colors={colors}
          >
            <select className={`w-full max-w-md p-2 rounded-md border ${
              theme === 'dark' ? 'border-[#1E2733] bg-[#0A0E13]/80' : 'border-gray-300 bg-white'
            } ${colors.text}`}>
              <option>80% Minimum Attendance Required</option>
              <option>70% Minimum Attendance Required</option>
              <option>75% Minimum Attendance Required</option>
              <option>No Minimum Requirement</option>
            </select>
          </SettingsRow>
          
          <SettingsRow
            title="System Timezone"
            description="Set the default timezone for attendance tracking"
            colors={colors}
          >
            <select className={`w-full max-w-md p-2 rounded-md border ${
              theme === 'dark' ? 'border-[#1E2733] bg-[#0A0E13]/80' : 'border-gray-300 bg-white'
            } ${colors.text}`}>
              <option>(UTC-08:00) Pacific Time</option>
              <option>(UTC-05:00) Eastern Time</option>
              <option>(UTC+00:00) Greenwich Mean Time</option>
              <option>(UTC+05:30) Indian Standard Time</option>
              <option>(UTC+09:00) Japan Standard Time</option>
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