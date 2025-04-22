import React from "react";
import { useTheme } from "../../../context/ThemeProvider";
import SettingsRow from "./commonComponents/SettingsRow";
import ToggleSetting from "./commonComponents/ToggleSettings";
 export default function SecuritySettings({ colors }) {
    const { themeConfig, theme, toggleTheme } = useTheme();
  return (
    <div className={`${colors.card} rounded-lg p-6`}>
      <h2 className={`text-xl font-semibold ${colors.text} mb-6`}>Privacy & Security</h2>
      
      <div className="space-y-6">
        <SettingsRow
          title="Authentication Settings"
          description="Configure login and authentication options"
          colors={colors}
        >
          <div className="space-y-3">
            <ToggleSetting 
              label="Two-Factor Authentication Required" 
              defaultChecked={true}
              colors={colors}
            />
            <ToggleSetting 
              label="Allow Single Sign-On (SSO)" 
              defaultChecked={true}
              colors={colors}
            />
            <ToggleSetting 
              label="Auto-Logout After Inactivity" 
              defaultChecked={true}
              colors={colors}
            />
          </div>
        </SettingsRow>
        
        <SettingsRow
          title="Password Policy"
          description="Set password requirements for all users"
          colors={colors}
        >
          <div className="space-y-3">
            <ToggleSetting 
              label="Require Complex Passwords" 
              defaultChecked={true}
              colors={colors}
            />
            <div className="flex items-center justify-between max-w-md">
              <span className={`text-sm ${colors.text}`}>Minimum Password Length</span>
              <select className={`p-1.5 rounded-md border ${
                theme === 'dark' ? 'border-[#1E2733] bg-[#0A0E13]/80' : 'border-gray-300 bg-white'
              } ${colors.text}`}>
                <option>8 characters</option>
                <option>10 characters</option>
                <option>12 characters</option>
              </select>
            </div>
            <div className="flex items-center justify-between max-w-md">
              <span className={`text-sm ${colors.text}`}>Password Expiration</span>
              <select className={`p-1.5 rounded-md border ${
                theme === 'dark' ? 'border-[#1E2733] bg-[#0A0E13]/80' : 'border-gray-300 bg-white'
              } ${colors.text}`}>
                <option>90 days</option>
                <option>60 days</option>
                <option>30 days</option>
                <option>Never</option>
              </select>
            </div>
          </div>
        </SettingsRow>
        
        <SettingsRow
          title="Facial Recognition Data"
          description="Configure storage and usage of biometric data"
          colors={colors}
        >
          <div className="space-y-3">
            <ToggleSetting 
              label="Store Encrypted Facial Templates Only" 
              defaultChecked={true}
              colors={colors}
            />
            <ToggleSetting 
              label="Auto-Delete After Course Completion" 
              defaultChecked={true}
              colors={colors}
            />
            <ToggleSetting 
              label="Allow Students to Delete Their Data" 
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
