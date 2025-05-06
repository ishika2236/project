const mongoose = require("mongoose");
const { Schema } = mongoose;

const GroupSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  mentor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  maxCapacity: {
    type: Number,
    default: 100
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  // Add courses field to track assigned courses
  courses: [{
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }],
  description: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Group', GroupSchema);