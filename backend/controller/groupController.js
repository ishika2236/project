// controllers/groupController.js

const Group = require('../model/groups');
const Department = require('../model/department');
const User = require('../model/user');
const Course = require('../model/course');
const Classroom = require('../model/classroom')
const mongoose = require('mongoose')

// Create group within a department and assign department courses
const createGroup = async (req, res) => {
  const { departmentId } = req.params;
  const { name, mentorId, maxCapacity, description } = req.body;

  try {
    // Verify department exists
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    // Verify mentor exists and is a teacher
    if (mentorId) {
      const mentor = await User.findById(mentorId);
      if (!mentor || mentor.role !== 'teacher') {
        return res.status(400).json({ message: 'Mentor must be a valid teacher' });
      }
    }

    // Create the group
    const group = new Group({
      name,
      mentor: mentorId,
      department: departmentId,
      maxCapacity: maxCapacity || 100,
      description,
      courses: [] // Initialize empty courses array
    });

    await group.save();

    // Add group to department
    department.groups.push(group._id);
    await department.save();
    
    // Auto-assign all active courses from this department to the new group
    const departmentCourses = await Course.find({ 
      department: departmentId,
      isActive: true 
    });
    
    if (departmentCourses.length > 0) {
      // Add courses to group
      group.courses = departmentCourses.map(course => course._id);
      await group.save();
    }

    // Return the saved group with department information
    const populatedGroup = await Group.findById(group._id)
      .populate('department')
      .populate('mentor')
      .populate('courses');
      
    res.status(201).json({
      group: populatedGroup,
      assignedCourses: departmentCourses.length,
      message: `Group created and assigned to ${departmentCourses.length} courses from the department`
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const assignStudent = async (req, res) => {
  const { groupId } = req.params;
  const { studentIds } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if any student is already in the group
    for (const studentId of studentIds) {
      if (group.students.includes(studentId)) {
        return res.status(400).json({ 
          message: `Student ${studentId} is already in this group` 
        });
      }
    }

    // Check if adding students would exceed capacity
    if (group.students.length + studentIds.length > group.maxCapacity) {
      return res.status(400).json({ 
        message: 'Adding these students would exceed group capacity',
        currentCount: group.students.length,
        maxCapacity: group.maxCapacity,
        attemptingToAdd: studentIds.length
      });
    }

    // Verify students exist and have role 'student'
    const studentsToAdd = await User.find({ 
      _id: { $in: studentIds },
      role: 'student'
    });

    if (studentsToAdd.length !== studentIds.length) {
      return res.status(404).json({ 
        message: 'One or more students not found or not a student',
        found: studentsToAdd.length,
        requested: studentIds.length
      });
    }

    // Add students to the group
    group.students.push(...studentIds);
    await group.save();

    // Update each student to reflect the group and department
    for (const studentId of studentIds) {
      await User.findByIdAndUpdate(studentId, {
        $push: { groups: groupId },
        $set: { department: group.department }
      });
    }

    // 🔁 Now update all classrooms linked to this group
    const classrooms = await Classroom.find({ group: groupId });

    for (const classroom of classrooms) {
      const validStudentIds = studentIds
        .filter(id => id && mongoose.Types.ObjectId.isValid(id)); // Ensure valid ObjectIds

      // Avoid pushing duplicates
      const newAssigned = validStudentIds.filter(
        id => !classroom.assignedStudents.includes(id)
      );

      if (newAssigned.length > 0) {
        classroom.assignedStudents.push(...newAssigned);
        await classroom.save();
      }
    }

    return res.status(200).json({ 
      groupId, 
      students: studentsToAdd,
      message: `${studentIds.length} student(s) added to group and classrooms successfully`
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};


// Remove student from a group
const removeStudent = async (req, res) => {
  const { groupId } = req.params;
  const { studentId } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Remove student from group
    group.students = group.students.filter(id => id.toString() !== studentId);
    await group.save();

    // Remove group from student
    await User.findByIdAndUpdate(
      studentId,
      { $pull: { groups: groupId } }
    );

    res.status(200).json({ groupId, studentId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Assign teacher as mentor to a group
const assignTeacher = async (req, res) => {
  const { groupId } = req.params;
  const { teacherId } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Verify teacher exists and is a teacher
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ message: 'Teacher not found or not a teacher' });
    }

    group.mentor = teacherId;
    await group.save();

    res.status(200).json({ groupId, teacher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all groups based on user role
const getGroups = async (req, res) => {
  const user = req.user;

  try {
    let groups;
    
    if (user.role === 'admin') {
      groups = await Group.find()
        .populate('department')
        .populate('students')
        .populate('mentor')
        .populate('courses');
    } else if (user.role === 'teacher') {
      groups = await Group.find({ mentor: user.userId })
        .populate('department')
        .populate('students')
        .populate('courses');
    } else if (user.role === 'student') {
      groups = await Group.find({ students: user.userId })
        .populate('department')
        .populate('mentor')
        .populate('courses');
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }
  
    return res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all groups for a department
const getGroupsByDepartment = async (req, res) => {
  const { departmentId } = req.params;
  const user = req.user;

  try {
    // Verify the department exists
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    let groups;
    
    if (user.role === 'admin') {
      // Admin can see all groups in a department
      groups = await Group.find({ department: departmentId })
        .populate('students')
        .populate('mentor')
        .populate('courses');
    } else if (user.role === 'teacher') {
      // Teachers see groups they mentor in this department
      groups = await Group.find({ 
        department: departmentId,
        mentor: user._id 
      })
      .populate('students')
      .populate('courses');
    } else if (user.role === 'student') {
      // Students see groups they're enrolled in for this department
      groups = await Group.find({ 
        department: departmentId,
        students: user._id 
      })
      .populate('mentor')
      .populate('courses');
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    
    return res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all groups (admin only)
const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('department')
      .populate('students')
      .populate('mentor')
      .populate('courses');
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get specific group details
const getGroupById = async (req, res) => {
  try {
    const groupId = req.params.id;
    
    const group = await Group.findById(groupId)
      .populate('department')
      .populate('students')
      .populate('mentor')
      .populate({
        path: 'courses',
        populate: {
          path: 'courseCoordinator',
          select: 'name email' 
        }
      });
      
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update group
const updateGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const updates = req.body;
    console.log(updates);
    
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // If department is being changed, update the department references
    if (updates.department && updates.department !== group.department.toString()) {
      // Remove group from old department
      await Department.findByIdAndUpdate(
        group.department,
        { $pull: { groups: groupId } }
      );
      
      // Add group to new department
      await Department.findByIdAndUpdate(
        updates.department,
        { $push: { groups: groupId } }
      );
      
      // Update department reference for all students in this group
      for (const studentId of group.students) {
        await User.findByIdAndUpdate(
          studentId,
          { department: updates.department }
        );
      }
      
      // Update courses - remove old department courses, add new department courses
      // First, clear all existing courses
      group.courses = [];
      
      // Get all courses from the new department
      const newDepartmentCourses = await Course.find({
        department: updates.department,
        isActive: true
      });
      
      // Add new department courses
      group.courses = newDepartmentCourses.map(course => course._id);
    }
    if (updates.mentorId && updates.mentorId !== group.mentor.toString()) {
      const mentorExists = await User.findById(updates.mentorId);
      if (!mentorExists) {
        return res.status(400).json({ message: 'Mentor not found' });
      }
      group.mentor = updates.mentorId;
    }
    
    // Apply the updates
    Object.keys(updates).forEach(key => {
      if (key !== 'courses' && key !== 'mentor') {
        group[key] = updates[key];
      }
    });
    
    await group.save();
    
    const updatedGroup = await Group.findById(groupId)
      .populate('department mentor students courses');
    
    res.json(updatedGroup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add or remove courses from a group manually
const updateGroupCourses = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { coursesToAdd = [], coursesToRemove = [] } = req.body;
    
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Verify all courses exist
    if (coursesToAdd.length > 0) {
      const validCourses = await Course.find({ _id: { $in: coursesToAdd } });
      if (validCourses.length !== coursesToAdd.length) {
        return res.status(400).json({ message: 'One or more courses to add were not found' });
      }
      
      // Add courses that aren't already in the group
      for (const courseId of coursesToAdd) {
        if (!group.courses.includes(courseId)) {
          group.courses.push(courseId);
        }
      }
    }
    
    // Remove courses
    if (coursesToRemove.length > 0) {
      group.courses = group.courses.filter(
        courseId => !coursesToRemove.includes(courseId.toString())
      );
    }
    
    await group.save();
    
    const updatedGroup = await Group.findById(groupId)
      .populate('courses')
      .populate('department')
      .populate('mentor');
      
    res.status(200).json({
      message: 'Group courses updated successfully',
      added: coursesToAdd.length,
      removed: coursesToRemove.length,
      group: updatedGroup
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete group
const deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Remove group from department
    await Department.findByIdAndUpdate(
      group.department,
      { $pull: { groups: groupId } }
    );
    
    // Remove group from all students
    await User.updateMany(
      { groups: groupId },
      { $pull: { groups: groupId } }
    );
    
    // Delete the group
    await Group.findByIdAndDelete(groupId);
    
    res.json({ message: 'Group deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports = {createGroup,
  assignStudent,
  removeStudent,
  assignTeacher,
  getGroups,
  getAllGroups,
  getGroupsByDepartment,
  updateGroup,
  deleteGroup};