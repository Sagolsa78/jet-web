'use client';

import React, { useRef, useState, useSyncExternalStore } from 'react';

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getServerReducedMotionSnapshot() {
  return false;
}

export function HeroBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot
  );

  const [isPlaying, setIsPlaying] = useState(!hasReducedMotion);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleSound = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* ── HTML5 BACKGROUND VIDEO ── */}
      <video
        ref={videoRef}
        autoPlay={!hasReducedMotion}
        muted={isMuted}
        loop
        playsInline
        poster="/videos/hero-poster.jpg"
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover object-center transform scale-[1.03] transition-transform duration-1000"
        aria-hidden="true"
      >
        <source src="/videos/hero-travel.webm" type="video/webm" />
        <source src="/videos/hero-travel.mp4" type="video/mp4" />
      </video>

      {/* ── CINEMATIC COLOR SCRIM & GRADIENTS (Ensures 100% WCAG Contrast) ── */}
      {/* Primary Brand Tint: Deep Navy with Teal & Coral undertones */}
      <div className="absolute inset-0 bg-[#0B233F]/75 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-container/95 via-primary-container/85 to-primary-container/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-transparent to-primary-container/30 opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-teal-900/30 via-transparent to-transparent opacity-80" />

      {/* ── INTERACTIVE FLOATING VIDEO CONTROL DOCK ── */}
      <div className="absolute bottom-6 right-6 z-20 pointer-events-auto flex items-center gap-2">
        {/* Destination Tag */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-surface-container-low shadow-sm">
          <span className="material-symbols-outlined text-[13px] text-secondary-container">
            videocam
          </span>
          <span>Lovina Coast, Bali · Drone Dispatch</span>
        </div>

        {/* Play / Pause Toggle Button */}
        <button
          type="button"
          onClick={togglePlay}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-lowest/80 hover:bg-surface-container-lowest backdrop-blur-md border border-white/20 text-on-surface hover:text-primary transition-all shadow-sm cursor-pointer"
          aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
          title={isPlaying ? 'Pause background video' : 'Play background video'}
        >
          <span className="material-symbols-outlined text-sm">
            {isPlaying ? 'pause' : 'play_arrow'}
          </span>
        </button>

        {/* Audio Mute / Unmute Toggle Button */}
        <button
          type="button"
          onClick={toggleSound}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-lowest/80 hover:bg-surface-container-lowest backdrop-blur-md border border-white/20 text-on-surface hover:text-primary transition-all shadow-sm cursor-pointer"
          aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
          title={isMuted ? 'Unmute' : 'Muted'}
        >
          <span className="material-symbols-outlined text-sm">
            {isMuted ? 'volume_off' : 'volume_up'}
          </span>
        </button>
      </div>
    </div>
  );
}
