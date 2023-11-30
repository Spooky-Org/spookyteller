'use client'
import React, { useRef, useState } from 'react';
import {
    IconVolume,
    IconMuteVolume
  } from '@/components/ui/icons'

export const MusicPlayer = () => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null)

  const toggleMusic = () => {
    const audio = audioRef.current
    if (isMusicPlaying && audio) {
      audio.pause();
      audio.currentTime = 0;
    } else {
      audio?.play();
    }

    setIsMusicPlaying(!isMusicPlaying);
  };

  return (
    <div>
      <div id="musicToggle" onClick={toggleMusic}>
        {isMusicPlaying ? <IconVolume className='w-6 h-6'/> : <IconMuteVolume className='w-6 h-6'/>}
      </div>
      <audio ref={audioRef} loop>
        <source src="lost-soul_30sec-177569.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

