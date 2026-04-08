
import { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import adminService from "../../services/adminService";
import StatCard from "../Common/StatCard";
import MonthlyBarChart from "../Common/MonthlyBarChart";
import StatusBars from "../Common/StatusBars";
import {
  TrendingUp, FileText, Clock, CheckCircle,
  BarChart2, DollarSign, AlertTriangle,
} from "lucide-react";

const groupRevenueByMonth = (claims) => {
  const rev = Array(12).fill(0);
  claims.forEach((c) => {
    const d = c.submissionDate;                 // ← correct API field
    const m = d ? new Date(d).getMonth() : NaN;
    if (!isNaN(m)) rev[m] += c.claimAmount || 0; // ← correct API field
  });
  return rev.map((v) => Math.round(v / 1000));
};

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const AdminDashboard = () => {
  const [users,   setUsers]   = useState([]);
  const [claims,  setClaims]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

const fetchData = async () => {
  try {
    setLoading(true);
    const [u, c] = await Promise.allSettled([
      adminService.getUsers(),
      adminService.getClaims(),
    ]);
    const userList  = u.status === "fulfilled"
      ? (u.value?.items ?? (Array.isArray(u.value) ? u.value : []))
      : [];
    const claimList = c.status === "fulfilled"
      ? (c.value?.items ?? (Array.isArray(c.value) ? c.value : []))
      : [];
    setUsers(userList);
    setClaims(claimList);
  } catch (err) {
    console.error("AdminDashboard fetch error:", err);
  } finally {
    setLoading(false);
  }
};

  // Stats — all use correct API field names
  const approved     = claims.filter(c => c.status?.toLowerCase() === "approved").length;
  const pending      = claims.filter(c => c.status?.toLowerCase() === "pending").length;
  const rejected     = claims.filter(c => c.status?.toLowerCase() === "rejected").length;
  const totalAmt     = claims.reduce((s, c) => s + (c.claimAmount || 0), 0); // claimAmount
  const avgAmt       = claims.length ? Math.round(totalAmt / claims.length) : 0;
  const rejRate      = claims.length ? Math.round((rejected  / claims.length) * 100) : 0;
  const approvalRate = claims.length ? Math.round((approved  / claims.length) * 100) : 0;

  const monthlyRev = groupRevenueByMonth(claims);

  return (
    <Layout role="Admin">

      {/* Row 1 – overview */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <StatCard label="Total Users" value={loading ? "…" : users.length}
            change="" up icon={<TrendingUp size={20}/>} color="primary"/>
        </div>
        <div className="col-md-3">
          <StatCard label="Claims Processed" value={loading ? "…" : claims.length}
            change="" up icon={<FileText size={20}/>} color="success"/>
        </div>
        <div className="col-md-3">
          <StatCard label="Approval Rate" value={loading ? "…" : `${approvalRate}%`}
            change="" up icon={<CheckCircle size={20}/>} color="info"/>
        </div>
        <div className="col-md-3">
          <StatCard label="Rejection Rate" value={loading ? "…" : `${rejRate}%`}
            change="" up={false} icon={<AlertTriangle size={20}/>} color="danger"/>
        </div>
      </div>

      {/* Row 2 – financial */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <StatCard label="Total Revenue" value={loading ? "…" : `₹${(totalAmt/1000).toFixed(1)}K`}
            change="" up icon={<DollarSign size={20}/>} color="success"/>
        </div>
        <div className="col-md-4">
          <StatCard label="Avg Claim Value" value={loading ? "…" : `₹${avgAmt.toLocaleString("en-IN")}`}
            change="" up={false} icon={<Clock size={20}/>} color="warning"/>
        </div>
        <div className="col-md-4">
          <StatCard label="Total Claims" value={loading ? "…" : claims.length}
            change="" up icon={<BarChart2 size={20}/>} color="primary"/>
        </div>
      </div>

      {/* Row 3 – Revenue trend + Status bars */}
      <div className="row g-3">
        <div className="col-md-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-bold mb-1">Revenue Trend</h6>
              <p className="text-muted small mb-3">Monthly claim revenue in ₹K</p>
              {loading ? (
                <div className="text-center text-muted py-4">Loading…</div>
              ) : (
                <MonthlyBarChart data={monthlyRev} color="#22c55e" />
              )}
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-bold mb-1">Claims by Status</h6>
              <p className="text-muted small mb-3">Distribution across all claims</p>
              {loading ? (
                <div className="text-center text-muted py-4">Loading…</div>
              ) : (
                <StatusBars
                  approved={approved}
                  pending={pending}
                  rejected={rejected}
                  total={claims.length}
                />
              )}
            </div>
          </div>
        </div>
      </div>

    </Layout>
  );
};

export default AdminDashboard;