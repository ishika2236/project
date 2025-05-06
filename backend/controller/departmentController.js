const Department = require('../model/department')
const User = require('../model/user');
const Group = require('../model/groups');
const Course = require('../model/course');

// Create a new department (admin only)
const createDepartment = async (req, res) => {
  try {
    const newDepartment = new Department(req.body);
    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all departments
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get department by ID
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('head')
      .populate('faculty')
      .populate('courses')
      .populate('groups');
    
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    res.json(department);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update department
const updateDepartment = async (req, res) => {
  try {
    const departmentId = req.params.id;
    const updates = req.body;
    
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    const updatedDepartment = await Department.findByIdAndUpdate(
      departmentId, 
      updates, 
      { new: true, runValidators: true }
    );
    
    res.json(updatedDepartment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete department
const deleteDepartment = async (req, res) => {
  try {
    const departmentId = req.params.id;
    
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    // Check if department has courses or groups
    if (department.courses.length > 0 || department.groups.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete department with associated courses or groups. Please remove these associations first.' 
      });
    }
    
    // Update users to remove this department reference
    await User.updateMany(
      { department: departmentId },
      { $unset: { department: "" } }
    );
    
    const deletedDepartment = await Department.findByIdAndDelete(departmentId);
    
    res.json(deletedDepartment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Assign head of department
const assignDepartmentHead = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { userId } = req.body;
    
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.role !== 'teacher') {
      return res.status(400).json({ error: 'Department head must be a teacher' });
    }
    
    department.head = userId;
    await department.save();
    
    res.json(department);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add faculty to department
const addFacultyToDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { userIds } = req.body;
    
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    // Find all users to make sure they exist before adding them
    const faculty = await User.find({ 
      _id: { $in: userIds },
      role: 'teacher'
    });
    
    // Check if all requested faculty were found and are teachers
    if (faculty.length !== userIds.length) {
      return res.status(400).json({ 
        error: 'One or more users not found or not teachers',
        found: faculty.length,
        requested: userIds.length
      });
    }
    
    // Add faculty to department
    for (const userId of userIds) {
      if (!department.faculty.includes(userId)) {
        department.faculty.push(userId);
      }
      
      // Update user's department reference
      await User.findByIdAndUpdate(
        userId,
        { department: departmentId }
      );
    }
    
    await department.save();
    
    res.json(department);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove faculty from department
const removeFacultyFromDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { userId } = req.body;
    
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    // Remove faculty from department
    department.faculty = department.faculty.filter(id => id.toString() !== userId);
    await department.save();
    
    // If user is the head of department, remove that as well
    if (department.head && department.head.toString() === userId) {
      department.head = null;
      await department.save();
    }
    
    // Remove department reference from user
    await User.findByIdAndUpdate(
      userId,
      { $unset: { department: "" } }
    );
    
    res.json(department);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  assignDepartmentHead,
  addFacultyToDepartment,
  removeFacultyFromDepartment
};