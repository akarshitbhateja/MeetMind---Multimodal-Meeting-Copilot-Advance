// server/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // This line reads the MONGO_URI variable loaded from your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB Connection Failed: ${err.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;