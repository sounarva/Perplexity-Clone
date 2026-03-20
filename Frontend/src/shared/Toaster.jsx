import React, { useState, useEffect } from 'react';
import './toaster.css';

const Toaster = ({
  title = "Registration failed",
  message = "Email already in use.",
  type = "error",
  onClose = () => { }
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 2.1 seconds so the CSS animation (which takes 2.0s) has time to finish completely
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 2100);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="toaster-overlay">
      <div className={`toaster-container ${type}`}>
        <div className="toaster-content">
          <div className="toaster-icon-wrapper">
            {type === 'error' ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="10" cy="10" r="10" fill="#EF4444" />
                <rect x="9" y="5" width="2" height="6" rx="1" fill="white" />
                <circle cx="10" cy="14" r="1.25" fill="white" />
              </svg>
            ) : (
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 20 20" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="10" cy="10" r="10" fill="#10B981" />
                <path d="M14 7L8.5 12.5L6 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <div className="toaster-text">
            <h4 className="toaster-title">{title}</h4>
            <p className="toaster-message">{message}</p>
          </div>
          <div className="toaster-close" onClick={() => {
            setIsVisible(false)
            onClose();
          }}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        </div>
        <div className="toaster-progress-bar-container">
          <div className={`toaster-progress-bar ${type}`}></div>
        </div>
      </div>
    </div>
  );
};

export default Toaster;