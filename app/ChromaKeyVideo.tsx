"use client";

import { useEffect, useRef } from "react";

const LOOP_FADE_SECONDS = 0.5;

export default function ChromaKeyVideo({
  src,
  className,
  loopSlideOffsetPercent = 0,
}: {
  // a .webm with a real alpha channel (background already keyed out
  // offline via ffmpeg) — no canvas/pixel access at runtime, so nothing
  // for privacy/anti-fingerprinting protections to block
  src: string;
  className?: string;
  // the footage's last frame sits this many % of the width to the left
  // of where it should to match the first frame. Rather than fix the
  // source, we open each loop already shifted left by that amount and
  // slide back to 0 by the last frame, so the drift is absorbed instead
  // of popping at the loop point.
  loopSlideOffsetPercent?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;

    function tick() {
      const duration = video!.duration || 0;
      const t = video!.currentTime;

      // ease across the loop point instead of hard-cutting back to frame
      // 0: fade out just before the video ends and back in just after
      let opacity = 1;
      if (duration > 0) {
        if (t < LOOP_FADE_SECONDS) {
          opacity = t / LOOP_FADE_SECONDS;
        } else if (t > duration - LOOP_FADE_SECONDS) {
          opacity = (duration - t) / LOOP_FADE_SECONDS;
        }
      }
      video!.style.opacity = String(Math.max(0, Math.min(1, opacity)));

      // slide from the start offset back to 0 (flush) over the full clip
      if (loopSlideOffsetPercent && duration > 0) {
        const progress = Math.min(1, Math.max(0, t / duration));
        const currentOffset = loopSlideOffsetPercent * (1 - progress);
        video!.style.transform = `translateX(-${currentOffset}%)`;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [loopSlideOffsetPercent]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      className={className}
    />
  );
}
