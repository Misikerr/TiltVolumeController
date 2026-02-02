import React, { useEffect, useRef, useCallback } from 'react';
import { useAudio } from './hooks/useAudio';
import { useTilt } from './hooks/useTilt';
import { VolumeIndicator } from './components/VolumeIndicator';
import { Controls } from './components/Controls';
import './App.css';

function App() {
  const { 
    volume, 
    updateVolume, 
    isPlaying, 
    play, 
    canPlay, 
    isLocked, 
    toggleLock, 
    resetVolume
  } = useAudio();

  // Smoothing logic
  const targetVolumeRef = useRef(volume);
  const currentVolumeRef = useRef(volume);
  const animationFrameRef = useRef();

  // Update target volume from tilt
  const handleTilt = useCallback((newTarget) => {
    if (!isLocked) {
      targetVolumeRef.current = newTarget;
    }
  }, [isLocked]);

  const { permissionGranted, requestPermission } = useTilt(handleTilt);

  // Desktop Cursor Control
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isLocked) return;
      
      // Check if device supports fine pointer (mouse) to avoid conflict with touch
      if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
          const { clientY } = e;
          const { innerHeight } = window;
          // Top (0) -> 1, Bottom (height) -> 0
          const newVolume = 1 - (clientY / innerHeight);
          targetVolumeRef.current = Math.max(0, Math.min(1, newVolume));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isLocked]);

  // Animation loop for smoothing
  useEffect(() => {
     let isActive = true;
    const animate = () => {
        if(!isActive) return;
      // Linear interpolation (Lerp)
      const factor = 0.1; 
      const diff = targetVolumeRef.current - currentVolumeRef.current;
      
      if (Math.abs(diff) > 0.001) {
        currentVolumeRef.current += diff * factor;
        // Clamp 0-1 just in case
        const clamped = Math.max(0, Math.min(1, currentVolumeRef.current));
        updateVolume(clamped);
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
        isActive = false;
        cancelAnimationFrame(animationFrameRef.current);
    }
  }, [updateVolume]); 

  useEffect(() => {
    if (isLocked) {
      targetVolumeRef.current = volume;
      currentVolumeRef.current = volume;
    }
  }, [volume, isLocked]);
  
  const handleReset = () => {
    resetVolume();
    targetVolumeRef.current = 0.5;
    // We let the lerp animate it back to 0.5? Or snap?
    // Let's snap the ref so it doesn't fight, but let animation handle visual if audio state updates instantly.
    // Actually, resetVolume sets state. The effect above sees volume change?
    // Wait, useAudio volume state is the source of truth for audio.
    // The loop drives useAudio via updateVolume.
    // When we call resetVolume, the state updates.
    // We need to sync our refs.
    currentVolumeRef.current = 0.5;
  };

  const handleStart = () => {
    play();
    requestPermission();
  };

  if (!canPlay) {
    return (
      <div className="overlay">
        <h1 className="overlay-title">🔊 Tilt Volume</h1>
        <button 
          onClick={handleStart}
          className="btn-start"
        >
          TAP TO START
        </button>
        <p className="status-text">Enable Sound & Motion</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">TILT CONTROLLER</h1>
      </header>
      
      {/* Main Display */}
      <main className="app-main">
        <VolumeIndicator volume={volume} />
      </main>

      {/* Controls */}
      <footer className="app-footer">
        <Controls 
          isLocked={isLocked}
          onToggleLock={toggleLock}
          onReset={handleReset}
          isPlaying={isPlaying}
          requestPermission={requestPermission}
        />
      </footer>
    </div>
  );
}

export default App;
