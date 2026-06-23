const mongoose = require("mongoose");

// Connect to MongoDB using the URI from .env
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // stop the server if DB connection fails
  }
}

module.exports = connectDB;
