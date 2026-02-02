import { useState, useEffect, useRef } from 'react';

export function useTilt(onTiltChange) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const requestRef = useRef(null);

  useEffect(() => {
    // Check if DeviceOrientationEvent is defined
    if (typeof DeviceOrientationEvent === 'undefined') {
      setIsSupported(false);
    } else {
      // Check if permission is needed (iOS 13+)
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        setPermissionGranted(false); // Needs explicit request
      } else {
        setPermissionGranted(true); // Android / Older iOS / Desktop
      }
    }
  }, []);

  const callbackRef = useRef(onTiltChange);

  useEffect(() => {
    callbackRef.current = onTiltChange;
  }, [onTiltChange]);

  const handleOrientation = (event) => {
    if (event.beta === null) return;

    // Beta: 
    // 90 (upright) -> 0 volume
    // 0 (flat) -> 100 volume
    
    // Invert mapping for "Tilt Forward to Increase"
    // "Forward" usually means top of phone goes down.
    // If phone is upright (90), tilting forward decreases Beta towards 0.
    // So lower Beta = Higher Volume.
    
    // Map Beta [10, 80] to [1, 0]
    const minTilt = 10; // Flat-ish
    const maxTilt = 80; // Upright-ish
    
    let normalized = (maxTilt - event.beta) / (maxTilt - minTilt);
    
    // Clamping
    normalized = Math.max(0, Math.min(1, normalized));
    
    if (callbackRef.current) {
      callbackRef.current(normalized);
    }
  };

  useEffect(() => {
    if (permissionGranted) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [permissionGranted]);

  const requestPermission = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permissionState = await DeviceOrientationEvent.requestPermission();
        if (permissionState === 'granted') {
          setPermissionGranted(true);
        } else {
          alert('Permission to assess device orientation was denied.');
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      // Non-iOS 13+ devices
      setPermissionGranted(true);
    }
  };

  return {
    permissionGranted,
    requestPermission,
    isSupported
  };
}
