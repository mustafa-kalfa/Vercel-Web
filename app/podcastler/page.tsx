"use client";

import Link from "next/link";
import ChromaKeyVideo from "../ChromaKeyVideo";
import { useLanguage } from "../LanguageContext";

const CATEGORIES = [
  "Hadis Tarihi",
  "Hadis Usûlü",
  "Hadis Edebiyatı",
  "Oryantalizm",
];

export default function Podcastler() {
  const { t } = useLanguage();

  return (
    <main className="relative flex flex-1 flex-col items-center">
      <Link
        href="/"
        aria-label={t.brandAlt}
        className="fixed left-1/2 top-4 z-20 flex h-[72px] -translate-x-1/2 items-center transition-opacity hover:opacity-70"
      >
        <ChromaKeyVideo
          src="/HD-Mini.mp4"
          loop={false}
          className="h-[72px] w-auto max-w-none brightness-0 dark:brightness-100"
        />
      </Link>

      <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 px-6 pb-16 pt-32 sm:px-10">
        {CATEGORIES.map((label) => (
          <button
            key={label}
            type="button"
            className="flex h-12 w-full max-w-xs items-center justify-center whitespace-nowrap rounded-full border border-solid border-black/[.08] px-5 text-center text-base font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
          >
            {label}
          </button>
        ))}
      </div>
    </main>
  );
}
