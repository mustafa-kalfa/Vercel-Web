"use client";

import Link from "next/link";
import ChromaKeyVideo from "../ChromaKeyVideo";
import { useLanguage } from "../LanguageContext";

export default function Podcastler() {
  const { t } = useLanguage();

  const buttonClass =
    "flex h-12 w-full max-w-xs items-center justify-center whitespace-nowrap rounded-full border border-solid border-black/20 px-5 text-center text-base font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/70 dark:hover:bg-[#1a1a1a]";

  /* Yalnizca Hadis Tarihi'nin kendi sayfasi var. Digerleri simdilik
     /mustafa-calisiyor'a gidiyor (Mustafa'nin talebi, 2026-08-29): o
     sayfa "Mustafa bu is uzerinde calisiyor" diyor, yani ziyaretci
     tiklayinca bos bir yere degil, durumu anlatan bir yere dusuyor.
     Bolum eklendikce buradaki `href` kendi sayfasiyla degistirilecek. */
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
        className="absolute left-1/2 top-1 z-20 flex h-[48px] -translate-x-1/2 items-center transition-opacity hover:opacity-70"
      >
        <ChromaKeyVideo
          src="/HD-Mini.mp4"
          loop={false}
          className="h-[48px] w-auto max-w-none brightness-0 dark:brightness-100"
        />
      </Link>

      <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 px-6 pb-16 pt-32 sm:px-10">
        <Link href="/hadis-tarihi" className={buttonClass}>
          {t.podcastHadithHistory}
        </Link>

        {categories.map((label) => (
          <Link key={label} href="/mustafa-calisiyor" className={buttonClass}>
            {label}
          </Link>
        ))}
      </div>
    </main>
  );
}
