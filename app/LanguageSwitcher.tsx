"use client";

import { LANGUAGE_LABELS, type Language } from "./translations";
import { useLanguage } from "./LanguageContext";
import SwapContent from "./SwapContent";

export default function LanguageSwitcher() {
  const { language, outgoingLanguage, cycleLanguage, t } = useLanguage();

  return (
    <button
      type="button"
      onClick={cycleLanguage}
      className="lang-switcher fixed right-4 top-4 z-20 flex h-9 min-w-9 items-center justify-center rounded-full border border-black/[.08] bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
      aria-label={t.languageToggle}
      title={t.languageToggle}
    >
      {/* Sabit genislik: etiket degisince dugme genisligi ziplamasin. */}
      <SwapContent
        className="h-[18px] w-[24px]"
        current={language}
        outgoing={outgoingLanguage}
        render={(key) => LANGUAGE_LABELS[key as Language]}
      />
    </button>
  );
}
