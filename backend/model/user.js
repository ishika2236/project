const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
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
        type: Schema.Types.ObjectId,
        ref: 'Department'
    },
    // Profile image fields
    profileImage: {
        type: String,
        default: null
    },
    faceEmbedding: {
        type: Schema.Types.ObjectId,
        ref: 'Embedding'
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
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    },
    enrolledCourses: [{
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course'
        },
        enrollmentDate: {
            type: Date,
            default: Date.now
        }
    }],
    
    // Fields specific to teachers
    employeeId: {
        type: String,
        sparse: true
    },
    teachingAssignments: [{
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course'
        },
        group: {
            type: Schema.Types.ObjectId,
            ref: 'Group'
        }
    }],
    
    // Admin-specific field
    isAdmin: {
        type: Boolean,
        default: function() {
            return this.role === 'admin';
        }
    },
}, {
    timestamps: true
});

// Add virtual getters for compatibility with existing code
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Ensure the existing code using separate models still works
// with our unified User model
userSchema.statics.findStudents = function(query = {}) {
    return this.find({ ...query, role: 'student' });
};

userSchema.statics.findTeachers = function(query = {}) {
    return this.find({ ...query, role: 'teacher' });
};

userSchema.statics.findAdmins = function(query = {}) {
    return this.find({ ...query, role: 'admin' });
};

// Indexes for better query performance
userSchema.index({ role: 1 });
userSchema.index({ rollNumber: 1 }, { sparse: true });
userSchema.index({ employeeId: 1 }, { sparse: true });

const User = mongoose.model('User', userSchema);

module.exports = User;