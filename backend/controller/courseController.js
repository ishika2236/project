// Updated courseController.js with update and delete functionality
const Course = require('../model/course');
const User = require('../model/user');
const Group = require('../model/groups');

// Create Course
const createCourse = async (req, res) => {
  try {
    console.log(req.body);
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

// Admin can view all courses
const getAllCoursesForAdmin = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCoursesForTeacher = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const teacher = await User.findById(teacherId).populate('assignedCourses');
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    res.json(teacher.assignedCourses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCoursesForStudent = async (req, res) => {
  try {
    const studentId = req.user.id;
    const student = await User.findById(studentId).populate('enrolledCourses');
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student.enrolledCourses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('courseCoordinator instructors groups');
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
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { courseCoordinator: coordinatorId },
      { new: true }
    );
    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Enroll student
const enrollInCourse = async (req, res) => {
  const { studentId } = req.body;
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const isAlreadyEnrolled = course.enrolledStudents.some(
      (e) => e.student.toString() === studentId
    );
    if (isAlreadyEnrolled) {
      return res.status(400).json({ error: 'Student already enrolled' });
    }

    course.enrolledStudents.push({ student: studentId });
    await course.save();

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
    
    console.log(courseId, updates);
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Update the course with the new data
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId, 
      updates, 
      { new: true, runValidators: true }
    ).populate('courseCoordinator instructors groups');
    
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
    
    // Remove course from any users who have it assigned or enrolled
    await User.updateMany(
      { assignedCourses: courseId }, 
      { $pull: { assignedCourses: courseId } }
    );
    
    await User.updateMany(
      { enrolledCourses: courseId }, 
      { $pull: { enrolledCourses: courseId } }
    );
    
    // Delete the course
    const deletedCourse = await Course.findByIdAndDelete(courseId);
    
    res.status(200).json(deletedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
  deleteCourse
};
