import { useState } from 'react'
import Signup from './pages/auth/Signup'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import DashboardLayput from './pages/dashboard';
import CaptureImage from './pages/CaptureImage';
import Login from './pages/auth/Login';
import ProtectedRoute from './ProtectedRoute';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCourses from './pages/student/StudentCourses';
import StudentEnroll from './pages/student/StudentEnroll';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
// import DashboardLayout from './components/DashboardLayout';

function App() {
  

  return (
    <>
      {/* <Router> */}
        <Routes>
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}
          <Route path="/capture-image" element={<ProtectedRoute><CaptureImage /></ProtectedRoute>} />
          <Route path="/student/dashboard" element={<StudentDashboard />}></Route>
          <Route path="/student/courses" element={<StudentCourses />}></Route>
          <Route path="/student/enroll" element={<StudentEnroll />}></Route>
          <Route path="/teacher/dashboard" element={<TeacherDashboard />}></Route>



        </Routes>
      {/* </Router> */}
      {/* <Signup /> */}
    </>
  )
}

export default App
