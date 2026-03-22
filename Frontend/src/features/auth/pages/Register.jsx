import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux'
import { setError } from '../auth.slice';
import Loader from '../../../shared/Loader';
import '../styles/animation.css';
import Toaster from '../../../shared/Toaster';
import Logo from '../../../shared/Logo';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { register } = useAuth()
  const { user, loading, error } = useSelector((state) => state.auth)
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verifyEmailModal, setVerifyEmailModal] = useState(false);
  const [toasterTitle , setToasterTitle] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register({ username, email, password });
    if (success) {
      setVerifyEmailModal(true);
    } else {
      setToasterTitle("Registration failed")
    }
  };

  const handleClose = () => {
    dispatch(setError(null))
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
        onClose={handleClose} />}

      {/* Background Gradient */}
      <div className="absolute top-[-20%] left-[-10%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.03)_0%,rgba(0,0,0,0)_50%)] pointer-events-none" />

      {/* Registration Success Modal */}
      {verifyEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-overlay-fade">
          <div className="w-full max-w-[380px] bg-[#121214] border border-[#2d2d33] rounded-2xl p-6 sm:p-8 shadow-2xl relative animate-popup">
            {/* Soft backdrop glow behind modal content */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.05)_0%,rgba(0,0,0,0)_70%)] rounded-2xl pointer-events-none" />

            <div className="relative flex flex-col items-center text-center">
              {/* Icon Container with subtle gradient border and glow */}
              <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#22d3ee] to-[#34d399] p-px mb-6 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                <div className="w-full h-full rounded-full bg-[#121214] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#22d3ee]">
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 tracking-tight">Registration Successful!</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 px-2">
                Please verify your email using the link sent to your inbox to activate your account and access all features.
              </p>

              <button
                onClick={() => navigate('/login')}
                className="w-full bg-linear-to-r from-[#22d3ee] to-[#34d399] hover:opacity-90 transition-opacity text-black font-semibold rounded-lg py-3 shadow-[0_4px_14px_0_rgba(34,211,238,0.2)] cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      <Logo />

      <div className="flex-1 flex flex-col justify-center px-6 pt-28 pb-12 md:px-4 z-10">
        <div className="w-full max-w-[360px] sm:max-w-[400px] m-auto bg-[#121214] border border-[#2d2d33] rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Create an account</h1>
            <p className="text-gray-400 text-[13px] sm:text-sm">Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-[13px] sm:text-sm font-medium text-gray-300 mb-1.5" htmlFor="username">Username</label>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] sm:w-5 sm:h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  className="w-full bg-[#18181c] border border-[#2d2d33] text-white rounded-lg p-2.5 sm:p-3 pl-10 sm:pl-11 text-[13px] sm:text-sm outline-none focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] transition-all placeholder:text-gray-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] sm:text-sm font-medium text-gray-300 mb-1.5" htmlFor="email">Email address</label>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] sm:w-5 sm:h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
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
                  className="w-full bg-[#18181c] border border-[#2d2d33] text-white rounded-lg p-2.5 sm:p-3 pl-10 sm:pl-11 text-[13px] sm:text-sm outline-none focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] transition-all placeholder:text-gray-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] sm:text-sm font-medium text-gray-300 mb-1.5" htmlFor="password">Password</label>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] sm:w-5 sm:h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#18181c] border border-[#2d2d33] text-white rounded-lg p-2.5 sm:p-3 pl-10 sm:pl-11 pr-10 sm:pr-11 text-[13px] sm:text-sm outline-none focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] transition-all placeholder:text-gray-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none cursor-pointer"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[18px] h-[18px] sm:w-5 sm:h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[18px] h-[18px] sm:w-5 sm:h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-linear-to-r from-[#22d3ee] to-[#34d399] hover:opacity-90 transition-opacity text-black font-semibold rounded-lg py-2.5 sm:py-3 mt-3 sm:mt-4 text-[13px] sm:text-base text-center cursor-pointer"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-6 sm:mt-8 text-center text-[13px] sm:text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-[#22d3ee] hover:underline font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center py-6 text-xs text-gray-600 font-medium tracking-wide">
        POWERED BY PERPLEXITY AI<br />
        <span className="font-normal mt-2 block opacity-70">© 2026 Perplexity AI, Inc. All rights reserved.</span>
      </div>
    </div>
  );
};

export default Register;