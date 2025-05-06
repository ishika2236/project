const express = require('express');
const router = express.Router();
const {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  assignDepartmentHead,
  addFacultyToDepartment,
  removeFacultyFromDepartment
} = require('../controller/departmentController');

const roleCheck = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    
    if (roles.includes(userRole)) {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden' });
  };
};

// Create department (admin only)
router.post('/create', roleCheck(['admin']), createDepartment);

// Get all departments
router.get('/', getAllDepartments);

// Get department by ID
router.get('/:id', getDepartmentById);

// Update department (admin only)
router.put('/:id', roleCheck(['admin']), updateDepartment);

// Delete department (admin only)
router.delete('/:id', roleCheck(['admin']), deleteDepartment);

// Assign department head (admin only)
router.post('/:departmentId/assign-head', roleCheck(['admin']), assignDepartmentHead);

// Add faculty to department (admin only)
router.post('/:departmentId/add-faculty', roleCheck(['admin']), addFacultyToDepartment);

// Remove faculty from department (admin only)
router.delete('/:departmentId/remove-faculty', roleCheck(['admin']), removeFacultyFromDepartment);

module.exports = router;