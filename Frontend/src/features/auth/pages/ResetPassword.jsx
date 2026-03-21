import React, { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import Toaster from '../../../shared/Toaster';
import Logo from '../../../shared/Logo';
import { useDispatch, useSelector } from 'react-redux';
import { setError, setSuccess } from '../auth.slice';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { resetPassword } = useAuth();
  const dispatch = useDispatch();

  const { error, success } = useSelector((state) => state.auth);

  const [newPassword, setNewPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      dispatch(setError("Invalid or missing reset token"));
      return;
    }
    const isSuccess = await resetPassword({ token, newPassword });
    if (isSuccess) {
      setIsResetSuccessful(true);
    }
  };

  const handleClose = () => {
    dispatch(setError(null));
    dispatch(setSuccess(null));
  };

  const renderPasswordInput = (label, value, setValue, show, setShow, id) => (
    <div className="mb-4 text-left">
      <label className="block text-xs font-medium text-gray-300 mb-1.5" htmlFor={id}>{label}</label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="••••••••"
          className={`w-full border text-white rounded-md p-2.5 pr-10 transition-all outline-none placeholder:text-gray-600 text-sm ${isResetSuccessful
              ? "bg-[#2d2d33] border-[#3f3f46] text-gray-400 cursor-not-allowed"
              : "bg-[#18181c] border-[#2d2d33] hover:border-gray-500 focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
            }`}
          required
          disabled={isResetSuccessful}
        />
        {!isResetSuccessful && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none transition-colors cursor-pointer"
          >
            {show ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative text-white font-sans overflow-hidden">
      {error && <Toaster
        title="Reset failed"
        message={error}
        onClose={handleClose}
        type="error"
      />}
      {success && <Toaster
        title="Password updated"
        message={success}
        onClose={handleClose}
        type="success"
      />}

      {/* Background Gradient */}
      <div className="absolute top-[-20%] left-[-10%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.03)_0%,rgba(0,0,0,0)_50%)] pointer-events-none" />

      <Logo />

      <div className="flex-1 flex items-center justify-center p-4 pt-28 pb-12">
        <div className="w-full max-w-md bg-[#121214] border border-[#2d2d33] rounded-2xl p-8 shadow-2xl flex flex-col items-center">

          <div className="w-12 h-12 bg-[#1e3a8a]/40 rounded-full flex items-center justify-center mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 text-[#3b82f6]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v2m-3-2h6v-4a3 3 0 00-6 0v4z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold mb-2 tracking-wide text-white text-center">Reset Password</h2>
          <p className="text-sm text-gray-400 mb-7 text-center">
            {token ? "Enter your new password to secure your account." : "Invalid reset link. Please request a new one."}
          </p>

          <form className="w-full" onSubmit={handleSubmit}>
            {renderPasswordInput("New Password", newPassword, setNewPassword, showNew, setShowNew, "newPassword")}

            <div className="bg-[#17263b] border border-[#1e3a8a]/40 rounded-md p-3 mb-6 mt-3">
              <p className="text-[11px] leading-relaxed text-[#3b82f6]">
                <span className="font-semibold text-[#60a5fa]">Security tip:</span> Use at least 8 characters with a mix of letters, numbers, and symbols.
              </p>
            </div>

            <button
              type={isResetSuccessful ? "button" : "submit"}
              disabled={!token || isResetSuccessful}
              className={`w-full font-semibold text-white rounded-md py-2.5 transition-opacity duration-200 text-sm mb-4 ${token && !isResetSuccessful
                  ? "bg-linear-to-r from-[#2563eb] to-[#2dd4bf] hover:opacity-90 shadow-[0_0_15px_rgba(45,212,191,0.15)] cursor-pointer"
                  : "bg-gray-600 opacity-50 cursor-not-allowed"
                }`}
            >
              {isResetSuccessful ? "Go back to your login page" : "Update Password"}
            </button>
          </form>
        </div>
      </div>

      <div className="text-center py-6 text-xs text-gray-600 font-medium tracking-wide">
        POWERED BY PERPLEXITY AI<br />
        <span className="font-normal mt-2 block opacity-70">© 2026 Perplexity AI, Inc. All rights reserved.</span>
      </div>
    </div>
  );
};

export default ResetPassword;
