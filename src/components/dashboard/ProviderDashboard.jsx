

// import { useEffect, useState, useCallback } from "react";
// import api from "../../api/api";
// import providerService from "../../services/ProviderService";
// import Layout from "../Layout/Layout";
// import Paginator from "../Common/Paginator";

// const PAGE_SIZE = 10;


// const normalisePatient = (p) => ({
  
//   patientId: p.patientId ?? p.PatientId ?? p.id ?? p.Id ?? "—",


//   name:
//     p.name          ||
//     p.Name          ||
//     p.fullName      ||
//     p.FullName      ||
//     p.patientName   ||
//     p.PatientName   ||
//     (p.firstName && p.lastName
//       ? `${p.firstName} ${p.lastName}`.trim()
//       : null)       ||
//     (p.FirstName && p.LastName
//       ? `${p.FirstName} ${p.LastName}`.trim()
//       : null)       ||
//     "—",

  
//   age:
//     p.age    ??
//     p.Age    ??
//     (p.dateOfBirth || p.DateOfBirth
//       ? Math.floor(
//           (Date.now() - new Date(p.dateOfBirth || p.DateOfBirth)) /
//           (1000 * 60 * 60 * 24 * 365.25)
//         )
//       : null),

  
//   gender: p.gender || p.Gender || "—",

  
//   email:  p.email  || p.Email  || "",
//   phone:  p.phone  || p.Phone  || p.phoneNumber || p.PhoneNumber || "",
// });

