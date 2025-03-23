// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import TeacherCourses from "./pages/teacher/courses";
// import Requests from "./pages/teacher/requests";
// import StudentCourses from "./pages/student/courses";
// import EnrollCourse from "./pages/student/enroll";
// import DashboardLayout from "./pages/dashboard";

// const AppRoutes = () => {
//   const userRole = "teacher"; // Change to "student" for testing

//   return (
//     <Router>
//       <Routes>
//         {/* Default Redirect */}
//         <Route path="/" element={<Navigate to={`/${userRole}/dashboard`} replace />} />

//         {/* Teacher Routes */}
//         <Route path="/teacher/dashboard" element={<DashboardLayout role="teacher"><TeacherCourses /></DashboardLayout>} />
//         <Route path="/teacher/courses" element={<DashboardLayout role="teacher"><TeacherCourses /></DashboardLayout>} />
//         <Route path="/teacher/requests" element={<DashboardLayout role="teacher"><Requests /></DashboardLayout>} />

//         {/* Student Routes */}
//         <Route path="/student/dashboard" element={<DashboardLayout role="student"><StudentCourses /></DashboardLayout>} />
//         <Route path="/student/courses" element={<DashboardLayout role="student"><StudentCourses /></DashboardLayout>} />
//         <Route path="/student/enroll" element={<DashboardLayout role="student"><EnrollCourse /></DashboardLayout>} />

//         {/* 404 Page */}
//         <Route path="*" element={<h2 className="text-center mt-10 text-2xl">404 - Page Not Found</h2>} />
//       </Routes>
//     </Router>
//   );
// };

// export default AppRoutes;