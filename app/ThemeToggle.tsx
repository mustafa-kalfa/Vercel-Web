"use client";

import { useState } from "react";
import { useTheme } from "./ThemeContext";
import { useLanguage } from "./LanguageContext";
import SwapContent from "./SwapContent";

/* Tombul hilal + yildiz: acik moddayken gorunur, "karanliga gec" demek.
   Hilal, buyuk dairenin icinden kaydirilmis ikinci dairenin maske ile
   cikarilmasiyla olusuyor; iki yaricapin farki (8 / 6.5) genis govdeyi
   veriyor. */
function CrescentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[19px] w-[19px]"
      aria-hidden="true"
      focusable="false"
    >
      <mask id="crescent-mask">
        <circle cx="10" cy="12" r="8" fill="white" />
        <circle cx="13.5" cy="12" r="6.5" fill="black" />
      </mask>
      <rect
        width="24"
        height="24"
        fill="currentColor"
        mask="url(#crescent-mask)"
      />
      <path
        d="M16.8 9 L17.47 11.07 L19.65 11.07 L17.89 12.35 L18.56 14.43 L16.8 13.15 L15.04 14.43 L15.71 12.35 L13.95 11.07 L16.13 11.07 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* Gunes: karanlik moddayken gorunur, "aydinliga don" demek. */
function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[19px] w-[19px]"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="4.6" fill="currentColor" />
      <g
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        fill="none"
      >
        <line x1="12" y1="5.4" x2="12" y2="2.8" />
        <line x1="12" y1="18.6" x2="12" y2="21.2" />
        <line x1="18.6" y1="12" x2="21.2" y2="12" />
        <line x1="5.4" y1="12" x2="2.8" y2="12" />
        <line x1="16.67" y1="7.33" x2="18.51" y2="5.49" />
        <line x1="7.33" y1="16.67" x2="5.49" y2="18.51" />
        <line x1="16.67" y1="16.67" x2="18.51" y2="18.51" />
        <line x1="7.33" y1="7.33" x2="5.49" y2="5.49" />
      </g>
    </svg>
  );
}

function iconFor(theme: string) {
  return theme === "dark" ? <SunIcon /> : <CrescentIcon />;
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  // Cikan ikon tiklama aninda yakalaniyor; effect ile izlemeye gerek yok.
  const [outgoing, setOutgoing] = useState<string | null>(null);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => {
        setOutgoing(theme);
        toggleTheme();
        // Temizlik zamanlayiciyla: `animationend`'e baglanirsak
        // prefers-reduced-motion acikken olay hic gelmiyor ve cikan
        // ikon DOM'da asili kaliyor.
        window.setTimeout(() => setOutgoing(null), 400);
      }}
      className="fixed left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-black/[.08] bg-background text-foreground transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
      aria-label={t.themeToggle}
      aria-pressed={isDark}
      title={t.themeToggle}
    >
      <SwapContent
        className="h-[19px] w-[19px]"
        current={theme}
        outgoing={outgoing}
        render={iconFor}
      />
    </button>
  );
}
