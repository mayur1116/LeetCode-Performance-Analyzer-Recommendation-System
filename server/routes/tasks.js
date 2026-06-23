const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// GET /api/tasks/:username
// Fetch all tasks for a specific user
router.get("/:username", async (req, res) => {
  try {
    const tasks = await Task.find({ username: req.params.username }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ error: "Could not fetch tasks" });
  }
});

// POST /api/tasks
// Create a new task
router.post("/", async (req, res) => {
  const { username, text } = req.body;

  if (!username || !text) {
    return res.status(400).json({ error: "Username and task text are required" });
  }

  try {
    const newTask = new Task({ username, text });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error creating task:", error.message);
    res.status(500).json({ error: "Could not create task" });
  }
});

// PATCH /api/tasks/:id
// Toggle the completed status of a task
router.patch("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Flip the completed boolean
    task.completed = !task.completed;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error.message);
    res.status(500).json({ error: "Could not update task" });
  }
});

// DELETE /api/tasks/:id
// Delete a task by ID
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    res.status(500).json({ error: "Could not delete task" });
  }
});

module.exports = router;
