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
        sparse: true // Allows null/undefined values
    },
    admissionYear: {
        type: Number,
        sparse: true
    },
    group: {
        type: String,
        sparse: true
    },
    // Fields specific to teachers
    employeeId: {
        type: String,
        sparse: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    // Profile image fields
    profileImage: {
        type: String, // URL to stored image
        default: null
    },
    faceEmbedding: {
        type: [Number], // Array to store face embedding vector
        default: null
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
