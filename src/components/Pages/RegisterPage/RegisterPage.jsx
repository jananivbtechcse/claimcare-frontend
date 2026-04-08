

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import authService from "../../../services/authService";
import '../LoginPage/LoginPage.css'; 

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.register({
        fullName,
        email,
        password,
        phoneNumber,
        roleName: 'Patient'   
      });

      alert('Account created successfully!');
      navigate('/login');

    } catch (error) {
      console.error("FULL ERROR:", error.response?.data);
      alert(JSON.stringify(error.response?.data));
    } finally {
      setLoading(false);
    }
  };

 


  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">

        
        <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center left-panel text-white">
          <div className="text-center px-4">
           
            <h1 className="fw-bold">ClaimCare</h1>
            <p className="mt-3 fs-5">
              Medical Billing &amp; Claims Management System
            </p>
          </div>
        </div>

       
        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-light">
          <div className="card shadow-sm p-4 login-card">

            <h3 className="fw-bold mb-2">Create your account</h3>
            <p className="text-muted small mb-3">Patient self-registration</p>

            <form onSubmit={handleRegister}>

              <input
                type="text"
                className="form-control input-field mb-3"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <input
                type="email"
                className="form-control input-field mb-3"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="tel"
                className="form-control input-field mb-3"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,10}$/.test(value)) {
                    setPhoneNumber(value);
                  }
                }}
                required
              />

              <div className="position-relative mb-3">
                <input
                  type={showPassword ? 'text' : 'password'}
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

            

              <button
                type="submit"
                className="btn w-100 login-btn"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>

            </form>

            

            <p className="mt-3 text-center small">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>

           

          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;

