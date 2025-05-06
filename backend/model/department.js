const mongoose = require('mongoose');
const { Schema } = mongoose;

const DepartmentSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String
  },
  head: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  faculty: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  groups: [{
    type: Schema.Types.ObjectId,
    ref: 'Group'
  }],
  courses: [{
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Department', DepartmentSchema);