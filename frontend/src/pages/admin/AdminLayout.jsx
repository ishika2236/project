import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/sidebar';
import Navbar from '../../components/Navbar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar title='Admin Dashboard' />
        
        <div className="flex-1 overflow-y-auto bg-gray-900">
          {/* This Outlet will render the nested routes */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;