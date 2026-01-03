// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());

// --- ROUTES ---
// This connects the /api/ai URL to the aiRoutes file
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/meetings', require('./routes/meetingRoutes'));

app.get('/', (req, res) => {
  res.send('MeetMind API is running...');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));