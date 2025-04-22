import React from "react";
import { useTheme } from "../../../context/ThemeProvider";
import { useState } from "react";
import SettingsRow from "./commonComponents/SettingsRow";
import ToggleSetting from "./commonComponents/ToggleSettings";
import { Activity } from "lucide-react";
export default function IntegrationSettings({ colors }) {
    const { themeConfig, theme, toggleTheme } = useTheme();
  const [integrations] = useState([
    { id: 1, name: 'Google Classroom', status: 'Connected', icon: <Activity size={20} /> },
    { id: 2, name: 'Microsoft Teams', status: 'Not Connected', icon: <Activity size={20} /> },
    { id: 3, name: 'Canvas LMS', status: 'Connected', icon: <Activity size={20} /> },
  ]);
  
  return (
    <div className={`${colors.card} rounded-lg p-6`}>
      <h2 className={`text-xl font-semibold ${colors.text} mb-6`}>Integrations</h2>
      
      <div className="space-y-6">
        <div className="space-y-4">
          {integrations.map(integration => (
            <div key={integration.id} className={`flex items-center justify-between p-4 border rounded-lg ${
              theme === 'dark' ? 'border-[#1E2733] bg-[#0A0E13]/30' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-md flex items-center justify-center ${
                  theme === 'dark' ? 'bg-[#121A22]' : 'bg-white'
                }`}>
                  {integration.icon}
                </div>
                <div>
                  <h3 className={`font-medium ${colors.text}`}>{integration.name}</h3>
                  <p className={`text-sm ${colors.secondaryText}`}>
                    {integration.status}
                  </p>
                </div>
              </div>
              <button className={`${
                integration.status === 'Connected'
                  ? theme === 'dark' ? 'bg-[#251A1A]/40 text-[#F2683C] border-[#F2683C]/30' : 'bg-red-50 text-red-600 border-red-200'
                  : theme === 'dark' ? 'bg-[#1A2520]/40 text-[#2F955A] border-[#2F955A]/30' : 'bg-green-50 text-green-600 border-green-200'
              } px-3 py-1.5 rounded-md text-sm border`}>
                {integration.status === 'Connected' ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
        
        <SettingsRow
          title="API Access"
          description="Manage API keys and access for external systems"
          colors={colors}
        >
          <div className="space-y-3">
            <ToggleSetting 
              label="Enable API Access" 
              defaultChecked={true}
              colors={colors}
            />
            <div className="flex items-center justify-between max-w-md">
              <span className={`text-sm ${colors.text}`}>API Key</span>
              <div className="flex items-center space-x-2">
                <input 
                  type="password" 
                  value="••••••••••••••••"
                  disabled
                  className={`p-1.5 rounded-md border ${
                    theme === 'dark' ? 'border-[#1E2733] bg-[#0A0E13]/80' : 'border-gray-300 bg-white'
                  } ${colors.text} w-44`}
                />
                <button className={`${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                } text-sm hover:underline`}>
                  Regenerate
                </button>
              </div>
            </div>
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