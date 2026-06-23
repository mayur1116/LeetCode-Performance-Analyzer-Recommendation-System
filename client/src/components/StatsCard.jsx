function StatsCard({ solved, contest }) {
  const total = solved.total || 0;
  const easy = solved.easy || 0;
  const medium = solved.medium || 0;
  const hard = solved.hard || 0;

  // Width of each bar relative to total solved
  function barWidth(count) {
    if (total === 0) return "0%";
    return `${Math.min((count / total) * 100, 100)}%`;
  }

  return (
    <div className="card hover-card">
      <p className="card-title">Solved Problems</p>

      <div className="total-number">{total}</div>
      <div className="total-label">problems solved</div>

      {/* Difficulty breakdown */}
      <div className="diff-row">
        <div className="diff-top">
          <span className="diff-label easy">Easy</span>
          <span className="diff-count">{easy}</span>
        </div>
        <div className="bar-bg">
          <div className="bar-fill easy-bg" style={{ width: barWidth(easy) }}></div>
        </div>
      </div>

      <div className="diff-row">
        <div className="diff-top">
          <span className="diff-label medium">Medium</span>
          <span className="diff-count">{medium}</span>
        </div>
        <div className="bar-bg">
          <div className="bar-fill medium-bg" style={{ width: barWidth(medium) }}></div>
        </div>
      </div>

      <div className="diff-row">
        <div className="diff-top">
          <span className="diff-label hard">Hard</span>
          <span className="diff-count">{hard}</span>
        </div>
        <div className="bar-bg">
          <div className="bar-fill hard-bg" style={{ width: barWidth(hard) }}></div>
        </div>
      </div>

      {/* Contest section — only if user has a rating */}
      {contest && contest.rating && (
        <>
          <hr className="divider" />
          <p className="card-title">Contest</p>
          <div className="contest-grid">
            <div className="contest-box">
              <div className="contest-val">{contest.rating}</div>
              <div className="contest-lbl">Rating</div>
            </div>
            <div className="contest-box">
              <div className="contest-val">{contest.attended}</div>
              <div className="contest-lbl">Attended</div>
            </div>
            {contest.globalRanking && (
              <div className="contest-box">
                <div className="contest-val">#{contest.globalRanking.toLocaleString()}</div>
                <div className="contest-lbl">Global Rank</div>
              </div>
            )}
            {contest.topPercentage && (
              <div className="contest-box">
                <div className="contest-val">Top {contest.topPercentage.toFixed(1)}%</div>
                <div className="contest-lbl">Percentile</div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default StatsCard;
