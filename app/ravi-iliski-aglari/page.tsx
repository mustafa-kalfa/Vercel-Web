"use client";

import Link from "next/link";
import ChromaKeyVideo from "../ChromaKeyVideo";
import { useLanguage } from "../LanguageContext";

/* Haritanin TANITIM sayfasi. Harita bir alt adreste (/harita).

   2026-08-30'a kadar bu adres dogrudan agi aciyordu. Mustafa araya kisa
   bir tanitim istedi: ag nedir, hangi kaynaklara dayaniyor, su an nerede
   bitiyor. Harita alt adrese indi, bu adres -- yani sitemap'teki ve
   kartlardaki adres -- yerinde kaldi. Yan fayda: sayfanin artik
   indekslenecek gercek bir metni var, oncekinde yoktu.

   Duzen /oyunlar ve /podcastler ile ayni iskelet: ust-orta logo, ortada
   dikey akan icerik, altta hap dugme. */
export default function RaviIliskiAglari() {
  const { t } = useLanguage();

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

      <div className="flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-6 pb-16 pt-28 sm:px-10 sm:pt-32">
        <h1 className="text-xl font-semibold sm:text-2xl">{t.cardNetworks}</h1>

        {/* Uc paragraf, uc soru: ne, hangi kaynak, nerede bitiyor.
            Bilerek kisa -- ziyaretci buraya haritayi gormeye geldi,
            okumaya degil. */}
        <div className="flex flex-col gap-4 text-base leading-7 text-zinc-700 sm:text-lg sm:leading-8 dark:text-cream-dim">
          <p>{t.agGirisNe}</p>
          <p>{t.agGirisKaynak}</p>
          <p>{t.agGirisSinir}</p>
        </div>

        {/* `w-fit` + `mr-auto`: dugme metnin sol kenariyla hizali,
            metnin genisligine yayilmiyor. Hizalama fiziksel degil
            mantiksal DEGIL -- burada metin de dugme de dilin akisiyla
            birlikte donuyor, o yuzden `me-auto` dogru olan.
            (/selam'daki dugme fiziksel, cunku oradaki balon Arapca'da
            da fiziksel olarak sagda kaliyor.) */}
        <Link
          href="/ravi-iliski-aglari/harita"
          className="me-auto mt-2 flex w-fit items-center gap-2 rounded-full border border-solid border-black/20 px-5 py-3 text-base font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/70 dark:hover:bg-[#1a1a1a]"
        >
          {t.agHaritayaGit}
          {/* Ileri oku. `rtl:-scale-x-100` ile Arapca'da ok da ters
              cevriliyor, yoksa metnin akisina karsi bakiyor. */}
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 shrink-0 rtl:-scale-x-100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </main>
  );
}
