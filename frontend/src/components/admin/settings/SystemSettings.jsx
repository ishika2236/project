import React from "react";
import { useState } from "react";
import { useTheme } from "../../../context/ThemeProvider";
import SettingsRow from "./commonComponents/SettingsRow";
import ToggleSetting from "./commonComponents/ToggleSettings";
export default function SystemSettings({ colors }) {
    const { theme } = useTheme();
    const [metrics] = useState({
      cpuUsage: 32,
      memoryUsage: 68,
      diskUsage: 45,
      uptime: '23 days, 7 hours'
    });
  
    return (
      <div className={`${colors.card} rounded-lg p-6`}>
        <h2 className={`text-xl font-semibold ${colors.text} mb-6`}>System Status</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-[#0A0E13]/60 border border-[#1E2733]' : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className={`font-medium ${colors.text}`}>CPU Usage</h3>
                <span className={`${metrics.cpuUsage > 80 ? 'text-red-500' : theme === 'dark' ? 'text-[#2F955A]' : 'text-green-600'} font-medium`}>
                  {metrics.cpuUsage}%
                </span>
              </div>
              <div className="w-full bg-gray-700/20 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    theme === 'dark' ? 'bg-gradient-to-r from-[#2F955A] to-[#1E4FFF]/70' : 'bg-blue-600'
                  }`}
                  style={{ width: `${metrics.cpuUsage}%` }}
                ></div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-[#0A0E13]/60 border border-[#1E2733]' : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className={`font-medium ${colors.text}`}>Memory Usage</h3>
                <span className={`${metrics.memoryUsage > 80 ? 'text-red-500' : theme === 'dark' ? 'text-[#F2683C]' : 'text-orange-600'} font-medium`}>
                  {metrics.memoryUsage}%
                </span>
              </div>
              <div className="w-full bg-gray-700/20 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    theme === 'dark' ? 'bg-gradient-to-r from-[#F2683C] to-[#E9BF47]' : 'bg-orange-500'
                  }`}
                  style={{ width: `${metrics.memoryUsage}%` }}
                ></div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-[#0A0E13]/60 border border-[#1E2733]' : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className={`font-medium ${colors.text}`}>Disk Usage</h3>
                <span className={`${metrics.diskUsage > 80 ? 'text-red-500' : theme === 'dark' ? 'text-[#506EE5]' : 'text-blue-600'} font-medium`}>
                  {metrics.diskUsage}%
                </span>
              </div>
              <div className="w-full bg-gray-700/20 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    theme === 'dark' ? 'bg-gradient-to-r from-[#506EE5] to-[#1E4FFF]' : 'bg-blue-600'
                  }`}
                  style={{ width: `${metrics.diskUsage}%` }}
                ></div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-[#0A0E13]/60 border border-[#1E2733]' : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-medium ${colors.text}`}>System Uptime</h3>
                <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-700'} font-medium`}>
                  {metrics.uptime}
                </span>
              </div>
            </div>
          </div>
          
          <SettingsRow
            title="Server Maintenance"
            description="Schedule regular maintenance tasks"
            colors={colors}
          >
            <div className="space-y-3">
              <ToggleSetting 
                label="Enable Automatic Updates" 
                defaultChecked={true}
                colors={colors}
              />
              <div className="flex items-center justify-between max-w-md">
                <span className={`text-sm ${colors.text}`}>Maintenance Window</span>
                <select className={`p-1.5 rounded-md border ${
                  theme === 'dark' ? 'border-[#1E2733] bg-[#0A0E13]/80' : 'border-gray-300 bg-white'
                } ${colors.text}`}>
                  <option>Weekends, 2:00 AM</option>
                  <option>Weekdays, 3:00 AM</option>
                  <option>Sunday, 1:00 AM</option>
                </select>
              </div>
            </div>
          </SettingsRow>
          
          <SettingsRow
            title="Storage Management"
            description="Configure automatic cleanup of old data"
            colors={colors}
          >
            <div className="space-y-3">
              <ToggleSetting 
                label="Auto-Clean Old Reports" 
                defaultChecked={true}
                colors={colors}
              />
              <div className="flex items-center justify-between max-w-md">
                <span className={`text-sm ${colors.text}`}>Delete Reports Older Than</span>
                <select className={`p-1.5 rounded-md border ${
                  theme === 'dark' ? 'border-[#1E2733] bg-[#0A0E13]/80' : 'border-gray-300 bg-white'
                } ${colors.text}`}>
                  <option>6 months</option>
                  <option>1 year</option>
                  <option>2 years</option>
                  <option>Never</option>
                </select>
              </div>
              <ToggleSetting 
                label="Auto-Archive Completed Courses" 
                defaultChecked={true}
                colors={colors}
              />
            </div>
          </SettingsRow>
          
          <div className="pt-4 flex space-x-4">
            <button className={colors.button.primary + " px-4 py-2 rounded-md"}>
              Save Changes
            </button>
            <button className={`${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-[#251A1A]/80 to-[#0A0E13]/90 text-white hover:from-[#F2683C]/20 hover:to-[#0A0E13]/80 border-2 border-[#F2683C]/50'
                : 'bg-orange-100 text-orange-700 border border-orange-200 hover:bg-orange-200'
            } px-4 py-2 rounded-md`}>
              Reset System
            </button>
          </div>
        </div>
      </div>
    );
  }
