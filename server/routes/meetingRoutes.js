// server/routes/meetingRoutes.js
const express = require('express');
const router = express.Router();

// Import ALL necessary controller functions
const { 
    getMeetings, 
    createMeeting, 
    updateMeetingLink // <--- We are adding this back
} = require('../controllers/meetingController');

router.get('/', getMeetings);
router.post('/', createMeeting);

// --- THIS FIXES THE 404 ERROR ---
router.post('/update-link', updateMeetingLink);

module.exports = router;