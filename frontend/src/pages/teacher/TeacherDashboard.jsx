import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaUserGraduate, FaBook, FaCalendarAlt } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { useTheme } from "../../context/ThemeProvider";

const TeacherDashboard = () => {
  const { themeConfig, isDark } = useTheme();

  const [enrollmentRequests, setEnrollmentRequests] = useState([
    { id: 1, studentName: "Sarah Johnson", courseName: "CS101", status: "pending" },
    { id: 2, studentName: "Michael Chen", courseName: "CS202", status: "pending" },
    { id: 3, studentName: "Emily Davis", courseName: "CS303", status: "pending" },
    { id: 4, studentName: "John Smith", courseName: "CS101", status: "pending" },
    { id: 5, studentName: "Sophia Lee", courseName: "CS202", status: "pending" },
  ]);

  const [courses] = useState([
    { id: 1, courseName: "CS101", studentsCount: 30 },
    { id: 2, courseName: "CS202", studentsCount: 25 },
    { id: 3, courseName: "CS303", studentsCount: 22 },
    { id: 4, courseName: "CS404", studentsCount: 15 },
  ]);

  const [stats] = useState({
    totalCourses: 4,
    totalStudents: 92,
    pendingRequests: 5,
  });

  const handleApproveRequest = (requestId) => {
    setEnrollmentRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "approved" } : req
      )
    );
  };

  const handleRejectRequest = (requestId) => {
    setEnrollmentRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "rejected" } : req
      )
    );
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar role="teacher" className={isDark ? themeConfig.sidebar : 'bg-gray-800 text-white'} />

      {/* Main Dashboard Section */}
      <div className={`flex-1 ${isDark ? themeConfig.background : 'bg-gray-100'} p-6`}>
        {/* Navbar */}
        <Navbar userName="Teacher" className={isDark ? themeConfig.navbar : 'bg-white text-gray-900'} />

        <div className="space-y-6">
          <h1 className={`text-3xl font-semibold ${isDark ? themeConfig.text : 'text-gray-900'}`}>Teacher Dashboard</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stats Overview */}
            <div className={`p-4 rounded shadow ${isDark ? themeConfig.card : 'bg-white'}`}>
              <FaBook size={24} className={`${isDark ? themeConfig.icon : 'text-gray-900'}`} />
              <h3 className={`${isDark ? themeConfig.text : 'text-gray-900'}`}>{stats.totalCourses}</h3>
              <p className={`${isDark ? themeConfig.secondaryText : 'text-gray-600'}`}>Total Courses</p>
            </div>
            <div className={`p-4 rounded shadow ${isDark ? themeConfig.card : 'bg-white'}`}>
              <FaUserGraduate size={24} className={`${isDark ? themeConfig.icon : 'text-gray-900'}`} />
              <h3 className={`${isDark ? themeConfig.text : 'text-gray-900'}`}>{stats.totalStudents}</h3>
              <p className={`${isDark ? themeConfig.secondaryText : 'text-gray-600'}`}>Total Students</p>
            </div>
            <div className={`p-4 rounded shadow ${isDark ? themeConfig.card : 'bg-white'}`}>
              <FaCalendarAlt size={24} className={`${isDark ? themeConfig.icon : 'text-gray-900'}`} />
              <h3 className={`${isDark ? themeConfig.text : 'text-gray-900'}`}>{stats.pendingRequests}</h3>
              <p className={`${isDark ? themeConfig.secondaryText : 'text-gray-600'}`}>Pending Requests</p>
            </div>
          </div>

          {/* Enrollment Requests */}
          <div>
            <h2 className={`text-2xl font-semibold ${isDark ? themeConfig.text : 'text-gray-900'}`}>Enrollment Requests</h2>
            <ul className="space-y-4">
              {enrollmentRequests.map((req) => (
                <li
                  key={req.id}
                  className={`p-4 rounded flex justify-between ${isDark ? themeConfig.card : 'bg-gray-100'} ${req.status !== "pending" ? "opacity-50" : ""}`}
                >
                  <div>
                    <h3 className={`${isDark ? themeConfig.text : 'text-gray-900'}`}>{req.studentName}</h3>
                    <p className={`${isDark ? themeConfig.secondaryText : 'text-gray-600'}`}>{req.courseName}</p>
                  </div>
                  {req.status === "pending" ? (
                    <div>
                      <button
                        onClick={() => handleApproveRequest(req.id)}
                        className={`bg-green-500 text-white px-4 py-1 rounded mr-2 ${isDark ? themeConfig.button.primary : 'bg-green-500'}`}
                      >
                        <FaCheckCircle />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectRequest(req.id)}
                        className={`bg-red-500 text-white px-4 py-1 rounded ${isDark ? themeConfig.button.secondary : 'bg-red-500'}`}
                      >
                        <FaTimesCircle />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span>{req.status === "approved" ? "Approved" : "Rejected"}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h2 className={`text-2xl font-semibold ${isDark ? themeConfig.text : 'text-gray-900'}`}>Your Courses</h2>
            <ul className="space-y-4">
              {courses.map((course) => (
                <li key={course.id} className={`p-4 rounded ${isDark ? themeConfig.card : 'bg-gray-100'}`}>
                  <h3 className={`${isDark ? themeConfig.text : 'text-gray-900'}`}>{course.courseName}</h3>
                  <p className={`${isDark ? themeConfig.secondaryText : 'text-gray-600'}`}>Enrolled Students: {course.studentsCount}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
