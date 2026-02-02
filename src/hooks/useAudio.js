import { useState, useRef, useEffect } from 'react';

export function useAudio() {
  const audioRef = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    
    // Set static source
    // User must place 'music.mp3' in the public folder
    audio.src = '/music.mp3'; 
    audio.loop = true;
    audio.volume = volume;

    return () => {
      audio.pause();
      // No object URL to revoke
    };
  }, []);

  // Removed setAudioFile

  useEffect(() => {
    // Update volume whenever it changes
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current.paused) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setCanPlay(true); // User interaction allows play
        })
        .catch(e => console.error(e));
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const play = () => {
    audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setCanPlay(true);
        })
        .catch(e => console.error(e));
  };

  const updateVolume = (newVolume) => {
    if (!isLocked) {
      const clamped = Math.max(0, Math.min(1, newVolume));
      setVolume(clamped);
    }
  };

  const toggleLock = () => setIsLocked(!isLocked);
  
  const resetVolume = () => {
      if(!isLocked) setVolume(0.5);
  };

  return {
    volume,
    updateVolume,
    isPlaying,
    togglePlay,
    play, // Explicit play for "Tap to Start"
    canPlay,
    isLocked,
    toggleLock,
    resetVolume
  };
}
