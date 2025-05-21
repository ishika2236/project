const Class = require('../model/class');
const Classroom = require('../model/classroom');
const mongoose = require('mongoose');
const { startOfDay, endOfDay } = require('date-fns');

/**
 * Controller for handling class scheduling and material operations
 */
const classController = {
  /**
   * Create a new scheduled class
   * @route POST /api/classes
   */
  scheduleClass: async (req, res) => {
    try {
      const {
        title,
        course,
        classroom,
        teacher,
        groups,
        department,
        schedule,
        topics,
        notes,
        specialRequirements,
        isExtraClass,
        extraClassDate
      } = req.body;
  
      if (!title || !course || !classroom || !teacher || !department) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      if (isExtraClass) {
        if (!extraClassDate || !schedule.startTime || !schedule.endTime) {
          return res.status(400).json({ message: 'Extra class requires date, start time, and end time' });
        }
      } else {
        const dayNameToNumber = {
          Sunday: 0,
          Monday: 1,
          Tuesday: 2,
          Wednesday: 3,
          Thursday: 4,
          Friday: 5,
          Saturday: 6
        };
  
        if (schedule.daysOfWeek && Array.isArray(schedule.daysOfWeek)) {
          schedule.daysOfWeek = schedule.daysOfWeek.map(day => {
            const num = dayNameToNumber[day];
            if (num === undefined) {
              throw new Error(`Invalid day: ${day}`);
            }
            return num;
          });
        }
  
        if (!schedule.startDate || !schedule.endDate || !schedule.daysOfWeek || !schedule.startTime || !schedule.endTime) {
          return res.status(400).json({ message: 'Regular class requires complete schedule information' });
        }
      }
  
      const classroomObj = await Classroom.findById(classroom);
      if (!classroomObj) {
        return res.status(404).json({ message: 'Classroom not found' });
      }
  
      const newClass = new Class({
        title,
        course,
        classroom,
        teacher,
        groups: groups || [],
        department,
        location: {
          building: classroomObj.building,
          room: classroomObj.roomNumber
        },
        schedule,
        topics: topics || [],
        notes: notes || '',
        specialRequirements: specialRequirements || '',
        isExtraClass: isExtraClass || false,
        extraClassDate: extraClassDate ? new Date(extraClassDate) : null
      });
  
      await newClass.save();
  
      // ✅ Push new class into Classroom.classes array
      classroomObj.classes.push({
        class: newClass._id,
        status: 'scheduled',
        notes: notes || ''
      });
  
      await classroomObj.save();
  
      return res.status(201).json({
        message: `Class ${isExtraClass ? 'extra session' : 'schedule'} created and linked to classroom successfully`,
        class: newClass
      });
  
    } catch (error) {
      if (error.message && error.message.includes('schedule conflict')) {
        return res.status(409).json({ message: error.message });
      }
      console.error('Error scheduling class:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  

  /**
   * Get all classes
   * @route GET /api/classes
   */
  getAllClasses: async (req, res) => {
    try {
      const classes = await Class.find()
        .populate('course', 'title code')
        .populate('classroom', 'name roomNumber building')
        .populate('teacher', 'firstName lastName')
        .populate('department', 'name')
        .sort({ 'schedule.startDate': 1, 'extraClassDate': 1 });

      return res.status(200).json(classes);
    } catch (error) {
      console.error('Error retrieving classes:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  /**
   * Get a specific class by ID
   * @route GET /api/classes/:id
   */
  getClassById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const classObj = await Class.findById(id)
        .populate('course', 'title code')
        .populate('classroom', 'name roomNumber building')
        .populate('teacher', 'firstName lastName email')
        .populate('groups', 'name')
        .populate('department', 'name');
      
      if (!classObj) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      return res.status(200).json(classObj);
    } catch (error) {
      console.error('Error retrieving class details:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  /**
   * Get classes for a date range
   * @route GET /api/classes/daterange
   */
  getClassesForDateRange: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start date and end date are required' });
      }
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const query = {
        $or: [
          // Regular classes that overlap with the date range
          {
            isExtraClass: false,
            'schedule.startDate': { $lte: end },
            'schedule.endDate': { $gte: start }
          },
          // Extra classes within the date range
          {
            isExtraClass: true,
            extraClassDate: { $gte: start, $lte: end }
          }
        ]
      };
      
      const classes = await Class.find(query)
        .populate('course', 'courseName courseCode')
        .populate('classroom', 'name roomNumber building')
        .populate('teacher', 'firstName lastName')
        .sort({ 'schedule.startDate': 1, 'extraClassDate': 1 });

      return res.status(200).json(classes);
    } catch (error) {
      console.error('Error retrieving classes for date range:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  /**
   * Update class schedule
   * @route PUT /api/classes/:id/schedule
   */
  rescheduleClass: async (req, res) => {
    try {
      const { id } = req.params;
      const { schedule, extraClassDate } = req.body;
      
      const classObj = await Class.findById(id);
      if (!classObj) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      const dayNameToNumber = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6
      };
      
      // Process schedule if provided
      if (schedule) {
        if (schedule.daysOfWeek && Array.isArray(schedule.daysOfWeek)) {
          const convertedDays = schedule.daysOfWeek.map(day => {
            if (typeof day === 'string') {
              const num = dayNameToNumber[day];
              if (num === undefined) {
                throw new Error(`Invalid day name: ${day}`);
              }
              return num;
            } else if (typeof day === 'number') {
              if (day < 0 || day > 6) {
                throw new Error(`Invalid day number: ${day}`);
              }
              return day;
            } else {
              throw new Error(`Unsupported day format: ${day}`);
            }
          });
          
          // Update the class object with the new schedule
          classObj.schedule = classObj.schedule || {};
          classObj.schedule.daysOfWeek = convertedDays;
          
          // Update other schedule properties if provided
          if (schedule.startTime) classObj.schedule.startTime = schedule.startTime;
          if (schedule.endTime) classObj.schedule.endTime = schedule.endTime;
          // Add any other schedule properties you need to update
        }
      }
      
      // Handle extraClassDate if provided
      if (extraClassDate) {
        // Add logic to handle extra class dates
        classObj.extraClassDates = classObj.extraClassDates || [];
        classObj.extraClassDates.push(extraClassDate);
      }
      
      await classObj.save();
      
      return res.status(200).json({
        message: 'Class rescheduled successfully',
        class: classObj
      });
    } catch (error) {
      if (error.message && error.message.includes('schedule conflict')) {
        return res.status(409).json({ message: error.message });
      }
      console.error('Error rescheduling class:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  /**
   * Update class location
   * @route PATCH /api/classes/:id/location
   */
  updateClassLocation: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        building,
        room,
        latitude,
        longitude,
        address,
        floor,
        additionalInfo
      } = req.body;
      
      const classObj = await Class.findById(id);
      if (!classObj) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      // Update location fields
      classObj.location = {
        building: building !== undefined ? building : classObj.location?.building,
        room: room !== undefined ? room : classObj.location?.room,
        latitude: latitude !== undefined ? latitude : classObj.location?.latitude,
        longitude: longitude !== undefined ? longitude : classObj.location?.longitude,
        address: address !== undefined ? address : classObj.location?.address,
        floor: floor !== undefined ? floor : classObj.location?.floor,
        additionalInfo: additionalInfo !== undefined ? additionalInfo : classObj.location?.additionalInfo
      };
      
      // Save updated class
      await classObj.save();
      
      return res.status(200).json({
        message: 'Class location updated successfully',
        location: classObj.location
      });
    } catch (error) {
      console.error('Error updating class location:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  /**
   * Update class notes
   * @route PATCH /api/classes/:id/notes
   */
  updateClassNotes: async (req, res) => {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      
      if (notes === undefined) {
        return res.status(400).json({ message: 'Notes field is required' });
      }

      const classObj = await Class.findById(id);
      if (!classObj) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      classObj.notes = notes;
      await classObj.save();
      
      return res.status(200).json({
        message: 'Class notes updated successfully',
        notes: classObj.notes
      });
    } catch (error) {
      console.error('Error updating class notes:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  /**
   * Add/update class topics
   * @route PATCH /api/classes/:id/topics
   */
  updateClassTopics: async (req, res) => {
    try {
      const { id } = req.params;
      const { topics } = req.body;
      
      if (!topics || !Array.isArray(topics)) {
        return res.status(400).json({ message: 'Topics should be provided as an array' });
      }

      const classObj = await Class.findById(id);
      if (!classObj) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      classObj.topics = topics;
      await classObj.save();
      
      return res.status(200).json({
        message: 'Class topics updated successfully',
        topics: classObj.topics
      });
    } catch (error) {
      console.error('Error updating class topics:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  /**
   * Update class special requirements
   * @route PATCH /api/classes/:id/requirements
   */
  updateSpecialRequirements: async (req, res) => {
    try {
      const { id } = req.params;
      const { specialRequirements } = req.body;
      
      if (specialRequirements === undefined) {
        return res.status(400).json({ message: 'Special requirements field is required' });
      }

      const classObj = await Class.findById(id);
      if (!classObj) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      classObj.specialRequirements = specialRequirements;
      await classObj.save();
      
      return res.status(200).json({
        message: 'Class special requirements updated successfully',
        specialRequirements: classObj.specialRequirements
      });
    } catch (error) {
      console.error('Error updating class special requirements:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  /**
   * Delete a class
   * @route DELETE /api/classes/:id
   */
  deleteClass: async (req, res) => {
    try {
      const { id } = req.params;
      
      const result = await Class.findByIdAndDelete(id);
      
      if (!result) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      return res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
      console.error('Error deleting class:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  getClassesByClassroom :async (req, res) => {
    const { classroomId } = req.params;
  
    try {
      const classes = await Class.find({ classroom: classroomId })
        .populate('course teacher classroom groups department');
  
      res.status(200).json(classes);
    } catch (error) {
      console.error('Error fetching classes by classroom:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
  
 
  getClassesByClassroomForDateRange: async (req, res) => {
    const {classroomId} = req.params;
    const { startDate, endDate } = req.query;
    console.log(classroomId, startDate, endDate);
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Both startDate and endDate are required' });
    }
  
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    try {
      const classes = await Class.find({
        classroom: classroomId,
        $or: [
          // Recurring classes that intersect the range
          {
            isExtraClass: false,
            'schedule.startDate': { $lte: end },
            'schedule.endDate': { $gte: start }
          },
          // Extra classes within the date range
          {
            isExtraClass: true,
            extraClassDate: { $gte: start, $lte: end }
          }
        ]
      }).populate('course teacher classroom groups department').populate('classroom', 'department assignedTeacher group assignedStudents course');
  
      res.status(200).json(classes);
    } catch (error) {
      console.error('Error fetching classes by date range:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
  
};

module.exports = classController;