const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnnouncementSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ClassroomSchema = new Schema({
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  assignedTeacher: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group'
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
  assignedStudents: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  classes: [{
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class'
    },
    status: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'rescheduled'],
      default: 'scheduled'
    }, attendanceWindow: {
      isOpen: {
        type: Boolean,
        default: false
      },
      openedAt: {
        type: Date
      },
      closesAt: {
        type: Date
      },
      openedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    },
    notes: String
  }],
  sharedResources: [{
    type: Schema.Types.ObjectId,
    ref: 'Resource'
  }],
  announcements: [AnnouncementSchema]
}, {
  timestamps: true
});

// Check if attendance window is open for a specific class
ClassroomSchema.methods.isAttendanceWindowOpen = function(classId) {
  const classEntry = this.classes.find(c => c.class._id.toString() === classId.toString());
  console.log("in classroom controller: class entry: ", classEntry);
  if (!classEntry || !classEntry.attendanceWindow || !classEntry.attendanceWindow.isOpen) return false;

  const now = new Date();
  const { openedAt, closesAt } = classEntry.attendanceWindow;

  // If no closesAt is specified, window remains open indefinitely
  if (!closesAt) return true;

  return now >= openedAt && now <= closesAt;
};

// Open attendance window for a specific class
ClassroomSchema.methods.openAttendanceWindow = async function(classId, teacherId, duration) {
  // Find the class in the classroom's classes array
  const classIndex = this.classes.findIndex(c => c.class.toString() === classId.toString());
  
  if (classIndex === -1) {
    throw new Error('Class not found in this classroom');
  }
  
  // Set up window open/close times
  const now = new Date();
  const closesAt = duration ? new Date(now.getTime() + duration * 60000) : null; // duration in minutes
  
  // Update the attendance window
  this.classes[classIndex].attendanceWindow = {
    isOpen: true,
    openedAt: now,
    closesAt: closesAt,
    openedBy: teacherId
  };
  
  // Update class status to in-progress if it was scheduled
  if (this.classes[classIndex].status === 'scheduled') {
    this.classes[classIndex].status = 'in-progress';
  }
  
  // Save the changes
  await this.save();
  
  return {
    isOpen: true,
    openedAt: now,
    closesAt: closesAt
  };
};

// Close attendance window for a specific class
ClassroomSchema.methods.closeAttendanceWindow = async function(classId) {
  // Find the class in the classroom's classes array
  const classIndex = this.classes.findIndex(c => c.class.toString() === classId.toString());
  
  if (classIndex === -1) {
    throw new Error('Class not found in this classroom');
  }
  
  // Check if window is actually open
  if (!this.classes[classIndex].attendanceWindow || !this.classes[classIndex].attendanceWindow.isOpen) {
    throw new Error('Attendance window is not open for this class');
  }
  
  // Close the window
  this.classes[classIndex].attendanceWindow.isOpen = false;
  
  // Save the changes
  await this.save();
  
  return {
    isOpen: false,
    closedAt: new Date()
  };
};

module.exports = mongoose.model('Classroom', ClassroomSchema);
