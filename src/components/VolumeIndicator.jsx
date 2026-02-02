import React from 'react';
import '../App.css';

export const VolumeIndicator = ({ volume }) => {
  // Volume is 0 to 1
  const percentage = Math.round(volume * 100);
  
  // Dynamic color
  const getColor = (pct) => {
    if (pct < 50) return '#4dff88'; // Green
    if (pct < 80) return '#ffd700'; // Gold
    return '#ff4d4d'; // Red
  };
  
  const color = getColor(percentage);

  return (
    <div className="volume-display">
      {/* Glass Container */}
      <div className="glass-container">
        
        {/* Liquid */}
        <div 
          className="liquid"
          style={{ 
            height: `${percentage}%`,
            backgroundColor: color,
            color: color /* for box-shadow currentColor */
          }}
        />

        {/* Shine/Reflection */}
        <div className="glass-shine" />
        
      </div>

      {/* Text Display */}
      <div className="volume-text-container">
        <span className="volume-percent">
          {percentage}
        </span>
        <span className="volume-label">
          Volume
        </span>
      </div>
    </div>
  );
};
