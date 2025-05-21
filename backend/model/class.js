// Updated Class Schema with location data

const mongoose = require('mongoose');
const { Schema } = mongoose;

const ClassSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  classroom: {
    type: Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  groups: [{
    type: Schema.Types.ObjectId,
    ref: 'Group'
  }],
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  // Location data for the class
  location: {
    latitude: {
      type: Number,
      min: -90,
      max: 90,
      default: null
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180,
      default: null
    },
    address: {
      type: String,
      trim: true
    },
    building: {
      type: String,
      trim: true
    },
    floor: {
      type: Number
    },
    room: {
      type: String,
      trim: true
    },
    additionalInfo: {
      type: String,
      trim: true
    }
  },
  // For regular scheduled classes
  schedule: {
    // If schedule is present, this is a recurring class
    startDate: {
      type: Date,
      required: function() { return !this.isExtraClass; }
    },
    endDate: {
      type: Date,
      required: function() { return !this.isExtraClass; }
    },
    daysOfWeek: [{
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6] // 0 is Sunday, 1 is Monday, etc.
    }],
    startTime: {
      type: String, // Format: "HH:MM" in 24-hour format
      required: true
    },
    endTime: {
      type: String, // Format: "HH:MM" in 24-hour format
      required: true
    }
  },
  // Flag to identify extra classes
  isExtraClass: {
    type: Boolean,
    default: false
  },
  // For one-time or extra classes
  extraClassDate: {
    type: Date,
    required: function() { return this.isExtraClass; }
  },
  // Reference to attendance records (moved to separate Attendance schema)
  attendanceRecords: [{
    type: Schema.Types.ObjectId,
    ref: 'Attendance'
  }],
  // Resources shared in class
  resources: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    fileUrl: {
      type: String
    },
    fileType: {
      type: String,
      enum: ['pdf', 'doc', 'image', 'video', 'link', 'other']
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Topics covered in class
  topics: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  notes: {
    type: String
  },
  // Special requirements for the class
  specialRequirements: {
    type: String
  },
}, {
  timestamps: true
});

// Virtual to get all students from the associated groups
ClassSchema.virtual('students').get(async function() {
  try {
    const groups = await mongoose.model('Group').find({
      _id: { $in: this.groups }
    }).populate('students');
    
    // Extract and flatten student arrays from all groups
    const students = groups.reduce((allStudents, group) => {
      return [...allStudents, ...group.students];
    }, []);
    
    // Remove duplicates (students might be in multiple groups)
    return [...new Set(students)];
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
});

// Methods to check for schedule conflicts
ClassSchema.statics.checkForConflicts = async function (
  classroomId,
  startTime,
  endTime,
  date,
  daysOfWeek,
  existingClassId = null
) {
  const startDate = new Date(date.setHours(0, 0, 0, 0));
  const endDate = new Date(date.setHours(23, 59, 59, 999));
  const daysToCheck = daysOfWeek || [date.getDay()];

  const query = {
    classroom: classroomId,
    _id: existingClassId ? { $ne: existingClassId } : { $exists: true },
    $or: [
      // Regular (recurring) class conflict
      {
        isExtraClass: false,
        'schedule.daysOfWeek': { $in: daysToCheck },
        'schedule.startDate': { $lte: endDate },
        'schedule.endDate': { $gte: startDate },
        $or: [
          {
            'schedule.startTime': { $lt: endTime, $gte: startTime }
          },
          {
            'schedule.endTime': { $gt: startTime, $lte: endTime }
          },
          {
            'schedule.startTime': { $lte: startTime },
            'schedule.endTime': { $gte: endTime }
          }
        ]
      },
      // Extra class conflict on specific date
      {
        isExtraClass: true,
        extraClassDate: { $gte: startDate, $lte: endDate },
        $or: [
          {
            'schedule.startTime': { $lt: endTime, $gte: startTime }
          },
          {
            'schedule.endTime': { $gt: startTime, $lte: endTime }
          },
          {
            'schedule.startTime': { $lte: startTime },
            'schedule.endTime': { $gte: endTime }
          }
        ]
      }
    ]
  };

  return await this.find(query);
};

// Pre-save hook to check for classroom conflicts
ClassSchema.pre('save', async function(next) {
  try {
    if (this.isExtraClass) {
      // Check for conflicts for extra class
      const conflicts = await this.constructor.checkForConflicts(
        this.classroom,
        this.schedule.startTime,
        this.schedule.endTime,
        this.extraClassDate,
        null,
        this._id
      );
      
      if (conflicts.length > 0) {
        return next(new Error('Classroom schedule conflict detected'));
      }
    } else {
      // Check for conflicts for regular classes
      // We need to check each day in the date range that matches daysOfWeek
      const startDate = new Date(this.schedule.startDate);
      const endDate = new Date(this.schedule.endDate);
      
      // Get an array of all dates in the range that match daysOfWeek
      const dates = [];
      for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        if (this.schedule.daysOfWeek.includes(d.getDay())) {
          dates.push(new Date(d));
        }
      }
      
      // Check each date for conflicts
      for (const date of dates) {
        const conflicts = await this.constructor.checkForConflicts(
          this.classroom,
          this.schedule.startTime,
          this.schedule.endTime,
          date,
          this.schedule.daysOfWeek,
          this._id
        );
        
        if (conflicts.length > 0) {
          return next(new Error(`Classroom schedule conflict detected on ${date.toISOString().split('T')[0]}`));
        }
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Class', ClassSchema);