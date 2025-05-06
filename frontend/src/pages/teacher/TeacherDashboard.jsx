import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeProvider'; 
import { Bell, Book, Calendar, ChevronDown, ChevronRight, Clock, Grid, Home, LogOut, Settings, Users } from 'lucide-react';

// Main Dashboard component with navigation
const TeacherDashboard = () => {
  const { themeConfig, theme, toggleTheme } = useTheme();
  const [activePage, setActivePage] = useState('dashboard');
  const isDark = theme === 'dark';
  
  // Sidebar navigation items
  const navItems = [
    { name: 'Dashboard', icon: <Home size={20} />, id: 'dashboard' },
    { name: 'Classrooms', icon: <Book size={20} />, id: 'classrooms' },
    { name: 'Students', icon: <Users size={20} />, id: 'students' },
    { name: 'Settings', icon: <Settings size={20} />, id: 'settings' },
  ];
  
  return (
    <div className={`flex h-screen w-full ${themeConfig[theme].background}`}>
      
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        
        <div className="flex-1 p-6 overflow-auto">
          {activePage === 'dashboard' && <DashboardContent />}
          {activePage === 'classrooms' && <ClassroomsPage />}
          {activePage === 'students' && <StudentsPage />}
          {activePage === 'settings' && <SettingsPage />}
        </div>
      </div>
    </div>
  );
};

// Dashboard Content
const DashboardContent = () => {
  const { themeConfig, theme } = useTheme();
  const isDark = theme === 'dark';
  
  const stats = [
    { title: "Today's Classes", value: "3", icon: <Calendar size={24} /> },
    { title: "Active Students", value: "78%", icon: <Users size={24} /> },
    { title: "Total Groups", value: "4", icon: <Grid size={24} /> },
    { title: "Upcoming Classes", value: "5", icon: <Clock size={24} /> }
  ];
  
  return (
    <div>
      <div className="flex items-center mb-8">
        <h2 className={`text-2xl font-bold ${themeConfig[theme].text}`}>Welcome back, John!</h2>
        <div className={`ml-3 px-3 py-1 rounded-md text-sm ${
          isDark 
            ? 'bg-[#1E2733]/50 text-blue-400'
            : 'bg-indigo-100 text-indigo-700'
        }`}>
          May 5, 2025
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`${themeConfig[theme].card} p-6 rounded-lg`}>
            <div className="flex justify-between items-center">
              <div>
                <p className={`text-sm ${themeConfig[theme].secondaryText}`}>{stat.title}</p>
                <p className={`text-2xl font-bold mt-1 ${
                  isDark ? themeConfig.dark.text : themeConfig.light.gradient.text
                }`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${
                isDark 
                  ? 'bg-[#1E2733]/70' 
                  : 'bg-indigo-100'
              }`}>
                <span className={themeConfig[theme].icon}>{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${themeConfig[theme].card} p-6 rounded-lg`}>
          <div className="flex items-center justify-between mb-5">
            <h3 className={`text-lg font-semibold ${themeConfig[theme].text}`}>Upcoming Classes</h3>
            <button className={`text-sm px-3 py-1 rounded-lg ${
              isDark
                ? 'bg-[#1E2733]/50 text-blue-400 hover:bg-[#1E2733]'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            }`}>
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {[
              { name: "Advanced Mathematics", time: "10:00 AM", group: "Group A" },
              { name: "Computer Networks", time: "01:30 PM", group: "Group C" },
              { name: "Artificial Intelligence", time: "03:15 PM", group: "Group B" }
            ].map((cls, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                  isDark 
                    ? 'bg-[#121A22]/70 hover:bg-[#121A22] border border-[#1E2733]/50' 
                    : 'bg-white/80 hover:bg-white border border-indigo-50 shadow-sm hover:shadow'
                }`}
              >
                <div>
                  <p className={`font-medium ${themeConfig[theme].text}`}>{cls.name}</p>
                  <p className={`text-sm ${themeConfig[theme].secondaryText}`}>{cls.group}</p>
                </div>
                <div className={`flex items-center px-3 py-1 rounded-full ${
                  isDark 
                    ? 'bg-[#1E2733]/50'
                    : 'bg-indigo-50'
                }`}>
                  <Clock size={14} className={`mr-1 ${
                    isDark ? 'text-blue-400' : 'text-indigo-600'
                  }`} />
                  <span className={`text-sm ${
                    isDark ? 'text-blue-400' : 'text-indigo-600'
                  }`}>{cls.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={`${themeConfig[theme].card} p-6 rounded-lg`}>
          <div className="flex items-center justify-between mb-5">
            <h3 className={`text-lg font-semibold ${themeConfig[theme].text}`}>Recent Attendance</h3>
            <button className={`text-sm px-3 py-1 rounded-lg ${
              isDark
                ? 'bg-[#1E2733]/50 text-blue-400 hover:bg-[#1E2733]'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            }`}>
              Full Report
            </button>
          </div>
          
          <div className="space-y-4">
            {[
              { name: "Advanced Mathematics", attendance: "92%", date: "Today" },
              { name: "Computer Networks", attendance: "88%", date: "Yesterday" },
              { name: "Artificial Intelligence", attendance: "95%", date: "May 2" }
            ].map((cls, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                  isDark 
                    ? 'bg-[#121A22]/70 hover:bg-[#121A22] border border-[#1E2733]/50' 
                    : 'bg-white/80 hover:bg-white border border-indigo-50 shadow-sm hover:shadow'
                }`}
              >
                <div>
                  <p className={`font-medium ${themeConfig[theme].text}`}>{cls.name}</p>
                  <p className={`text-sm ${themeConfig[theme].secondaryText}`}>{cls.date}</p>
                </div>
                <div className="flex items-center">
                  <div className={`w-24 ${isDark ? 'bg-[#1E2733]' : 'bg-indigo-100'} rounded-full h-2`}>
                    <div 
                      className={`${
                        isDark ? 'bg-green-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      } rounded-full h-2`} 
                      style={{ width: cls.attendance }}
                    ></div>
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isDark ? 'text-green-500' : 'text-emerald-600'
                  }`}>{cls.attendance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder components for other pages
const ClassroomsPage = () => {
  const { themeConfig, theme } = useTheme();
  return (
    <div className={`p-6 ${themeConfig[theme].card} rounded-lg`}>
      <h3 className={`text-xl font-bold mb-4 ${themeConfig[theme].text}`}>Classrooms</h3>
      <p className={themeConfig[theme].secondaryText}>Your classroom management will appear here.</p>
    </div>
  );
};

const StudentsPage = () => {
  const { themeConfig, theme } = useTheme();
  return (
    <div className={`p-6 ${themeConfig[theme].card} rounded-lg`}>
      <h3 className={`text-xl font-bold mb-4 ${themeConfig[theme].text}`}>Students</h3>
      <p className={themeConfig[theme].secondaryText}>Your student information will appear here.</p>
    </div>
  );
};

const SettingsPage = () => {
  const { themeConfig, theme } = useTheme();
  return (
    <div className={`p-6 ${themeConfig[theme].card} rounded-lg`}>
      <h3 className={`text-xl font-bold mb-4 ${themeConfig[theme].text}`}>Settings</h3>
      <p className={themeConfig[theme].secondaryText}>Your account settings will appear here.</p>
    </div>
  );
};

export default TeacherDashboard;