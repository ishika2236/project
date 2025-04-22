import React from 'react';
import { useTheme } from '../../../context/ThemeProvider';
import { Users, Book, CalendarCheck, Clock, Bell, ArrowUpRight, Shield } from 'lucide-react';

export default function HeroSection() {
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];
  
  // Get current date for display
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Quick stats for hero section
  const quickStats = [
    { icon: <Users size={18} />, label: 'Total Students', value: '856' },
    { icon: <Book size={18} />, label: 'Active Courses', value: '24' },
    { icon: <CalendarCheck size={18} />, label: 'Today\'s Classes', value: '12' },
    { icon: <Clock size={18} />, label: 'Avg. Attendance', value: '81%' },
  ];
  
  // Recent notifications
  const notifications = [
    { type: 'attendance', message: 'Web Dev Group A attendance below 70%', time: '2h ago' },
    { type: 'system', message: 'System maintenance scheduled for tomorrow', time: '5h ago' },
    { type: 'course', message: 'New student enrollments for UI/UX Design', time: '1d ago' },
  ];

  return (
    <div className="mb-10">
      {/* Top Section with Welcome and Date */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className={`text-3xl font-bold ${colors.gradient.text}`}>Admin Dashboard</h1>
          <p className={`${colors.secondaryText} mt-2`}>Welcome back! Here's what's happening today.</p>
        </div>
        <div className={`${colors.card} px-4 py-2 rounded-lg mt-4 md:mt-0 flex items-center`}>
          <CalendarCheck size={18} className={`${colors.icon} mr-2`} />
          <span className={`${colors.text} text-sm font-medium`}>{formattedDate}</span>
        </div>
      </div>
      
      {/* Enhanced Hero Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className={`${colors.card} p-6 rounded-xl col-span-1 lg:col-span-2`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`${colors.text} text-lg font-semibold`}>Overview</h2>
            <div className={`${theme === 'dark' ? 'bg-[#1E2733]/50' : 'bg-blue-100'} px-3 py-1 rounded-full`}>
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>
                Today
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
              <div key={index} className={`${theme === 'dark' ? 'bg-[#121A22]/40' : 'bg-gray-50'} p-4 rounded-lg`}>
                <div className="flex items-center mb-2">
                  <div className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} mr-2`}>
                    {stat.icon}
                  </div>
                  <span className={`${colors.secondaryText} text-xs`}>{stat.label}</span>
                </div>
                <div className={`${colors.text} text-xl font-bold`}>{stat.value}</div>
              </div>
            ))}
          </div>
          
          {/* Status Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* Student Progress */}
            <div className={`${theme === 'dark' ? 'bg-[#1E2733]/30' : 'bg-orange-50'} p-4 rounded-lg border ${theme === 'dark' ? 'border-[#F2683C]/30' : 'border-orange-200'}`}>
              <div className="flex justify-between items-center mb-2">
                <h3 className={`${theme === 'dark' ? 'text-orange-400' : 'text-orange-700'} text-sm font-medium`}>
                  Student Progress
                </h3>
                <ArrowUpRight size={16} className={`${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
              </div>
              <p className={`${colors.text} text-sm`}>85% of students are on track with coursework</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className={`${theme === 'dark' ? 'bg-orange-500' : 'bg-orange-600'} h-2.5 rounded-full`} style={{ width: '85%' }}></div>
              </div>
            </div>
            
            {/* Server Status */}
            <div className={`${theme === 'dark' ? 'bg-[#1E2733]/30' : 'bg-green-50'} p-4 rounded-lg border ${theme === 'dark' ? 'border-[#2F955A]/30' : 'border-green-200'}`}>
              <div className="flex justify-between items-center mb-2">
                <h3 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-700'} text-sm font-medium`}>
                  System Status
                </h3>
                <Shield size={16} className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <p className={`${colors.text} text-sm`}>All systems operational</p>
              <div className="flex mt-2 gap-2">
                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'}`}>Database</span>
                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'}`}>API</span>
                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'}`}>Storage</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Notifications Panel */}
        <div className={`${colors.card} p-6 rounded-xl`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`${colors.text} text-lg font-semibold`}>Recent Notifications</h2>
            <div className={`${theme === 'dark' ? 'bg-[#1E2733]/50' : 'bg-blue-100'} w-6 h-6 rounded-full flex items-center justify-center`}>
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>
                {notifications.length}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg border-l-4 ${
                  notification.type === 'attendance' 
                    ? `${theme === 'dark' ? 'bg-[#251A1A]/30 border-[#F2683C]' : 'bg-red-50 border-red-500'}`
                    : notification.type === 'system'
                      ? `${theme === 'dark' ? 'bg-[#1A2520]/30 border-[#2F955A]' : 'bg-blue-50 border-blue-500'}`
                      : `${theme === 'dark' ? 'bg-[#222C42]/30 border-[#506EE5]' : 'bg-purple-50 border-purple-500'}`
                }`}
              >
                <div className="flex items-center">
                  <Bell size={14} className={`${colors.icon} mr-2`} />
                  <span className={`${colors.text} text-xs font-medium`}>{notification.message}</span>
                </div>
                <div className="flex justify-end mt-1">
                  <span className={`${colors.secondaryText} text-xs`}>{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
          
          <button className={`w-full mt-4 py-2 text-center text-sm font-medium rounded-lg ${colors.button.primary}`}>
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  );
}