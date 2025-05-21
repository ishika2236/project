import { Routes, Route, Navigate } from "react-router-dom";
import './App.css';

// Auth Components
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
import ProtectedRoute from './ProtectedRoute';
import Sidebar from "./components/sidebar";

// Student Components
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCourses from './pages/student/StudentCourses';
import StudentEnroll from './pages/student/StudentEnroll';
import StudentCourseDetail from "./pages/student/StudentCourseDetails";
import ClassMaterials from "./pages/student/ClassMaterials";
import StudentDashboardOverview from "./components/student/StudentDashboardOverview";
import StudentClassroomPortal from "./pages/student/StudentClassroomPortal";

// Teacher Components
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherAttendanceDashboard from "./pages/teacher/TeacherAttendanceDashboard";

// Admin Components
import DashboardOverview from './components/admin/DashboardOverview';
import EnrolledUsersPage from './pages/admin/EnrolledUsersPage';
import CourseManagement from "./pages/admin/CourseManagement";
import AdminLayout from "./pages/admin/AdminLayout";
import AttendanceDashboard from "./pages/admin/AttendanceDashboard";
import AdminSettings from "./pages/admin/AdminSettings";
import GroupsManagementPage from "./pages/admin/GroupsManagementPage";

// Other Components
import CaptureImage from './pages/CaptureImage';
import DepartmentManagementPage from "./pages/admin/DepartmentManagementPage";
import TeacherLayout from './pages/teacher/TeacherLayout'
import ClassroomsPage from "./pages/teacher/ClassroomsPage";
import StudentCoursesPage from "./pages/student/StudentCourses";
import SmartAttendLanding from "./pages/SmartAttendLanding";
// import ClassroomSystem from "./pages/student/StudentClassroomPortal";



function App() {
  return (
    <Routes>
      {/* Public routes */}
      {/* <Route path="/" element={<Navigate to="/" replace />} /> */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes */}
      <Route path="/capture-image" element={
        <ProtectedRoute>
          <CaptureImage />
        </ProtectedRoute>
      } />
      
      {/* Student routes */}
      <Route path="/student/" element={
        <ProtectedRoute>
          <StudentDashboard />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/student" replace />} />
        {/* <Route path="dashboard" element={<StudentDashboardOverview  />} /> */}
        {/* <Route path="courses" element={<StudentCourses />} /> */}
        <Route path="classrooms" element= {<StudentClassroomPortal/>}></Route>
        <Route path="dashboard" element={<StudentCoursesPage />} />
        <Route path="enroll" element={<StudentEnroll />} />
        <Route path="attendance" element={<StudentClassroomPortal/>} />
        
        {/* Class-specific routes for student */}
        <Route path="courses/:courseId/classes/:classId/materials" element={<ClassMaterials />} />
      </Route>
      
      {/* Teacher routes - SIMPLIFIED */}
      <Route path="/teacher" element={
        
        <ProtectedRoute>
          <TeacherLayout/>
        </ProtectedRoute>
      }>
        
        <Route index element={<TeacherDashboard />} />
        <Route path="dashboard" element={<TeacherDashboard />} />

        {/* <Route path="courses" element={<CourseComponents />} /> */}
        <Route path="groups" element={<TeacherAttendanceDashboard />} />
        <Route path="classroom" element={<ClassroomsPage/>} />
      </Route>
        {/* <Route path="attendance" element={<AttendanceManagement />} />
        <Route path="classroom" element={<VirtualClassroomDashboard/>}></Route>  */}
        {/* <Route path="classes/:classId/control" element={<AttendanceControl />} />
        <Route path="classes/:classId/materials" element={<MaterialsSharing />} />
      </Route>
      
      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardOverview />} />
        <Route path="dashboard" element={<DashboardOverview />} />
        <Route path="enrolledUsers" element={<EnrolledUsersPage />} />
        <Route path="manageCourses" element={<CourseManagement />} />
        <Route path="manageGroups" element={<GroupsManagementPage/>} />
        <Route path="manageAttendance" element={<AttendanceDashboard/>}></Route>
        <Route path="adminSettings" element={<AdminSettings/>}></Route>
        <Route  path="manageDepartments" element={<DepartmentManagementPage/>}></Route>
      </Route>
      <Route path="/" element={<SmartAttendLanding/>}></Route>
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;