"use client";

import Link from "next/link";
import ChromaKeyVideo from "../ChromaKeyVideo";
import IntroVideo from "../IntroVideo";
import { useLanguage } from "../LanguageContext";
import SwapContent from "../SwapContent";
import { TRANSLATIONS, type Language } from "../translations";

function GamepadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[19px] w-[19px]"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
      <path d="M6 12h4" />
      <path d="M8 10v4" />
      <path d="M15 13h.01" />
      <path d="M18 11h.01" />
    </svg>
  );
}

export default function Sinama() {
  const { t, language, outgoingLanguage } = useLanguage();

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      {/* Dil dugmesinin (layout.tsx, fixed right-4 top-4, h-9) hemen
          altinda, ayni gorunumde bir dugme: 8px bosluk icin top-[60px]
          (16 + 36 + 8). Yalnizca bu sayfaya ozgu oldugundan layout.tsx
          yerine burada duruyor. */}
      <Link
        href="/resule-kavusmak"
        className="glow-btn fixed right-4 top-[60px] z-20 flex h-9 w-9 items-center justify-center rounded-full border border-black/[.08] bg-background text-foreground transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
        aria-label="Resûle Kavuşmak"
        title="Resûle Kavuşmak"
      >
        <GamepadIcon />
        <svg className="glow-container" aria-hidden="true" focusable="false">
          <rect pathLength={100} strokeLinecap="round" className="glow-blur" />
          <rect pathLength={100} strokeLinecap="round" className="glow-line" />
        </svg>
      </Link>
      <IntroVideo />
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-start gap-8 px-16 pt-28 pb-[35vh] sm:items-start sm:pt-36 sm:pb-24">
        <span role="img" aria-label={t.brandAlt} className="my-[-38px] block">
          <ChromaKeyVideo
            src="/HD-Animasyon.mp4"
            loop={false}
            className="h-[140px] w-auto max-w-none brightness-0 dark:brightness-100"
          />
        </span>
        <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-start">
          <h1 className="site-title max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-foreground">
            {t.title}
          </h1>
          <p className="site-welcome text-base font-medium text-zinc-700 dark:text-cream-dim">
            {t.welcome}
          </p>
          <p className="site-description max-w-md text-lg leading-8 text-zinc-600 dark:text-cream-dimmer">
            {t.descriptionQuestion}
            <br />
            {t.descriptionRephrase}
            <br />
            <strong className="font-semibold">{t.descriptionHadith}</strong>{" "}
            {t.descriptionAnd}{" "}
            <strong className="font-semibold">{t.descriptionDigital}</strong>
          </p>
        </div>
        <div className="site-actions flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Link
            href="/selam"
            className="flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-foreground px-5 text-center text-background transition-opacity hover:opacity-90 md:w-auto md:min-w-[158px]"
          >
            <SwapContent
              current={language}
              outgoing={outgoingLanguage}
              render={(key) => TRANSLATIONS[key as Language].begin}
            />
          </Link>
          <a
            className="flex h-12 w-full items-center justify-center whitespace-nowrap rounded-full border border-solid border-black/[.08] px-5 text-center transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-auto md:min-w-[158px]"
            href="https://x.com/mustafakalfa__"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SwapContent
              current={language}
              outgoing={outgoingLanguage}
              render={(key) => TRANSLATIONS[key as Language].about}
            />
          </a>
        </div>
      </main>
    </div>
  );
}
