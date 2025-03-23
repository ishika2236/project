import React, { useState } from "react";
import DashboardLayout from "../dashboard";

const StudentCourses = () => {
  const [courses] = useState(["Math", "Physics"]);

  return (
    <DashboardLayout role="student">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Your Enrolled Courses</h2>
        <ul className="space-y-2">
          {courses.map((course, index) => (
            <li key={index} className="bg-gray-200 p-2 rounded">{course}</li>
          ))}
        </ul>
      </div>
    </DashboardLayout>
  );
};

export default StudentCourses;
