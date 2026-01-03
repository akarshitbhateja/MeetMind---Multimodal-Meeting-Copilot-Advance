// server/routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { processAudio } = require('../controllers/aiController');

// Configure multer to save files to an 'uploads' folder
const upload = multer({ dest: 'uploads/' });

// Define the POST route. 
// IMPORTANT: 'upload.single('audio')' MUST match the formData key sent from frontend
router.post('/process-audio', upload.single('audio'), processAudio);

module.exports = router;