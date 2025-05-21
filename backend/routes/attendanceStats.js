const express = require('express');
const router = express.Router();
const attendanceStatsController = require('../controller/attendanceStatsController');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');

// Base routes accessible by authenticated users
router.use(authMiddleware);

// Student routes
// Students can only view their own attendance
router.get(
  '/student/me',
  attendanceStatsController.getStudentAttendance
);

// Routes that require specific roles
// Admin routes - can view any attendance data
router.get(
  '/student/:studentId',
  authorizeRoles(['admin']),
  attendanceStatsController.getStudentAttendance
);

router.get(
  '/class/:classId',
  authorizeRoles(['admin', 'teacher']),
  attendanceStatsController.getClassAttendance
);

router.get(
  '/classroom/:classroomId',
  authorizeRoles(['admin', 'teacher']),
  attendanceStatsController.getClassroomAttendance
);

router.get(
  '/teacher/:teacherId',
  authorizeRoles(['admin', 'teacher']),
  attendanceStatsController.getTeacherAttendance
);

// Admin dashboard reports
router.get(
  '/reports/overall',
  authorizeRoles(['admin']),
  attendanceStatsController.getOverallAttendance
);

router.get(
  '/reports/daily',
  authorizeRoles(['admin']),
  attendanceStatsController.getDailyAttendanceReport
);

router.get(
  '/reports/monthly',
  authorizeRoles(['admin']),
  attendanceStatsController.getMonthlyAttendanceReport
);

module.exports = router;