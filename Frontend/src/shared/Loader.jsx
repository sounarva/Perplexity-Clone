import React from 'react';
import './loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-wrapper">
        <div className="loader-ring-outer"></div>
        <div className="loader-ring-inner"></div>
        <div className="loader-core"></div>
      </div>
    </div>
  );
};

export default Loader;