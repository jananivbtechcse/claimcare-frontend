export const StatCard = ({ label, value, change, up, icon, color = "primary" }) => {
  const colors = {
    primary: { bg: "rgba(59,130,246,0.08)",  icon: "#3b82f6" },
    success: { bg: "rgba(34,197,94,0.08)",   icon: "#22c55e" },
    warning: { bg: "rgba(245,158,11,0.08)",  icon: "#f59e0b" },
    danger:  { bg: "rgba(239,68,68,0.08)",   icon: "#ef4444" },
    info:    { bg: "rgba(99,102,241,0.08)",  icon: "#6366f1" },
  };
  const c = colors[color] || colors.primary;
 
  return (
    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
      <div className="card-body">
        <div className="d-flex align-items-start justify-content-between mb-2">
          <span className="text-muted small fw-semibold">{label}</span>
          <span
            style={{
              width: 36, height: 36, background: c.bg, color: c.icon,
              borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >{icon}</span>
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-1px", fontFamily: "monospace" }}>
          {value}
        </div>
        <div
          className="small fw-semibold mt-1"
          style={{ color: up ? "#22c55e" : "#ef4444" }}
        >
          {up ? "↑" : "↓"} {change}
        </div>
      </div>
    </div>
  );
};
export default StatCard;