"use client";

import { LANGUAGE_LABELS } from "./translations";
import { useLanguage } from "./LanguageContext";

export default function LanguageSwitcher() {
  const { language, cycleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={cycleLanguage}
      className="lang-switcher fixed right-4 top-4 z-20 flex h-9 min-w-9 items-center justify-center rounded-full border border-black/[.08] bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
      aria-label="Dili değiştir"
    >
      {LANGUAGE_LABELS[language]}
    </button>
  );
}
