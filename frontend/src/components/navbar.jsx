import React, { useEffect, useState } from "react";
import { FaUser, FaBell, FaSignOutAlt, FaCog } from "react-icons/fa";
import { BsMoon, BsSun } from "react-icons/bs";
import { useTheme } from "../context/ThemeProvider";
import { useAuth } from "../context/AuthProvider";

const Navbar = ({
  title = "App Title",
  userName = "User",
  showThemeToggle = true,
  showNotifications = true,
  showProfile = true,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  customLogo,
  className = "",
  notificationsData = [],
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const { theme, themeConfig, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    if (showNotificationsPanel) setShowNotificationsPanel(false);
  };

  const toggleNotifications = () => {
    setShowNotificationsPanel(!showNotificationsPanel);
    if (showDropdown) setShowDropdown(false);
  };

  // Default notifications if none provided
  const notifications = notificationsData.length > 0 
    ? notificationsData 
    : [
        { id: 1, text: "New notification", time: "2 hours ago", read: false },
        { id: 2, text: "System update", time: "1 day ago", read: true },
      ];

  const handleMenuItemClick = (handler) => {
    if (handler) handler();
    setShowDropdown(false);
  };

  const handleLogout = () => {
    if (onLogoutClick) {
      onLogoutClick();
    } else if (logout) {
      logout();
    }
    setShowDropdown(false);
  };

  // Determine display name
  const displayName = user?.firstName || userName;

 
  const iconColor = theme === "dark" ? "text-white" : "text-gray-800";
  const hoverBg = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200";
  const dropdownBg = theme === "dark" ? "bg-[#121A22]" : "bg-white";
  const unreadBg = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const avatarBg = theme === "dark" ? "bg-gray-700" : "bg-gray-300";

  return (
    <nav
      className={`flex justify-between items-center p-4 shadow-md ${themeConfig[theme].gradientBackground} ${className}`}
    >
      <div className="flex items-center space-x-2">
        {customLogo ? (
          customLogo
        ) : (
          <div className={`text-xl font-bold ${themeConfig[theme].text}`}>{title}</div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        {showThemeToggle && (
          <button 
            onClick={toggleTheme} 
            className={`p-2 text-xl rounded-full ${hoverBg} transition-colors`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === "dark" ? (
              <BsSun className="text-yellow-400" />
            ) : (
              <BsMoon className="text-gray-800" />
            )}
          </button>
        )}

        {/* Notifications */}
        {showNotifications && (
          <div className="relative">
            <button 
              onClick={toggleNotifications} 
              className={`p-2 text-xl relative ${hoverBg} rounded-full transition-colors ${iconColor}`}
              aria-label="Notifications"
            >
              <FaBell />
              {notifications.some((n) => !n.read) && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {showNotificationsPanel && (
              <div className={`absolute right-0 mt-2 w-64 ${dropdownBg} border ${theme === 'dark' ? 'border-[#1E2733]' : 'border-[#BDC3C7]'} rounded-lg p-3 z-50 shadow-lg`}>
                <h3 className={`text-sm font-semibold border-b pb-2 mb-2 ${themeConfig[theme].text}`}>Notifications</h3>
                {notifications.length > 0 ? (
                  <ul>
                    {notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className={`p-2 text-sm rounded ${!notification.read ? unreadBg : ""} ${themeConfig[theme].text}`}
                      >
                        {notification.text}{" "}
                        <span className={`text-xs ${themeConfig[theme].secondaryText} block`}>
                          {notification.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={`text-sm ${themeConfig[theme].secondaryText}`}>No notifications</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Profile Dropdown */}
        {showProfile && (
          <div className="relative">
            <button 
              onClick={toggleDropdown} 
              className={`flex items-center gap-2 p-2 ${hoverBg} rounded-lg transition-colors ${themeConfig[theme].text}`}
              aria-label="User menu"
            >
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={displayName} 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className={`w-8 h-8 ${avatarBg} rounded-full flex items-center justify-center ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  <FaUser />
                </div>
              )}
              <span>{displayName}</span>
            </button>

            {showDropdown && (
              <div className={`absolute right-0 mt-2 w-40 ${dropdownBg} border ${theme === 'dark' ? 'border-[#1E2733]' : 'border-[#BDC3C7]'} rounded-lg p-3 z-50 shadow-lg`}>
                <button
                  onClick={() => handleMenuItemClick(onProfileClick)}
                  className={`flex items-center gap-2 p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} w-full rounded transition-colors ${themeConfig[theme].text}`}
                >
                  <FaUser /> Profile
                </button>
                <button
                  onClick={() => handleMenuItemClick(onSettingsClick)}
                  className={`flex items-center gap-2 p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} w-full rounded transition-colors ${themeConfig[theme].text}`}
                >
                  <FaCog /> Settings
                </button>
                <button
                  onClick={handleLogout}
                  className={`flex items-center gap-2 p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} w-full rounded transition-colors text-red-500`}
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;