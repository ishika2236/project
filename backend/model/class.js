const mongoose = require('mongoose');
const { Schema } = mongoose;

const ClassSchema = new Schema({
  // Basic Class Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:'User'
    }
  ],
  
  // Connections to existing models
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  
  // Teacher - could be derived from course but kept for quick access
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Class specific info (that might differ from course-level info)
  description: {
    type: String
  },
  
  // Location
  location: {
    building: String,
    room: String,
    gpsCoordinates: {
      latitude: Number,
      longitude: Number,
      radius: {
        type: Number,
        default: 50 // Default radius in meters for attendance geofencing
      }
    }
  },
  
  // Schedule
  schedule: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: String,
    endTime: String
  }],
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  
  sessions: [{
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    topic: String,
    description: String,
    status: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
      default: 'scheduled'
    },
    
    // Attendance configuration for this session
    attendanceEnabled: {
      type: Boolean,
      default: false
    },
    attendanceWindow: {
      startTime: Date,
      endTime: Date
    },
    
    // Notes for the session
    notes: String
  }],
  
  // Class-level attendance settings (defaults)
  attendanceSettings: {
    enabled: {
      type: Boolean,
      default: true
    },
    verificationMethods: {
      facial: {
        type: Boolean,
        default: true
      },
      geolocation: {
        type: Boolean,
        default: true
      },
      manual: {
        type: Boolean,
        default: true
      }
    },
    defaultWindowMinutes: {
      type: Number,
      default: 15 // Default minutes for attendance window
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Class', ClassSchema);
