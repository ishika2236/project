import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  ClipboardList, 
  UserPlus, 
  BarChart, 
  StickyNote, 
  Bell, 
  PlusCircle, 
  Menu,
  User,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Book,
  Calendar,
  Share2,
  Home,
  GroupIcon,
  BookUser
} from "lucide-react";
import { useTheme } from "../context/ThemeProvider";
import { useSelector } from "react-redux";

const Sidebar = ({activeView, selectedCourse, selectedGroup, selectedClass, onNavigate}) => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, themeConfig, isDark } = useTheme();
  const [sidebarContent, setSidebarContent] = useState([]);
  const { user } = useSelector(state => state.auth);
  const location = useLocation();
  
  // Define icon colors based on theme - bolder colors for light theme
  const iconColor = isDark ? "#2F955A" : "#1C2833"; // Green for dark, darker blue-gray for light

  const sideBarItems = {
    teacher: [
      { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} />, link: "/teacher/dashboard" },
      { id: "classroom", label: "Classroom", icon: <BookUser size={20} />, link: "/teacher/classroom" },
      { id: "groups", label: "Attendance Records", icon: <GroupIcon size={20} />, link: "/teacher/groups" },
     
           
    ],
    student: [
      { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} />, link: "/student/dashboard" },
      // { id: "courses", label: "Courses", icon: <BookOpen size={20} />, link: "/student/courses" },
      { id: "attendance", label: "Attendance", icon: <ClipboardList size={20} />, link: "/student/attendance" },

      // { id: "enroll", label: "Enroll Course", icon: <PlusCircle size={20} />, link: "/student/enroll" },
    ],
    admin: [
      { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} />, link: "/admin/dashboard" },
      { id: "users", label: "Users", icon: <User size={20} />, link: "/admin/enrolledUsers" },
      { id: "departments", label: "Department", icon: <Settings size={20} />, link: "/admin/manageDepartments" },
      { id: "courses", label: "Courses", icon: <BookOpen size={20} />, link: "/admin/manageCourses" },
      { id: "groups", label: "Groups", icon: <Users size={20} />, link: "/admin/manageGroups" },
      { id: "attendance", label: "Attendance", icon: <ClipboardList size={20} />, link: "/admin/manageAttendance" },
      { id: "settings", label: "Settings", icon: <Settings size={20} />, link: "/admin/adminSettings" },
    ]
  };

  useEffect(() => {
    if (user && user.role) {
      setSidebarContent(sideBarItems[user.role] || []);
    }
  }, [user, selectedCourse, selectedGroup, selectedClass]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Get appropriate text color based on theme
  const textColor = isDark
    ? themeConfig.dark.text
    : themeConfig.light.text;
  
  const secondaryTextColor = isDark
    ? themeConfig.dark.secondaryText
    : themeConfig.light.secondaryText;

  // Determine active item style based on theme - bolder for light theme
  const activeItemStyle = isDark
    ? 'bg-[#171D25] border-l-4 border-[#2F955A]'
    : 'bg-[#BDC3C7]/50 border-l-4 border-[#1C2833]'; // More opaque background for bolder appearance

  // Choose the appropriate button style based on theme - solid for light theme
  const settingsButtonStyle = isDark 
    ? themeConfig.dark.button.green 
    : themeConfig.light.button.lavender;

  return (
    <div 
      className={`
        transition-all duration-300 z-100
        ${collapsed ? "w-20" : "w-64"} 
        flex flex-col min-h-full
        ${isDark ? themeConfig.dark.gradientBackground : 'bg-white'}
        ${isDark ? 'border-r border-[#1E2733]' : 'border-r border-[#AAB7B8]'}
      `}
    >
      {/* Sidebar Header */}
      <div className={`
        p-5 flex justify-between items-center 
        ${isDark ? 'border-b border-[#1E2733]/50' : 'border-b border-[#AAB7B8]'}
      `}>
        {!collapsed && (
          <div className={`
            font-bold text-xl
            ${isDark ? themeConfig.dark.gradient.text : 'text-[#1C2833]'}
          `}>
            Smart Attend
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className={`
            p-2 rounded-full focus:outline-none 
            ${isDark ? 'hover:bg-[#171D25]' : 'hover:bg-[#BDC3C7]/50'}
            transition-all duration-200
            ${collapsed ? 'mx-auto' : 'ml-auto'}
          `}
        >
          {collapsed ? 
            <ChevronRight size={20} color={iconColor} /> : 
            <ChevronLeft size={20} color={iconColor} />
          }
        </button>
      </div>

      {/* Sidebar Menu */}
      <div className="flex-1 overflow-y-auto py-5 px-3">
        {user && user.role ? (
          <ul className="space-y-1">
            {sidebarContent.map((item) => {
              const isActiveItem = isActive(item.link);
              return (
                <li key={item.id}>
                  <Link
                    to={item.link}
                    className={`
                      flex items-center px-4 py-3 rounded-lg
                      transition-all duration-200
                      ${isActiveItem ? activeItemStyle : ''}
                      ${isDark 
                        ? 'hover:bg-[#171D25] hover:border-l-4 hover:border-[#2F955A]/50' 
                        : 'hover:bg-[#BDC3C7]/40 hover:border-l-4 hover:border-[#1C2833]/80'
                      }
                    `}
                  >
                    <div className={`
                      ${isActiveItem ? (isDark ? 'text-[#2F955A]' : 'text-[#1C2833]') : (isDark ? 'text-white/70' : textColor)}
                    `}>
                      {React.cloneElement(item.icon, { 
                        color: isActiveItem ? iconColor : (isDark ? '#FFFFFF99' : '#2E4053')
                      })}
                    </div>
                    {!collapsed && (
                      <span className={`
                        ml-3 font-medium text-sm truncate
                        ${isActiveItem 
                          ? (isDark ? 'text-white' : 'text-[#1C2833] font-semibold') 
                          : (isDark ? 'text-white/70' : secondaryTextColor)
                        }
                      `}>
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className={`text-center p-4 ${secondaryTextColor}`}>
            Loading menu...
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="p-4 mt-auto">
        <Link 
          to="/settings"
          className={`
            flex items-center justify-center ${collapsed ? 'p-3' : 'px-4 py-3'} 
            rounded-lg transition-all duration-200
            ${collapsed 
              ? (isDark ? 'bg-[#171D25]/80 hover:bg-[#171D25]' : 'bg-[#2E4053]/10 hover:bg-[#2E4053]/20')
              : settingsButtonStyle
            }
          `}
        >
          <Settings size={20} color={iconColor} />
          {!collapsed && <span className={`ml-3 font-medium ${isDark ? '' : 'text-white'}`}>Settings</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;