const express = require('express');
const router = express.Router();
const attendanceController = require('../controller/attendanceController');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');
// Authentication middleware for all routes

console.log(attendanceController);
router.use(authMiddleware);
// ====== New Routes for Face Embedding and Location Verification ======

/**
 * @route POST /api/attendance/verify-face
 * @desc Verify user's face embedding against stored embeddings
 * @access Private (Students & Teachers)
 * @requires userId from middleware
 */
router.post('/verify-face', attendanceController.verifyUserEmbedding);

/**
 * @route POST /api/attendance/verify-location
 * @desc Check if user's location is valid for a specific class
 * @access Private (Students & Teachers)
 * @requires userId from middleware
 */
router.post('/verify-location', attendanceController.checkLocationValidity);

// ====== Teacher Routes ======

/**
 * @route POST /api/attendance/window/open
 * @desc Open attendance window for a class
 * @access Private (Teachers only)
 */
router.post('/window/open', authorizeRoles(['teacher']), attendanceController.openAttendanceWindow);

/**
 * @route POST /api/attendance/window/close
 * @desc Close attendance window for a class
 * @access Private (Teachers only)
 */
router.post('/window/close', authorizeRoles(['teacher']), attendanceController.closeAttendanceWindow);

/**
 * @route GET /api/attendance/class/:classId
 * @desc Get attendance records for a specific class
 * @access Private (Teachers only)
 */
router.get('/class/:classId', authorizeRoles(['teacher']), attendanceController.getClassAttendance);

/**
 * @route POST /api/attendance/mark/manual
 * @desc Manually mark attendance for a student
 * @access Private (Teachers only)
 */
router.post('/mark/manual', authorizeRoles(['teacher']), attendanceController.markAttendanceManually);

/**
 * @route POST /api/attendance/mark/bulk
 * @desc Mark attendance for multiple students at once
 * @access Private (Teachers only)
 */
router.post('/mark/bulk', authorizeRoles(['teacher']), attendanceController.bulkMarkAttendance);

// ====== Student Routes ======

/**
 * @route POST /api/attendance/mark
 * @desc Mark attendance using face recognition and/or location
 * @access Private (Students only)
 */
router.post('/mark', authorizeRoles(['student']), attendanceController.markAttendanceByFaceAndLocation);

/**
 * @route GET /api/attendance/student/course/:courseId
 * @desc Get student's attendance records for a specific course
 * @access Private (Students only)
 */
router.get('/student/course/:courseId', authorizeRoles(['student']), attendanceController.getStudentAttendance);

// ====== Common Routes ======

/**
 * @route GET /api/attendance/window-status/:classId
 * @desc Check if attendance window is open for a class
 * @access Private (Students & Teachers)
 */
router.get('/window-status/:classId', attendanceController.getAttendanceWindowStatus);

module.exports = router;