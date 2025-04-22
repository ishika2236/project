const User = require('./../model/user')
const getAllUsers = async (req, res) => {
    try {
      // Pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      // Filtering
      let filter = {};
      if (req.query.role) {
        filter.role = req.query.role;
      }
  
      // Execute query with pagination
      const users = await User.find(filter)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
  
      // Get total count for pagination
      const total = await User.countDocuments(filter);
  
      res.json({
        users,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  // Get all teachers
  const getAllTeachers = async (req, res) => {
    try {
      // Pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      // Execute query with pagination
      const teachers = await User.find({ role: 'teacher' })
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ lastName: 1, firstName: 1 });
  
      // Get total count for pagination
      const total = await User.countDocuments({ role: 'teacher' });
  
      res.json({
        teachers,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get all teachers error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  // Get all students
  const getAllStudents = async (req, res) => {
    try {
      // Pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      // Filtering
      let filter = { role: 'student' };
      if (req.query.group) {
        filter.group = req.query.group;
      }
      if (req.query.admissionYear) {
        filter.admissionYear = parseInt(req.query.admissionYear);
      }
  
      // Execute query with pagination
      const students = await User.find(filter)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ lastName: 1, firstName: 1 });
  
      // Get total count for pagination
      const total = await User.countDocuments(filter);
  
      res.json({
        students,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get all students error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  // Get user by ID
  const getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(user);
    } catch (error) {
      console.error('Get user by ID error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  // Update user
 const updateUser = async (req, res) => {
    try {
      // Check if user exists
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check permission (admin can update any user, users can update only themselves)
      if (req.user.role !== 'admin' && req.user.userId !== req.params.id) {
        return res.status(403).json({ message: 'Not authorized to update this user' });
      }
  
      // Extract updatable fields
      const {
        firstName,
        lastName,
        mobile,
        permanentAddress,
        currentAddress,
        dateOfBirth,
        gender,
        // Student specific fields
        rollNumber,
        admissionYear,
        group,
        // Teacher specific fields
        employeeId
      } = req.body;
  
      // Prepare update data
      const updateData = {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(mobile && { mobile }),
        ...(permanentAddress && { permanentAddress: JSON.parse(permanentAddress) }),
        ...(currentAddress && { currentAddress: JSON.parse(currentAddress) }),
        ...(dateOfBirth && { dateOfBirth }),
        ...(gender && { gender }),
        // Role-specific fields
        ...(user.role === 'student' && {
          ...(rollNumber && { rollNumber }),
          ...(admissionYear && { admissionYear }),
          ...(group && { group })
        }),
        ...(user.role === 'teacher' && {
          ...(employeeId && { employeeId })
        }),
        updatedAt: Date.now()
      };
  
      // Handle profile image if uploaded
      if (req.file) {
        updateData.profileImage = `/uploads/${req.file.filename}`;
      }
  
      // Update password if provided (admin only)
      if (req.body.password && req.user.role === 'admin') {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(req.body.password, salt);
      }
  
      // Handle face embedding update if provided
      if (req.body.faceEmbedding) {
        updateData.faceEmbedding = req.body.faceEmbedding;
      }
  
      // Update user in database
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true }
      ).select('-password');
  
      res.json({
        message: 'User updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ message: 'Server error during update', error: error.message });
    }
  };
  
  // Delete user
  const deleteUser = async (req, res) => {
    try {
      // Only admin can delete users
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }
  
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Delete user
      await User.findByIdAndDelete(req.params.id);
  
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ message: 'Server error during deletion', error: error.message });
    }
  };

module.exports = { getAllStudents, getAllTeachers, getAllUsers, updateUser, deleteUser, getUserById};