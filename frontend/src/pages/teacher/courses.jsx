import React, { useState } from "react";
import DashboardLayout from "../dashboard";

const TeacherCourses = () => {
  const [courses, setCourses] = useState(["Math", "Physics", "Computer Science"]);

  return (
    <DashboardLayout role="teacher">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Your Courses</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4">➕ Add New Course</button>
        <ul className="space-y-2">
          {courses.map((course, index) => (
            <li key={index} className="bg-gray-200 p-2 rounded">{course}</li>
          ))}
        </ul>
      </div>
    </DashboardLayout>
  );
};

export default TeacherCourses;
