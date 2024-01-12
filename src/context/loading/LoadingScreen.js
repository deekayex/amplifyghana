import React from 'react';
import './LoadingScreen.css'; // Create a CSS file for styling

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loader"></div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingScreen;
