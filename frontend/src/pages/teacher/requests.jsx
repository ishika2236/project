import React, { useState } from "react";
import DashboardLayout from "../dashboard";

const Requests = () => {
  const [requests, setRequests] = useState([
    { id: 1, student: "Alice", course: "Math" },
    { id: 2, student: "Bob", course: "Physics" },
  ]);

  return (
    <DashboardLayout role="teacher">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Student Requests</h2>
        <ul className="space-y-2">
          {requests.map((req) => (
            <li key={req.id} className="bg-gray-200 p-2 rounded flex justify-between">
              {req.student} wants to join {req.course}
              <button className="bg-blue-500 text-white px-4 py-1 rounded">✔ Accept</button>
            </li>
          ))}
        </ul>
      </div>
    </DashboardLayout>
  );
};

export default Requests;
