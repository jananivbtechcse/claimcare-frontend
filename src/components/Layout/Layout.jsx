
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./Layout.css";

const Layout = ({ children, role }) => {
  return (
    <div className="dashboard-container">
      <Sidebar role={role} />
      <div className="main-content">
        <Navbar role={role} />
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;