import React, { useState } from 'react';
import { FaUser, FaBell, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { BsMoon, BsSun } from 'react-icons/bs';
import './index.css';
import { useTheme } from '../theme';

const Navbar = ({ 
  userName = 'User', 
  userAvatar = null,
  onProfileClick,
  onSettingsClick,
  onLogoutClick 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    if (showNotifications) setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showDropdown) setShowDropdown(false);
  };

  // Sample notifications
  const notifications = [
    {
      id: 1,
      text: 'New attendance report available',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      text: 'Course schedule updated',
      time: '1 day ago',
      read: true
    }
  ];

  const handleMenuItemClick = (handler) => {
    if (handler) handler();
    setShowDropdown(false);
  };

  return (
    <nav className={`navbar ${theme === 'dark' ? 'navbar-dark' : 'navbar-light'}`}>
      <div className="navbar-left">
        <h2 className="navbar-brand">Attendance App</h2>
      </div>
      
      <div className="navbar-right">
        {/* Theme toggle */}
        <button 
          className="navbar-icon-btn" 
          onClick={toggleTheme} 
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <BsSun /> : <BsMoon />}
        </button>
        
        {/* Notifications */}
        <div className="navbar-dropdown-container">
          <button 
            className="navbar-icon-btn" 
            onClick={toggleNotifications}
            aria-label="Notifications"
          >
            <FaBell />
            {notifications.some(n => !n.read) && <span className="notification-badge"></span>}
          </button>
          
          {showNotifications && (
            <div className="navbar-dropdown notifications-dropdown">
              <h3 className="dropdown-header">Notifications</h3>
              
              {notifications.length > 0 ? (
                <ul className="notifications-list">
                  {notifications.map(notification => (
                    <li 
                      key={notification.id} 
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                    >
                      <p className="notification-text">{notification.text}</p>
                      <span className="notification-time">{notification.time}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-notifications">No notifications</p>
              )}
            </div>
          )}
        </div>
        
        {/* User profile */}
        <div className="navbar-dropdown-container">
          <button 
            className="navbar-profile-btn" 
            onClick={toggleDropdown}
            aria-label="User menu"
          >
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="avatar" />
            ) : (
              <div className="avatar-placeholder">
                <FaUser />
              </div>
            )}
            <span className="user-name">{userName}</span>
          </button>
          
          {showDropdown && (
            <div className="navbar-dropdown profile-dropdown">
              <button 
                onClick={() => handleMenuItemClick(onProfileClick)} 
                className="dropdown-item"
              >
                <FaUser /> Profile
              </button>
              <button 
                onClick={() => handleMenuItemClick(onSettingsClick)} 
                className="dropdown-item"
              >
                <FaCog /> Settings
              </button>
              <button 
                onClick={() => handleMenuItemClick(onLogoutClick)} 
                className="dropdown-item"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;