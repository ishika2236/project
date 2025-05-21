const express = require('express');
const router = express.Router();
const classController = require('../controller/classController');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * Class Routes
 */

// Schedule a class (handles both regular and extra classes)
router.post(
  '/schedule',
  authMiddleware,
  authorizeRoles(['admin', 'teacher', 'department_head']),
  classController.scheduleClass
);

// Get all classes
router.get(
  '/',
  authMiddleware,
  classController.getAllClasses
);

// Get classes for a date range
router.get(
  '/daterange',
  authMiddleware,
  classController.getClassesForDateRange
);

// Get classes for a specific classroom
router.get(
  '/classroom/:classroomId',
  authMiddleware,
  classController.getClassesByClassroom
);

// Get classes for a specific classroom within a date range
router.get(
  '/classroom/:classroomId/daterange',
  authMiddleware,
  classController.getClassesByClassroomForDateRange
);

// Get a specific class by ID
router.get(
  '/:id',
  authMiddleware,
  classController.getClassById
);

// Reschedule a class
router.put(
  '/:id/schedule',
  authMiddleware,
  authorizeRoles(['admin', 'teacher', 'department_head']),
  classController.rescheduleClass
);

// Update class location
router.patch(
  '/:id/location',
  authMiddleware,
  authorizeRoles(['admin', 'teacher', 'department_head']),
  classController.updateClassLocation
);

// Update class notes
router.patch(
  '/:id/notes',
  authMiddleware,
  authorizeRoles(['admin', 'teacher', 'department_head']),
  classController.updateClassNotes
);

// Update class topics
router.patch(
  '/:id/topics',
  authMiddleware,
  authorizeRoles(['admin', 'teacher', 'department_head']),
  classController.updateClassTopics
);

// Update class special requirements
router.patch(
  '/:id/requirements',
  authMiddleware,
  authorizeRoles(['admin', 'teacher', 'department_head']),
  classController.updateSpecialRequirements
);

// Delete a class
router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles(['admin', 'teacher']),
  classController.deleteClass
);

module.exports = router;