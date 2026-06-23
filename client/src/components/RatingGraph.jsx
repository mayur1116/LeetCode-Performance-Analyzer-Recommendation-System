import { useState } from "react";

function RatingGraph({ contestHistory }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!contestHistory || contestHistory.length === 0) {
    return null;
  }

  // Chart dimensions
  const W = 700;
  const H = 250;
  const padLeft = 50;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 40; // space for x-axis labels
  const plotW = W - padLeft - padRight;
  const plotH = H - padTop - padBottom;

  // Find min and max rating
  const ratings = contestHistory.map((c) => c.rating);
  const minRating = Math.min(...ratings);
  const maxRating = Math.max(...ratings);

  // Determine grid step (50, 100, or 200 based on range)
  let rawRange = maxRating - minRating;
  if (rawRange === 0) rawRange = 100;

  let step = 50;
  if (rawRange > 1000) step = 200;
  else if (rawRange > 500) step = 100;

  // Round grid boundaries cleanly
  const gridMin = Math.floor(minRating / step) * step - step;
  const gridMax = Math.ceil(maxRating / step) * step + step;
  const ratingRange = gridMax - gridMin;

  // Generate grid steps
  const gridLines = [];
  for (let r = gridMin; r <= gridMax; r += step) {
    gridLines.push(r);
  }

  function getX(index) {
    if (contestHistory.length === 1) return padLeft + plotW / 2;
    return padLeft + (index / (contestHistory.length - 1)) * plotW;
  }

  function getY(rating) {
    return padTop + plotH - ((rating - gridMin) / ratingRange) * plotH;
  }

  // Polyline points
  const linePoints = contestHistory
    .map((c, i) => `${getX(i)},${getY(c.rating)}`)
    .join(" ");

  const firstRating = Math.round(contestHistory[0].rating);
  const lastRating = Math.round(contestHistory[contestHistory.length - 1].rating);
  const peakRating = Math.round(maxRating);

  return (
    <div className="card mt-16" style={{ position: "relative" }}>
      <p className="card-title">Contest Rating History</p>

      {/* Stats Summary */}
      <div style={{ display: "flex", gap: "20px", fontSize: "14px", marginBottom: "16px", flexWrap: "wrap" }}>
        <span>
          <span style={{ color: "var(--text-muted)" }}>Start: </span>
          <strong>{firstRating}</strong>
        </span>
        <span>
          <span style={{ color: "var(--text-muted)" }}>Current: </span>
          <strong style={{ color: "var(--accent)" }}>{lastRating}</strong>
        </span>
        <span>
          <span style={{ color: "var(--text-muted)" }}>Peak: </span>
          <strong>{peakRating}</strong>
        </span>
        <span>
          <span style={{ color: "var(--text-muted)" }}>Contests: </span>
          <strong>{contestHistory.length}</strong>
        </span>
      </div>

      <div style={{ position: "relative", width: "100%", overflowX: "auto" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", minWidth: "500px", display: "block" }}>
          
          {/* Grid Lines & Y-Axis Labels */}
          {gridLines.map((val) => {
            const y = getY(val);
            // Don't draw lines outside the plot area
            if (y < padTop || y > padTop + plotH) return null;
            return (
              <g key={val}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={padLeft + plotW}
                  y2={y}
                  stroke="var(--border)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={padLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="var(--text-muted)"
                  fontFamily="sans-serif"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* X-Axis Labels (Show first, last, and a few in between) */}
          {contestHistory.map((c, i) => {
            // Logic to prevent x-axis text overlapping: show max 5-6 labels
            const total = contestHistory.length;
            const showLabel = 
              total <= 10 || 
              i === 0 || 
              i === total - 1 || 
              (total > 10 && i % Math.ceil(total / 5) === 0);

            if (!showLabel) return null;
            return (
              <text
                key={i}
                x={getX(i)}
                y={H - 10}
                textAnchor="middle"
                fontSize="11"
                fill="var(--text-muted)"
                fontFamily="sans-serif"
              >
                C-{i + 1}
              </text>
            );
          })}

          {/* Line Chart */}
          <polyline
            points={linePoints}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {contestHistory.map((c, i) => (
            <circle
              key={i}
              cx={getX(i)}
              cy={getY(c.rating)}
              r={hoveredIndex === i ? 6 : 4}
              fill={hoveredIndex === i ? "#fff" : "var(--accent)"}
              stroke="var(--accent)"
              strokeWidth={hoveredIndex === i ? 2 : 0}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ cursor: "pointer", transition: "r 0.1s" }}
            />
          ))}
        </svg>

        {/* HTML Tooltip (Absolutely positioned over the SVG) */}
        {hoveredIndex !== null && (
          <div
            style={{
              position: "absolute",
              left: `${(getX(hoveredIndex) / W) * 100}%`,
              top: `${(getY(contestHistory[hoveredIndex].rating) / H) * 100}%`,
              transform: "translate(-50%, -120%)",
              background: "var(--card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow)",
              padding: "8px 12px",
              borderRadius: "4px",
              pointerEvents: "none", // so it doesn't block mouse events on circles
              fontSize: "12px",
              minWidth: "120px",
              textAlign: "center",
              zIndex: 10,
            }}
          >
            <div style={{ fontWeight: "bold", color: "var(--text)" }}>
              {contestHistory[hoveredIndex].contest.title}
            </div>
            <div style={{ color: "var(--accent)", marginTop: "4px", fontWeight: "600" }}>
              Rating: {Math.round(contestHistory[hoveredIndex].rating)}
            </div>
          </div>
        )}
      </div>

      <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "16px", textAlign: "center" }}>
        Each point represents one contest attended. Left is oldest, right is most recent.
      </p>
    </div>
  );
}

export default RatingGraph;
