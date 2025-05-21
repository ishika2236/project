
const Classroom = require('../model/classroom');
const Class = require('../model/class');
const User = require('../model/user');
const Embedding = require('../model/embedding');
const mongoose = require('mongoose');
const Attendance = require('../model/attendance')
// Helper function for face recognition - moved from embedding controller
const calculateCosineSimilarity = (embedding1, embedding2) => {
  if (embedding1.length !== embedding2.length) {
    throw new Error('Embedding vectors must have the same length');
  }
  
  // Calculate dot product
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    magnitude1 += embedding1[i] * embedding1[i];
    magnitude2 += embedding2[i] * embedding2[i];
  }
  
  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);
  
  // Avoid division by zero
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }
  
  return dotProduct / (magnitude1 * magnitude2);
};

// Function to verify face embedding - moved from simplified approach to actual face recognition
const verifyFaceEmbedding = async (faceEmbeddingData, studentId) => {
  // Configure threshold as needed for your application
  const SIMILARITY_THRESHOLD = 0.90;
  
  try {
    // Parse the embedding if it's a string
    const embedding = typeof faceEmbeddingData === 'string' 
      ? JSON.parse(faceEmbeddingData) 
      : faceEmbeddingData;
    
    // Validate embedding format
    if (!embedding || !Array.isArray(embedding)) {
      return { 
        verified: false, 
        error: 'Invalid embedding format' 
      };
    }
    
    // Get student's embeddings from database
    const studentEmbeddings = await Embedding.find({ 
      user: studentId,
      isActive: true
    });
    
    if (studentEmbeddings.length === 0) {
      return { 
        verified: false, 
        error: 'No embeddings found for this student' 
      };
    }
    
    // Calculate similarity for each stored embedding for this student
    const similarities = studentEmbeddings.map(storedEmbedding => {
      const similarity = calculateCosineSimilarity(embedding, storedEmbedding.embedding);
      return {
        embeddingId: storedEmbedding._id,
        similarity
      };
    });
    
    // Sort by similarity (highest first)
    similarities.sort((a, b) => b.similarity - a.similarity);
    
    // Get the top match
    const bestMatch = similarities[0];
    
    // Check if the best match is above the threshold
    if (bestMatch.similarity < SIMILARITY_THRESHOLD) {
      return { 
        verified: false, 
        similarity: bestMatch.similarity,
        error: 'Face verification failed - similarity below threshold' 
      };
    }
    
    return { 
      verified: true, 
      embeddingId: bestMatch.embeddingId,
      similarity: bestMatch.similarity 
    };
  } catch (error) {
    console.error('Error verifying face embedding:', error);
    return { 
      verified: false, 
      error: error.message 
    };
  }
};

// NEW CONTROLLER: Verify user embedding against stored embeddings
const verifyUserEmbedding = async (req, res) => {
  try {
    const { faceEmbeddingData
    } = req.body;
    const userId = req.user.userId; // User ID from middleware
    const embedding = faceEmbeddingData;
    // console.log(embedding,Array.isArray(embedding) )
    if (!embedding || !Array.isArray(embedding)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid embedding format. Expected array of numbers.'
      });
    }

    // Verify the embedding against stored user embeddings
    const verificationResult = await verifyFaceEmbedding(embedding, userId);
    
    if (!verificationResult.verified) {
      return res.status(401).json({
        success: false,
        message: 'Face verification failed',
        details: {
          error: verificationResult.error,
          similarity: verificationResult.similarity || 0
        }
      });
    }
    
    return res.json({
      success: true,
      message: 'Face verification successful',
      data: {
        userId,
        embeddingId: verificationResult.embeddingId,
        similarity: verificationResult.similarity
      }
    });
  } catch (error) {
    console.error('Error verifying user embedding:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify user embedding',
      error: error.message
    });
  }
};

