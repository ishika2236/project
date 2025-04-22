import React from "react";
import { useTheme } from "../../../context/ThemeProvider";
import { Settings, User, Bell, Shield, Clock, Database, Palette, Globe, Eye, Lock, Server, Download, Upload, Activity } from 'lucide-react';

export default function SettingsSidebar({ activeTab, setActiveTab, colors }) {
    const tabs = [
      { id: 'general', label: 'General Settings', icon: <Settings size={18} /> },
      { id: 'account', label: 'Admin Accounts', icon: <User size={18} /> },
      { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
      { id: 'security', label: 'Privacy & Security', icon: <Shield size={18} /> },
      { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
      { id: 'integration', label: 'Integrations', icon: <Globe size={18} /> },
      { id: 'backup', label: 'Backup & Restore', icon: <Database size={18} /> },
      { id: 'system', label: 'System Status', icon: <Server size={18} /> },
    ];
    const { themeConfig, theme, toggleTheme } = useTheme();
    
    return (
      <div className={`w-full lg:w-64 ${colors.card} p-4 rounded-lg`}>
        <h3 className={`${colors.text} font-semibold mb-4`}>Settings</h3>
        <ul className="space-y-1">
          {tabs.map(tab => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left py-2.5 px-3 rounded-md flex items-center gap-3 transition duration-150 ${
                  activeTab === tab.id
                    ? theme === 'dark'
                      ? 'bg-[#1E2733]/40 text-white'
                      : 'bg-blue-50 text-blue-700'
                    : `${colors.secondaryText} hover:bg-opacity-10 hover:bg-gray-500`
                }`}
              >
                {tab.icon}
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  