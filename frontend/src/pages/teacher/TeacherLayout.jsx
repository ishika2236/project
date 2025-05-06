import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/Navbar";
export default function TeacherLayout({}) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-100">
        {/* Sidebar container - you can pass in your existing sidebar component */}
        <aside className={` shrink-0 h-full`}>
          <Sidebar/>
        </aside>
  
        {/* Main content area with navbar and outlet */}
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          {/* Navbar container - you can pass in your existing navbar component */}
          <header className="h-16 shrink-0">
            <Navbar title="Dashboard"/>
          </header>
  
          {/* Outlet for page content */}
          <main className="flex-1 overflow-auto ">
            <Outlet/>
          </main>
        </div>
      </div>
    );
  }