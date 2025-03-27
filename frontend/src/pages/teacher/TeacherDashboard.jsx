// import React, { useState, useEffect } from 'react';
// import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
// import { 
//   FaBook, 
//   FaUserGraduate, 
//   FaCalendarAlt, 
//   FaCheckCircle, 
//   FaTimesCircle,
//   FaTrophy,
//   FaEnvelope
// } from "react-icons/fa";
// import Chart from 'chart.js/auto';

// const TeacherDashboard = () => {
//   const [stats, setStats] = useState({
//     totalCourses: 4,
//     totalStudents: 92,
//     pendingRequests: 5,
//     monthlyEarnings: 2041.30,
//     studentSatisfaction: 87,
//     monthlyGrowth: 12
//   });

//   const [enrollmentRequests, setEnrollmentRequests] = useState([
//     { id: 1, studentName: "Sarah Johnson", courseName: "CS101", status: "pending" },
//     { id: 2, studentName: "Michael Chen", courseName: "CS202", status: "pending" },
//     { id: 3, studentName: "Emily Davis", courseName: "CS303", status: "pending" }
//   ]);

//   const [courses, setCourses] = useState([
//     { 
//       id: 1, 
//       name: "Advanced Programming", 
//       courseName: "CS101",
//       students: 30, 
//       completionRate: 85,
//       change: "+5%",
//       performanceData: [
//         { month: 'Jan', students: 25 },
//         { month: 'Feb', students: 28 },
//         { month: 'Mar', students: 30 }
//       ]
//     },
//     { 
//       id: 2, 
//       name: "Web Development", 
//       courseName: "CS202",
//       students: 25, 
//       completionRate: 78,
//       change: "+3%",
//       performanceData: [
//         { month: 'Jan', students: 20 },
//         { month: 'Feb', students: 22 },
//         { month: 'Mar', students: 25 }
//       ]
//     }
//   ]);

//   const [notifications, setNotifications] = useState([
//     { id: 1, type: 'message', content: 'New message from Emily Davis', time: '2m ago' },
//     { id: 2, type: 'enrollment', content: 'Michael Chen requested course enrollment', time: '1h ago' },
//     { id: 3, type: 'assignment', content: 'Assignment CS202 needs grading', time: '3h ago' }
//   ]);

//   const [achievements, setAchievements] = useState([
//     { id: 1, title: 'Top Rated Instructor', description: 'Achieved 95% student satisfaction', icon: <FaTrophy className="text-yellow-400" /> },
//     { id: 2, title: 'Course Completion', description: '80% students completed Web Dev', icon: <FaBook className="text-blue-400" /> }
//   ]);

//   const [professionalDevelopment, setProfessionalDevelopment] = useState([
//     { 
//       id: 1, 
//       title: 'Modern Teaching Techniques', 
//       duration: '2 hours',
//       progress: 60
//     },
//     { 
//       id: 2, 
//       title: 'Advanced Curriculum Design', 
//       duration: '3 hours', 
//       progress: 40
//     }
//   ]);

//   const handleApproveRequest = (requestId) => {
//     setEnrollmentRequests((prev) =>
//       prev.map((req) =>
//         req.id === requestId ? { ...req, status: "approved" } : req
//       )
//     );
//   };

//   const handleRejectRequest = (requestId) => {
//     setEnrollmentRequests((prev) =>
//       prev.map((req) =>
//         req.id === requestId ? { ...req, status: "rejected" } : req
//       )
//     );
//   };

//   return (
//     <div className="flex min-h-screen bg-[#0F172A] text-white">
//       {/* Sidebar */}
//       <div className="w-64 bg-[#1E293B] p-4 space-y-6">
//         <div className="flex items-center space-x-2">
//           <FaBook className="text-blue-400" size={24} />
//           <span className="text-xl font-semibold">Teacher Hub</span>
//         </div>
        
//         <nav className="space-y-2">
//           {[
//             { icon: <FaBook />, label: 'Dashboard', active: true },
//             { icon: <FaUserGraduate />, label: 'Courses' },
//             { icon: <FaCalendarAlt />, label: 'Schedule' }
//           ].map((item, index) => (
//             <div 
//               key={index} 
//               className={`
//                 ${item.active ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-slate-700'} 
//                 p-2 rounded flex items-center space-x-2
//               `}
//             >
//               {item.icon}
//               <span>{item.label}</span>
//             </div>
//           ))}
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-6 space-y-6">
//         {/* Top Bar */}
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
//           <div className="flex items-center space-x-4">
//             <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
//               Create New Course
//             </button>
//             <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
//               T
//             </div>
//           </div>
//         </div>

