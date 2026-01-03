// server/controllers/meetingController.js
const Meeting = require('../models/Meeting');
const axios = require('axios');

exports.getMeetings = async (req, res) => {
  try {
    const { userFirebaseUid } = req.query;
    if (!userFirebaseUid) { return res.status(400).json({ message: 'User UID is required.' }); }
    const meetings = await Meeting.find({ userFirebaseUid }).sort({ startTime: -1 });
    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching meetings.' });
  }
};

// --- THIS FUNCTION HANDLES THE PABBLY REQUEST ---
exports.updateMeetingLink = async (req, res) => {
  try {
    const { meetingId, hangoutLink } = req.body;
    console.log(`Received Pabbly Update -> ID: ${meetingId}, Link: ${hangoutLink}`);

    if (!meetingId || !hangoutLink) {
      return res.status(400).json({ message: "Missing meetingId or hangoutLink" });
    }

    const updatedMeeting = await Meeting.findByIdAndUpdate(
      meetingId, 
      { meetingLink: hangoutLink }, 
      { new: true }
    );

    if (!updatedMeeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.status(200).json({ message: "Link updated successfully" });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createMeeting = async (req, res) => {
  try {
    const { userFirebaseUid, title, startTime, endTime, description, attendees, postMeetingAssets, aiResults } = req.body;

    // 1. Save meeting with "processing..." status
    const newMeeting = new Meeting({ 
        userFirebaseUid, title, startTime, endTime, description, attendees, postMeetingAssets, aiResults,
        meetingLink: "processing..." 
    });
    let savedMeeting = await newMeeting.save();

    // 2. Trigger Pabbly (Fire and Forget)
    const webhookUrl = process.env.PABBLY_WEBHOOK_URL;
    if (webhookUrl) {
      console.log("Triggering Pabbly...");
      axios.post(webhookUrl, {
          title: savedMeeting.title,
          startTime: savedMeeting.startTime,
          endTime: savedMeeting.endTime,
          description: savedMeeting.description,
          attendees: savedMeeting.attendees,
          meetingId: savedMeeting._id // Critical for Pabbly to send back
      }).catch(err => console.error("Pabbly Error:", err.message));
    }

    // 3. Respond immediately to Frontend
    res.status(201).json({
      message: 'Meeting scheduled! Link will appear shortly.',
      meeting: savedMeeting,
    });

  } catch (error) {
    console.error('Create Error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};