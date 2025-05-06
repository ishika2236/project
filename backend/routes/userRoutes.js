const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middleware/authMiddleware');
const {adminMiddleware} = require('../middleware/adminMiddleware');
const upload = require('./../utils/multerConfig')

const { getAllStudents, getAllTeachers, getAllUsers, updateUser, deleteUser, getUserById} = require('./../controller/userController')


router.get('/', authMiddleware, adminMiddleware, getAllUsers);
router.get('/teachers', authMiddleware,getAllTeachers);
router.get('/students', authMiddleware, getAllStudents);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, upload.single('profileImage'), updateUser);
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);

module.exports = router;