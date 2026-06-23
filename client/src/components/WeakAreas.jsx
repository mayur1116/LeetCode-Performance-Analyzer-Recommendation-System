function WeakAreas({ weakAreas }) {
  if (!weakAreas || weakAreas.length === 0) {
    return (
      <div className="card">
        <p className="card-title">Weak Areas</p>
        <p className="no-weak">🎉 Good coverage across all attempted topics!</p>
      </div>
    );
  }

  return (
    <div className="card">
      <p className="card-title">Weak Areas</p>
      <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "12px" }}>
        Topics you've attempted but solved the fewest problems in.
      </p>

      <div className="weak-list">
        {weakAreas.map((topic, index) => (
          <div key={topic.tagSlug} className="weak-item">
            <div className="weak-left">
              <div className="weak-num">{index + 1}</div>
              <span className="weak-name">{topic.tagName}</span>
            </div>
            <span className="weak-count">{topic.problemsSolved} solved</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeakAreas;
