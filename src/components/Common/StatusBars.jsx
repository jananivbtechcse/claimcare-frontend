const StatusBars = ({ approved, pending, rejected, total }) => {
  const pct = (n) => (total ? Math.round((n / total) * 100) : 0);
  const bars = [
    { label: "Approved", count: approved, color: "#22c55e" },
    { label: "Pending",  count: pending,  color: "#f59e0b" },
    { label: "Rejected", count: rejected, color: "#ef4444" },
  ];
  return (
    <div>
      {bars.map(({ label, count, color }) => (
        <div key={label} style={{ marginBottom: 16 }}>
          <div className="d-flex justify-content-between mb-1">
            <span style={{ fontSize: 13 }}>{label}</span>
            <span style={{ fontFamily: "monospace", fontSize: 12, color: "#94a3b8", fontWeight: 700 }}>
              {pct(count)}%
            </span>
          </div>
          <div style={{ height: 8, background: "rgba(0,0,0,0.07)", borderRadius: 4, overflow: "hidden" }}>
            <div
              style={{
                height: "100%", width: `${pct(count)}%`,
                background: color, borderRadius: 4, transition: "width 0.8s ease",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusBars;