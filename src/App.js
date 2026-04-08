

import { Routes, Route, Navigate } from "react-router-dom";

// Auth
import LoginPage    from "./components/Pages/LoginPage/LoginPage";
import RegisterPage from "./components/Pages/RegisterPage/RegisterPage";

// Dashboards
import PatientDashboard          from "./components/dashboard/PatientDashboard";
import ProviderDashboard         from "./components/dashboard/ProviderDashboard";
import AdminDashboard            from "./components/dashboard/AdminDashboard";
import InsuranceCompanyDashboard from "./components/dashboard/InsuranceCompanyDashboard";

// Admin pages
import AdminUsers  from "./components/Pages/Admin/AdminUsers";
import AdminClaims from "./components/Pages/Admin/AdminClaims";

// Patient pages
import SubmitClaimPage     from "./components/Pages/Patient/SubmitClaimPage";
import ClaimsPage          from "./components/Pages/Patient/ClaimsPage";
import InvoicesPage        from "./components/Pages/Patient/InvoicesPage";
import InvoiceRequestsPage from "./components/Pages/Patient/InvoiceRequestsPage";
import PaymentsPage        from "./components/Pages/Patient/PaymentsPage";
import InsurancePlansPage  from "./components/Pages/Patient/InsurancePlansPage";
import ProfilePage         from "./components/Pages/Patient/ProfilePage";

// Payment gateway page (shared)
import PaymentPage from "./components/Pages/InsuranceCompany/PaymentPage";

// Provider pages
import ProviderInvoiceRequestsPage from "./components/Pages/Provider/InvoicerRequests";
import ProviderInvoicesPage        from "./components/Pages/Provider/Invoices";
import ProviderClaimsPage          from "./components/Pages/Provider/Claims";
import ProviderProfilePage         from "./components/Pages/Provider/ProviderProfilePage";

// Insurance Company pages
import ManagePlans                 from "./components/Pages/InsuranceCompany/ManagePlans";
import InsuranceCompanyProfilePage from "./components/Pages/InsuranceCompany/InsuranceCompanyProfilePage";

// ── Roles ─────────────────────────────────────────────────────────────────────
const ROLES = {
  PATIENT:   "Patient",
  PROVIDER:  "healthcareprovider",
  INSURANCE: "InsuranceCompany",
  ADMIN:     "Admin",
};

// ── Private Route ─────────────────────────────────────────────────────────────
function PrivateRoute({ children, allowedRoles }) {
  const role = localStorage.getItem("role");
  if (!role) return <Navigate to="/login" replace />;

  const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const hasAccess = allowed.some(
    (r) => r.toLowerCase() === role.toLowerCase()
  );

  if (!hasAccess) {
    console.warn("Access Denied — role:", role, "| expected one of:", allowed);
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>

      {/* Auth */}
      <Route path="/"         element={<LoginPage />} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Patient */}
      <Route path="/PatientDashboard" element={
        <PrivateRoute allowedRoles={ROLES.PATIENT}>
          <PatientDashboard />
        </PrivateRoute>
      } />
      <Route path="/patient/profile" element={
        <PrivateRoute allowedRoles={ROLES.PATIENT}>
          <ProfilePage />
        </PrivateRoute>
      } />
      <Route path="/patient/submit-claim" element={
        <PrivateRoute allowedRoles={ROLES.PATIENT}>
          <SubmitClaimPage />
        </PrivateRoute>
      } />
      <Route path="/patient/claims" element={
        <PrivateRoute allowedRoles={ROLES.PATIENT}>
          <ClaimsPage />
        </PrivateRoute>
      } />
      <Route path="/patient/invoices" element={
        <PrivateRoute allowedRoles={ROLES.PATIENT}>
          <InvoicesPage />
        </PrivateRoute>
      } />
      <Route path="/patient/invoice-requests" element={
        <PrivateRoute allowedRoles={ROLES.PATIENT}>
          <InvoiceRequestsPage />
        </PrivateRoute>
      } />
      <Route path="/patient/payments" element={
        <PrivateRoute allowedRoles={ROLES.PATIENT}>
          <PaymentsPage />
        </PrivateRoute>
      } />
      <Route path="/patient/insurance-plans" element={
        <PrivateRoute allowedRoles={ROLES.PATIENT}>
          <InsurancePlansPage />
        </PrivateRoute>
      } />

      {/* Payment Gateway — shared between Patient and InsuranceCompany */}
      <Route path="/payment" element={
        <PrivateRoute allowedRoles={[ROLES.PATIENT, ROLES.INSURANCE]}>
          <PaymentPage />
        </PrivateRoute>
      } />

      {/* Provider */}
      <Route path="/ProviderDashboard" element={
        <PrivateRoute allowedRoles={ROLES.PROVIDER}>
          <ProviderDashboard />
        </PrivateRoute>
      } />
      <Route path="/provider/profile" element={
        <PrivateRoute allowedRoles={ROLES.PROVIDER}>
          <ProviderProfilePage />
        </PrivateRoute>
      } />
      <Route path="/provider/invoice-requests" element={
        <PrivateRoute allowedRoles={ROLES.PROVIDER}>
          <ProviderInvoiceRequestsPage />
        </PrivateRoute>
      } />
      <Route path="/provider/invoices" element={
        <PrivateRoute allowedRoles={ROLES.PROVIDER}>
          <ProviderInvoicesPage />
        </PrivateRoute>
      } />
      <Route path="/provider/claims" element={
        <PrivateRoute allowedRoles={ROLES.PROVIDER}>
          <ProviderClaimsPage />
        </PrivateRoute>
      } />

      {/* Admin */}
      <Route path="/AdminDashboard" element={
        <PrivateRoute allowedRoles={ROLES.ADMIN}>
          <AdminDashboard />
        </PrivateRoute>
      } />
      <Route path="/admin/users" element={
        <PrivateRoute allowedRoles={ROLES.ADMIN}>
          <AdminUsers />
        </PrivateRoute>
      } />
      <Route path="/admin/claims" element={
        <PrivateRoute allowedRoles={ROLES.ADMIN}>
          <AdminClaims />
        </PrivateRoute>
      } />

      {/* Insurance Company */}
      <Route path="/InsuranceDashboard" element={
        <PrivateRoute allowedRoles={ROLES.INSURANCE}>
          <InsuranceCompanyDashboard />
        </PrivateRoute>
      } />
      <Route path="/insurance/profile" element={
        <PrivateRoute allowedRoles={ROLES.INSURANCE}>
          <InsuranceCompanyProfilePage />
        </PrivateRoute>
      } />
      <Route path="/insurance/manage-plans" element={
        <PrivateRoute allowedRoles={ROLES.INSURANCE}>
          <ManagePlans />
        </PrivateRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}

export default App;