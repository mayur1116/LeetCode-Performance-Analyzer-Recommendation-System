function Recommendations({ recommendations }) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="card">
        <p className="card-title">Recommendations</p>
        <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>No recommendations at the moment.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <p className="card-title">Recommendations</p>
      <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "12px" }}>
        Topics to focus on based on your performance.
      </p>

      <div className="rec-list">
        {recommendations.map((rec, index) => (
          <div key={index} className={`rec-item type-${rec.type}`}>
            <div className="rec-header">
              {rec.topic}
            </div>
            <p className="rec-reason">{rec.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recommendations;
