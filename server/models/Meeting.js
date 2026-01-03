// server/models/Meeting.js

const mongoose = require('mongoose');

const PollOptionSchema = new mongoose.Schema({
  text: String,
  // We can add votes here later
});

const PollSchema = new mongoose.Schema({
  question: String,
  options: [String], // Storing options as an array of strings
});

const MeetingSchema = new mongoose.Schema({
  userFirebaseUid: { // Storing the Firebase UID directly for easy lookup
    type: String,
    required: true,
    index: true, // Add an index for faster queries
  },
  title: {
    type: String,
    required: [true, 'Meeting title is required'],
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required'],
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required'],
  },
  description: {
    type: String,
    default: '',
  },
  attendees: {
    type: [String], // Array of attendee emails
    required: true,
  },
  // NEW FIELDS
  presentationUrl: { // We will store the URL from Firebase Storage here
    type: String,
    default: '',
  },
  polls: [PollSchema], // An array of polls
  meetingLink: { // The link from Pabbly/Google Calendar
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled',
  },
}, { timestamps: true });

module.exports = mongoose.model('Meeting', MeetingSchema);