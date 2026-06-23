const express = require("express");
const axios = require("axios");
const router = express.Router();

// We use the alfa-leetcode-api (community-built wrapper around LeetCode's internal GraphQL).
// Directly hitting leetcode.com/graphql from the backend is unreliable due to rate limits
// and frequent schema changes. This community API is stable and well-documented.
const BASE_URL = "https://alfa-leetcode-api.onrender.com";

// These are the core DSA topics that every competitive programmer should know.
// We use this list to identify topics the user hasn't explored at all.
const importantTopics = [
  "Array",
  "String",
  "Hash Table",
  "Linked List",
  "Stack",
  "Queue",
  "Tree",
  "Binary Tree",
  "Graph Theory",
  "Greedy",
  "Dynamic Programming",
  "Binary Search",
  "Two Pointers",
  "Depth-First Search",
  "Breadth-First Search",
  "Backtracking",
  "Sorting",
  "Recursion",
  "Sliding Window",
  "Bit Manipulation",
];

// The alfa-leetcode-api runs on Render's free tier, which spins down after inactivity.
// Cold starts can take 30-60 seconds. This helper retries once after a short wait
// so the user doesn't have to manually click Analyze twice.
async function fetchWithRetry(url, options) {
  try {
    return await axios.get(url, options);
  } catch (err) {
    // If it timed out or was a network error, wait 3 seconds and try one more time
    const isTimeout = err.code === "ECONNABORTED" || err.message.includes("timeout");
    const isNetworkErr = err.code === "ECONNRESET" || err.code === "ENOTFOUND";
    if (isTimeout || isNetworkErr) {
      console.log(`Retrying ${url} after timeout...`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return await axios.get(url, options);
    }
    throw err; // for 404s or other errors, don't retry
  }
}

// GET /api/leetcode/:username
// Fetches profile, solved stats, skill/topic data, and contest info.
// Also runs the weak area analysis and builds recommendations.
router.get("/:username", async (req, res) => {
  const { username } = req.params;

  try {
    // Make all API calls at the same time to save time.
    // Using 30s timeout because the external API can be slow on cold starts.
    const TIMEOUT = 30000;
    const [profileRes, solvedRes, skillRes, contestRes, historyRes] = await Promise.all([
      fetchWithRetry(`${BASE_URL}/${username}`, { timeout: TIMEOUT }),
      fetchWithRetry(`${BASE_URL}/${username}/solved`, { timeout: TIMEOUT }),
      fetchWithRetry(`${BASE_URL}/${username}/skill`, { timeout: TIMEOUT }),
      fetchWithRetry(`${BASE_URL}/${username}/contest`, { timeout: TIMEOUT }).catch(() => null),
      fetchWithRetry(`${BASE_URL}/${username}/contest/history`, { timeout: TIMEOUT }).catch(() => null),
      // contest and history are optional — some users have never participated
    ]);

    const profile = profileRes.data;
    const solved = solvedRes.data;
    const skill = skillRes.data;
    const contest = contestRes ? contestRes.data : null;
    // Filter to only attended contests and sort by startTime ascending (oldest first)
    // so the graph shows rating progression from left to right correctly
    let historyRaw = [];
    if (historyRes && historyRes.data) {
      historyRaw = Array.isArray(historyRes.data) ? historyRes.data : (historyRes.data.contestHistory || []);
    }
    
    const contestHistory = historyRaw
      .filter((c) => c.attended)
      .sort((a, b) => a.contest.startTime - b.contest.startTime);

    // --- Topic Analysis ---
    // The skill endpoint gives us three categories: fundamental, intermediate, advanced.
    // Each item has: { tagName, tagSlug, problemsSolved }
    // We merge them all into one flat list.

    const allTopics = [
      ...(skill.fundamental || []),
      ...(skill.intermediate || []),
      ...(skill.advanced || []),
    ];

    // Build a hash map: topic name -> problems solved count
    // This is the core data structure for the analysis
    const topicMap = {};
    for (let i = 0; i < allTopics.length; i++) {
      topicMap[allTopics[i].tagName] = allTopics[i].problemsSolved;
    }

    // --- Weak Area Detection ---
    // Sort topics by problems solved (ascending). Lowest = weakest.
    // We only consider topics where the user has solved at least 1 problem
    // because those are areas they've tried but not practiced enough.
    const attemptedTopics = allTopics.filter((t) => t.problemsSolved > 0);
    attemptedTopics.sort((a, b) => a.problemsSolved - b.problemsSolved);

    // Take the bottom 8 as weak areas to have enough data for recommendations
    const weakTopics = attemptedTopics.slice(0, 8);

    // --- Not Yet Explored Topics ---
    // Check which important topics the user has ZERO problems solved in.
    // These are also worth recommending.
    const notExplored = [];
    for (let i = 0; i < importantTopics.length; i++) {
      const topicName = importantTopics[i];
      if (!topicMap[topicName]) {
        notExplored.push(topicName);
      }
    }

    // --- Build Recommendations ---
    // Target 5-6 recommendations (min 4, max 8). Priority: Weak -> Unexplored -> Additional Weak
    const recommendations = [];

    const weakPhrases = [
      (t) => `Build fundamentals in ${t}.`,
      (t) => `Strengthen ${t} concepts.`,
      (t) => `Focus more on ${t}.`,
      (t) => `Increase practice in ${t}.`,
    ];

    // 1. Weak topics first (up to 4)
    const firstWeakLimit = Math.min(4, weakTopics.length);
    for (let i = 0; i < firstWeakLimit; i++) {
      const topic = weakTopics[i].tagName;
      const phrase = weakPhrases[i % weakPhrases.length];
      recommendations.push({
        topic: topic,
        reason: phrase(topic),
        type: "weak",
      });
    }

    // 2. Unexplored topics (fill up to 6 total recommendations)
    for (let i = 0; i < notExplored.length && recommendations.length < 6; i++) {
      const topic = notExplored[i];
      recommendations.push({
        topic: topic,
        reason: `Explore ${topic}.`,
        type: "unexplored",
      });
    }

    // 3. Additional weak topics if we still need more to hit a healthy number (up to 7 max)
    for (let i = firstWeakLimit; i < weakTopics.length && recommendations.length < 7; i++) {
      const topic = weakTopics[i].tagName;
      const phrase = weakPhrases[i % weakPhrases.length];
      recommendations.push({
        topic: topic,
        reason: phrase(topic),
        type: "weak",
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        topic: "All Clear",
        reason: "Strong coverage across topics and difficulty levels.",
        type: "strong",
      });
    }

    // --- Build the final response object ---
    const result = {
      profile: {
        username: profile.username,
        name: profile.name || profile.username,
        avatar: profile.avatar,
        ranking: profile.ranking,
        country: profile.country,
        company: profile.company,
        school: profile.school,
        about: profile.about,
      },
      solved: {
        total: solved.solvedProblem || 0,
        easy: solved.easySolved || 0,
        medium: solved.mediumSolved || 0,
        hard: solved.hardSolved || 0,
      },
      contest: contest
        ? {
            attended: contest.contestAttend || 0,
            rating: contest.contestRating ? Math.round(contest.contestRating) : null,
            globalRanking: contest.contestGlobalRanking || null,
            topPercentage: contest.contestTopPercentage || null,
          }
        : null,
      // All topics sorted by problems solved (descending) for display
      topics: allTopics.sort((a, b) => b.problemsSolved - a.problemsSolved),
      weakAreas: weakTopics,
      recommendations: recommendations,
      contestHistory: contestHistory,
    };

    res.json(result);
  } catch (error) {
    // If the API call fails (user not found, network error, etc.)
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: "LeetCode user not found. Please check the username." });
    }

    console.error("Error fetching LeetCode data:", error.message);
    res.status(500).json({
      error:
        "Could not fetch data. The LeetCode API might be waking up from sleep (Render free tier). " +
        "Please wait 10 seconds and try again.",
    });
  }
});

module.exports = router;
