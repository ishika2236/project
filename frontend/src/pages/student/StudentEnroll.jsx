import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const StudentEnroll = () => {
  const [courseName, setCourseName] = useState("");
  const [message, setMessage] = useState("");

  const handleEnroll = (e) => {
    e.preventDefault();
    if (courseName.trim() === "") {
      setMessage("Please enter a course name.");
      return;
    }
    setMessage(`Enrollment request for "${courseName}" sent!`);
    setCourseName("");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar role="student" />

      {/* Main Dashboard Section */}
      <div className="flex-1 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
        {/* Navbar */}
        <Navbar userName="Student" />
        <div className="p-6 max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Enroll in a New Course</h1>
          <form onSubmit={handleEnroll} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <label className="block mb-2 text-sm font-medium">Course Name</label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Enter course name..."
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <button type="submit" className="mt-4 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
              Enroll
            </button>
            {message && <p className="mt-2 text-green-500">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentEnroll;
