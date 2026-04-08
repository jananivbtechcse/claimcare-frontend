const ALL_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
 
export const MonthlyBarChart = ({ data = [], color = "#3b82f6" }) => {
  const max = Math.max(...data, 1);
  const months = ALL_MONTHS.slice(-data.length);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120 }}>
      {data.map((val, i) => {
        const pct = Math.round((val / max) * 100);
        const isLast = i === data.length - 1;
        return (
          <div
            key={i}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" }}
          >
            <div
              title={`${months[i]}: ${val}`}
              style={{
                width: "100%", height: `${pct}%`,
                borderRadius: "4px 4px 0 0",
                background: isLast ? color : color + "99",
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
            />
            <span style={{ fontSize: 9, color: "#94a3b8", fontFamily: "monospace" }}>{months[i]}</span>
          </div>
        );
      })}
    </div>
  );
};
export default MonthlyBarChart;