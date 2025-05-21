const Classroom = require('../model/classroom');
const User = require('../model/user');
const Group = require('../model/groups');
const Resource = require('../model/resource');
const Class = require('./../model/class')
/**
 * Controller for handling classroom operations
 * Classroom is a logical entity that maps one teacher, one group, and one course together
 */
const classroomController = {
  /**
   * Create a new classroom
   * @route POST /api/classrooms
   */
  createClassroom: async (req, res) => {
    try {
      const { teacherId, groupId, courseId } = req.body;
  
      // Validate required fields
      if (!groupId || !courseId || !teacherId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      // Fetch teacher and their department
      const teacher = await User.findById(teacherId);
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
  
      const department = teacher.department;
  
      // 🔍 Check if classroom already exists
      let classroom = await Classroom.findOne({
        group: groupId,
        course: courseId,
        department: department
      });
  
      if (classroom) {
        // 🛠️ Update the teacher if classroom exists
        classroom.assignedTeacher = teacherId;
        await classroom.save();
  
        const updatedClassroom = await Classroom.findById(classroom._id)
          .populate('assignedTeacher')
          .populate('course')
          .populate('group')
          .populate('assignedStudents')
          .populate('department');
  
        return res.status(200).json({
          message: 'Classroom already exists — teacher updated successfully',
          classroom: updatedClassroom
        });
      }
  
      // 🆕 Otherwise, create new classroom
      const groupRecord = await Group.findById(groupId);
      if (!groupRecord) {
        return res.status(404).json({ message: 'Group not found' });
      }
  
      const newClassroom = new Classroom({
        department,
        assignedTeacher: teacherId,
        course: courseId,
        group: groupId,
        assignedStudents: groupRecord.students.map(student => student._id)
      });
  
      await newClassroom.save();
  
      const populatedClassroom = await Classroom.findById(newClassroom._id)
        .populate('assignedTeacher')
        .populate('course')
        .populate('group')
        .populate('assignedStudents')
        .populate('department');
  
      return res.status(201).json({
        message: 'Classroom created successfully',
        classroom: populatedClassroom
      });
    } catch (error) {
      console.error('Error creating classroom:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  

  /**
   * Get all classrooms
   * @route GET /api/classrooms
   */
  getAllClassrooms: async (req, res) => {
    try {
      const classrooms = await Classroom.find()
        .populate('department', 'name')
        .populate('assignedTeacher', 'firstName lastName email')
        .populate('group', 'name')
        .populate('course', 'title code')
        .sort({ name: 1 });

      return res.status(200).json(classrooms);
    } catch (error) {
      console.error('Error getting classrooms:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  /**
   * Get classrooms by department
   * @route GET /api/classrooms/department/:departmentId
   */
  getClassroomsByDepartment: async (req, res) => {
    try {
      const { departmentId } = req.params;
      
      const classrooms = await Classroom.find({ department: departmentId })
        .populate('department', 'name')
        .populate('assignedTeacher', 'firstName lastName')
        .populate('group', 'name')
        .populate('course', 'title code')
        .sort({ name: 1 });

      return res.status(200).json(classrooms);
    } catch (error) {
      console.error('Error getting classrooms by department:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  /**
   * Get classrooms by course
   * @route GET /api/classrooms/course/:courseId
   */
  getClassroomsByCourse: async (req, res) => {
    try {
      const { courseId } = req.params;
      
      const classrooms = await Classroom.find({ course: courseId })
        .populate('department', 'name')
        .populate('assignedTeacher', 'firstName lastName')
        .populate('group', 'name')
        .populate('course', 'title code')
        .sort({ name: 1 });

      return res.status(200).json(classrooms);
    } catch (error) {
      console.error('Error getting classrooms by course:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  /**
   * Get classrooms by group
   * @route GET /api/classrooms/group/:groupId
   */
  getClassroomsByGroup: async (req, res) => {
    try {
      const { groupId } = req.params;
      
      const classrooms = await Classroom.find({ group: groupId })
        .populate('department', 'name')
        .populate('assignedTeacher', 'firstName lastName')
        .populate('group', 'name')
        .populate('course', 'title code')
        .sort({ name: 1 });

      return res.status(200).json(classrooms);
    } catch (error) {
      console.error('Error getting classrooms by group:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  /**
   * Get classrooms by teacher
   * @route GET /api/classrooms/teacher/:teacherId
   */
  getClassroomsByTeacher: async (req, res) => {
    try {
      const { teacherId } = req.params;
      // console.log(teacherId)
      const classrooms = await Classroom.find({ assignedTeacher: teacherId })
        .populate('assignedStudents', 'firstName lastName email rollNumber')
        .populate('department', 'name')
        .populate('assignedTeacher', 'firstName lastName email')
        .populate('group', 'name')
        .populate('course', 'courseName courseCode')
        .populate('sharedResources', 'title files uploadedBy')
        .populate('classes')
        .populate('classes.class')
        .sort({ name: 1 });

      return res.status(200).json(classrooms);
    } catch (error) {
      console.error('Error getting classrooms by teacher:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  getClassroomsByStudent : async (req, res) => {
    try {
      const studentId =  req.user?.userId; // or use req.user._id if protected route
  
      const classrooms = await Classroom.find({ assignedStudents: studentId })
      .populate('department')
      .populate('assignedTeacher', 'firstName lastName email')
      .populate('group')
      .populate('course')
      .populate({
        path: 'classes.class',
        select: 'title course classroom department teacher location isExtraClass schedule'
      })
      .populate('sharedResources')
      .populate('announcements.postedBy', 'firstName lastName');

      console.log(classrooms)
      res.status(200).json({ success: true, data: classrooms });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  },

  /**
   * Get a specific classroom by ID
   * @route GET /api/classrooms/:id
   */
  getClassroomById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const classroom = await Classroom.findById(id)
        .populate('department', 'name')
        .populate('assignedTeacher', 'firstName lastName email')
        .populate('group', 'name')
        .populate('course', 'title code')
        .populate('assignedStudents', 'firstName lastName email');
      
      if (!classroom) {
        return res.status(404).json({ message: 'Classroom not found' });
      }
      
      return res.status(200).json(classroom);
    } catch (error) {
      console.error('Error getting classroom by ID:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  /**
   * Update a classroom
   * @route PUT /api/classrooms/:id
   */
  updateClassroom: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Check if classroom exists
      const classroom = await Classroom.findById(id);
      if (!classroom) {
        return res.status(404).json({ message: 'Classroom not found' });
      }
      
      // If group is updated, update the assigned students accordingly
      if (updateData.group) {
        const students = await User.find({
          group: updateData.group,
          role: 'student'
        }).select('_id');
        
        updateData.assignedStudents = students.map(student => student._id);
      }
      
      // Update classroom
      const updatedClassroom = await Classroom.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      )
        .populate('department', 'name')
        .populate('assignedTeacher', 'firstName lastName')
        .populate('group', 'name')
        .populate('course', 'title code');
      
      return res.status(200).json({
        message: 'Classroom updated successfully',
        classroom: updatedClassroom
      });
    } catch (error) {
      console.error('Error updating classroom:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  /**
   * Delete a classroom
   * @route DELETE /api/classrooms/:id
   */
  deleteClassroom: async (req, res) => {
    try {
      const { id } = req.params;
      
      const result = await Classroom.findByIdAndDelete(id);
      
      if (!result) {
        return res.status(404).json({ message: 'Classroom not found' });
      }
      
      return res.status(200).json({ message: 'Classroom deleted successfully' });
    } catch (error) {
      console.error('Error deleting classroom:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  /**
   * Update teacher
   * @route PATCH /api/classrooms/:id/teacher
   */
  updateTeacher: async (req, res) => {
    try {
      const { id } = req.params;
      const { teacherId } = req.body;
      
      if (!teacherId) {
        return res.status(400).json({ message: 'Teacher ID is required' });
      }
      
      const classroom = await Classroom.findById(id);
      if (!classroom) {
        return res.status(404).json({ message: 'Classroom not found' });
      }
      
      // Set assigned teacher
      classroom.assignedTeacher = teacherId;
      await classroom.save();
      
      const updatedClassroom = await Classroom.findById(id)
        .populate('department', 'name')
        .populate('assignedTeacher', 'firstName lastName email');
      
      return res.status(200).json({
        message: 'Teacher updated successfully',
        classroom: updatedClassroom
      });
    } catch (error) {
      console.error('Error updating teacher:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  /**
   * Update group and refresh student list
   * @route PATCH /api/classrooms/:id/group
   */
  updateGroup: async (req, res) => {
    try {
      const { id } = req.params;
      const { groupId } = req.body;
      
      if (!groupId) {
        return res.status(400).json({ message: 'Group ID is required' });
      }
      
      const classroom = await Classroom.findById(id);
      if (!classroom) {
        return res.status(404).json({ message: 'Classroom not found' });
      }
      
      // Set assigned group
      classroom.group = groupId;
      
      // Find all students in this group
      const students = await User.find({
        group: groupId,
        role: 'student'
      }).select('_id');
      
      classroom.assignedStudents = students.map(student => student._id);
      
      await classroom.save();
      
      const updatedClassroom = await Classroom.findById(id)
        .populate('department', 'name')
        .populate('group', 'name')
        .populate('assignedStudents', 'firstName lastName email');
      
      return res.status(200).json({
        message: 'Group updated successfully',
        classroom: updatedClassroom
      });
    } catch (error) {
      console.error('Error updating group:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  /**
   * Update course
   * @route PATCH /api/classrooms/:id/course
   */
  updateCourse: async (req, res) => {
    try {
      const { id } = req.params;
      const { courseId } = req.body;
      
      if (!courseId) {
        return res.status(400).json({ message: 'Course ID is required' });
      }
      
      const classroom = await Classroom.findById(id);
      if (!classroom) {
        return res.status(404).json({ message: 'Classroom not found' });
      }
      
      // Set assigned course
      classroom.course = courseId;
      await classroom.save();
      
      const updatedClassroom = await Classroom.findById(id)
        .populate('department', 'name')
        .populate('course', 'title code');
      
      return res.status(200).json({
        message: 'Course updated successfully',
        classroom: updatedClassroom
      });
    } catch (error) {
      console.error('Error updating course:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  /**
   * Get all students in a classroom
   * @route GET /api/classrooms/:id/students
   */
  getClassroomStudents: async (req, res) => {
    try {
      const { id } = req.params;
      
      const classroom = await Classroom.findById(id)
        .populate('assignedStudents', 'firstName lastName email rollNumber group')
        .populate('assignedTeacher', 'firstName lastName email')
        .populate('course', 'courseName courseCode')
        .populate('group', 'name department');
      
      if (!classroom) {
        return res.status(404).json({ message: 'Classroom not found' });
      }
      
      return res.status(200).json({
        classroomName: classroom.name,
        courseName: classroom.course?.title,
        courseCode: classroom.course?.code,
        groupName: classroom.group?.name,
        teacher: classroom.assignedTeacher ? {
          name: `${classroom.assignedTeacher.firstName} ${classroom.assignedTeacher.lastName}`,
          email: classroom.assignedTeacher.email
        } : null,
        students: classroom.assignedStudents
      });
    } catch (error) {
      console.error('Error getting classroom students:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  uploadResource: async (req, res) => {
    try {
      const { title, description, link, type } = req.body;
      const { id } = req.params;
      console.log(req.user)
      const teacherId = req.user.userId; // assuming JWT/auth middleware
  
      const classroom = await Classroom.findById(id).populate('group');
      if (!classroom) return res.status(404).json({ message: 'Classroom not found' });
  
      const files = req.files; // array of files uploaded
  
      // Build file metadata array
      let uploadedFiles = [];
      if (files && files.length > 0) {
        uploadedFiles = files.map(file => ({
          url: file.path,
          filename: file.originalname,
          mimetype: file.mimetype,
        }));
      }
  
      const resource = new Resource({
        title,
        description,
        link, // Optional if file(s) uploaded
        type,
        uploadedBy: teacherId,
        group: classroom.group._id,
        files: uploadedFiles
      });
  
      await resource.save();
  
      classroom.sharedResources.push(resource._id);
      await classroom.save();
  
      res.status(201).json({ message: 'Resource uploaded', resource });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ error: err.message });
    }
  },
  
  postAnnouncement: async (req, res) => {
    try {
      const { message } = req.body;
      const { id } = req.params;

      const teacherId = req.user.userId;
  
      const classroom = await Classroom.findById(id);
      if (!classroom) return res.status(404).json({ message: 'Classroom not found' });
      console.log(message, id, req.user)
      const announcement = {
        message,
        postedBy: teacherId,
        createdAt: new Date()
      };
  
      classroom.announcements.push(announcement);
      await classroom.save();
  
      res.status(201).json({ message: 'Announcement posted', announcement });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getAnnouncements : async (req, res) => {
    try {
      const classroom = await Classroom.findById(req.params.id)
        .populate('announcements.postedBy', 'name email');
  
      if (!classroom) return res.status(404).json({ message: 'Classroom not found' });
  
      res.json({ announcements: classroom.announcements });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  
  // PUT edit an announcement
  editAnnouncement : async (req, res) => {
    try {
      const { classroomId, announcementId } = req.params;
      const { message } = req.body;
      const userId = req.user._id;
  
      const classroom = await Classroom.findById(classroomId);
      if (!classroom) return res.status(404).json({ message: 'Classroom not found' });
  
      const announcement = classroom.announcements.id(announcementId);
      if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
  
      if (!announcement.postedBy.equals(userId)) {
        return res.status(403).json({ message: 'Not authorized to edit this announcement' });
      }
  
      announcement.message = message;
      await classroom.save();
  
      res.json({ message: 'Announcement updated', announcement });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  
  // DELETE an announcement
  deleteAnnouncement : async (req, res) => {
    try {
      const { classroomId, announcementId } = req.params;
      const userId = req.user._id;
  
      const classroom = await Classroom.findById(classroomId);
      if (!classroom) return res.status(404).json({ message: 'Classroom not found' });
  
      const announcement = classroom.announcements.id(announcementId);
      if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
  
      if (!announcement.postedBy.equals(userId)) {
        return res.status(403).json({ message: 'Not authorized to delete this announcement' });
      }
  
      announcement.remove();
      await classroom.save();
  
      res.json({ message: 'Announcement deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  deleteMaterial :async (req, res) => {
    try {
      const { id, resourceId } = req.params;
  
      // Remove the resource reference from the classroom
      await Classroom.findByIdAndUpdate(id, {
        $pull: { sharedResources: resourceId }
      });
  
      // Optionally delete the resource document itself
      await Resource.findByIdAndDelete(resourceId);
  
      res.status(200).json({ message: 'Material deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting material', error });
    }
  }
};

module.exports = classroomController;