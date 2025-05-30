import React, { useState } from "react";
import { FaUser, FaBell, FaSignOutAlt, FaCog } from "react-icons/fa";
import { BsMoon, BsSun } from "react-icons/bs";
import { useTheme } from "../context/ThemeProvider";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../app/features/auth/authThunks";

const Navbar = ({
  title = "App Title",
  userName = "User",
  showThemeToggle = true,
  showNotifications = true,
  showProfile = true,
  onProfileClick,
  onSettingsClick,
  customLogo,
  className = "",
  notificationsData = [],
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const { theme, themeConfig, toggleTheme, isDark } = useTheme();
  
  // Redux state and dispatch
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);

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
    if (onSettingsClick) {
      onSettingsClick();
    }
    dispatch(logout());
    setShowDropdown(false);
  };

  // Determine display name
  const displayName = user?.firstName || userName;

  // Using theme configuration instead of hardcoded values
  const currentTheme = themeConfig[theme];
  const hoverBg = isDark ? "hover:bg-gray-700" : "hover:bg-slate-100";
  const dropdownBg = isDark ? currentTheme.card : "bg-white shadow-lg";
  const dropdownBorder = isDark ? "border-[#1E2733]" : "border-slate-200";
  const avatarBg = isDark ? "bg-gray-700" : "bg-[#4E8CEC]/20";
  const iconColor = isDark ? "text-white" : "text-[#31B7AF]";
  const navBg = isDark ? currentTheme.gradientBackground : "bg-white";

  return (
    <nav
      className={`flex justify-between items-center p-4 z-10 shadow-md ${navBg} ${className}`}
    >
      <div className="flex items-center space-x-2">
        {customLogo ? (
          customLogo
        ) : (
          <div className={`text-xl font-bold ${isDark ? currentTheme.text : "text-[#31B7AF]"}`}>{title}</div>
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
            {isDark ? (
              <BsSun className="text-yellow-400" />
            ) : (
              <BsMoon className="text-[#6D77D8]" />
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
              <div className={`absolute right-0 mt-2 w-64 ${dropdownBg} border ${dropdownBorder} rounded-lg p-3 z-50`}>
                <h3 className={`text-sm font-semibold border-b pb-2 mb-2 ${currentTheme.text}`}>Notifications</h3>
                {notifications.length > 0 ? (
                  <ul>
                    {notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className={`p-2 text-sm rounded ${!notification.read ? (isDark ? "bg-gray-700" : "bg-[#F3F6FA]") : ""} ${currentTheme.text}`}
                      >
                        {notification.text}{" "}
                        <span className={`text-xs ${currentTheme.secondaryText} block`}>
                          {notification.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={`text-sm ${currentTheme.secondaryText}`}>No notifications</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Profile Dropdown */}
        {showProfile && isAuthenticated && (
          <div className="relative">
            <button 
              onClick={toggleDropdown} 
              className={`flex items-center gap-2 p-2 ${hoverBg} rounded-lg transition-colors ${currentTheme.text}`}
              aria-label="User menu"
            >
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={displayName} 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className={`w-8 h-8 ${avatarBg} rounded-full flex items-center justify-center ${isDark ? 'text-white' : 'text-[#4E8CEC]'}`}>
                  <FaUser />
                </div>
              )}
              <span>{displayName}</span>
            </button>

            {showDropdown && (
              <div className={`absolute right-0 mt-2 w-40 ${dropdownBg} border ${dropdownBorder} rounded-lg p-3 z-50`}>
                <button
                  onClick={() => handleMenuItemClick(onProfileClick)}
                  className={`flex items-center gap-2 p-2 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-[#F3F6FA]'} w-full rounded transition-colors ${currentTheme.text}`}
                >
                  <FaUser className={isDark ? "" : "text-[#6D77D8]"} /> Profile
                </button>
                <button
                  onClick={() => handleMenuItemClick(onSettingsClick)}
                  className={`flex items-center gap-2 p-2 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-[#F3F6FA]'} w-full rounded transition-colors ${currentTheme.text}`}
                >
                  <FaCog className={isDark ? "" : "text-[#6D77D8]"} /> Settings
                </button>
                <button
                  onClick={handleLogout}
                  className={`flex items-center gap-2 p-2 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-[#F3F6FA]'} w-full rounded transition-colors ${isDark ? "text-red-500" : "text-[#FF5A5A]"}`}
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