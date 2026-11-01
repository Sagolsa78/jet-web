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

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* ── HTML5 BACKGROUND VIDEO ── */}
      <video
        ref={videoRef}
        autoPlay={!hasReducedMotion}
        muted
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

      {/* Keep the headline legible while allowing the travel footage to show through. */}
      <div className="absolute inset-0 bg-[#0B233F]/35 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-container/95 via-primary-container/88 to-primary-container/70 sm:from-primary-container/90 sm:via-primary-container/72 sm:to-primary-container/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-container/55 via-transparent to-primary-container/15" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent opacity-80" />

      {/* ── INTERACTIVE FLOATING VIDEO CONTROL DOCK ── */}
      <div className="absolute bottom-6 right-6 z-20 pointer-events-auto flex items-center gap-2">
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
      </div>
    </div>
  );
}