// NEW CONTROLLER: Check if user location is valid for class attendance
const checkLocationValidity = async (req, res) => {
  try {
    const { classId, location } = req.body;
    console.log(classId);
    const userId = req.user.userId; // User ID from middleware
    
    if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Invalid location data. Latitude and longitude required.'
      });
    }
    
    // Find the class with location info
    
    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }
    
    // Check if the class has location information
    if (!classObj.location || !classObj.location.latitude || !classObj.location.longitude) {
      return res.status(400).json({
        success: false,
        message: 'Class does not have location information set'
      });
    }
    
    // Find classroom with this class to verify student assignment
    const classroom = await Classroom.findOne({ 
      'classes.class': classId,
      assignedStudents: userId
    });
    
    if (!classroom) {
      return res.status(403).json({
        success: false,
        message: 'You are not assigned to this class'
      });
    }
    
    // Check if attendance window is open
    if (!classroom.isAttendanceWindowOpen(classId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Attendance window is not open for this class' 
      });
    }
    
    // Check if student has already marked attendance
    const existingAttendance = await Attendance.findOne({
      class: classId,
      student: userId,
      classroom: classroom._id
    });
    
    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this class',
        data: {
          status: existingAttendance.status,
          markedAt: existingAttendance.markedAt,
          markedBy: existingAttendance.markedBy
        }
      });
    }
    
    // Calculate distance between user and class locations
    const userLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy || 0
    };
    
    // Create temporary attendance object to use the location validation method
    const tempAttendance = new Attendance({
      location: {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        accuracy: userLocation.accuracy,
        timestamp: new Date()
      }
    });
    
    // Validate the location
    const isLocationValid = await tempAttendance.validateLocation(classObj);
    
    // Calculate distance for informational purposes
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      classObj.location.latitude,
      classObj.location.longitude
    );
    
    if (!isLocationValid) {
      return res.json({
        success: false,
        message: 'Location verification failed',
        data: {
          distance,
          maxAllowedDistance: classObj.location.radius || 100, // default 100m if not specified
          userLocation: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude
          },
          classLocation: {
            latitude: classObj.location.latitude,
            longitude: classObj.location.longitude
          }
        }
      });
    }
    
    // Location is valid, now mark attendance
    
    // Determine attendance status (late or present)
    const now = new Date();
    const classStartTime = classObj.isExtraClass 
      ? new Date(`${classObj.extraClassDate.toISOString().split('T')[0]}T${classObj.schedule.startTime}:00`)
      : new Date();  // Simplified - in production, calculate from schedule
    
    const lateThreshold = 15; // minutes
    const lateThresholdMs = lateThreshold * 60 * 1000;
    
    const status = now > new Date(classStartTime.getTime() + lateThresholdMs) ? 'late' : 'present';
    
    // Record attendance
    const attendance = await Attendance.findOneAndUpdate(
      { 
        class: classId, 
        student: userId,
        classroom: classroom._id
      },
      {
        status,
        markedBy: 'student',
        markedAt: now,
        faceRecognized: true,
        location: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          accuracy: userLocation.accuracy,
          timestamp: now
        }
      },
      { 
        new: true, 
        upsert: true 
      }
    );
    
    return res.json({
      success: true,
      message: `Location verification successful. Attendance marked as ${status}`,
      data: {
        attendanceId: attendance._id,
        status,
        distance,
        maxAllowedDistance: classObj.location.radius || 100,
        userLocation: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude
        },
        classLocation: {
          latitude: classObj.location.latitude,
          longitude: classObj.location.longitude
        },
        markedAt: attendance.markedAt
      }
    });
  } catch (error) {
    console.error('Error checking location validity:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check location validity',
      error: error.message
    });
  }
};


// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  // Earth's radius in meters
  const R = 6371000;
  
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance); // Return distance in meters, rounded
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Controller for teacher's attendance functions
const openAttendanceWindow = async (req, res) => {
  try {
    const { classId, duration } = req.body;
    const teacherId = req.user.userId;

    // Find classroom with this class
    const classroom = await Classroom.findOne({ 
      'classes.class': classId,
      assignedTeacher: teacherId
    });

    if (!classroom) {
      return res.status(404).json({ 
        success: false, 
        message: 'Classroom not found or you are not authorized for this classroom' 
      });
    }

    // Validate that the class exists
    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({ 
        success: false, 
        message: 'Class not found' 
      });
    }

    // Open attendance window
    await classroom.openAttendanceWindow(classId, teacherId, duration);

    return res.json({
      success: true,
      message: 'Attendance window opened successfully',
      data: {
        classId,
        openedAt: new Date(),
        closesAt: duration ? new Date(Date.now() + duration * 60000) : null
      }
    });
  } catch (error) {
    console.error('Error opening attendance window:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to open attendance window', 
      error: error.message 
    });
  }
};