//         {/* Top Stats Grid */}
//         <div className="grid grid-cols-3 gap-8">
//           {[
//             { icon: <FaBook />, label: 'Courses', value: stats.totalCourses },
//             { icon: <FaUserGraduate />, label: 'Students', value: stats.totalStudents },
//             { icon: <FaCalendarAlt />, label: 'Pending', value: stats.pendingRequests }
//           ].map((stat, index) => (
//             <div 
//               key={index} 
//               className="bg-[#1E293B] p-4 rounded-lg flex flex-col justify-between"
//             >
//               <div className="flex justify-between items-center">
//                 {React.cloneElement(stat.icon, { className: "text-blue-400" })}
//               </div>
//               <div>
//                 <h3 className="text-2xl font-bold">{stat.value}</h3>
//                 <p className="text-gray-400">{stat.label}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Two-Column Layout */}
//         <div className="grid grid-cols-3 gap-6">
//           {/* Course Performance & Enrollment Requests */}
//           <div className="bg-[#1E293B] p-4 rounded-lg col-span-2">
//             <div className="grid grid-cols-2 gap-4">
//               {/* Course Performance */}
//               <div>
//                 <h2 className="text-xl font-semibold mb-4">Course Performance</h2>
//                 <div className="space-y-4">
//                   {courses.map((course) => (
//                     <div key={course.id} className="bg-[#334155] p-3 rounded">
//                       <div className="flex justify-between items-center mb-2">
//                         <h3 className="font-medium">{course.name}</h3>
//                         <span className="text-green-500">{course.completionRate}%</span>
//                       </div>
//                       <ResponsiveContainer width="100%" height={50}>
//                         <LineChart data={course.performanceData}>
//                           <XAxis dataKey="month" hide />
//                           <Tooltip />
//                           <Line 
//                             type="monotone" 
//                             dataKey="students" 
//                             stroke="#8884d8" 
//                             strokeWidth={2}
//                           />
//                         </LineChart>
//                       </ResponsiveContainer>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Enrollment Requests */}
//               <div>
//                 <h2 className="text-xl font-semibold mb-4">Enrollment Requests</h2>
//                 <div className="space-y-3">
//                   {enrollmentRequests.map((req) => (
//                     <div 
//                       key={req.id} 
//                       className="flex justify-between items-center bg-[#334155] p-3 rounded"
//                     >
//                       <div>
//                         <h3 className="font-medium">{req.studentName}</h3>
//                         <p className="text-gray-400 text-sm">{req.courseName}</p>
//                       </div>
//                       {req.status === "pending" && (
//                         <div className="flex space-x-2">
//                           <button 
//                             onClick={() => handleApproveRequest(req.id)}
//                             className="bg-green-500 text-white p-2 rounded"
//                           >
//                             <FaCheckCircle />
//                           </button>
//                           <button 
//                             onClick={() => handleRejectRequest(req.id)}
//                             className="bg-red-500 text-white p-2 rounded"
//                           >
//                             <FaTimesCircle />
//                           </button>
//                         </div>
//                       )}
//                       {req.status !== "pending" && (
//                         <span 
//                           className={`
//                             px-3 py-1 rounded text-sm 
//                             ${req.status === "approved" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}
//                           `}
//                         >
//                           {req.status}
//                         </span>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Notifications */}
//           <div className="bg-[#1E293B] p-4 rounded-lg">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">Notifications</h2>
//               <span className="text-blue-400">Mark All Read</span>
//             </div>
//             <div className="space-y-3">
//               {notifications.map((notification) => (
//                 <div 
//                   key={notification.id} 
//                   className="bg-[#334155] p-3 rounded flex justify-between items-center"
//                 >
//                   <div>
//                     <h3 className="font-medium">{notification.content}</h3>
//                     <p className="text-gray-400 text-sm">{notification.time}</p>
//                   </div>
//                   <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Professional Development, Achievements & Quick Actions */}
//         <div className="grid grid-cols-3 gap-6">
//           {/* Professional Development */}
//           <div className="bg-[#1E293B] p-4 rounded-lg">
//             <h2 className="text-xl font-semibold mb-4">Professional Development</h2>
//             <div className="space-y-4">
//               {professionalDevelopment.map((course) => (
//                 <div key={course.id} className="bg-[#334155] p-3 rounded">
//                   <div className="flex justify-between items-center mb-2">
//                     <h3 className="font-medium">{course.title}</h3>
//                     <span className="text-gray-400">{course.duration}</span>
//                   </div>
//                   <div className="w-full bg-gray-700 rounded-full h-2.5">
//                     <div 
//                       className="bg-blue-600 h-2.5 rounded-full" 
//                       style={{width: `${course.progress}%`}}
//                     ></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Achievements */}
//           <div className="bg-[#1E293B] p-4 rounded-lg">
//             <h2 className="text-xl font-semibold mb-4">Achievements</h2>
//             <div className="space-y-4">
//               {achievements.map((achievement) => (
//                 <div 
//                   key={achievement.id} 
//                   className="bg-[#334155] p-3 rounded flex items-center space-x-4"
//                 >
//                   <div className="bg-yellow-500/20 p-2 rounded">
//                     {achievement.icon}
//                   </div>
//                   <div>
//                     <h3 className="font-medium">{achievement.title}</h3>
//                     <p className="text-gray-400 text-sm">{achievement.description}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Quick Actions */}
//           <div className="bg-[#1E293B] p-4 rounded-lg">
//             <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
//             <div className="space-y-3">
//               {[
//                 'Create New Course',
//                 'Schedule Office Hours',
//                 'Send Bulk Announcements',
//                 'Generate Reports'
//               ].map((action, index) => (
//                 <button 
//                   key={index} 
//                   className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded text-left"
//                 >
//                   {action}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeacherDashboard;

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
import { useTheme } from '../../context/ThemeProvider'; // Import the useTheme hook

