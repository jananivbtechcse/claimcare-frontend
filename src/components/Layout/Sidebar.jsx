
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo3.png";

const Sidebar = ({ role }) => {
  const location = useLocation();

  const menus = {
    patient: [
      { name: "Dashboard",        path: "/PatientDashboard" },
      { name: "Insurance Plans",  path: "/patient/insurance-plans" },
      { name: "Invoice Requests", path: "/patient/invoice-requests" },
      { name: "Invoices",         path: "/patient/invoices" },
      { name: "Submit Claim",     path: "/patient/submit-claim" },
      
    ],
    provider: [
      { name: "Dashboard",        path: "/ProviderDashboard" },
      { name: "Invoice Requests", path: "/provider/invoice-requests" },
      { name: "Invoices",         path: "/provider/invoices" },
      { name: "Claims",           path: "/provider/claims" },
    ],
    insurance: [
      { name: "Dashboard",        path: "/InsuranceDashboard" },
      { name: "Manage Plans",     path: "/insurance/manage-plans" },
      { name: "Payments",         path: "/payment" },
    ],
    admin: [
      { name: "Dashboard",        path: "/AdminDashboard" },
      { name: "Users",            path: "/admin/users" },
      { name: "All Claims",       path: "/admin/claims" },
    ],
  };

  const getRoleKey = (role) => {
    const r = (role || "").toLowerCase();
    if (r.includes("insurance")) return "insurance";
    if (r.includes("provider"))  return "provider";
    if (r.includes("patient"))   return "patient";
    if (r.includes("admin"))     return "admin";
    return r;
  };

  const menuItems = menus[getRoleKey(role)] || [];

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <img src={logo} alt="Logo" style={{ width: "40px", height: "40px" }} />
        <h4 className="logo">ClaimCare</h4>
      </div>
      <ul className="menu">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={location.pathname === item.path ? "active" : ""}
          >
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;