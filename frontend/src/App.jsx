import { useState } from 'react'
import Signup from './pages/auth/Signup'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './pages/dashboard';
import CaptureImage from './pages/CaptureImage';
function App() {
  

  return (
    <>
      {/* <Router> */}
        <Routes>
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/capture-image" element={<CaptureImage />} />
        </Routes>
      {/* </Router> */}
      {/* <Signup /> */}
    </>
  )
}

export default App