const TeacherDashboard = () => {
  const { themeConfig } = useTheme(); // Use the theme configuration

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
    { id: 1, title: 'Top Rated Instructor', description: 'Achieved 95% student satisfaction', icon: <FaTrophy className="text-yellow-400" /> },
    { id: 2, title: 'Course Completion', description: '80% students completed Web Dev', icon: <FaBook className="text-blue-400" /> }
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
      <div className={`w-64 ${themeConfig.sidebar} p-4 space-y-6`}>
        <div className="flex items-center space-x-2">
          <FaBook className={themeConfig.icon} size={24} />
          <span className="text-xl font-semibold">Teacher Hub</span>
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
                ${item.active ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-slate-700'} 
                p-2 rounded flex items-center space-x-2
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
          <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className={`${themeConfig.button.primary} px-4 py-2 rounded`}>
              Create New Course
            </button>
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
              T
            </div>
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-3 gap-8">
          {[
            { icon: <FaBook />, label: 'Courses', value: stats.totalCourses },
            { icon: <FaUserGraduate />, label: 'Students', value: stats.totalStudents },
            { icon: <FaCalendarAlt />, label: 'Requests Pending', value: stats.pendingRequests }
          ].map((stat, index) => (
            <div 
              key={index} 
              className={`${themeConfig.card} p-4 rounded-lg flex flex-col justify-between`}
            >
              <div className="flex justify-between items-center">
                {React.cloneElement(stat.icon, { className: themeConfig.icon })}
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
                    <div key={course.id} className="bg-[#334155] p-3 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{course.name}</h3>
                        <span className="text-green-500">{course.completionRate}%</span>
                      </div>
                      <ResponsiveContainer width="100%" height={50}>
                        <LineChart data={course.performanceData}>
                          <XAxis dataKey="month" hide />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="students" 
                            stroke="#8884d8" 
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
                      className="flex justify-between items-center bg-[#334155] p-3 rounded"
                    >
                      <div>
                        <h3 className="font-medium">{req.studentName}</h3>
                        <p className="text-gray-400 text-sm">{req.courseName}</p>
                      </div>
                      {req.status === "pending" && (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleApproveRequest(req.id)}
                            className="bg-green-500 text-white p-2 rounded"
                          >
                            <FaCheckCircle />
                          </button>
                          <button 
                            onClick={() => handleRejectRequest(req.id)}
                            className="bg-red-500 text-white p-2 rounded"
                          >
                            <FaTimesCircle />
                          </button>
                        </div>
                      )}
                      {req.status !== "pending" && (
                        <span 
                          className={`
                            px-3 py-1 rounded text-sm 
                            ${req.status === "approved" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}
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
              <span className="text-blue-400">Mark All Read</span>
            </div>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="bg-[#334155] p-3 rounded flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{notification.content}</h3>
                    <p className="text-gray-400 text-sm">{notification.time}</p>
                  </div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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
                <div key={course.id} className="bg-[#334155] p-3 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{course.title}</h3>
                    <span className="text-gray-400">{course.duration}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
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
                  className="bg-[#334155] p-3 rounded flex items-center space-x-4"
                >
                  <div className="bg-yellow-500/20 p-2 rounded">
                    {achievement.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{achievement.title}</h3>
                    <p className="text-gray-400 text-sm">{achievement.description}</p>
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