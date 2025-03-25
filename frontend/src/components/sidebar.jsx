import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBookOpen, FaClipboardList, FaUserPlus, FaChartBar, FaStickyNote, FaBullhorn, FaPlusCircle } from "react-icons/fa";

const Sidebar = ({ role }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  const teacherMenu = [
    { id: "courses", label: "Courses", icon: <FaBookOpen />, link: "/teacher/courses" },
    { id: "attendance", label: "Mark Attendance", icon: <FaClipboardList />, link: "/capture-image" },
    { id: "requests", label: "Requests", icon: <FaUserPlus />, link: "/teacher/requests" },
    { id: "reports", label: "Reports", icon: <FaChartBar />, link: "/teacher/reports" },
    { id: "notes", label: "Notes", icon: <FaStickyNote />, link: "/teacher/notes" },
    { id: "announcements", label: "Announcements", icon: <FaBullhorn />, link: "/teacher/announcements" },
  ];

  const studentMenu = [
    { id: "courses", label: "Courses", icon: <FaBookOpen />, link: "/student/courses" },
    { id: "attendance", label: "Attendance", icon: <FaClipboardList />, link: "/capture-image" },
    { id: "enroll", label: "Enroll New Course", icon: <FaPlusCircle />, link: "/student/enroll" },
  ];

  const menuItems = role === "teacher" ? teacherMenu : studentMenu;

  return (
    <div className={`h-screen ${collapsed ? "w-16" : "w-60"} bg-gray-900 text-white transition-all duration-300`}>
      <button onClick={toggleSidebar} className="p-4 text-white focus:outline-none">
        {collapsed ? "➡️" : "⬅️"}
      </button>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.id}>
            <Link to={item.link} className="flex items-center p-4 hover:bg-gray-700">
              {item.icon} {!collapsed && <span className="ml-2">{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
