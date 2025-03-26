// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { FaBookOpen, FaClipboardList, FaUserPlus, FaChartBar, FaStickyNote, FaBullhorn, FaPlusCircle } from "react-icons/fa";

// const Sidebar = ({ role }) => {
//   const [collapsed, setCollapsed] = useState(false);

//   const toggleSidebar = () => setCollapsed(!collapsed);

//   const teacherMenu = [
//     { id: "courses", label: "Courses", icon: <FaBookOpen />, link: "/teacher/courses" },
//     { id: "attendance", label: "Mark Attendance", icon: <FaClipboardList />, link: "/capture-image" },
//     { id: "requests", label: "Requests", icon: <FaUserPlus />, link: "/teacher/requests" },
//     { id: "reports", label: "Reports", icon: <FaChartBar />, link: "/teacher/reports" },
//     { id: "notes", label: "Notes", icon: <FaStickyNote />, link: "/teacher/notes" },
//     { id: "announcements", label: "Announcements", icon: <FaBullhorn />, link: "/teacher/announcements" },
//   ];

//   const studentMenu = [
//     { id: "courses", label: "Courses", icon: <FaBookOpen />, link: "/student/courses" },
//     { id: "attendance", label: "Attendance", icon: <FaClipboardList />, link: "/capture-image" },
//     { id: "enroll", label: "Enroll New Course", icon: <FaPlusCircle />, link: "/student/enroll" },
//   ];

//   const menuItems = role === "teacher" ? teacherMenu : studentMenu;

//   return (
//     <div className={`h-screen ${collapsed ? "w-16" : "w-60"} bg-gray-900 text-white transition-all duration-300`}>
//       <button onClick={toggleSidebar} className="p-4 text-white focus:outline-none">
//         {collapsed ? "➡️" : "⬅️"}
//       </button>
//       <ul className="space-y-2">
//         {menuItems.map((item) => (
//           <li key={item.id}>
//             <Link to={item.link} className="flex items-center p-4 hover:bg-gray-700">
//               {item.icon} {!collapsed && <span className="ml-2">{item.label}</span>}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaBookOpen, FaClipboardList, FaUserPlus, FaChartBar, FaStickyNote, FaBullhorn, FaPlusCircle, FaBars } from "react-icons/fa";
import { useTheme } from "../context/ThemeProvider"; // Import the useTheme hook to access the theme

const Sidebar = ({ role }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { themeConfig, isDark } = useTheme(); // Access theme config and dark mode status

  const toggleSidebar = () => setCollapsed(!collapsed);

  const teacherMenu = [
    { id: "dashboard", label: "Dashboard", icon: <FaTachometerAlt />, link: "/teacher/dashboard" },
    { id: "courses", label: "Courses", icon: <FaBookOpen />, link: "/teacher/courses" },
    { id: "attendance", label: "Mark Attendance", icon: <FaClipboardList />, link: "/capture-image" },
    { id: "requests", label: "Requests", icon: <FaUserPlus />, link: "/teacher/requests" },
    { id: "reports", label: "Reports", icon: <FaChartBar />, link: "/teacher/reports" },
    { id: "notes", label: "Notes", icon: <FaStickyNote />, link: "/teacher/notes" },
    { id: "announcements", label: "Announcements", icon: <FaBullhorn />, link: "/teacher/announcements" },
  ];

  const studentMenu = [
    { id: "dashboard", label: "Dashboard", icon: <FaTachometerAlt />, link: "/student/dashboard" },
    { id: "courses", label: "Courses", icon: <FaBookOpen />, link: "/student/courses" },
    { id: "attendance", label: "Attendance", icon: <FaClipboardList />, link: "/capture-image" },
    { id: "enroll", label: "Enroll Course", icon: <FaPlusCircle />, link: "/student/enroll" },
  ];

  const menuItems = role === "teacher" ? teacherMenu : studentMenu;

  return (
    <div className={`h-screen transition-all duration-300 z-100 ${collapsed ? "w-16" : "w-60"} flex flex-col ${isDark ? themeConfig.card : themeConfig.card}`}>
      {/* Sidebar Toggle Button */}
      <div className="p-4 flex justify-between items-center">
        <button onClick={toggleSidebar} className={`text-xl focus:outline-none ${isDark ? themeConfig.text : themeConfig.text}`}>
          <FaBars />
        </button>
      </div>

      {/* Sidebar Menu */}
      <ul className="flex-1 space-y-2 mt-4">
        {menuItems.map((item) => (
          <li key={item.id}>
            <Link 
              to={item.link} 
              className={`flex items-center px-4 py-3 transition-all duration-200 rounded-lg 
                ${isDark ? themeConfig.background : themeConfig.background} 
                hover:${isDark ? "bg-gray-700" : "bg-[#d3d3d3]"} 
                text-sm font-medium ${isDark ? themeConfig.text : themeConfig.text}`}
            >
              <span className={`text-lg ${isDark ? themeConfig.text : themeConfig.text}`}>{item.icon}</span>
              {!collapsed && <span className={`ml-3 ${isDark ? themeConfig.text : themeConfig.text}`}>{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

