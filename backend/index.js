const express = require('express');
const http = require('http');
const connectDB = require('./utils/db');
require('dotenv').config();
const cors = require('cors');

const app = express();
const authRoutes = require('./routes/auth');
const faceRecognitionRoutes = require('./routes/faceRecognition');


const server = http.createServer(app);


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));


app.use('/api/auth', authRoutes);
app.use('/api/face-recognition', faceRecognitionRoutes);


// Connect to MongoDB
connectDB();

// Error handling middleware

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

