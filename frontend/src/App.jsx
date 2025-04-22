import { Routes, Route, Navigate } from "react-router-dom";
import './App.css';

// Auth Components
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
import ProtectedRoute from './ProtectedRoute';

// Student Components
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCourses from './pages/student/StudentCourses';
import StudentEnroll from './pages/student/StudentEnroll';
import StudentCourseDetail from "./pages/student/StudentCourseDetails";
import ClassMaterials from "./pages/student/ClassMaterials";
import StudentDashboardOverview from "./components/student/StudentDashboardOverview";

// Teacher Components
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CourseOverview from './components/teacher/CourseOverview';
import CourseDetails from './components/teacher/CourseDetails';
import ClassManagement from './components/teacher/ClassManagement';
import AttendanceManagement from './components/teacher/AttendanceManagement';
import AttendanceControl from './components/teacher/AttendanceControl';
import MaterialsSharing from './components/teacher/MaterialsSharing';

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

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
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
        <Route path="dashboard" element={<StudentDashboardOverview  />} />
        {/* <Route path="courses" element={<StudentCourses />} /> */}
        <Route path="courses" element={<StudentCourseDetail />} />
        <Route path="enroll" element={<StudentEnroll />} />
        <Route path="attendance" element={<CaptureImage />} />
        
        {/* Class-specific routes for student */}
        <Route path="courses/:courseId/classes/:classId/materials" element={<ClassMaterials />} />
      </Route>
      
      {/* Teacher routes - SIMPLIFIED */}
      <Route path="/teacher" element={
        <ProtectedRoute>
          <TeacherDashboard />
        </ProtectedRoute>
      }>
        <Route index element={<CourseOverview />} />
        <Route path="dashboard" element={<CourseOverview />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />
        <Route path="groups/:groupId" element={<ClassManagement />} />
        <Route path="classes/:classId/attendance" element={<AttendanceManagement />} />
        <Route path="classes/:classId/control" element={<AttendanceControl />} />
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
      </Route>
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;