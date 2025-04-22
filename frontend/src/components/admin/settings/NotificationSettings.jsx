import React from "react";
import { useTheme } from "../../../context/ThemeProvider";
import SettingsRow from "./commonComponents/SettingsRow";
import ToggleSetting from "./commonComponents/ToggleSettings";
export default function NotificationSettings({ colors }) {
    const { themeConfig, theme, toggleTheme } = useTheme();
  return (
    <div className={`${colors.card} rounded-lg p-6`}>
      <h2 className={`text-xl font-semibold ${colors.text} mb-6`}>Notification Settings</h2>
      
      <div className="space-y-6">
        <SettingsRow
          title="Email Notifications"
          description="Configure email notifications for administrators"
          colors={colors}
        >
          <div className="space-y-3">
            <ToggleSetting 
              label="Course Creation Alerts" 
              defaultChecked={true}
              colors={colors}
            />
            <ToggleSetting 
              label="Low Attendance Warnings" 
              defaultChecked={true}
              colors={colors}
            />
            <ToggleSetting 
              label="System Updates" 
              defaultChecked={false}
              colors={colors}
            />
          </div>
        </SettingsRow>
        
        <SettingsRow
          title="Notification Frequency"
          description="Set how often notifications are sent"
          colors={colors}
        >
          <select className={`w-full max-w-md p-2 rounded-md border ${
            theme === 'dark' ? 'border-[#1E2733] bg-[#0A0E13]/80' : 'border-gray-300 bg-white'
          } ${colors.text}`}>
            <option>Immediately</option>
            <option>Daily Digest</option>
            <option>Weekly Summary</option>
          </select>
        </SettingsRow>
        
        <SettingsRow
          title="Student Notification Templates"
          description="Configure notifications sent to students"
          colors={colors}
        >
          <div className="space-y-3">
            <ToggleSetting 
              label="Attendance Confirmation" 
              defaultChecked={true}
              colors={colors}
            />
            <ToggleSetting 
              label="Absence Warnings" 
              defaultChecked={true}
              colors={colors}
            />
            <ToggleSetting 
              label="Course Material Updates" 
              defaultChecked={true}
              colors={colors}
            />
          </div>
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
