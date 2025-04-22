import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeProvider';
import { Settings, User, Bell, Shield, Clock, Database, Palette, Globe, Eye, Lock, Server, Download, Upload, Activity } from 'lucide-react';
import SettingsSidebar from '../../components/admin/settings/SettingsSidebar';  
import GeneralSettings from '../../components/admin/settings/GeneralSettings';
import AccountSettings from '../../components/admin/settings/AccountSettings';
import IntegrationSettings from '../../components/admin/settings/IntegrationSettings';
import NotificationSettings from '../../components/admin/settings/NotificationSettings';
import AppearanceSettings from '../../components/admin/settings/AppearanceSettings';
import SystemSettings from '../../components/admin/settings/SystemSettings';
import SecuritySettings from '../../components/admin/settings/SecuritySettings';
export default function AdminSettings() {
  const { themeConfig, theme, toggleTheme } = useTheme();
  const colors = themeConfig[theme];
  
  const [activeTab, setActiveTab] = useState('general');
  
  return (
    <div className={`${colors.background} min-h-screen p-6`}>
      <div className={`max-w-7xl mx-auto`}>
        <header className="mb-8">
          <h1 className={`text-3xl font-bold ${colors.text}`}>Admin Settings</h1>
          <p className={`mt-2 ${colors.secondaryText}`}>
            Configure system settings and preferences for your classroom management platform
          </p>
        </header>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Settings Navigation */}
          <SettingsSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            colors={colors}
          />
          
          {/* Settings Content */}
          <div className="flex-1">
            {activeTab === 'general' && <GeneralSettings colors={colors} toggleTheme={toggleTheme} theme={theme} />}
            {activeTab === 'account' && <AccountSettings colors={colors} />}
            {activeTab === 'notifications' && <NotificationSettings colors={colors} />}
            {activeTab === 'security' && <SecuritySettings colors={colors} />}
            {activeTab === 'appearance' && <AppearanceSettings colors={colors} toggleTheme={toggleTheme} theme={theme} />}
            {activeTab === 'integration' && <IntegrationSettings colors={colors} />}
            {activeTab === 'system' && <SystemSettings colors={colors} />}
          </div>
        </div>
      </div>
    </div>
  );
}

