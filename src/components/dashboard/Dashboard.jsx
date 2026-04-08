import PatientDashboard from './PatientDashboard';
import ProviderDashboard from './ProviderDashboard';
import AdminDashboard from './AdminDashboard';
import InsuranceDashboard from './InsuranceCompanyDashboard'; // ✅ correct name

const Dashboard = () => {
  const role = localStorage.getItem('role');

  if (role === 'Patient') return <PatientDashboard />;
  if (role === 'Provider') return <ProviderDashboard />;
  if (role === 'Insurance') return <InsuranceDashboard />;
  if (role === 'Admin') return <AdminDashboard />;

  return <h2 className="text-center mt-5">No Dashboard Found</h2>;
};

export default Dashboard;