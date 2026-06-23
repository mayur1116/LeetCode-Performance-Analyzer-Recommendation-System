# LeetCode Performance Analyzer

A full-stack MERN application that analyzes your LeetCode profile — shows your solved problem statistics, topic-wise breakdown, weak area detection, and personalized recommendations. Also includes a daily task planner to track your practice goals.

Built as a personal project for internship applications.

---

## Tech Stack

| Layer     | Technology                         |
|-----------|------------------------------------|
| Frontend  | React.js (Vite), Axios, CSS        |
| Backend   | Node.js, Express.js                |
| Database  | MongoDB (Mongoose)                 |
| Data Source | [alfa-leetcode-api](https://github.com/alfaarghya/alfa-leetcode-api) — community wrapper around LeetCode's internal GraphQL API |

---

## Features

- **Profile Overview** — Name, avatar, global ranking, country
- **Solved Statistics** — Total, Easy, Medium, Hard counts with visual progress bars
- **Contest Info** — Rating, global rank, percentile (if you've participated)
- **Topic Breakdown** — All topics you've solved problems in, sorted by count
- **Weak Area Detection** — Topics you've practiced the least
- **Recommendations** — Topics to focus on next, with reasons
- **Daily Task Planner** — Add, complete, and delete tasks stored in MongoDB

---

## How the Recommendation Logic Works

This is simple and easy to explain in an interview:

1. The LeetCode API returns topics the user has solved, split into: `fundamental`, `intermediate`, `advanced`.
2. Each topic has a `problemsSolved` count.
3. We merge all topics into one array and **sort by `problemsSolved` ascending**.
4. The **bottom 5** topics = weak areas (least practiced).
5. We also have a hardcoded list of important DSA topics. Any topic in that list that the user has 0 problems in = **unexplored**, also recommended.
6. Final recommendations = weak areas first, then unexplored topics.

```js
// Example — this is literally what the backend does:
attemptedTopics.sort((a, b) => a.problemsSolved - b.problemsSolved);
const weakTopics = attemptedTopics.slice(0, 5);
```

No ML, no complex scoring formulas — just sorting and array slicing.

---

## Folder Structure

```
leetcode-analyzer/
├── client/                         ← React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProfileCard.jsx     ← Shows avatar, name, ranking
│   │   │   ├── StatsCard.jsx       ← Solved counts + difficulty bars + contest
│   │   │   ├── TopicAnalysis.jsx   ← All topics as badges
│   │   │   ├── WeakAreas.jsx       ← Bottom 5 topics
│   │   │   ├── Recommendations.jsx ← Practice suggestions
│   │   │   └── TaskPlanner.jsx     ← Daily to-do list
│   │   ├── pages/
│   │   │   └── Home.jsx            ← Main page, holds all state
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── server/                         ← Express backend
    ├── models/
    │   └── Task.js                 ← MongoDB schema for planner tasks
    ├── routes/
    │   ├── leetcode.js             ← Fetches LeetCode data + recommendation logic
    │   └── tasks.js                ← CRUD routes for task planner
    ├── db.js                       ← MongoDB connection
    ├── server.js                   ← App entry point
    ├── .env.example
    └── package.json
```

---

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB running locally (or a MongoDB Atlas connection string)

### 1. Clone and navigate

```bash
git clone <your-repo-url>
cd leetcode-analyzer
```

### 2. Backend Setup

1. Open a terminal and navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to a new file called `.env`.
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and replace the placeholder with your actual MongoDB Atlas connection string:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/myDatabase?retryWrites=true&w=majority
   ```
   *(Note: This application works with any MongoDB connection, local or Atlas).*

4. Start the backend:
```bash
npm run dev
```

The server will run on **http://localhost:5000**

### 3. Set up the frontend

In a new terminal:

```bash
cd client
npm install
npm run dev
```

The React app will run on **http://localhost:3000**

### 4. Open the app

Visit **http://localhost:3000**, enter any LeetCode username, and click Analyze.

---

## API Routes

### LeetCode
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/leetcode/:username` | Fetch profile, stats, topics, recommendations |

### Tasks (Daily Planner)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/tasks/:username` | Get all tasks for a user |
| POST | `/api/tasks` | Create a new task |
| PATCH | `/api/tasks/:id` | Toggle task completed |
| DELETE | `/api/tasks/:id` | Delete a task |

---

## MongoDB Schema

```js
// Task document
{
  username: String,    // LeetCode username
  text: String,        // Task description
  completed: Boolean,  // Default: false
  createdAt: Date      // Auto-set on creation
}
```

---

## Data Source Note

LeetCode does not have an official public API. This project uses [alfa-leetcode-api](https://github.com/alfaarghya/alfa-leetcode-api), a community-built REST wrapper around LeetCode's internal GraphQL endpoint. The backend proxies all calls to this API, so the frontend never directly calls LeetCode.

Data available via this API:
- ✅ Profile info (name, avatar, ranking, country)
- ✅ Solved counts by difficulty (Easy / Medium / Hard)
- ✅ Topic-wise solved counts (fundamental / intermediate / advanced)
- ✅ Contest rating and global ranking

---

## Interview Talking Points

If asked about this project in an interview, here's what to say:

- **Why proxy through the backend?** — To avoid CORS errors and to keep the LeetCode API calls server-side, which is a better security practice.
- **How does the recommendation work?** — Simple sorting. I merge all topics into one array, sort by problems solved count ascending, and take the bottom 5 as weak areas.
- **Why use this community API instead of LeetCode's GraphQL directly?** — LeetCode's internal GraphQL schema changes frequently. The community API is more stable and already handles the query formatting.
- **Why MongoDB for tasks?** — Tasks need to persist across sessions. MongoDB + Mongoose makes it easy to store, query, and update documents with minimal setup.
- **Why Vite instead of CRA?** — Vite is faster in development, the modern standard, and simpler to configure.

---

## Author

Built by a B.Tech student as a full-stack MERN internship project.
