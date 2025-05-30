const express = require('express');
const http = require('http');
const connectDB = require('./utils/db');
require('dotenv').config();
const cors = require('cors');

const app = express();
const {authMiddleware }= require('./middleware/authMiddleware')
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courseRoutes');
const groupRoutes = require('./routes/groupRoutes');
const userRoutes = require('./routes/userRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const faceRecognitionRoutes = require('./routes/faceRecognition');
const classRoutes = require('./routes/classRoutes');
const classroomRoutes = require('./routes/classroomRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes')
const attendanceStatsRoutes = require('./routes/attendanceStats')
const server = http.createServer(app);


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['https://project-i3sw.vercel.app','https://project-bkly.vercel.app','http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
}));


app.use('/api/auth', authRoutes);
app.use('/api/face-recognition', faceRecognitionRoutes);
app.use('/api/courses',authMiddleware, courseRoutes);
app.use('/api/groups',authMiddleware, groupRoutes);
app.use('/api/users',authMiddleware, userRoutes);
app.use('/api/departments', authMiddleware, departmentRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/classroom', classroomRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/attendanceStats', attendanceStatsRoutes);
// Connect to MongoDB
connectDB();
app.get('/', (req, res) => {
    res.send('Hello World, I am the backend');
});
// Error handling middleware

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

