const express = require('express');
const router = express.Router();
const classroomController = require('../controller/classroomController');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('./../utils/multerConfig')
/**
 * Classroom Routes
 */

// Create routes
router.post(
  '/',
  authMiddleware,
  authorizeRoles(['admin', 'department_head']),
  classroomController.createClassroom
);

// Read routes
router.get(
  '/',
  authMiddleware,
  classroomController.getAllClassrooms
);

router.get(
  '/department/:departmentId',
  authMiddleware,
  classroomController.getClassroomsByDepartment
);

router.get(
  '/course/:courseId',
  authMiddleware,
  classroomController.getClassroomsByCourse
);

router.get(
  '/group/:groupId',
  authMiddleware,
  classroomController.getClassroomsByGroup
);

router.get(
  '/teacher/:teacherId',
  authMiddleware,
  classroomController.getClassroomsByTeacher
);
router.get('/student/:studentId',authMiddleware, classroomController.getClassroomsByStudent);
router.get(
  '/:id',
  authMiddleware,
  classroomController.getClassroomById
);

router.get(
  '/:id/students',
  authMiddleware,
  classroomController.getClassroomStudents
);

// Update routes
router.put(
  '/:id',
  authMiddleware,
  authorizeRoles(['admin', 'department_head']),
  classroomController.updateClassroom
);

router.patch(
  '/:id/teacher',
  authMiddleware,
  authorizeRoles(['admin', 'department_head']),
  classroomController.updateTeacher
);

router.patch(
  '/:id/group',
  authMiddleware,
  authorizeRoles(['admin', 'department_head']),
  classroomController.updateGroup
);

router.patch(
  '/:id/course',
  authMiddleware,
  authorizeRoles(['admin', 'department_head']),
  classroomController.updateCourse
);

// Delete routes
router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles(['admin', 'department_head']),
  classroomController.deleteClassroom
);
router.post('/:id/upload-material', upload.array('files', 10),authMiddleware, classroomController.uploadResource);


// Post an announcement to a classroom
router.post('/:id/announcement', authMiddleware, classroomController.postAnnouncement);
// Get all announcements of a classroom
router.get('/:id/announcements', authMiddleware, classroomController.getAnnouncements);

// Edit a specific announcement
router.put('/:classroomId/announcement/:announcementId', authMiddleware, classroomController.editAnnouncement);

// Delete a specific announcement
router.delete('/:classroomId/announcement/:announcementId', authMiddleware, classroomController.deleteAnnouncement);
router.delete('/:id/delete-material/:resourceId', classroomController.deleteMaterial);

module.exports = router;