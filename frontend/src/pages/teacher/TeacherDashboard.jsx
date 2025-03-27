
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  FaBook, 
  FaUserGraduate, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaTimesCircle,
  FaTrophy,
  FaEnvelope
} from "react-icons/fa";
import Chart from 'chart.js/auto';

const TeacherDashboard = () => {
  const themeConfig = {
    background: 'bg-[#0A0E13]',
    text: 'text-white',
    sidebar: 'bg-gradient-to-b from-[#121A22] to-[#0A0E13]',
    card: 'bg-gradient-to-br from-[#121A22] to-[#0A0E13]/50 border border-[#1E2733] shadow-xl',
    icon: 'text-white',
    secondaryText: 'text-[#5E6E82]',
    button: {
      primary: 'bg-gradient-to-r from-[#506EE5]/60 via-[#222C42]/40 to-[#1D2229] text-white ' +
               'hover:from-[#506EE5] hover:to-[#1D2229] ' +
               'border-2 border-[#1E4FFF]/30 border-rounded-lg' +
               'transition-all duration-300 ease-in-out',
      gradient: 'bg-gradient-to-r from-[#F2683C]/20 to-[#2F955A]/20'
    },
    gradient: {
      text: 'bg-gradient-to-r from-[#2E67FF] to-[#2F955A] bg-clip-text text-transparent',
      accent: 'bg-gradient-to-r from-[#F2683C] to-[#2F955A]'
    }
  };

  const [stats, setStats] = useState({
    totalCourses: 4,
    totalStudents: 92,
    pendingRequests: 5,
    monthlyEarnings: 2041.30,
    studentSatisfaction: 87,
    monthlyGrowth: 12
  });

  const [enrollmentRequests, setEnrollmentRequests] = useState([
    { id: 1, studentName: "Sarah Johnson", courseName: "CS101", status: "pending" },
    { id: 2, studentName: "Michael Chen", courseName: "CS202", status: "pending" },
    { id: 3, studentName: "Emily Davis", courseName: "CS303", status: "pending" }
  ]);

  const [courses, setCourses] = useState([
    { 
      id: 1, 
      name: "Advanced Programming", 
      courseName: "CS101",
      students: 30, 
      completionRate: 85,
      change: "+5%",
      performanceData: [
        { month: 'Jan', students: 25 },
        { month: 'Feb', students: 28 },
        { month: 'Mar', students: 30 }
      ]
    },
    { 
      id: 2, 
      name: "Web Development", 
      courseName: "CS202",
      students: 25, 
      completionRate: 78,
      change: "+3%",
      performanceData: [
        { month: 'Jan', students: 20 },
        { month: 'Feb', students: 22 },
        { month: 'Mar', students: 25 }
      ]
    }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'message', content: 'New message from Emily Davis', time: '2m ago' },
    { id: 2, type: 'enrollment', content: 'Michael Chen requested course enrollment', time: '1h ago' },
    { id: 3, type: 'assignment', content: 'Assignment CS202 needs grading', time: '3h ago' }
  ]);

  const [achievements, setAchievements] = useState([
    { id: 1, title: 'Top Rated Instructor', description: 'Achieved 95% student satisfaction', icon: <FaTrophy className="text-[#F2683C]" /> },
    { id: 2, title: 'Course Completion', description: '80% students completed Web Dev', icon: <FaBook className="text-[#2F955A]" /> }
  ]);

  const [professionalDevelopment, setProfessionalDevelopment] = useState([
    { 
      id: 1, 
      title: 'Modern Teaching Techniques', 
      duration: '2 hours',
      progress: 60
    },
    { 
      id: 2, 
      title: 'Advanced Curriculum Design', 
      duration: '3 hours', 
      progress: 40
    }
  ]);

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
    <div className={`flex min-h-screen ${themeConfig.background} ${themeConfig.text}`}>
      {/* Sidebar */}
      <div className={`w-64 ${themeConfig.sidebar} p-4 space-y-6 border-r border-[#1E2733]`}>
        <div className="flex items-center space-x-2">
          <FaBook className={`${themeConfig.icon} bg-gradient-to-r from-[#1E4FFF]/20 to-[#2F955A]/20 p-2 rounded`} size={36} />
          <span className="text-xl font-semibold">Smart Attend</span>
        </div>
        
        <nav className="space-y-2">
          {[
            { icon: <FaBook />, label: 'Dashboard', active: true },
            { icon: <FaUserGraduate />, label: 'Courses' },
            { icon: <FaCalendarAlt />, label: 'Schedule' }
          ].map((item, index) => (
            <div 
              key={index} 
              className={`
                ${item.active 
                  ? 'bg-gradient-to-r from-[#1E4FFF]/20 to-[#2F955A]/20 text-[#2E67FF]' 
                  : 'hover:bg-[#1E2733]'} 
                p-2 rounded flex items-center space-x-2 transition-all duration-300
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4">
          <h1 className={`text-2xl font-bold ${themeConfig.text}`}>Teacher Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className={`${themeConfig.button.primary} px-4 py-2 rounded-lg`}>
              Create New Course
            </button>
            <div className={`w-10 h-10 ${themeConfig.gradient.accent} rounded-full flex items-center justify-center text-white font-bold`}>
              T
            </div>
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-3 gap-8">
          {[
            { icon: <FaBook />, label: 'Courses', value: stats.totalCourses },
            { icon: <FaUserGraduate />, label: 'Students', value: stats.totalStudents },
            { icon: <FaCalendarAlt />, label: 'Pending', value: stats.pendingRequests }
          ].map((stat, index) => (
            <div 
              key={index} 
              className={`${themeConfig.card} p-4 rounded-lg flex flex-col justify-between`}
            >
              <div className="flex justify-between items-center">
                {React.cloneElement(stat.icon, { className: `${themeConfig.icon} ${themeConfig.gradient.text}` })}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className={themeConfig.secondaryText}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Course Performance & Enrollment Requests */}
          <div className={`${themeConfig.card} p-4 rounded-lg col-span-2`}>
            <div className="grid grid-cols-2 gap-4">
              {/* Course Performance */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Course Performance</h2>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course.id} className="bg-[#171D25] p-3 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{course.name}</h3>
                        <span className="text-[#2F955A]">{course.completionRate}%</span>
                      </div>
                      <ResponsiveContainer width="100%" height={50}>
                        <LineChart data={course.performanceData}>
                          <XAxis dataKey="month" hide />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="students" 
                            stroke="#F2683C" 
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enrollment Requests */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Enrollment Requests</h2>
                <div className="space-y-3">
                  {enrollmentRequests.map((req) => (
                    <div 
                      key={req.id} 
                      className="flex justify-between items-center bg-[#171D25] p-3 rounded"
                    >
                      <div>
                        <h3 className="font-medium">{req.studentName}</h3>
                        <p className="text-[#393E41] text-sm">{req.courseName}</p>
                      </div>
                      {req.status === "pending" && (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleApproveRequest(req.id)}
                            className="bg-[#2F955A] text-white p-2 rounded"
                          >
                            <FaCheckCircle />
                          </button>
                          <button 
                            onClick={() => handleRejectRequest(req.id)}
                            className="bg-[#F2683C] text-white p-2 rounded"
                          >
                            <FaTimesCircle />
                          </button>
                        </div>
                      )}
                      {req.status !== "pending" && (
                        <span 
                          className={`
                            px-3 py-1 rounded text-sm 
                            ${req.status === "approved" ? "bg-[#2F955A]/20 text-[#2F955A]" : "bg-[#F2683C]/20 text-[#F2683C]"}
                          `}
                        >
                          {req.status}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className={`${themeConfig.card} p-4 rounded-lg`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Notifications</h2>
              <span className="text-[#314373]">Mark All Read</span>
            </div>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="bg-[#171D25] p-3 rounded flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{notification.content}</h3>
                    <p className="text-[#393E41] text-sm">{notification.time}</p>
                  </div>
                  <div className="w-2 h-2 bg-[#F2683C] rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Professional Development, Achievements & Quick Actions */}
        <div className="grid grid-cols-3 gap-6">
          {/* Professional Development */}
          <div className={`${themeConfig.card} p-4 rounded-lg`}>
            <h2 className="text-xl font-semibold mb-4">Professional Development</h2>
            <div className="space-y-4">
              {professionalDevelopment.map((course) => (
                <div key={course.id} className="bg-[#171D25] p-3 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{course.title}</h3>
                    <span className="text-[#393E41]">{course.duration}</span>
                  </div>
                  <div className="w-full bg-[#393E41] rounded-full h-2.5">
                    <div 
                      className="bg-[#314373] h-2.5 rounded-full" 
                      style={{width: `${course.progress}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className={`${themeConfig.card} p-4 rounded-lg`}>
            <h2 className="text-xl font-semibold mb-4">Achievements</h2>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className="bg-[#171D25] p-3 rounded flex items-center space-x-4"
                >
                  <div className="bg-[#F2683C]/20 p-2 rounded">
                    {achievement.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{achievement.title}</h3>
                    <p className="text-[#393E41] text-sm">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`${themeConfig.card} p-4 rounded-lg`}>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {[
                'Create New Course',
                'Schedule Office Hours',
                'Send Bulk Announcements',
                'Generate Reports'
              ].map((action, index) => (
                <button 
                  key={index} 
                  className={`w-full ${themeConfig.button.primary} p-3 rounded text-left`}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;