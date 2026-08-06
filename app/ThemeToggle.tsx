"use client";

import { useTheme } from "./ThemeContext";
import { useLanguage } from "./LanguageContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="fixed left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-black/[.08] bg-background text-foreground transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
      aria-label={t.themeToggle}
      aria-pressed={theme === "dark"}
      title={t.themeToggle}
    >
      {/* Tombul hilal + yildiz. Hilal, buyuk dairenin icinden kaydirilmis
          ikinci dairenin maske ile cikarilmasiyla olusuyor; iki yaricapin
          farki (8 / 6.5) genis govdeyi veriyor. */}
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
    </button>
  );
}
