require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const leetcodeRoutes = require("./routes/leetcode");
const taskRoutes = require("./routes/tasks");

const app = express();

// Connect to MongoDB when the server starts
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/leetcode", leetcodeRoutes);
app.use("/api/tasks", taskRoutes);

// Basic health check route
app.get("/", (req, res) => {
  res.json({ message: "LeetCode Analyzer API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
