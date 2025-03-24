const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
        trim: true
    },
    courseCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    courseDescription: {
        type: String,
        required: true
    },
    courseCoordinator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    instructors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    enrolledStudents: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        enrollmentDate: {
            type: Date,
            default: Date.now
        },
        grade: {
            type: String,
            enum: ['A', 'B', 'C', 'D', 'F', 'IP'], // IP = In Progress
            default: 'IP'
        }
    }],
    academicYear: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true,
        enum: ['Fall', 'Spring', 'Summer']
    },
    credits: {
        type: Number,
        required: true,
        min: 1
    },
    schedule: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        startTime: String,
        endTime: String,
        room: String
    }],
    prerequisites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    maxCapacity: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    syllabus: {
        type: String // URL or file path to syllabus document
    },
    assignments: [{
        title: String,
        description: String,
        dueDate: Date,
        totalMarks: Number
    }],
    department: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
