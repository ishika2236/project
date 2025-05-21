// controllers/courseController.js
const Course = require('../model/course');
const User = require('../model/user');
const Department = require('../model/department');
const Group = require('../model/groups');

// Create Course with auto-assignment to department groups
const createCourse = async (req, res) => {
  try {
    const { department, courseCoordinator, ...courseData } = req.body;
    
    // Validate department exists
    const departmentObj = await Department.findById(department);
    if (!departmentObj) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    // Validate coordinator exists
    const coordinatorObj = await User.findById(courseCoordinator);
    if (!coordinatorObj) {
      return res.status(404).json({ error: 'Course Coordinator not found' });
    }
    
    // Create the new course
    const newCourse = new Course({
      ...courseData,
      department: departmentObj._id,
      courseCoordinator: coordinatorObj._id
    });
    
    await newCourse.save();
    
    // Add course to department
    departmentObj.courses.push(newCourse._id);
    await departmentObj.save();
    
    // Auto-assign course to all active groups in the same department
    const departmentGroups = await Group.find({ 
      department: departmentObj._id,
      isActive: true 
    });
    
    // Track the assignments for response
    const groupAssignments = [];
    
    // Assign course to each group
    for (const group of departmentGroups) {
      group.courses.push(newCourse._id);
      await group.save();
      groupAssignments.push({
        groupId: group._id,
        groupName: group.name
      });
    }
    const populatedCourse = await Course.findById(newCourse._id)
  .populate('courseCoordinator')
  .populate('department');
    
    // Return the course and group assignments
    res.status(201).json({
      course: populatedCourse,
      assignedToGroups: groupAssignments,
      message: `Course automatically assigned to ${groupAssignments.length} groups in the department`
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

// Admin can view all courses
const getAllCoursesForAdmin = async (req, res) => {
  try {
    const courses = await Course.find().populate('department').populate('courseCoordinator').populate('instructors');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCoursesForTeacher = async (req, res) => {
  try {
    const teacherId = req.user.userId;
    const teacher = await User.findById(teacherId);
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    
    // Find courses where this teacher is either coordinator or instructor
    const courses = await Course.find({
      $or: [
        { courseCoordinator: teacherId },
        { instructors: teacherId }
      ]
    }).populate('department').populate('instructors');
    
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get courses for a specific group
const getCoursesForGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    
    // Verify group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    // Get all courses assigned to this group
    const courses = await Course.find({
      _id: { $in: group.courses }
    }).populate('department courseCoordinator');
    
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCoursesForStudent = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    
    // Find student's group(s)
    const studentGroups = await Group.find({
      students: studentId
    });
    
    // Collect course IDs from all student's groups
    const groupCourseIds = studentGroups.flatMap(group => group.courses);
    
    // Get courses from both direct enrollment and group assignment
    const courses = await Course.find({
      $or: [
        { 'enrolledStudents.student': studentId },
        { _id: { $in: groupCourseIds } }
      ]
    }).populate('department');
    
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('courseCoordinator')
      .populate('instructors')
      .populate('department');
      
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Assign Coordinator
const assignCoordinator = async (req, res) => {
  const { coordinatorId } = req.body;
  try {
    // Verify coordinator is a teacher
    const coordinator = await User.findById(coordinatorId);
    if (!coordinator || coordinator.role !== 'teacher') {
      return res.status(400).json({ error: 'Coordinator must be a teacher' });
    }
    
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { courseCoordinator: coordinatorId },
      { new: true }
    );
    
    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Manually assign course to a group
const assignCourseToGroup = async (req, res) => {
  const courseId = req.params.id;
  const { groupId } = req.body;
  
  try {
    // Verify the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Verify the group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    // Check if course is already assigned to the group
    if (group.courses.includes(courseId)) {
      return res.status(400).json({ error: 'Course already assigned to this group' });
    }
    
    // Add course to group
    group.courses.push(courseId);
    await group.save();
    
    res.status(200).json({
      message: 'Course successfully assigned to group',
      course: courseId,
      group: groupId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove course from a group
const removeCourseFromGroup = async (req, res) => {
  const courseId = req.params.id;
  const { groupId } = req.body;
  
  try {
    // Verify the group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    // Remove course from group
    group.courses = group.courses.filter(id => id.toString() !== courseId);
    await group.save();
    
    res.status(200).json({
      message: 'Course successfully removed from group',
      course: courseId,
      group: groupId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Enroll student in course
const enrollInCourse = async (req, res) => {
  const courseId = req.params.id;
  const { studentId } = req.body;
  
  try {
    // Verify the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Verify the student exists
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    // Check if student is already enrolled
    const isAlreadyEnrolled = course.enrolledStudents.some(
      (e) => e.student.toString() === studentId
    );
    
    if (isAlreadyEnrolled) {
      return res.status(400).json({ error: 'Student already enrolled in this course' });
    }
    
    // Check if course is at capacity
    if (course.enrolledStudents.length >= course.maxCapacity) {
      return res.status(400).json({ error: 'Course is at maximum capacity' });
    }
    
    // Add student to course
    course.enrolledStudents.push({ student: studentId });
    await course.save();
    
    // Add course to student's enrolledCourses
    await User.findByIdAndUpdate(
      studentId,
      { $push: { enrolledCourses: { course: courseId } } }
    );
    
    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const updates = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // If department is being changed, update the department references
    if (updates.department && updates.department !== course.department.toString()) {
      // Remove course from old department
      await Department.findByIdAndUpdate(
        course.department,
        { $pull: { courses: courseId } }
      );
      
      // Add course to new department
      await Department.findByIdAndUpdate(
        updates.department,
        { $push: { courses: courseId } }
      );
      
      // Remove course from all groups in old department and add to all groups in new department
      // First, remove from old department groups
      await Group.updateMany(
        { department: course.department },
        { $pull: { courses: courseId } }
      );
      
      // Then, add to new department groups
      const newDepartmentGroups = await Group.find({ 
        department: updates.department,
        isActive: true 
      });
      
      for (const group of newDepartmentGroups) {
        group.courses.push(courseId);
        await group.save();
      }
    }
    
    // Update the course with the new data
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updates,
      { new: true }
    ).populate('courseCoordinator').populate('department').populate('instructors');
    
    
    res.status(200).json(updatedCourse);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    
    // Find course and validate it exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Remove course from department
    await Department.findByIdAndUpdate(
      course.department,
      { $pull: { courses: courseId } }
    );
    
    // Remove course from any users who have it enrolled
    await User.updateMany(
      { 'enrolledCourses.course': courseId }, 
      { $pull: { enrolledCourses: { course: courseId } } }
    );
    
    // Remove course from all groups
    await Group.updateMany(
      { courses: courseId },
      { $pull: { courses: courseId } }
    );
    
    // Delete the course
    const deletedCourse = await Course.findByIdAndDelete(courseId);
    
    res.status(200).json(deletedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get courses by department
const getCoursesByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    
    // Verify department exists
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    // Find courses for this department
    const courses = await Course.find({ department: departmentId })
      .populate('courseCoordinator')
      .populate('instructors');
    
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const assignTeacherToCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { teacherId, groupId } = req.body;
    
    // Validate inputs
    if (!courseId || !teacherId || !groupId) {
      return res.status(400).json({ message: 'Course ID, Teacher ID, and Group ID are required' });
    }
    
    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Find the teacher
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    // Find the group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if teacher is already assigned to this course for this group
    const existingAssignment = course.instructors.find(
      instructor => instructor.toString() === teacherId
    );
    
    if (!existingAssignment) {
      // Add teacher to course instructors
      course.instructors.push(teacherId);
    }
    
    // Update teacher's teaching assignments
    const teachingAssignment = {
      course: courseId,
      group: groupId
    };
    
    // Check if teacher already has this assignment
    const existingTeachingAssignment = teacher.teachingAssignments.find(
      assignment => 
        assignment.course.toString() === courseId &&
        assignment.group.toString() === groupId
    );
    
    if (!existingTeachingAssignment) {
      teacher.teachingAssignments.push(teachingAssignment);
    }
    
    // Save both course and teacher
    await Promise.all([course.save(), teacher.save()]);
    
    // Return updated course with populated data
    const updatedCourse = await Course.findById(courseId)
      .populate('courseCoordinator', 'firstName lastName email')
      .populate('instructors', 'firstName lastName email')
      .populate('department', 'name')
      .populate({
        path: 'enrolledStudents.student',
        select: 'firstName lastName email rollNumber'
      });
    
    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error('Error assigning teacher to course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createCourse,
  getCoursesForStudent,
  getCoursesForTeacher,
  getAllCoursesForAdmin,
  getCourseById,
  assignCoordinator,
  enrollInCourse,
  updateCourse,
  deleteCourse,
  getCoursesByDepartment,
  getCoursesForGroup,
  assignCourseToGroup,
  removeCourseFromGroup,
  assignTeacherToCourse
};