

// // export default { login, register };


// import { GoogleLogin } from '@react-oauth/google';
// import api from '../api/api';

// // ✅ LOGIN
// const login = async ({ email, password }) => {
//   const resp = await api.post('/api/auth/login', {
//     email,
//     password
//   });
//   return resp.data;
// };

// // ✅ REGISTER (FIXED)
// const register = async (data) => {
//   const resp = await api.post('/api/auth/register', data);
//   return resp.data;
// };

// googleLogin: async (data) => {
//   const res = await api.post("/auth/google", data);
//   return res.data;
// }
// export default { login, register,googleLogin };

// import api from '../api/api';

// // ✅ LOGIN
// const login = async ({ email, password }) => {
//   const resp = await api.post('/api/auth/login', {
//     email,
//     password
//   });
//   return resp.data;
// };

// // ✅ REGISTER
// const register = async (data) => {
//   const resp = await api.post('/api/auth/register', data);
//   return resp.data;
// };




// // ✅ EXPORT
// export default {
//   login,
//   register,

// };


import api from '../api/api';

// ✅ LOGIN
const login = async ({ email, password }) => {
  const resp = await api.post('/api/auth/login', { email, password });
  return resp.data;
};

// ✅ REGISTER
const register = async (data) => {
  const resp = await api.post('/api/auth/register', data);
  return resp.data;
};

// ✅ STEP 1: Send OTP to email
const sendForgotPasswordOtp = async (email) => {
  const resp = await api.post('/api/auth/forgot-password/send-otp', { email });
  return resp.data;
};

// ✅ STEP 2: Verify OTP
const verifyForgotPasswordOtp = async (email, otp) => {
  const resp = await api.post('/api/auth/forgot-password/verify-otp', { email, otp });
  return resp.data;
};

// ✅ STEP 3: Reset Password
const resetPassword = async (email, otp, newPassword) => {
  const resp = await api.post('/api/auth/forgot-password/reset', { email, otp, newPassword });
  return resp.data;
};

// ✅ EXPORT
export default {
  login,
  register,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
};