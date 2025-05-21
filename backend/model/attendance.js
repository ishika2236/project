const mongoose = require('mongoose');
const { Schema } = mongoose;

const AttendanceSchema = new Schema({
  // Reference to the class session
  class: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  // Reference to the classroom
  classroom: {
    type: Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true
  },
  // Reference to the student (user)
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Status of attendance
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'excused'],
    default: 'absent'
  },
  // Method of marking attendance
  markedBy: {
    type: String,
    enum: ['auto', 'teacher', 'facial-recognition', 'student', 'system'],
    default: 'system'
  },
  // Who marked the attendance (if manually marked by teacher)
  markedByUser: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  // Date and time when attendance was marked
  markedAt: {
    type: Date,
    default: Date.now
  },
  // For location-based attendance
  location: {
    latitude: {
      type: Number,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180
    },
    accuracy: {
      type: Number
    },
    timestamp: {
      type: Date
    }
  },
  // For facial recognition attendance
  faceRecognized: {
    type: Boolean,
    default: false
  },
  // Reference to the face embedding used
  faceEmbedding: {
    type: Schema.Types.ObjectId,
    ref: 'Embedding'
  },
  // Additional notes
  notes: {
    type: String
  },
}, {
  timestamps: true
});

// Index for efficient queries
AttendanceSchema.index({ class: 1, student: 1 }, { unique: true });

// Method to validate location proximity
AttendanceSchema.methods.validateLocation = async function(classObj) {
  if (!this.location || !classObj.location) {
    return false;
  }
  
  // Calculate distance between points (using Haversine formula)
  const R = 6371e3; // Earth radius in meters
  const φ1 = this.location.latitude * Math.PI/180;
  const φ2 = classObj.location.latitude * Math.PI/180;
  const Δφ = (classObj.location.latitude - this.location.latitude) * Math.PI/180;
  const Δλ = (classObj.location.longitude - this.location.longitude) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  // Define proximity threshold in meters (adjust as needed)
  const proximityThreshold = 100; // 100 meters
  
  return distance <= proximityThreshold;
};

// Static method to get attendance statistics for a class
AttendanceSchema.statics.getClassStats = async function(classId) {
  const stats = await this.aggregate([
    { $match: { class: new mongoose.Types.ObjectId(classId) } }, // ✅ use 'new'
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);
  
  return stats.reduce((result, item) => {
    result[item._id] = item.count;
    return result;
  }, {});
};


// Static method to calculate attendance percentage for a student
AttendanceSchema.statics.getStudentAttendancePercentage = async function(studentId, courseId) {
  // Find all classes for this course
  const Class = mongoose.model('Class');
  const classesInCourse = await Class.find({ course: courseId });
  const classIds = classesInCourse.map(c => c._id);
  
  // Get attendance records for this student in these classes
  const attendanceRecords = await this.find({
    student: studentId,
    class: { $in: classIds }
  });
  
  // Calculate percentage
  const totalClasses = classIds.length;
  const presentCount = attendanceRecords.filter(a => 
    a.status === 'present' || a.status === 'late').length;
  
  return totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;
};

module.exports = mongoose.model('Attendance', AttendanceSchema);