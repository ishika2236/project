import React from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const StudentCourses = () => {
  // Sample enrolled courses with details
  const enrolledCourses = [
    {
      id: 1,
      name: "Machine Learning",
      instructor: "Dr. Smith",
      attendance: 85,
      nextClass: "March 28, 10:00 AM",
      room: "Room 304",
      totalClasses: 20,
    },
    {
      id: 2,
      name: "Quantum Computing",
      instructor: "Dr. Johnson",
      attendance: 70,
      nextClass: "March 29, 2:00 PM",
      room: "Room 112",
      totalClasses: 18,
    },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar role="student" />

      {/* Main Dashboard Section */}
      <div className="flex-1 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
        {/* Navbar */}
        <Navbar userName="Student" />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">My Courses</h1>

          {enrolledCourses.length === 0 ? (
            <p className="text-gray-500">You are not enrolled in any courses.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                  <h2 className="text-lg font-semibold">{course.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Instructor: <span className="font-medium">{course.instructor}</span>
                  </p>

                  {/* Attendance Bar */}
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{ width: `${course.attendance}%` }}
                    ></div>
                  </div>
                  <p className="text-sm mt-1">Attendance: {course.attendance}%</p>

                  {/* Next Class Info */}
                  <p className="mt-2 text-sm">
                    <span className="font-medium">Next Class:</span> {course.nextClass}
                  </p>

                  {/* Room & Total Classes */}
                  <p className="text-sm">
                    <span className="font-medium">Room:</span> {course.room}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Total Classes:</span> {course.totalClasses}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCourses;