// export default function ProviderDashboard() {
//   const [stats,    setStats]    = useState({ totalPatients: 0, invoices: 0, claims: 0, notifications: 0 });
//   const [patients, setPatients] = useState([]);
//   const [search,   setSearch]   = useState("");
//   const [loading,  setLoading]  = useState(true);
//   const [page,     setPage]     = useState(1);

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const [patientsRes, claimsRes, invoicesRes, unread] = await Promise.all([
//         api.get("/api/HealthcareProvider/my-patients"),
//         providerService.getClaims(),
//         providerService.getMyInvoices(),
//         providerService.getUnreadCount(),
//       ]);

      
//       const rawList = Array.isArray(patientsRes.data)
//         ? patientsRes.data
//         : patientsRes.data?.items     ??
//           patientsRes.data?.patients  ??
//           patientsRes.data?.data      ??
//           [];


//       const seen = new Set();
//       const uniquePatients = rawList
//         .map(normalisePatient)
//         .filter((p) => {
//           const key = String(p.patientId);
//           if (seen.has(key)) return false;
//           seen.add(key);
//           return true;
//         });

     
//       const invoiceCount =
//         Array.isArray(invoicesRes)
//           ? invoicesRes.length
//           : invoicesRes?.items?.length ?? invoicesRes?.data?.length ?? 0;

 
//       const claimsCount =
//         Array.isArray(claimsRes)
//           ? claimsRes.length
//           : claimsRes?.items?.length ?? claimsRes?.data?.length ?? 0;

//       setPatients(uniquePatients);
//       setStats({
//         totalPatients: uniquePatients.length,
//         invoices:      invoiceCount,
//         claims:        claimsCount,
//         notifications: unread ?? 0,
//       });
//     } catch (err) {
//       console.error("ProviderDashboard load error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { load(); }, [load]);

//   const filtered = patients.filter((p) => {
//     if (!search) return true;
//     const s = search.toLowerCase();
//     return (
//       p.name.toLowerCase().includes(s) ||
//       String(p.patientId).toLowerCase().includes(s) ||
//       (p.email || "").toLowerCase().includes(s)
//     );
//   });

//   const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
//   const visible    = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

//   const handleSearch = (val) => { setSearch(val); setPage(1); };

//   const statCards = [
//     { label: "Total Patients",     value: stats.totalPatients, sub: null,                             subClass: "" },
//     { label: "Invoices Generated", value: stats.invoices,      sub: null,                             subClass: "" },
//     { label: "Claims Submitted",   value: stats.claims,        sub: null,                             subClass: "" },
//     { label: "Notifications",      value: stats.notifications, sub: `${stats.notifications} unread`,  subClass: "text-warning" },
//   ];

//   return (
//     <Layout role="provider">
//       <div className="mb-4">
//         <h4 className="fw-bold mb-1">Provider Dashboard</h4>
//       </div>

     
//       <div className="row g-3 mb-4">
//         {statCards.map((card) => (
//           <div key={card.label} className="col-6 col-md-3">
//             <div className="card border-0 shadow-sm h-100">
//               <div className="card-body">
//                 <p className="text-muted small mb-1">{card.label}</p>
//                 <h3 className="fw-bold mb-1">{card.value}</h3>
//                 {card.sub && <small className={card.subClass}>{card.sub}</small>}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

      
//       <div className="card border-0 shadow-sm">
//         <div className="card-header bg-white d-flex justify-content-between align-items-center py-3 flex-wrap gap-2">
//           <div>
//             <h6 className="fw-bold mb-0">My Patients</h6>
//             <small className="text-muted">{patients.length} patient{patients.length !== 1 ? "s" : ""} assigned to you</small>
//           </div>
//           <input
//             className="form-control"
//             style={{ maxWidth: 260 }}
//             placeholder="Search by name, ID or email…"
//             value={search}
//             onChange={(e) => handleSearch(e.target.value)}
//           />
//         </div>

//         <div className="table-responsive">
//           <table className="table table-hover align-middle mb-0">
//             <thead className="table-light">
//               <tr>
//                 <th>#</th>
//                 <th>Patient Name</th>
//                 <th>Patient ID</th>
                
//                 <th>Email</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={6} className="text-center py-5">
//                     <div className="spinner-border spinner-border-sm text-primary me-2" />
//                     Loading…
//                   </td>
//                 </tr>
//               ) : visible.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="text-center py-5 text-muted">
//                     {search ? "No patients match your search." : "No patients assigned yet."}
//                   </td>
//                 </tr>
//               ) : (
//                 visible.map((p, idx) => (
//                   <tr key={`${p.patientId}-${idx}`}>
//                     <td className="text-muted">{(page - 1) * PAGE_SIZE + idx + 1}</td>
//                     <td className="fw-semibold">{p.name}</td>
//                     <td className="text-muted small">{p.patientId}</td>
                    
//                     <td className="text-muted small">{p.email || "—"}</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         <Paginator
//           page={page}
//           totalPages={totalPages}
//           totalCount={filtered.length}
//           pageSize={PAGE_SIZE}
//           onPageChange={setPage}
//         />
//       </div>
//     </Layout>
//   );
// }



import { useEffect, useState, useCallback } from "react";
import api from "../../api/api";
import providerService from "../../services/ProviderService";
import Layout from "../Layout/Layout";
import Paginator from "../Common/Paginator";

const PAGE_SIZE = 10;

const normalisePatient = (p) => ({
  patientId: p.patientId ?? p.PatientId ?? p.id ?? p.Id ?? "—",
  name:
    p.name || p.Name || p.fullName || p.FullName ||
    p.patientName || p.PatientName ||
    (p.firstName && p.lastName ? `${p.firstName} ${p.lastName}`.trim() : null) ||
    (p.FirstName && p.LastName ? `${p.FirstName} ${p.LastName}`.trim() : null) ||
    "—",
  age:
    p.age ?? p.Age ??
    (p.dateOfBirth || p.DateOfBirth
      ? Math.floor((Date.now() - new Date(p.dateOfBirth || p.DateOfBirth)) / (1000 * 60 * 60 * 24 * 365.25))
      : null),
  gender: p.gender || p.Gender || "—",
  email: p.email || p.Email || "",
  phone: p.phone || p.Phone || p.phoneNumber || p.PhoneNumber || "",
});

/* ── design tokens ─────────────────────────────────────────────────────────── */
const C = {
  blue:       "#1558E8",
  bluePale:   "#EBF1FF",
  green:      "#0F9651",
  greenPale:  "#E5F7EE",
  violet:     "#6D28D9",
  violetPale: "#F0EBFF",
  amber:      "#C27C0E",
  amberPale:  "#FEF5E0",
  ink:        "#0D1117",
  inkMid:     "#4B5563",
  inkLight:   "#9CA3AF",
  border:     "#E5E7EB",
  surface:    "#FFFFFF",
  page:       "#F3F4F6",
};

/* ── Avatar ─────────────────────────────────────────────────────────────────── */
const Avatar = ({ name, size = 38 }) => {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  const palette = [
    { bg: "#DBEAFE", fg: "#1E3A8A" },
    { bg: "#D1FAE5", fg: "#064E3B" },
    { bg: "#EDE9FE", fg: "#3B0764" },
    { bg: "#FEF3C7", fg: "#78350F" },
    { bg: "#FCE7F3", fg: "#701A75" },
    { bg: "#CFFAFE", fg: "#0C4A6E" },
  ];
  const col = palette[name.charCodeAt(0) % palette.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: col.bg, color: col.fg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: Math.round(size * 0.35), fontWeight: 700, letterSpacing: 0.5,
    }}>
      {initials || "?"}
    </div>
  );
};

