"use client";

import { useEffect, useRef } from "react";

const MAX_RENDER_WIDTH = 1920;
const LOOP_FADE_SECONDS = 0.5;

// hue in degrees (0-360) for the backdrop color being removed. `core` is
// how far (in hue degrees) a pixel can be from that hue and still count
// as fully backdrop (real screens are rarely a pure textbook hue); the
// match then fades out linearly between `core` and `edge`, so only the
// true anti-aliased boundary gets partial transparency instead of the
// whole backdrop. `minChroma` gates out neutral shadows/highlights on
// the subject. Red needs a much tighter gate than green: skin tones sit
// close to red in hue, so a loose match would eat into faces; green is
// far enough from skin hue that a looser match is safe.
const KEY_PROFILE = {
  green: { hue: 120, core: 25, edge: 50, minChroma: 20 },
  red: { hue: 0, core: 15, edge: 30, minChroma: 70 },
} as const;

// smooths the alpha channel only (a separable 3-tap box blur), leaving
// colors untouched. This is what actually kills the "ants marching"
// speckle along hair/fur edges: per-pixel keying flickers between
// opaque and transparent frame to frame on fine detail, and averaging
// each pixel's alpha with its neighbors turns that flicker into a
// smooth, stable gradient instead.
function smoothAlpha(data: Uint8ClampedArray, w: number, h: number) {
  const n = w * h;
  const alpha = new Float32Array(n);
  for (let i = 0; i < n; i++) alpha[i] = data[i * 4 + 3];

  const tmp = new Float32Array(n);
  for (let y = 0; y < h; y++) {
    const row = y * w;
    for (let x = 0; x < w; x++) {
      const x0 = Math.max(0, x - 1);
      const x1 = Math.min(w - 1, x + 1);
      tmp[row + x] = (alpha[row + x0] + alpha[row + x] + alpha[row + x1]) / 3;
    }
  }
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      const y0 = Math.max(0, y - 1);
      const y1 = Math.min(h - 1, y + 1);
      const v = (tmp[y0 * w + x] + tmp[y * w + x] + tmp[y1 * w + x]) / 3;
      data[(y * w + x) * 4 + 3] = Math.round(v);
    }
  }
}

export default function ChromaKeyVideo({
  src,
  className,
  keyColor = "green",
  loopSlideOffsetPercent = 0,
}: {
  src: string;
  className?: string;
  keyColor?: "green" | "red";
  // the footage's last frame sits this many % of the width to the left
  // of where it should to match the first frame. Rather than fix the
  // source, we open each loop already shifted left by that amount and
  // slide back to 0 by the last frame, so the drift is absorbed instead
  // of popping at the loop point.
  loopSlideOffsetPercent?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const { hue: targetHue, core, edge, minChroma } = KEY_PROFILE[keyColor];

    let rafId: number;
    let keyingDisabled = false;

    function resizeCanvas() {
      const vw = video!.videoWidth;
      const vh = video!.videoHeight;
      if (!vw || !vh) return;
      const scale = Math.min(1, MAX_RENDER_WIDTH / vw);
      const w = Math.round(vw * scale);
      const h = Math.round(vh * scale);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
      }
    }

    function draw() {
      if (video!.readyState >= 2 && video!.videoWidth) {
        resizeCanvas();
        // draw at full sharpness — noise from keying is smoothed out
        // afterward on the alpha channel only, so the visible image
        // (color) never gets blurred
        ctx!.drawImage(video!, 0, 0, canvas!.width, canvas!.height);

        // some browsers (privacy/anti-fingerprinting modes) block
        // getImageData on a canvas. If that happens we can't key out the
        // backdrop, but the plain video frame drawn above still shows —
        // better than a blank canvas.
        if (!keyingDisabled) {
          try {
            const frame = ctx!.getImageData(0, 0, canvas!.width, canvas!.height);
            const data = frame.data;
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const max = Math.max(r, g, b);
              const min = Math.min(r, g, b);
              const chroma = max - min;
              if (chroma < minChroma) continue; // neutral shadow/highlight, leave opaque

              let hue: number;
              if (max === r) hue = 60 * (((g - b) / chroma) % 6);
              else if (max === g) hue = 60 * ((b - r) / chroma + 2);
              else hue = 60 * ((r - g) / chroma + 4);
              if (hue < 0) hue += 360;

              const rawDiff = Math.abs(hue - targetHue);
              const hueDiff = Math.min(rawDiff, 360 - rawDiff);
              if (hueDiff > edge) continue; // not backdrop-colored

              // within the core band it's fully backdrop; between core and
              // edge it's a boundary pixel that fades out
              const hueMatch =
                hueDiff <= core ? 1 : 1 - (hueDiff - core) / (edge - core);
              const satMatch = Math.min(1, (chroma - minChroma) / 40);
              const strength = hueMatch * satMatch;
              data[i + 3] = Math.round(data[i + 3] * (1 - strength));
              // desaturate toward gray to suppress backdrop-color spill on edges
              const gray = (r + g + b) / 3;
              data[i] = Math.round(r + (gray - r) * strength);
              data[i + 1] = Math.round(g + (gray - g) * strength);
              data[i + 2] = Math.round(b + (gray - b) * strength);
            }
            smoothAlpha(data, canvas!.width, canvas!.height);
            ctx!.putImageData(frame, 0, 0);
          } catch (err) {
            keyingDisabled = true;
            console.warn(
              "ChromaKeyVideo: pixel access blocked, showing raw video without background removal",
              err
            );
          }
        }

        // ease across the loop point instead of hard-cutting back to
        // frame 0: fade the whole canvas out just before the video ends
        // and back in just after it restarts
        const duration = video!.duration || 0;
        const t = video!.currentTime;
        let opacity = 1;
        if (duration > 0) {
          if (t < LOOP_FADE_SECONDS) {
            opacity = t / LOOP_FADE_SECONDS;
          } else if (t > duration - LOOP_FADE_SECONDS) {
            opacity = (duration - t) / LOOP_FADE_SECONDS;
          }
        }
        canvas!.style.opacity = String(Math.max(0, Math.min(1, opacity)));

        // slide from the start offset back to 0 (flush) over the full
        // clip so the drift is spread out instead of popping at the loop
        if (loopSlideOffsetPercent && duration > 0) {
          const progress = Math.min(1, Math.max(0, t / duration));
          const currentOffset = loopSlideOffsetPercent * (1 - progress);
          canvas!.style.transform = `translateX(-${currentOffset}%)`;
        }
      }
      rafId = requestAnimationFrame(draw);
    }

    video.addEventListener("loadedmetadata", resizeCanvas);
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("loadedmetadata", resizeCanvas);
    };
  }, [keyColor, loopSlideOffsetPercent]);

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className="hidden"
      />
      <canvas ref={canvasRef} className={className} />
    </>
  );
}
