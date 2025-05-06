const express = require('express');
const router = express.Router();
const {
  createGroup,
  assignStudent,
  removeStudent,
  assignTeacher,
  getGroups,
  getAllGroups,
  getGroupsByDepartment,
  updateGroup,
  deleteGroup
} = require('../controller/groupController');

const roleCheck = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    
    if (roles.includes(userRole)) {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden' });
  };
};

// Create group in a department
router.post('/department/:departmentId/create', roleCheck(['admin']), createGroup);

// Get all groups for a department
router.get('/department/:departmentId', getGroupsByDepartment);

// Assign a student to a group
router.post('/:groupId/assign-student', roleCheck(['admin', 'teacher']), assignStudent);

// Remove a student from a group
router.delete('/:groupId/remove-student', roleCheck(['admin', 'teacher']), removeStudent);

// Assign teacher to a group
router.post('/:groupId/assign-teacher', roleCheck(['admin']), assignTeacher);

// Update group
router.put('/:id', roleCheck(['admin', 'teacher']), updateGroup);

// Delete group
router.delete('/:id', roleCheck(['admin']), deleteGroup);

// Get groups based on user role (admin, teacher, student)
router.get('/', getGroups);

// Get all groups (admin only)
router.get('/all', roleCheck(['admin']), getAllGroups);

module.exports = router;