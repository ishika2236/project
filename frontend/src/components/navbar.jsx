// import React, { useState } from 'react';
// import { FaUser, FaBell, FaSignOutAlt, FaCog } from 'react-icons/fa';
// import { BsMoon, BsSun } from 'react-icons/bs';
// import '../index.css';
// // import { useTheme } from '../theme';
// import { useTheme } from '../context/ThemeProvider';

// const Navbar = ({ 
//   userName = 'User', 
//   userAvatar = null,
//   onProfileClick,
//   onSettingsClick,
//   onLogoutClick 
// }) => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const { theme, toggleTheme } = useTheme();

//   const toggleDropdown = () => {
//     setShowDropdown(!showDropdown);
//     if (showNotifications) setShowNotifications(false);
//   };

//   const toggleNotifications = () => {
//     setShowNotifications(!showNotifications);
//     if (showDropdown) setShowDropdown(false);
//   };

//   // Sample notifications
//   const notifications = [
//     {
//       id: 1,
//       text: 'New attendance report available',
//       time: '2 hours ago',
//       read: false
//     },
//     {
//       id: 2,
//       text: 'Course schedule updated',
//       time: '1 day ago',
//       read: true
//     }
//   ];

//   const handleMenuItemClick = (handler) => {
//     if (handler) handler();
//     setShowDropdown(false);
//   };

//   return (
//     <nav className={`navbar ${theme === 'dark' ? 'navbar-dark' : 'navbar-light'}`}>
//       <div className="navbar-left">
//         <h2 className="navbar-brand">Attendance App</h2>
//       </div>
      
//       <div className="navbar-right">
//         {/* Theme toggle */}
//         <button 
//           className="navbar-icon-btn" 
//           onClick={toggleTheme} 
//           aria-label="Toggle theme"
//         >
//           {theme === 'dark' ? <BsSun /> : <BsMoon />}
//         </button>
        
//         {/* Notifications */}
//         <div className="navbar-dropdown-container">
//           <button 
//             className="navbar-icon-btn" 
//             onClick={toggleNotifications}
//             aria-label="Notifications"
//           >
//             <FaBell />
//             {notifications.some(n => !n.read) && <span className="notification-badge"></span>}
//           </button>
          
//           {showNotifications && (
//             <div className="navbar-dropdown notifications-dropdown">
//               <h3 className="dropdown-header">Notifications</h3>
              
//               {notifications.length > 0 ? (
//                 <ul className="notifications-list">
//                   {notifications.map(notification => (
//                     <li 
//                       key={notification.id} 
//                       className={`notification-item ${!notification.read ? 'unread' : ''}`}
//                     >
//                       <p className="notification-text">{notification.text}</p>
//                       <span className="notification-time">{notification.time}</span>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="no-notifications">No notifications</p>
//               )}
//             </div>
//           )}
//         </div>
        
//         {/* User profile */}
//         <div className="navbar-dropdown-container">
//           <button 
//             className="navbar-profile-btn" 
//             onClick={toggleDropdown}
//             aria-label="User menu"
//           >
//             {userAvatar ? (
//               <img src={userAvatar} alt={userName} className="avatar" />
//             ) : (
//               <div className="avatar-placeholder">
//                 <FaUser />
//               </div>
//             )}
//             <span className="user-name">{userName}</span>
//           </button>
          
//           {showDropdown && (
//             <div className="navbar-dropdown profile-dropdown">
//               <button 
//                 onClick={() => handleMenuItemClick(onProfileClick)} 
//                 className="dropdown-item"
//               >
//                 <FaUser /> Profile
//               </button>
//               <button 
//                 onClick={() => handleMenuItemClick(onSettingsClick)} 
//                 className="dropdown-item"
//               >
//                 <FaCog /> Settings
//               </button>
//               <button 
//                 onClick={() => handleMenuItemClick(onLogoutClick)} 
//                 className="dropdown-item"
//               >
//                 <FaSignOutAlt /> Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState } from "react";
import { FaUser, FaBell, FaSignOutAlt, FaCog } from "react-icons/fa";
import { BsMoon, BsSun } from "react-icons/bs";
import { useTheme } from "../context/ThemeProvider";

const Navbar = ({
  userName = "User",
  userAvatar = null,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { theme, themeConfig, toggleTheme } = useTheme();

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
    { id: 1, text: "New attendance report available", time: "2 hours ago", read: false },
    { id: 2, text: "Course schedule updated", time: "1 day ago", read: true },
  ];

  const handleMenuItemClick = (handler) => {
    if (handler) handler();
    setShowDropdown(false);
  };

  return (
    <nav
      className={`flex justify-between items-center p-4 shadow-md ${themeConfig.background} ${themeConfig.text}`}
    >
      <div className="text-xl font-bold">Attendance App</div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="p-2 text-xl">
          {theme === "dark" ? (
            <BsSun className="text-yellow-400" />
          ) : (
            <BsMoon className="text-gray-800" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button onClick={toggleNotifications} className="p-2 text-xl relative">
            <FaBell />
            {notifications.some((n) => !n.read) && (
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 z-50">
              <h3 className="text-sm font-semibold border-b pb-2 mb-2">Notifications</h3>
              {notifications.length > 0 ? (
                <ul>
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className={`p-2 text-sm rounded ${
                        !notification.read ? "bg-gray-100 dark:bg-gray-700" : ""
                      }`}
                    >
                      {notification.text}{" "}
                      <span className="text-xs text-gray-500 block">{notification.time}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No new notifications</p>
              )}
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button onClick={toggleDropdown} className="flex items-center gap-2 p-2">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <FaUser />
              </div>
            )}
            <span>{userName}</span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 z-50">
              <button
                onClick={() => handleMenuItemClick(onProfileClick)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
              >
                <FaUser /> Profile
              </button>
              <button
                onClick={() => handleMenuItemClick(onSettingsClick)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
              >
                <FaCog /> Settings
              </button>
              <button
                onClick={() => handleMenuItemClick(onLogoutClick)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-red-500"
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
