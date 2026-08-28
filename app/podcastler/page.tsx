"use client";

import Link from "next/link";
import ChromaKeyVideo from "../ChromaKeyVideo";
import { useLanguage } from "../LanguageContext";

export default function Podcastler() {
  const { t } = useLanguage();

  const buttonClass =
    "flex h-12 w-full max-w-xs items-center justify-center whitespace-nowrap rounded-full border border-solid border-black/20 px-5 text-center text-base font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/70 dark:hover:bg-[#1a1a1a]";

  // Yalnizca Hadis Tarihi'nin kendi sayfasi var; digerleri bolum
  // eklendikce ayni sekilde `href` alacak.
  const categories = [
    t.podcastHadithMethodology,
    t.podcastHadithLiterature,
    t.podcastOrientalism,
  ];

  return (
    <main className="relative flex flex-1 flex-col items-center">
      <Link
        href="/"
        aria-label={t.brandAlt}
        className="absolute left-1/2 top-1 z-20 flex h-[72px] -translate-x-1/2 items-center transition-opacity hover:opacity-70"
      >
        <ChromaKeyVideo
          src="/HD-Mini.mp4"
          loop={false}
          className="h-[72px] w-auto max-w-none brightness-0 dark:brightness-100"
        />
      </Link>

      <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 px-6 pb-16 pt-32 sm:px-10">
        <Link href="/hadis-tarihi" className={buttonClass}>
          {t.podcastHadithHistory}
        </Link>

        {categories.map((label) => (
          <button key={label} type="button" className={buttonClass}>
            {label}
          </button>
        ))}
      </div>
    </main>
  );
}
