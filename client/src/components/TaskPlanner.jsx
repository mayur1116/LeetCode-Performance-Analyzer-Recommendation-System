import { useState, useEffect } from "react";
import axios from "axios";

function TaskPlanner({ username }) {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [username]);

  async function fetchTasks() {
    setLoading(true);
    try {
      const response = await axios.get(`/api/tasks/${username}`);
      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTask(e) {
    e.preventDefault();
    const text = newTaskText.trim();
    if (!text) return;

    setAdding(true);
    setError("");
    try {
      const response = await axios.post("/api/tasks", { username, text });
      setTasks([response.data, ...tasks]);
      setNewTaskText("");
    } catch (err) {
      console.error("Error adding task:", err.message);
      setError("Database error. Please check your MongoDB connection.");
    } finally {
      setAdding(false);
    }
  }

  async function handleToggle(taskId) {
    try {
      const response = await axios.patch(`/api/tasks/${taskId}`);
      setTasks(tasks.map((t) => (t._id === taskId ? response.data : t)));
    } catch (err) {
      console.error("Error toggling task:", err.message);
    }
  }

  async function handleDelete(taskId) {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err.message);
    }
  }

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="card">
      <p className="card-title">Daily Task Planner</p>
      <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "14px" }}>
        Track your daily practice goals. Tasks are linked to this LeetCode username.
      </p>

      {/* Add task */}
      <form className="task-form" onSubmit={handleAddTask}>
        <input
          id="task-input"
          type="text"
          className="task-input"
          placeholder="e.g. Solve 3 DP problems today..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
        />
        <button id="add-task-btn" type="submit" className="btn-add" disabled={adding}>
          {adding ? "Adding..." : "Add"}
        </button>
      </form>

      {error && <p style={{ color: "var(--hard)", fontSize: "12px", marginBottom: "10px" }}>{error}</p>}

      {/* Summary */}
      {tasks.length > 0 && (
        <p className="task-summary">
          {completedCount} of {tasks.length} completed
        </p>
      )}

      {/* Task list */}
      {loading ? (
        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="empty-tasks">No tasks yet. Add one above!</p>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <div key={task._id} className={`task-item ${task.completed ? "done" : ""}`}>
              <div
                className={`task-check ${task.completed ? "checked" : ""}`}
                onClick={() => handleToggle(task._id)}
                title="Toggle complete"
              >
                {task.completed && "✓"}
              </div>
              <span className={`task-text ${task.completed ? "done" : ""}`}>
                {task.text}
              </span>
              <button
                className="btn-del"
                onClick={() => handleDelete(task._id)}
                title="Delete task"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskPlanner;
