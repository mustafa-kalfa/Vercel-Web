"use client";

import { useState } from "react";
import { LANGUAGE_LABELS, type Language } from "./translations";
import { useLanguage } from "./LanguageContext";

export default function LanguageSwitcher() {
  const { language, cycleLanguage, t } = useLanguage();
  // Cikan etiket tiklama aninda yakalaniyor; effect ile izlemeye gerek yok.
  const [outgoing, setOutgoing] = useState<Language | null>(null);

  const isSwapping = outgoing !== null && outgoing !== language;

  return (
    <button
      type="button"
      onClick={() => {
        setOutgoing(language);
        cycleLanguage();
        // Temizlik zamanlayiciyla: `animationend`'e baglanirsak
        // prefers-reduced-motion acikken olay hic gelmiyor ve cikan
        // etiket DOM'da asili kaliyor.
        window.setTimeout(() => setOutgoing(null), 400);
      }}
      className="lang-switcher fixed right-4 top-4 z-20 flex h-9 min-w-9 items-center justify-center rounded-full border border-black/[.08] bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
      aria-label={t.languageToggle}
      title={t.languageToggle}
    >
      {/* Sabit genislik: etiket degisince dugme genisligi ziplamasin. */}
      <span className="relative block h-[18px] w-[24px] overflow-hidden">
        {isSwapping && (
          <span
            key={outgoing}
            className="swap-out absolute inset-0 flex items-center justify-center"
          >
            {LANGUAGE_LABELS[outgoing]}
          </span>
        )}
        <span
          key={language}
          className={`absolute inset-0 flex items-center justify-center ${
            isSwapping ? "swap-in" : ""
          }`}
        >
          {LANGUAGE_LABELS[language]}
        </span>
      </span>
    </button>
  );
}
