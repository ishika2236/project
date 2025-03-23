import React from "react";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

const DashboardLayout = ({ children, role }) => {
  return (
    <div className="flex">
      <Sidebar role={role} />
      <div className="flex flex-col w-full">
        <Navbar username="John Doe" />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
