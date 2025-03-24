const express = require('express');
const router = express.Router();
const faceRecognitionController = require('../controller/face-recognition');

router.post('/find-closest-match', faceRecognitionController.findClosestMatch);

module.exports = router;
