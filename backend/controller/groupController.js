// controllers/groupController.js

const Group = require('../model/groups');
const Course = require('../model/course');
const Class = require('../model/class'); 
const Resource = require('../model/resource'); 
const User = require('../model/user');

const createGroup = async (req, res) => {
  const { courseId } = req.params;
  const { name, teacherId, teacherName } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const group = new Group({
      name: name,
      mentor: teacherId,
      course: courseId
    });

    await group.save();

    course.groups.push(group._id);
    await course.save();

    // Return the saved group with course information
    const populatedGroup = await Group.findById(group._id).populate('course');
    res.status(201).json(populatedGroup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const assignStudent = async (req, res) => {
  const { groupId } = req.params;
  const { studentIds } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    // Check if any student is already in the group
    console.log(req.body)
    for (const studentId of studentIds) {
      if (group.students.includes(studentId)) {
        return res.status(400).json({ 
          message: `Student ${studentId} is already in this group` 
        });
      }
    }
    
    // Check if adding all students would exceed capacity
    if (group.students.length + studentIds.length > group.maxCapacity) {
      return res.status(400).json({ 
        message: 'Adding these students would exceed group capacity',
        currentCount: group.students.length,
        maxCapacity: group.maxCapacity,
        attemptingToAdd: studentIds.length
      });
    }

    // Find all students to make sure they exist before adding them
    const studentsToAdd = await User.find({ _id: { $in: studentIds } });
    
    // Check if all students were found
    if (studentsToAdd.length !== studentIds.length) {
      return res.status(404).json({ 
        message: 'One or more students not found',
        found: studentsToAdd.length,
        requested: studentIds.length
      });
    }
    
    // Add students to the group
    group.students.push(...studentIds);
    await group.save();

    res.status(200).json({ 
      groupId, 
      students: studentsToAdd,
      message: `${studentIds.length} student(s) added successfully`
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeStudent = async (req, res) => {
  const { groupId } = req.params;
  const { studentId } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    group.students = group.students.filter(id => id.toString() !== studentId);
    await group.save();

    res.status(200).json({ groupId, studentId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const assignTeacher = async (req, res) => {
  const { groupId } = req.params;
  const { teacherId } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    group.mentor = teacherId;
    await group.save();

    // Get the teacher information
    const teacher = await User.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json({ groupId, teacher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getGroupResources = async(req, res) => {
    try {
        const resources = await Resource.find({ group: req.params.groupId });
        res.json(resources);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch resources." });
    }
};

const getGroupClasses = async (req, res) => {
  const { groupId } = req.params;
  try {
    const classes = await Class.find({ group: groupId });
    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller logic for getting groups based on user role
const getGroups = async (req, res) => {
  const user = req.user;

  try {
    let groups;
    
    if (user.role === 'admin') {
      groups = await Group.find()
        .populate('course')
        .populate('students')
        .populate('mentor');
    } else if (user.role === 'teacher') {
      groups = await Group.find({ mentor: user._id })
        .populate('course')
        .populate('students');
    } else if (user.role === 'student') {
      groups = await Group.find({ students: user._id })
        .populate('course')
        .populate('mentor');
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    
    return res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all groups for a specific course
const getGroupsByCourse = async (req, res) => {
  const { courseId } = req.params;
  const user = req.user;

  try {
    // Verify the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    let groups;
    
    if (user.role === 'admin') {
      // Admin can see all groups in a course
      groups = await Group.find({ course: courseId })
        .populate('students')
        .populate('mentor');
    } else if (user.role === 'teacher') {
      // Teachers see groups they mentor in this course
      groups = await Group.find({ 
        course: courseId,
        mentor: user._id 
      })
      .populate('students');
    } else if (user.role === 'student') {
      // Students see groups they're enrolled in for this course
      groups = await Group.find({ 
        course: courseId,
        students: user._id 
      })
      .populate('mentor');
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    
    return res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('course')
      .populate('students')
      .populate('mentor');
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createGroup, 
  assignStudent, 
  removeStudent, 
  assignTeacher, 
  getGroupResources, 
  getGroupClasses, 
  getGroups, 
  getAllGroups,
  getGroupsByCourse
};