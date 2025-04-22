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
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Group', GroupSchema);
