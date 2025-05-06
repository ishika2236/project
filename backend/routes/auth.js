const express = require('express');
const router = express.Router();
const { login, signup , me, getDepartments} = require('../controller/auth');

// Login route
router.post('/login', login);

// Signup route  
router.post('/signup', signup);
router.get('/me', me);
router.get('/departments', getDepartments);

module.exports = router;
