const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'teacher', 'student'],
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    permanentAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: String
    },
    currentAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: String
    },
    // Fields specific to students
    rollNumber: {
        type: String,
        sparse: true
    },
    admissionYear: {
        type: Number,
        sparse: true
    },
    // Fields specific to teachers
    employeeId: {
        type: String,
        sparse: true
    },
    teachingAssignments: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group'
        }
    }],
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },
    enrolledCourses: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        enrollmentDate: {
            type: Date,
            default: Date.now
        }
    }],
    // Profile image fields
    profileImage: {
        type: String,
        default: null
    },
    faceEmbedding: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Embedding'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
