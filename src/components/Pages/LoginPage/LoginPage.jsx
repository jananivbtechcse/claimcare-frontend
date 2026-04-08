import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from "../../../services/authService";
import './LoginPage.css'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
//       const data = await authService.login({ email, password });

      


// const role = data.role?.toLowerCase();




// localStorage.setItem("token", data.accessToken);
// localStorage.setItem("role", role);

const data = await authService.login({ email, password });

const role = data.role?.toLowerCase();

// ✅ FIX HERE
localStorage.setItem("fullName", data.companyName || data.fullName || data.name || "");
localStorage.setItem("email", data.email);

localStorage.setItem("token", data.accessToken);
localStorage.setItem("role", role);

if (role === "patient") navigate("/PatientDashboard");
else if (role === "healthcareprovider") navigate("/ProviderDashboard"); // ✅ FIXED
else if (role === "insurancecompany") navigate("/InsuranceDashboard");
else if (role === "admin") navigate("/AdminDashboard");
else navigate("/login");

    } catch (error) {
      console.error("Login error:", error.response?.data);
      alert('Invalid credentials!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">

        {/* LEFT PANEL */}
        <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center left-panel text-white">
          <div className="text-center px-4">
          
            <h1 className="fw-bold">ClaimCare</h1>
            <p className="mt-3 fs-5">
              Medical Billing & Claims Management System
            </p>
            <p className="small opacity-75">
              Streamline your healthcare claims processing with our modern platform.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-light">
          <div className="card border-0 shadow-sm p-4 login-card">

            <h3 className="fw-bold mb-1">Welcome back</h3>
            <p className="text-muted small mb-4">
              Sign in to your account to continue
            </p>

            <form onSubmit={handleLogin}>

              {/* EMAIL */}
              <div className="mb-3 position-relative">
                <input
                  type="email"
                  className="form-control input-field"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-3 position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control input-field"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="toggle-eye"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁"}
                </span>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="btn w-100 login-btn"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

            </form>

            {/* REGISTER */}
            <p className="mt-4 text-center small">
              Don't have an account?{" "}
              <Link to="/register">Sign up</Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;


