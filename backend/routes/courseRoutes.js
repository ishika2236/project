
const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCoursesForAdmin,
  getCoursesForStudent,
  getCoursesForTeacher,
  getCourseById,
  assignCoordinator,
  enrollInCourse,
  updateCourse,
  deleteCourse
} = require('../controller/courseController');

const roleCheck = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    
    if (roles.includes(userRole)) {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden' });
  };
};

// Create course route
router.post('/create', createCourse);

// Admin Routes
router.get('/admin/courses', roleCheck(['admin']), getAllCoursesForAdmin);

// Teacher Route
router.get('/teacher/courses', roleCheck(['teacher']), getCoursesForTeacher);

// Student Route
router.get('/student/courses', roleCheck(['student']), getCoursesForStudent);

// Get course by ID
router.get('/:id', getCourseById);

// Assign coordinator to course
router.patch('/:id/assign-coordinator', assignCoordinator);

// Enroll student in course
router.post('/:id/enroll', enrollInCourse);

// Update course - accessible to admin and coordinator
router.put('/:id', roleCheck(['admin', 'teacher']), updateCourse);

// Delete course - admin only
router.delete('/:id', roleCheck(['admin']), deleteCourse);

module.exports = router;