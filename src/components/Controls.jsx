import React from 'react';
import '../App.css';

export const Controls = ({ 
  isLocked, 
  onToggleLock, 
  onReset, 
  isPlaying, 
  onTogglePlay, // Keeping for potential use
  requestPermission
}) => {
  return (
    <div className="controls-container">
      <div className="controls-grid">
        <button
          onClick={onToggleLock}
          className={`btn ${isLocked ? 'locked' : 'default'}`}
        >
          {isLocked ? 'LOCKED 🔒' : 'UNLOCK 🔓'}
        </button>

      </div>
    
      
      <div className="status-text">
        <span>{isPlaying ? "Currently Playing" : "Paused"}</span>
      </div>
    </div>
  );
};