const closeAttendanceWindow = async (req, res) => {
  try {
    const { classId } = req.body;
    const teacherId = req.user.userId;

    // Find classroom with this class
    const classroom = await Classroom.findOne({ 
      'classes.class': classId,
      assignedTeacher: teacherId
    });

    if (!classroom) {
      return res.status(404).json({ 
        success: false, 
        message: 'Classroom not found or you are not authorized for this classroom' 
      });
    }

    // Close attendance window
    await classroom.closeAttendanceWindow(classId);

    return res.json({
      success: true,
      message: 'Attendance window closed successfully'
    });
  } catch (error) {
    console.error('Error closing attendance window:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to close attendance window', 
      error: error.message 
    });
  }
};

const markAttendanceManually = async (req, res) => {
  try {
    const { classId, studentId, status, notes } = req.body;
    const teacherId = req.user.userId;

    // Find the class
    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({ 
        success: false, 
        message: 'Class not found' 
      });
    }

    // Verify teacher is assigned to this class
    if (classObj.teacher.toString() !== teacherId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'You are not authorized to mark attendance for this class' 
      });
    }

    // Find the classroom
    const classroom = await Classroom.findOne({
      'classes.class': classId
    });

    if (!classroom) {
      return res.status(404).json({ 
        success: false, 
        message: 'Classroom not found for this class' 
      });
    }

    // Verify student is assigned to this classroom/group
    const isStudentAssigned = classroom.assignedStudents.some(
      student => student.toString() === studentId.toString()
    );

    if (!isStudentAssigned) {
      return res.status(400).json({ 
        success: false, 
        message: 'Student is not assigned to this classroom' 
      });
    }

    // Check if student has already marked their own attendance
    const existingAttendance = await Attendance.findOne({
      class: classId, 
      student: studentId,
      classroom: classroom._id
    });

    // If attendance exists and was marked by student (not manually), inform teacher
    if (existingAttendance && 
        (existingAttendance.markedBy === 'location' || 
         existingAttendance.markedBy === 'facial-recognition')) {
      
      // For teacher, allow override but inform them
      const attendance = await Attendance.findOneAndUpdate(
        { 
          class: classId, 
          student: studentId,
          classroom: classroom._id
        },
        {
          status,
          markedBy: 'teacher',
          markedByUser: teacherId,
          markedAt: new Date(),
          notes: notes || `Modified by teacher. Previously marked as ${existingAttendance.status} by ${existingAttendance.markedBy} at ${existingAttendance.markedAt}`
        },
        { new: true }
      );

      return res.json({
        success: true,
        message: `Attendance updated. Student previously marked attendance as ${existingAttendance.status} by ${existingAttendance.markedBy}`,
        data: attendance
      });
    }

    // Update or create attendance record
    const attendance = await Attendance.findOneAndUpdate(
      { 
        class: classId, 
        student: studentId,
        classroom: classroom._id
      },
      {
        status,
        markedBy: 'teacher',
        markedByUser: teacherId,
        markedAt: new Date(),
        notes
      },
      { 
        new: true, 
        upsert: true 
      }
    );

    return res.json({
      success: true,
      message: `Attendance marked as ${status} for student`,
      data: attendance
    });
  } catch (error) {
    console.error('Error marking attendance manually:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to mark attendance', 
      error: error.message 
    });
  }
};


const bulkMarkAttendance = async (req, res) => {
  try {
    const { classId, attendanceData } = req.body;
    const teacherId = req.user.userId;

    // Validate class and teacher permissions
    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({ 
        success: false, 
        message: 'Class not found' 
      });
    }

    if (classObj.teacher._id.toString() !== teacherId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'You are not authorized to mark attendance for this class' 
      });
    }

    // Find the classroom
    const classroom = await Classroom.findOne({
      'classes.class': classId
    });

    if (!classroom) {
      return res.status(404).json({ 
        success: false, 
        message: 'Classroom not found for this class' 
      });
    }

    // Process each attendance entry
    const operations = attendanceData.map(entry => ({
      updateOne: {
        filter: { 
          class: classId, 
          student: entry.studentId,
          classroom: classroom._id
        },
        update: {
          status: entry.status,
          markedBy: 'teacher',
          markedByUser: teacherId,
          markedAt: new Date(),
          notes: entry.notes
        },
        upsert: true
      }
    }));

    const result = await Attendance.bulkWrite(operations);

    return res.json({
      success: true,
      message: 'Bulk attendance marked successfully',
      data: {
        modified: result.modifiedCount,
        upserted: result.upsertedCount
      }
    });
  } catch (error) {
    console.error('Error marking bulk attendance:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to mark bulk attendance', 
      error: error.message 
    });
  }
};

const getClassAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const teacherId = req.user.userId;

    // Validate class and teacher permissions
    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({ 
        success: false, 
        message: 'Class not found' 
      });
    }

    if (classObj.teacher.toString() !== teacherId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'You are not authorized to view attendance for this class' 
      });
    }

    // Find the classroom to get students
    const classroomId = classObj.classroom;
    const classroom = await Classroom.findById(classroomId).populate('assignedStudents', 'firstName lastName email rollNumber'); // Adjust fields as needed

    if (!classroom) {
      return res.status(404).json({ 
        success: false, 
        message: 'Classroom not found for this class' 
      });
    }

    // Get attendance for all students in this class
    const attendanceRecords = await Attendance.find({
      class: classId
    }).populate('student', 'firstName email lastName rollNumber');

    // Create a map of student IDs to attendance records
    const attendanceMap = attendanceRecords.reduce((map, record) => {
      map[record.student._id.toString()] = record;
      return map;
    }, {});

    // Build response with all students and their attendance status
    const attendanceData = classroom.assignedStudents.map(student => {
      const record = attendanceMap[student._id.toString()];
      return {
        student: {
          _id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          rollNumber: student.rollNumber
        },
        attendance: record ? {
          status: record.status,
          markedBy: record.markedBy,
          markedAt: record.markedAt,
          notes: record.notes
        } : {
          status: 'absent',
          markedBy: 'system',
          markedAt: null,
          notes: null
        }
      };
    });
    

    // Get summary statistics
    const stats = await Attendance.getClassStats(classId);

    return res.json({
      success: true,
      data: {
        date: Date.now(),
        class: {
          _id: classObj._id,
          title: classObj.title,
          date: classObj.isExtraClass ? classObj.extraClassDate : null,
          schedule: classObj.schedule
        },
        attendance: attendanceData,
        stats: {
          total: classroom.assignedStudents.length,
          present: stats.present || 0,
          absent: stats.absent || 0,
          late: stats.late || 0,
          excused: stats.excused || 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching class attendance:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch class attendance', 
      error: error.message 
    });
  }
};

// Controller for student's attendance functions
const markAttendanceByFaceAndLocation = async (req, res) => {
  try {
    const { classId, faceEmbeddingData, location } = req.body;
    const studentId = req.user.userId;

    // Find classroom with this class
    const classroom = await Classroom.findOne({ 
      'classes.class': classId,
      assignedStudents: studentId
    });
    console.log(classroom);
    if (!classroom) {
      return res.status(404).json({ 
        success: false, 
        message: 'Classroom not found or you are not assigned to this classroom' 
      });
    }

    // Check if attendance window is open
    if (!classroom.isAttendanceWindowOpen(classId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Attendance window is not open for this class' 
      });
    }

    // Get class details
    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({ 
        success: false, 
        message: 'Class not found' 
      });
    }

    // Verify student's face embedding using the integrated face recognition system
    let faceRecognized = false;
    let embeddingId = null;
    let faceSimilarity = null;

    if (faceEmbeddingData) {
      const faceVerificationResult = await verifyFaceEmbedding(faceEmbeddingData, studentId);
      
      if (faceVerificationResult.verified) {
        faceRecognized = true;
        embeddingId = faceVerificationResult.embeddingId;
        faceSimilarity = faceVerificationResult.similarity;
      } else {
        console.log('Face verification failed:', faceVerificationResult.error);
      }
    }

    // Verify location proximity to class
    let locationVerified = false;
    if (location && classObj.location) {
      // Create temporary attendance object to use the method
      const tempAttendance = new Attendance({
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
          timestamp: new Date()
        }
      });
      
      locationVerified = await tempAttendance.validateLocation(classObj);
    }

    // If both criteria fail, reject attendance
    if (!faceRecognized && !locationVerified) {
      return res.status(400).json({ 
        success: false, 
        message: 'Face recognition and location verification both failed' 
      });
    }

    // Determine attendance status (late or present)
    const now = new Date();
    const classStartTime = classObj.isExtraClass 
      ? new Date(`${classObj.extraClassDate.toISOString().split('T')[0]}T${classObj.schedule.startTime}:00`)
      : new Date();  // Simplified - in production, calculate from schedule
    
    const lateThreshold = 15; // minutes
    const lateThresholdMs = lateThreshold * 60 * 1000;
    
    const status = now > new Date(classStartTime.getTime() + lateThresholdMs) ? 'late' : 'present';

    // Record attendance
    const attendance = await Attendance.findOneAndUpdate(
      { 
        class: classId, 
        student: studentId,
        classroom: classroom._id
      },
      {
        status,
        markedBy: faceRecognized ? 'facial-recognition' : 'location',
        markedAt: now,
        location: location ? {
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
          timestamp: now
        } : undefined,
        faceRecognized,
        faceEmbedding: embeddingId,
        faceSimilarity: faceSimilarity
      },
      { 
        new: true, 
        upsert: true 
      }
    );

    return res.json({
      success: true,
      message: `Attendance marked as ${status}`,
      data: {
        attendanceId: attendance._id,
        status,
        faceRecognized,
        faceSimilarity,
        locationVerified,
        markedAt: attendance.markedAt
      }
    });
  } catch (error) {
    console.error('Error marking attendance by face and location:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to mark attendance', 
      error: error.message 
    });
  }
};

