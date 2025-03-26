import React from "react";
// import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
// import StudentDashboard from "../pages/student/StudentDashboard";

const DashboardLayout = ({ children, role }) => {
  return (
    <div className="flex">
      <Sidebar role={role} />
      <div className="flex flex-col w-full">
        <Navbar username="John Doe" />
        <div className="p-6"> {children} </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