/* ── Icon set ───────────────────────────────────────────────────────────────── */
const IconPatients = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconInvoice = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const IconClaims = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.inkLight} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

/* ── StatCard ───────────────────────────────────────────────────────────────── */
const StatCard = ({ icon, label, value, sub, subColor, accent, pale, delay }) => (
  <div style={{
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 16,
    padding: "22px 22px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    animation: `fadeUp 0.4s ${delay}ms both ease-out`,
    transition: "box-shadow 0.2s",
  }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.07)"}
    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
  >
    <div style={{
      width: 44, height: 44, borderRadius: 12,
      background: pale, color: accent,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {icon}
    </div>
    <div>
      <p style={{ margin: "0 0 4px", fontSize: 12.5, fontWeight: 500, color: C.inkMid, letterSpacing: 0.1 }}>
        {label}
      </p>
      <p style={{ margin: 0, fontSize: 34, fontWeight: 700, color: C.ink, lineHeight: 1, letterSpacing: -1 }}>
        {value}
      </p>
      {sub && (
        <p style={{ margin: "7px 0 0", fontSize: 11.5, fontWeight: 500, color: subColor || C.inkLight }}>
          {sub}
        </p>
      )}
    </div>
  </div>
);

/* ── Main component ─────────────────────────────────────────────────────────── */
export default function ProviderDashboard() {
  const [stats,    setStats]    = useState({ totalPatients: 0, invoices: 0, claims: 0, notifications: 0 });
  const [patients, setPatients] = useState([]);
  const [search,   setSearch]   = useState("");
  const [loading,  setLoading]  = useState(true);
  const [page,     setPage]     = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [patientsRes, claimsRes, invoicesRes, unread] = await Promise.all([
        api.get("/api/HealthcareProvider/my-patients"),
        providerService.getClaims(),
        providerService.getMyInvoices(),
        providerService.getUnreadCount(),
      ]);
      const rawList = Array.isArray(patientsRes.data)
        ? patientsRes.data
        : patientsRes.data?.items ?? patientsRes.data?.patients ?? patientsRes.data?.data ?? [];
      const seen = new Set();
      const uniquePatients = rawList.map(normalisePatient).filter((p) => {
        const key = String(p.patientId);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      const invoiceCount = Array.isArray(invoicesRes) ? invoicesRes.length : invoicesRes?.items?.length ?? invoicesRes?.data?.length ?? 0;
      const claimsCount  = Array.isArray(claimsRes)  ? claimsRes.length  : claimsRes?.items?.length  ?? claimsRes?.data?.length  ?? 0;
      setPatients(uniquePatients);
      setStats({ totalPatients: uniquePatients.length, invoices: invoiceCount, claims: claimsCount, notifications: unread ?? 0 });
    } catch (err) {
      console.error("ProviderDashboard load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = patients.filter((p) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return p.name.toLowerCase().includes(s) || String(p.patientId).toLowerCase().includes(s) || (p.email || "").toLowerCase().includes(s);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible    = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const handleSearch = (val) => { setSearch(val); setPage(1); };

  const CARDS = [
    { icon: <IconPatients />, label: "Total Patients",     value: stats.totalPatients, sub: null,                            subColor: null,    accent: C.blue,   pale: C.bluePale,   delay: 0   },
    { icon: <IconInvoice />,  label: "Invoices Generated", value: stats.invoices,      sub: null,                            subColor: null,    accent: C.green,  pale: C.greenPale,  delay: 60  },
    { icon: <IconClaims />,   label: "Claims Submitted",   value: stats.claims,        sub: null,                            subColor: null,    accent: C.violet, pale: C.violetPale, delay: 120 },
    { icon: <IconBell />,     label: "Notifications",      value: stats.notifications, sub: `${stats.notifications} unread`, subColor: C.amber, accent: C.amber,  pale: C.amberPale,  delay: 180 },
  ];

  const TH = {
    fontSize: 11, fontWeight: 600, color: C.inkLight,
    textTransform: "uppercase", letterSpacing: "0.6px",
    padding: "12px 20px", textAlign: "left",
    borderBottom: `1px solid ${C.border}`,
    background: "#FAFAFA", whiteSpace: "nowrap",
  };
  const TD = { padding: "14px 20px", borderBottom: `1px solid ${C.border}`, verticalAlign: "middle" };

  return (
    <Layout role="provider">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
        .pd * { font-family: 'Outfit', sans-serif; box-sizing: border-box; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .pd-tr:hover td { background: #F9FAFB; }
        .pd-search:focus {
          outline: none;
          border-color: ${C.blue} !important;
          box-shadow: 0 0 0 3px ${C.bluePale};
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="pd" style={{ padding: "8px 0 48px", minHeight: "100vh" }}>

        {/* heading */}
        <div style={{ marginBottom: 32, animation: "fadeUp 0.35s ease both" }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: C.ink, margin: 0, letterSpacing: -0.6 }}>
            Provider Dashboard
          </h1>
          <p style={{ fontSize: 14, color: C.inkMid, margin: "6px 0 0", fontWeight: 400 }}>
            Welcome back — here's an overview of your patients and activity.
          </p>
        </div>

        {/* stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 16, marginBottom: 28 }}>
          {CARDS.map((c) => <StatCard key={c.label} {...c} />)}
        </div>

        {/* patients table */}
        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          overflow: "hidden",
          animation: "fadeUp 0.4s 220ms both ease-out",
        }}>

          {/* top bar */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: 12, padding: "20px 24px",
            borderBottom: `1px solid ${C.border}`,
          }}>
            <div>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.ink, letterSpacing: -0.2 }}>My Patients</p>
              <p style={{ margin: "3px 0 0", fontSize: 13, color: C.inkMid }}>
                {loading ? "Loading…" : `${patients.length} patient${patients.length !== 1 ? "s" : ""} assigned to you`}
              </p>
            </div>

            {/* search */}
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", lineHeight: 0 }}>
                <IconSearch />
              </span>
              <input
                className="pd-search"
                style={{
                  paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
                  fontSize: 13.5, border: `1px solid ${C.border}`, borderRadius: 10,
                  background: "#FAFAFA", color: C.ink, width: 260,
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
                placeholder="Search by name, ID or email…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ ...TH, width: 52  }}>#</th>
                  <th style={{ ...TH            }}>Patient Name</th>
                  <th style={{ ...TH, width: 180 }}>Patient ID</th>
                  <th style={{ ...TH            }}>Email</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "64px 0" }}>
                      <div style={{
                        display: "inline-block", width: 22, height: 22,
                        border: `2.5px solid ${C.blue}`, borderTopColor: "transparent",
                        borderRadius: "50%", animation: "spin 0.7s linear infinite",
                        verticalAlign: "middle", marginRight: 10,
                      }} />
                      <span style={{ fontSize: 14, color: C.inkMid }}>Loading patients…</span>
                    </td>
                  </tr>
                ) : visible.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "72px 0" }}>
                      <p style={{ margin: "0 0 8px", fontSize: 30 }}>🔍</p>
                      <p style={{ margin: 0, fontSize: 14, color: C.inkMid, fontWeight: 500 }}>
                        {search ? "No patients match your search." : "No patients assigned yet."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  visible.map((p, idx) => (
                    <tr key={`${p.patientId}-${idx}`} className="pd-tr" style={{ transition: "background 0.1s" }}>
                      <td style={{ ...TD, fontSize: 12.5, color: C.inkLight, fontWeight: 500 }}>
                        {(page - 1) * PAGE_SIZE + idx + 1}
                      </td>
                      <td style={TD}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <Avatar name={p.name} />
                          <div>
                            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.ink }}>{p.name}</p>
                            {p.gender !== "—" && (
                              <p style={{ margin: "2px 0 0", fontSize: 12, color: C.inkLight }}>{p.gender}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={TD}>
                        <span style={{
                          display: "inline-block",
                          background: "#F3F4F6",
                          border: `1px solid ${C.border}`,
                          borderRadius: 6, padding: "3px 10px",
                          fontSize: 12, fontFamily: "'Courier New', monospace",
                          color: C.inkMid, letterSpacing: 0.4,
                        }}>
                          {p.patientId}
                        </span>
                      </td>
                      <td style={{ ...TD, fontSize: 13.5 }}>
                        {p.email
                          ? <a href={`mailto:${p.email}`} style={{ color: C.blue, textDecoration: "none", fontWeight: 500 }}>{p.email}</a>
                          : <span style={{ color: C.inkLight }}>—</span>
                        }
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={{ padding: "4px 8px" }}>
            <Paginator page={page} totalPages={totalPages} totalCount={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </div>
        </div>

      </div>
    </Layout>
  );
}