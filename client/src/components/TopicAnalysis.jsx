function TopicAnalysis({ topics }) {
  if (!topics || topics.length === 0) {
    return (
      <div className="card">
        <p className="card-title">Topic Breakdown</p>
        <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>No topic data available.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <p className="card-title">Topic Breakdown</p>
      <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "12px" }}>
        Topics you've solved problems in, sorted by count.
      </p>

      <div className="topic-grid">
        {topics.map((topic) => (
          <div key={topic.tagSlug} className="topic-tag">
            <span>{topic.tagName}</span>
            <span className="topic-count">{topic.problemsSolved}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopicAnalysis;
