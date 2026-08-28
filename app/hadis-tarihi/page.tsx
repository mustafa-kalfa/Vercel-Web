"use client";

import Link from "next/link";
import { useState } from "react";
import AudioPlayer from "../AudioPlayer";
import ChromaKeyVideo from "../ChromaKeyVideo";
import { useLanguage } from "../LanguageContext";

const MIHNA_SRC = "/podcast/mihne-hadisesi.mp3";

export default function HadisTarihi() {
  const { t } = useLanguage();
  const [playerOpen, setPlayerOpen] = useState(false);

  const buttonClass =
    "flex h-12 w-full max-w-xs items-center justify-center whitespace-nowrap rounded-full border border-solid border-black/20 px-5 text-center text-base font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/70 dark:hover:bg-[#1a1a1a]";

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
        {/* Oynatici acikken dugme gizlenmiyor, basili kaliyor: kullanici
            hangi bolumu dinledigini gorsun. Ikinci tiklama duraklatmiyor,
            oynaticinin kendi dugmesi o isi yapiyor. */}
        <button
          type="button"
          onClick={() => setPlayerOpen(true)}
          aria-expanded={playerOpen}
          className={
            playerOpen
              ? `${buttonClass} border-transparent bg-black/[.04] dark:bg-[#1a1a1a]`
              : buttonClass
          }
        >
          {t.podcastMihna}
        </button>

        {/* `autoPlay`: oynatici yalnizca dugmeye basilinca mount oldugu
            icin tarayicinin otomatik oynatma kisiti asiliyor -- kullanici
            hareketi zincirin icinde. */}
        {playerOpen && <AudioPlayer src={MIHNA_SRC} autoPlay />}

        <Link href="/mustafa-calisiyor" className={buttonClass}>
          {t.podcastOtherTopics}
        </Link>
      </div>
    </main>
  );
}