const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const { courseId } = req.params;

    // Find all classes for this course
    const classes = await Class.find({ course: courseId });
    if (classes.length === 0) {
      return res.json({
        success: true,
        data: {
          attendanceRecords: [],
          stats: {
            totalClasses: 0,
            present: 0,
            absent: 0,
            late: 0,
            excused: 0,
            percentage: 0
          }
        }
      });
    }

    const classIds = classes.map(c => c._id);

    // Get all attendance records for this student in these classes
    const attendanceRecords = await Attendance.find({
      student: studentId,
      class: { $in: classIds }
    }).populate({
      path: 'class',
      select: 'title schedule isExtraClass extraClassDate'
    })
    .populate({
      path: 'student',
      select: 'firstName lastName'
    });

    // Calculate statistics
    const totalClasses = classIds.length;
    const stats = {
      totalClasses,
      present: attendanceRecords.filter(a => a.status === 'present').length,
      late: attendanceRecords.filter(a => a.status === 'late').length,
      absent: attendanceRecords.filter(a => a.status === 'absent').length,
      excused: attendanceRecords.filter(a => a.status === 'excused').length
    };

    // Calculate percentage
    const attendedClasses = stats.present + stats.late + stats.excused;
    stats.percentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;

    return res.json({
      success: true,
      data: {
        attendanceRecords,
        stats
      }
    });
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch attendance records', 
      error: error.message 
    });
  }
};

const getAttendanceWindowStatus = async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = req.user.userId;
    console.log(classId);
    // Find the class object first
    const classObj = await Class.findById(classId);
    console.log(classObj)
    if (!classObj) {
      return res.status(404).json({ 
        success: false, 
        message: 'Class not found' 
      });
    }
    
    // Check if classroom exists on the class object
    if (!classObj.classroom) {
      return res.status(404).json({ 
        success: false, 
        message: 'No classroom associated with this class' 
      });
    }

    // Extract classroom ID safely
    const classroomId = typeof classObj.classroom === 'object' 
      ? classObj.classroom._id 
      : classObj.classroom; // Handle both populated and reference only cases
    
    // Find the classroom
    const classroom = await Classroom.findById(classroomId);
    
    if (!classroom) {
      return res.status(404).json({ 
        success: false, 
        message: 'Associated classroom not found' 
      });
    }

    // Get the class entry
    const classEntry = classroom.classes.find(c => c.class.toString() === classId);
    
    if (!classEntry) {
      return res.status(404).json({ 
        success: false, 
        message: 'Class not found in this classroom' 
      });
    }

    // Check window status
    const isOpen = classroom.isAttendanceWindowOpen(classId);
    
    // Check if the student has already marked attendance for this class
    let attendanceStatus = null;
    if (req.user.role === 'student') {
      const attendance = await Attendance.findOne({
        class: classId,
        student: userId
      });
      
      if (attendance) {
        attendanceStatus = {
          status: attendance.status,
          markedAt: attendance.markedAt,
          markedBy: attendance.markedBy
        };
      }
    }

    return res.json({
      success: true,
      data: {
        isOpen,
        windowDetails: isOpen ? {
          openedAt: classEntry.attendanceWindow.openedAt,
          closesAt: classEntry.attendanceWindow.closesAt
        } : null,
        attendanceStatus
      }
    });
  } catch (error) {
    console.error('Error fetching attendance window status:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch attendance window status', 
      error: error.message 
    });
  }
};
const attendanceController = {verifyUserEmbedding, checkLocationValidity, openAttendanceWindow, closeAttendanceWindow, markAttendanceManually, getAttendanceWindowStatus, getStudentAttendance, markAttendanceByFaceAndLocation, getClassAttendance, bulkMarkAttendance};


module.exports = attendanceController;