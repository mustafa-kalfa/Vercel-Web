"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./LanguageContext";

const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2];
const SKIP_SECONDS = 5;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="currentColor">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="currentColor">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

/* Geri/ileri: ok basi ile 5 rakami ayni ikonda. Ok yonu `flip` ile
   aynalaniyor, rakam aynalanmasin diye ayri bir <text> olarak duruyor. */
function SkipIcon({ flip }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[22px] w-[22px]"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform={flip ? "scale(-1,1) translate(-24,0)" : undefined}>
        <path d="M12 5V2L8 6l4 4V7a6 6 0 1 1-6 6" />
      </g>
      <text
        x="12"
        y="18.5"
        textAnchor="middle"
        fontSize="9"
        fontWeight="600"
        stroke="none"
        fill="currentColor"
      >
        5
      </text>
    </svg>
  );
}

export default function AudioPlayer({
  src,
  title,
  autoPlay = false,
}: {
  src: string;
  /* Bolum adi cogu yerde oynaticiyi acan dugmede zaten yaziyor; oralarda
     bos birakilip kart icinde tekrar edilmiyor. */
  title?: string;
  autoPlay?: boolean;
}) {
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(SPEEDS.indexOf(1));
  const [failed, setFailed] = useState(false);

  const speed = SPEEDS[speedIndex];

  // Hiz `playbackRate` bir DOM ozelligi: yeni bir <audio> ogesi her zaman
  // 1'den basliyor, kaynak degisince de sifirlaniyor. Efektle senkron tut.
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.playbackRate = speed;
  }, [speed, src]);

  // Otomatik baslatma yalnizca kullanici bir dugmeye bastigi icin mount
  // olduysa calisir; tarayici yine de reddedebilir (`catch`), o zaman
  // dugme duraklatilmis halde kalir.
  useEffect(() => {
    if (!autoPlay) return;
    audioRef.current?.play().catch(() => setIsPlaying(false));
  }, [autoPlay, src]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  };

  const skip = (delta: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const limit = Number.isFinite(audio.duration) ? audio.duration : Infinity;
    audio.currentTime = Math.min(Math.max(audio.currentTime + delta, 0), limit);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full max-w-md rounded-3xl border border-black/[.08] bg-background px-6 py-5 dark:border-white/[.145]">
      {title && (
        <p className="mb-4 text-center text-base font-medium">{title}</p>
      )}

      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setFailed(true)}
      />

      {/* Medya denetimleri Arapca'da da soldan saga: ilerleme cubugunun
          yonu sesin yonu degil zamanin yonu, RTL'de ters donmesi
          kafa karistirici olurdu. */}
      <div dir="ltr">
        <input
          type="range"
          className="audio-range"
          style={{ "--progress": `${progress}%` } as React.CSSProperties}
          min={0}
          max={duration || 0}
          step={0.01}
          value={currentTime}
          onChange={(e) => {
            const audio = audioRef.current;
            if (!audio) return;
            audio.currentTime = Number(e.target.value);
            setCurrentTime(Number(e.target.value));
          }}
          aria-label={t.playerSeek}
          disabled={!duration}
        />

        <div className="mt-1 flex justify-between font-mono text-xs tabular-nums text-zinc-600 dark:text-cream-dimmer">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => skip(-SKIP_SECONDS)}
            aria-label={t.playerBack5}
            title={t.playerBack5}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[.08] transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
          >
            <SkipIcon />
          </button>

          <button
            type="button"
            onClick={toggle}
            aria-label={isPlaying ? t.playerPause : t.playerPlay}
            title={isPlaying ? t.playerPause : t.playerPlay}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-90"
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          <button
            type="button"
            onClick={() => skip(SKIP_SECONDS)}
            aria-label={t.playerForward5}
            title={t.playerForward5}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[.08] transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
          >
            <SkipIcon flip />
          </button>

          {/* Sabit genislik: 0.75x -> 1x gecisinde dugme daralip
              ortadaki oynat dugmesini kaydirmasin. */}
          <button
            type="button"
            onClick={() => setSpeedIndex((i) => (i + 1) % SPEEDS.length)}
            aria-label={t.playerSpeed}
            title={t.playerSpeed}
            className="flex h-10 w-14 items-center justify-center rounded-full border border-black/[.08] font-mono text-sm tabular-nums transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
          >
            {speed}×
          </button>
        </div>
      </div>

      {failed && (
        <p className="mt-4 text-center text-sm text-zinc-600 dark:text-cream-dimmer">
          Ses dosyası yüklenemedi.
        </p>
      )}
    </div>
  );
}
