import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux'
import { setError, setSuccess } from '../auth.slice';
import Loader from '../../../shared/Loader';
import Toaster from '../../../shared/Toaster';
import Logo from "../../../shared/Logo";

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { login, sendResetLink } = useAuth()
  const { user, loading, error, success } = useSelector((state) => state.auth)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetLinkModal, setResetLinkModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [toasterTitle , setToasterTitle] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) {
      navigate("/");
    } else {
      setToasterTitle("Login failed")
    }
  };

  const handleResetLink = async (e) => {
    e.preventDefault();
    const success = await sendResetLink({email: resetEmail})
    if(success){
      setResetLinkModal(false)
      setToasterTitle("Reset link sent successfully")
    }
  }

  const handleClose = () => {
    dispatch(setError(null))
    dispatch(setSuccess(null))
  }

  if (!loading && user) {
    return <Navigate to="/" replace />
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative text-white font-sans overflow-hidden">
      {error && <Toaster
        title={toasterTitle}
        message={error}
        onClose={handleClose}
        type="error"
      />}
      {success && <Toaster
        title={toasterTitle}
        message={success}
        onClose={handleClose}
        type="success"
      />}
      
      {resetLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#121214] border border-[#2d2d33] rounded-2xl p-8 shadow-2xl flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-linear-to-r from-[#22d3ee] to-[#34d399] flex items-center justify-center mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <rect x="9" y="11" width="6" height="4" rx="1" />
                <path d="M10.5 11V9.5a1.5 1.5 0 0 1 3 0V11" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold mb-3 text-white">Reset your password</h2>
            <p className="text-sm text-gray-400 text-center mb-8">
              Enter the email associated with your account<br />and we'll send you a link to reset your password.
            </p>

            <form className="w-full space-y-4" onSubmit={handleResetLink}>
              <div className="w-full text-left">
                <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="reset-email">Email Address</label>
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <input
                    id="reset-email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    type="email"
                    placeholder="name@example.com"
                    className="w-full bg-[#18181c] border border-[#2d2d33] text-white rounded-lg p-3 pl-11 outline-none focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] transition-all placeholder:text-gray-600"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-linear-to-r from-[#22d3ee] to-[#34d399] hover:opacity-90 transition-opacity text-black font-medium rounded-lg py-3 mt-2 flex items-center justify-center gap-2 cursor-pointer"
              >
                Send Reset Link
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </form>

            <button
              type="button"
              onClick={() => setResetLinkModal(false)}
              className="text-sm text-gray-400 hover:text-white transition-colors mt-6 flex items-center gap-2 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Back to Login
            </button>
          </div>
        </div>
      )}

      {/* Background Gradient */}
      <div className="absolute top-[-20%] left-[-10%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.03)_0%,rgba(0,0,0,0)_50%)] pointer-events-none" />

      <Logo />

      <div className="flex-1 flex items-center justify-center p-4 pt-28 pb-12">
        <div className="w-full max-w-md bg-[#121214] border border-[#2d2d33] rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-gray-400 text-sm">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="email">Email address</label>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#18181c] border border-[#2d2d33] text-white rounded-lg p-3 pl-11 outline-none focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] transition-all placeholder:text-gray-600"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-300" htmlFor="password">Password</label>
                <div
                  className="text-sm text-[#22d3ee] hover:underline cursor-pointer font-medium transition-colors"
                  onClick={() => setResetLinkModal(true)}
                >
                  Forgot password?
                </div>
              </div>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#18181c] border border-[#2d2d33] text-white rounded-lg p-3 pl-11 pr-11 outline-none focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] transition-all placeholder:text-gray-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none cursor-pointer"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-linear-to-r from-[#22d3ee] to-[#34d399] hover:opacity-90 transition-opacity text-black font-semibold rounded-lg py-3 mt-4 text-center cursor-pointer"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#22d3ee] hover:underline font-medium">
              Register
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center py-6 text-xs text-gray-600 font-medium tracking-wide">
        POWERED BY PERPLEXITY AI<br />
        <span className="font-normal mt-2 block opacity-70">© 2024 Perplexity AI, Inc. All rights reserved.</span>
      </div>
    </div>
  );
};

export default Login;