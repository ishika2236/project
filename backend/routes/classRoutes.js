const express = require('express');
const router = express.Router();
const classController = require('../controller/classController');
const { authMiddleware, isTeacher, isAdmin } = require('../middleware/authMiddleware');

// Get routes - accessible by authenticated users

router.get('/teacher', authMiddleware,  classController.fetchTeacherClassrooms);
router.get('/group/:groupId', authMiddleware, classController.getClassesByGroup);
router.get('/course/:courseId', authMiddleware, classController.getClassesByCourse);
router.get('/teacher/:teacherId', authMiddleware, classController.getClassesByTeacher);
router.get('/:classId', authMiddleware, classController.getClassById);

// Create, update, delete - restricted to teachers and admins
router.post('/', authMiddleware, isTeacher, classController.createClass);
router.put('/:classId', authMiddleware, isTeacher, classController.updateClass);
router.delete('/:classId', authMiddleware, isAdmin, classController.deleteClass);

// Schedule management - restricted to teachers and admins
router.post('/:classId/schedule', authMiddleware, isTeacher, classController.addSchedule);
router.put('/:classId/schedule/:scheduleId', authMiddleware, isTeacher, classController.updateSchedule);
router.delete('/:classId/schedule/:scheduleId', authMiddleware, isTeacher, classController.deleteSchedule);

// Session management (extra classes) - restricted to teachers and admins
router.post('/:classId/session', authMiddleware, isTeacher, classController.createSession);
router.put('/:classId/session/:sessionId', authMiddleware, isTeacher, classController.updateSession);
router.delete('/:classId/session/:sessionId', authMiddleware, isTeacher, classController.deleteSession);

// Location management - restricted to teachers and admins
router.put('/:classId/location', authMiddleware, isTeacher, classController.updateClassLocation);

// Attendance routes
router.get('/:classId/session/:sessionId/attendance', authMiddleware, classController.getSessionAttendance);
router.post('/:classId/session/:sessionId/attendance', authMiddleware, classController.markAttendance);


module.exports = router;