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
  deleteCourse,
  getCoursesByDepartment,
  assignTeacherToCourse
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
router.post('/create', roleCheck(['admin']), createCourse);

// Admin Routes
router.get('/admin/courses', roleCheck(['admin']), getAllCoursesForAdmin);

// Teacher Route
router.get('/teacher/courses', roleCheck(['teacher']), getCoursesForTeacher);

// Student Route
router.get('/student/courses', roleCheck(['student']), getCoursesForStudent);

// Get courses by department
router.get('/department/:departmentId', getCoursesByDepartment);

// Get course by ID
router.get('/:id', getCourseById);

// Assign coordinator to course
router.patch('/:id/assign-coordinator', roleCheck(['admin']), assignCoordinator);

// Enroll student in course
router.post('/:id/enroll', enrollInCourse);

// Update course - accessible to admin and coordinator
router.put('/:id', roleCheck(['admin', 'teacher']), updateCourse);

// Delete course - admin only
router.delete('/:id', roleCheck(['admin']), deleteCourse);
router.post(
  '/:courseId/assign-teacher',
  roleCheck(['admin', 'teacher']),
  assignTeacherToCourse
);

module.exports = router;