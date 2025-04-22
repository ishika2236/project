const express = require('express');
const router = express.Router();
const { createGroup, assignStudent, removeStudent, assignTeacher, getGroupResources, getGroupClasses, getGroups, getAllGroups} = require('./../controller/groupController');

router.post('/courses/:courseId/groups/create', createGroup);

// Assign a student to a group
router.post('/:groupId/assign', assignStudent);

// Remove a student from a group
router.delete('/:groupId/remove', removeStudent);

router.post('/:groupId/assignTeacher', assignTeacher);

router.get('/:groupId/classes', getGroupClasses);

router.get("/:groupId/resources", getGroupResources);

router.get("/:courseId/allGroups", getGroups)
router.get("/", getAllGroups);


module.exports = router;