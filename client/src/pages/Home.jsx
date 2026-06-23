import { useState, useEffect } from "react";
import axios from "axios";
import ProfileCard from "../components/ProfileCard";
import StatsCard from "../components/StatsCard";
import RatingGraph from "../components/RatingGraph";
import TopicAnalysis from "../components/TopicAnalysis";
import WeakAreas from "../components/WeakAreas";
import Recommendations from "../components/Recommendations";
import TaskPlanner from "../components/TaskPlanner";

function Home({ darkMode, toggleTheme }) {
  // Initialize username from localStorage if it exists
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("lc_username") || "";
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // On page load, auto-fetch if we have a saved username
  useEffect(() => {
    if (username) {
      handleAnalyze();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAnalyze(e) {
    if (e) e.preventDefault();

    const trimmed = username.trim();
    if (!trimmed) {
      setError("Please enter a LeetCode username.");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await axios.get(`/api/leetcode/${trimmed}`);
      setData(response.data);
      // Save username to localStorage on successful analysis so it persists on reload
      localStorage.setItem("lc_username", trimmed);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="container navbar-inner">
          <span className="navbar-logo">
            LeetCode <span>Analyzer</span>
          </span>
          <button className="theme-btn" onClick={toggleTheme}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </nav>

      {/* Hero / Search */}
      <div className="hero">
        <h1>LeetCode Performance Analyzer</h1>
        <p>
          Enter your LeetCode username to see your stats, topic breakdown,
          weak areas, and practice recommendations.
        </p>

        <form className="search-form" onSubmit={handleAnalyze}>
          <input
            id="username-input"
            type="text"
            className="search-input"
            placeholder="Enter LeetCode username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            id="analyze-btn"
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Loading..." : "Analyze"}
          </button>
        </form>

        {error && <div className="error-message">⚠️ {error}</div>}
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Fetching data... First load may take up to 30 seconds (API cold start).</p>
        </div>
      )}

      {/* Results */}
      {data && !loading && (
        <div className="results-section container">

          {/* Profile + Stats */}
          <div className="grid-2">
            <ProfileCard profile={data.profile} />
            <StatsCard solved={data.solved} contest={data.contest} />
          </div>

          {/* Contest Rating Graph — only renders if user has history */}
          <RatingGraph contestHistory={data.contestHistory} />

          {/* Topic Breakdown */}
          <div className="mt-16">
            <TopicAnalysis topics={data.topics} />
          </div>

          {/* Weak Areas + Recommendations */}
          <div className="grid-2 mt-16">
            <WeakAreas weakAreas={data.weakAreas} />
            <Recommendations recommendations={data.recommendations} />
          </div>

          {/* Daily Task Planner */}
          <div className="mt-16">
            <TaskPlanner username={data.profile.username} />
          </div>
        </div>
      )}

      {/* Footer */}
      {data && (
        <div className="footer">
          Data from LeetCode's public API · Built with React, Node.js & MongoDB
        </div>
      )}
    </div>
  );
}

export default Home;
