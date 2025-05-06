const Class = require('../model/class')
const mongoose = require('mongoose');
const { isValidObjectId } = mongoose;
const User = require('../model/user');
const department = require('../model/department');

/**
 * Class Controller for handling class scheduling and management
 */
const classController = {
  /**
   * Get all classes for a group
   */
  getClassesByGroup: async (req, res) => {
    try {
      const { groupId } = req.params;
      
      if (!isValidObjectId(groupId)) {
        return res.status(400).json({ message: 'Invalid group ID' });
      }
      
      const classes = await Class.find({ group: groupId })
        .populate('course', 'name code')
        .populate('teacher', 'firstName lastName email')
        .sort({ 'schedule.day': 1, 'schedule.startTime': 1 });
        
      res.status(200).json(classes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching classes', error: error.message });
    }
  },
  
  /**
   * Get all classes for a course
   */
  getClassesByCourse: async (req, res) => {
    try {
      const { courseId } = req.params;
      
      if (!isValidObjectId(courseId)) {
        return res.status(400).json({ message: 'Invalid course ID' });
      }
      
      const classes = await Class.find({ course: courseId })
        .populate('group', 'name')
        .populate('teacher', 'firstName lastName email')
        .sort({ 'schedule.day': 1, 'schedule.startTime': 1 });
        
      res.status(200).json(classes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching classes', error: error.message });
    }
  },
  
  /**
   * Get all classes for a teacher
   */
  getClassesByTeacher: async (req, res) => {
    try {
      const { teacherId } = req.params;
      
      if (!isValidObjectId(teacherId)) {
        return res.status(400).json({ message: 'Invalid teacher ID' });
      }
      
      const classes = await Class.find({ teacher: teacherId })
        .populate('course', 'name code')
        .populate('group', 'name')
        .sort({ 'schedule.day': 1, 'schedule.startTime': 1 });
        
      res.status(200).json(classes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching classes', error: error.message });
    }
  },
  
  /**
   * Get a single class by ID
   */
  getClassById: async (req, res) => {
    try {
      const { classId } = req.params;
      
      if (!isValidObjectId(classId)) {
        return res.status(400).json({ message: 'Invalid class ID' });
      }
      
      const classData = await Class.findById(classId)
        .populate('course', 'name code description')
        .populate('group', 'name')
        .populate('teacher', 'firstName lastName email');
        
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      res.status(200).json(classData);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching class', error: error.message });
    }
  },
  
  /**
   * Create a new class
   */
  createClass: async (req, res) => {
    try {
      const { 
        name, 
        course, 
        group, 
        teacher, 
        description, 
        location, 
        schedule,
        attendanceSettings 
      } = req.body;
      
      // Validate required fields
      if (!name || !course || !group || !teacher) {
        return res.status(400).json({ 
          message: 'Missing required fields. Name, course, group, and teacher are required.' 
        });
      }
      
      // Validate IDs
      if (!isValidObjectId(course) || !isValidObjectId(group) || !isValidObjectId(teacher)) {
        return res.status(400).json({ message: 'Invalid ID format for course, group or teacher' });
      }
      
      // Create new class
      const newClass = new Class({
        name,
        course,
        group,
        teacher,
        description,
        location,
        schedule: schedule || [],
        attendanceSettings: attendanceSettings || {}
      });
      
      const savedClass = await newClass.save();
      
      res.status(201).json(savedClass);
    } catch (error) {
      res.status(500).json({ message: 'Error creating class', error: error.message });
    }
  },
  
  /**
   * Update an existing class
   */
  updateClass: async (req, res) => {
    try {
      const { classId } = req.params;
      const updateData = req.body;
      
      if (!isValidObjectId(classId)) {
        return res.status(400).json({ message: 'Invalid class ID' });
      }
      
      // Validate IDs if present in update data
      if (updateData.course && !isValidObjectId(updateData.course)) {
        return res.status(400).json({ message: 'Invalid course ID' });
      }
      
      if (updateData.group && !isValidObjectId(updateData.group)) {
        return res.status(400).json({ message: 'Invalid group ID' });
      }
      
      if (updateData.teacher && !isValidObjectId(updateData.teacher)) {
        return res.status(400).json({ message: 'Invalid teacher ID' });
      }
      
      const updatedClass = await Class.findByIdAndUpdate(
        classId,
        { $set: updateData },
        { new: true, runValidators: true }
      );
      
      if (!updatedClass) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      res.status(200).json(updatedClass);
    } catch (error) {
      res.status(500).json({ message: 'Error updating class', error: error.message });
    }
  },
  
  /**
   * Delete a class
   */
  deleteClass: async (req, res) => {
    try {
      const { classId } = req.params;
      
      if (!isValidObjectId(classId)) {
        return res.status(400).json({ message: 'Invalid class ID' });
      }
      
      const deletedClass = await Class.findByIdAndDelete(classId);
      
      if (!deletedClass) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      res.status(200).json({ message: 'Class deleted successfully', deletedClass });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting class', error: error.message });
    }
  },
  
  /**
   * Add a new periodic schedule to a class
   */
  addSchedule: async (req, res) => {
    try {
      const { classId } = req.params;
      const { day, startTime, endTime } = req.body;
      
      if (!isValidObjectId(classId)) {
        return res.status(400).json({ message: 'Invalid class ID' });
      }
      
      if (!day || !startTime || !endTime) {
        return res.status(400).json({ 
          message: 'Missing required fields. Day, startTime, and endTime are required.' 
        });
      }
      
      const classData = await Class.findById(classId);
      
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      classData.schedule.push({ day, startTime, endTime });
      await classData.save();
      
      res.status(200).json(classData);
    } catch (error) {
      res.status(500).json({ message: 'Error adding schedule', error: error.message });
    }
  },
  
  /**
   * Update a schedule entry
   */
  updateSchedule: async (req, res) => {
    try {
      const { classId, scheduleId } = req.params;
      const { day, startTime, endTime } = req.body;
      
      if (!isValidObjectId(classId)) {
        return res.status(400).json({ message: 'Invalid class ID' });
      }
      
      const classData = await Class.findById(classId);
      
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      const scheduleEntry = classData.schedule.id(scheduleId);
      
      if (!scheduleEntry) {
        return res.status(404).json({ message: 'Schedule entry not found' });
      }
      
      if (day) scheduleEntry.day = day;
      if (startTime) scheduleEntry.startTime = startTime;
      if (endTime) scheduleEntry.endTime = endTime;
      
      await classData.save();
      
      res.status(200).json(classData);
    } catch (error) {
      res.status(500).json({ message: 'Error updating schedule', error: error.message });
    }
  },
  
  /**
   * Delete a schedule entry
   */
  deleteSchedule: async (req, res) => {
    try {
      const { classId, scheduleId } = req.params;
      
      if (!isValidObjectId(classId)) {
        return res.status(400).json({ message: 'Invalid class ID' });
      }
      
      const classData = await Class.findById(classId);
      
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      classData.schedule.id(scheduleId).remove();
      await classData.save();
      
      res.status(200).json({ message: 'Schedule entry deleted successfully', classData });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting schedule', error: error.message });
    }
  },
  
  /**
   * Create a new class session (for one-time or extra classes)
   */
  createSession: async (req, res) => {
    try {
      const { classId } = req.params;
      const { date, startTime, endTime, topic, description, attendanceEnabled, attendanceWindow } = req.body;
      
      if (!isValidObjectId(classId)) {
        return res.status(400).json({ message: 'Invalid class ID' });
      }
      
      if (!date || !startTime || !endTime) {
        return res.status(400).json({ 
          message: 'Missing required fields. Date, startTime, and endTime are required.' 
        });
      }
      
      const classData = await Class.findById(classId);
      
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      // Create new session
      const newSession = {
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        topic: topic || '',
        description: description || '',
        status: 'scheduled',
        attendanceEnabled: attendanceEnabled !== undefined ? attendanceEnabled : false,
        attendanceWindow: attendanceWindow || {
          startTime: new Date(startTime),
          endTime: new Date(new Date(startTime).getTime() + (classData.attendanceSettings.defaultWindowMinutes * 60000))
        }
      };
      
      classData.sessions.push(newSession);
      await classData.save();
      
      res.status(201).json({ 
        message: 'Session created successfully', 
        session: classData.sessions[classData.sessions.length - 1] 
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating session', error: error.message });
    }
  },
  
  /**
   * Update a class session
   */
  updateSession: async (req, res) => {
    try {
      const { classId, sessionId } = req.params;
      const updateData = req.body;
      
      if (!isValidObjectId(classId)) {
        return res.status(400).json({ message: 'Invalid class ID' });
      }
      
      const classData = await Class.findById(classId);
      
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      const session = classData.sessions.id(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }
      
      // Update session fields
      Object.keys(updateData).forEach(key => {
        // Handle date fields
        if (['date', 'startTime', 'endTime'].includes(key) && updateData[key]) {
          session[key] = new Date(updateData[key]);
        }
        // Handle nested attendanceWindow object
        else if (key === 'attendanceWindow' && updateData[key]) {
          if (updateData[key].startTime) {
            session.attendanceWindow.startTime = new Date(updateData[key].startTime);
          }
          if (updateData[key].endTime) {
            session.attendanceWindow.endTime = new Date(updateData[key].endTime);
          }
        }
        // Handle other fields
        else if (updateData[key] !== undefined) {
          session[key] = updateData[key];
        }
      });
      
      await classData.save();
      
      res.status(200).json({ message: 'Session updated successfully', session });
    } catch (error) {
      res.status(500).json({ message: 'Error updating session', error: error.message });
    }
  },
  
  /**
   * Delete a class session
   */
  deleteSession: async (req, res) => {
    try {
      const { classId, sessionId } = req.params;
      
      if (!isValidObjectId(classId)) {
        return res.status(400).json({ message: 'Invalid class ID' });
      }
      
      const classData = await Class.findById(classId);
      
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      const session = classData.sessions.id(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }
      
      session.remove();
      await classData.save();
      
      res.status(200).json({ message: 'Session deleted successfully', classData });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting session', error: error.message });
    }
  },
  
  /**
   * Update class location with geolocation data
   */
  updateClassLocation: async (req, res) => {
    try {
      const { classId } = req.params;
      const { building, room, latitude, longitude, radius } = req.body;
      
      if (!isValidObjectId(classId)) {
        return res.status(400).json({ message: 'Invalid class ID' });
      }
      
      const classData = await Class.findById(classId);
      
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      // Update location
      classData.location = {
        building: building || classData.location?.building,
        room: room || classData.location?.room,
        gpsCoordinates: {
          latitude: latitude !== undefined ? latitude : classData.location?.gpsCoordinates?.latitude,
          longitude: longitude !== undefined ? longitude : classData.location?.gpsCoordinates?.longitude,
          radius: radius !== undefined ? radius : (classData.location?.gpsCoordinates?.radius || 50)
        }
      };
      
      await classData.save();
      
      res.status(200).json({ message: 'Class location updated successfully', classData });
    } catch (error) {
      res.status(500).json({ message: 'Error updating class location', error: error.message });
    }
  },
  
  /**
   * Mark attendance for a student in a session
   */
  markAttendance: async (req, res) => {
    try {
      const { classId, sessionId } = req.params;
      const { studentId, status, latitude, longitude } = req.body;
      
      if (!isValidObjectId(classId) || !isValidObjectId(studentId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
      
      const classData = await Class.findById(classId);
      
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      // Create verification data object
      const verificationData = {};
      
      // Add geolocation data if available
      if (latitude !== undefined && longitude !== undefined) {
        verificationData.geolocation = {
          coordinates: {
            latitude,
            longitude
          },
          verifiedByGeo: isStudentInRange(
            latitude, 
            longitude, 
            classData.location?.gpsCoordinates?.latitude,
            classData.location?.gpsCoordinates?.longitude,
            classData.location?.gpsCoordinates?.radius
          )
        };
      }
      
      // Mark attendance using the method in the Class model
      const attendance = await classData.markAttendance(
        sessionId,
        studentId,
        status,
        verificationData
      );
      
      res.status(200).json({ message: 'Attendance marked successfully', attendance });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  
  /**
   * Get attendance for a session
   */
  getSessionAttendance: async (req, res) => {
    try {
      const { classId, sessionId } = req.params;
      
      if (!isValidObjectId(classId)) {
        return res.status(400).json({ message: 'Invalid class ID' });
      }
      
      const classData = await Class.findById(classId);
      
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      const attendance = await classData.getSessionAttendance(sessionId);
      
      res.status(200).json(attendance);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching attendance', error: error.message });
    }
  },
  fetchTeacherClassrooms: async(req, res)=>{
        
        try {
           
          const teacherId = req.user.userId;
            console.log(teacherId)
          const teacher = await User.findById(teacherId)
            .populate({
              path: 'teachingAssignments.course',
              populate: { path: 'department' }  
            })
            .populate('teachingAssignments.group')
            .populate('department')
            .populate('teachingAssignments.course');
      
          if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
          }
         
          res.json({
            department: teacher.department,
            teachingAssignments: teacher.teachingAssignments
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: err.message });
        }
      
  },

  
};


/**
 * Helper function to check if a student is within the specified radius of the class location
 */
function isStudentInRange(studentLat, studentLng, classLat, classLng, radiusMeters = 50) {
  if (!studentLat || !studentLng || !classLat || !classLng) {
    return false;
  }
  
  // Calculate distance between two points using the Haversine formula
  const R = 6371e3; // Earth's radius in meters
  const φ1 = studentLat * Math.PI/180;
  const φ2 = classLat * Math.PI/180;
  const Δφ = (classLat - studentLat) * Math.PI/180;
  const Δλ = (classLng - studentLng) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  return distance <= radiusMeters;
}

module.exports = classController;