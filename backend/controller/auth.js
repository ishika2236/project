const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const Embedding = require('../model/embedding'); 
const upload = require('../utils/multerConfig');

// Login controller remains unchanged
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Updated Signup controller
const signup = async (req, res) => {
    try {
        upload.single('profileImage')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: 'Image upload failed' });
            }

            const {
                firstName,
                lastName,
                email,
                password,
                role,
                mobile,
                permanentAddress,
                currentAddress,
                rollNumber,
                admissionYear,
                group,
                employeeId,
                dateOfBirth,
                gender,
                faceEmbedding
            } = req.body;
            console.log(req.body);
            
            // Parse face embedding data
            const parsedEmbedding = JSON.parse(faceEmbedding);
            
            if (!password) {
                return res.status(400).json({ message: 'Password is required' });
            }
            
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new user without embedding reference first
            const user = new User({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: role ? role.toLowerCase() : "", 
                mobile,
                permanentAddress, 
                currentAddress,   
                rollNumber,
                admissionYear,
                group: group ? group.toLowerCase() : "",  
                employeeId,
                dateOfBirth,
                gender: gender ? gender.toLowerCase() : "",  
                profileImage: req.file ? req.file.path : null,
                
            });

            // Save the user to get an _id
            await user.save();
            
            // Now create the embedding document with reference to the user
            const embeddingDoc = new Embedding({
                user: user._id,
                embedding: parsedEmbedding,
                isActive: true
            });
            
            // Save the embedding document
            await embeddingDoc.save();
            
            // Update the user with the reference to the embedding
            user.faceEmbedding = embeddingDoc._id;
            await user.save();
            console.log(user, embeddingDoc);
            
            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'User created successfully',
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                }
            });
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { login, signup };