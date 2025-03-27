import React from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Book, ClipboardList, Calendar, FilePlus, Activity } from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from "chart.js";
import { useTheme } from "../../context/ThemeProvider"; 

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const StudentDashboard = () => {
  const { themeConfig, isDark } = useTheme(); 

  const courses = [
    { id: 1, name: "Mathematics", attendance: "92%" },
    { id: 2, name: "Physics", attendance: "85%" },
    { id: 3, name: "Computer Science", attendance: "97%" },
  ];

  const pieChartData = {
    labels: ["Mathematics", "Physics", "Computer Science"],
    datasets: [
      {
        label: "Course Attendance",
        data: [92, 85, 97],
        backgroundColor: ["#4caf50", "#ff9800", "#2196f3"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const recentActivities = [
    { id: 1, action: "Completed assignment for Mathematics", time: "2 hours ago" },
    { id: 2, action: "Joined Physics study group", time: "5 hours ago" },
    { id: 3, action: "Attended Computer Science class", time: "1 day ago" },
  ];

  return (
    <div className={`flex ${isDark ? 'dark:bg-gray-950' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <Sidebar role="student" />

      {/* Main Dashboard Section */}
      <div className={`flex-1 min-h-screen ${isDark ? 'dark:bg-gray-950' : 'bg-gray-100'} p-6`}>
        {/* Navbar */}
        <Navbar userName="Student" />

        {/* Dashboard Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {/* Enrolled Courses */}
          <div className={`p-6 rounded-lg shadow-md ${isDark ? 'dark:bg-gray-900' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Book className="text-blue-500" /> Enrolled Courses
            </h2>
            <ul className="mt-4 space-y-3">
              {courses.map((course) => (
                <li key={course.id} className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'} text-${isDark ? 'white' : 'gray-900'}`}>
                  {course.name} – <span className="font-bold">{course.attendance}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Attendance Status */}
          <div className={`p-6 rounded-lg shadow-md ${isDark ? 'dark:bg-gray-900' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <ClipboardList className="text-green-500" /> Attendance Status
            </h2>
            <p className={`mt-4 ${isDark ? 'dark:text-white' : 'text-lg'}`}>
              Overall Attendance: <span className="font-bold text-green-500">91%</span>
            </p>
          </div>

          {/* Upcoming Classes */}
          <div className={`p-6 rounded-lg shadow-md ${isDark ? 'dark:bg-gray-900' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Calendar className="text-yellow-500" /> Upcoming Classes
            </h2>
            <p className={`mt-4 ${isDark ? 'dark:text-white' : 'text-lg'}`}>Mathematics – Tomorrow at 10:00 AM</p>
            <p className={`mt-4 ${isDark ? 'dark:text-white' : 'text-lg'}`}>Physics – Wednesday at 2:00 PM</p>
          </div>

          {/* Join New Course */}
          <div className={`p-6 rounded-lg shadow-md flex items-center justify-between ${isDark ? 'dark:bg-gray-900' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <FilePlus className="text-red-500" /> Join New Course
            </h2>
            <button className="bg-blue-500 text-white px-5 py-3 rounded-lg">Request</button>
          </div>

          {/* Pie Chart */}
          <div className={`p-6 rounded-lg shadow-md col-span-2 lg:col-span-1 ${isDark ? 'dark:bg-gray-900' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Activity className="text-purple-500" /> Course Attendance Distribution
            </h2>
            <Pie data={pieChartData} />
          </div>

          {/* Recent Activities */}
          <div className={`p-6 rounded-lg shadow-md col-span-2 lg:col-span-1 ${isDark ? 'dark:bg-gray-900' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Activity className="text-teal-500" /> Recent Activity
            </h2>
            <ul className="mt-4 space-y-3">
              {recentActivities.map((activity) => (
                <li key={activity.id} className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'} text-${isDark ? 'white' : 'gray-900'}`}>
                  <span className="font-bold">{activity.action}</span> – <span className="text-gray-500">{activity.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
