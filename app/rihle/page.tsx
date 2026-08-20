"use client";

import Link from "next/link";
import ChromaKeyVideo from "../ChromaKeyVideo";
import { useLanguage } from "../LanguageContext";

// Duzen /mustafa-calisiyor ile ayni; balondaki cumle ve kosedeki klip
// bu sayfaya ozel.
export default function Rihle() {
  const { t } = useLanguage();

  return (
    <main className="relative flex flex-1 flex-col">
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
      <div className="px-6 pt-24 sm:px-10 sm:pt-28">
        <div className="relative ml-auto max-w-md rounded-3xl border border-black/[.08] bg-background px-6 py-5 dark:border-white/[.145]">
          <p className="text-base leading-7 text-zinc-700 sm:text-lg sm:leading-8 dark:text-cream-dim ar-greeting">
            {t.journeyAhead}
          </p>
          <span
            aria-hidden="true"
            className="absolute -bottom-2 right-12 h-4 w-4 rotate-45 border-b border-r border-black/[.08] bg-background dark:border-white/[.145]"
          />
        </div>
      </div>

      <div aria-hidden="true" className="h-[60vh] shrink-0 sm:h-0" />

      {/* Diger kose kliplerinden farki: bu bir KARAKTER degil, 16:9 bir
          SAHNE -- gokyuzu yesil cekilmis, colun kendisi klibin ICINDE
          (`Mustafa Yagmur_seffaf.mp4` ile ayni tur). Karakter tek basina
          kirpilip cikarilamaz, cunku colun uzerinde duruyor.
          Bu yuzden /mustafa-calisiyor'un `h-[50vh] right-0` olcusu
          KULLANILMIYOR: 16:9'da o olcu 89vh genislik demek, sahne butun
          sayfayi kapliyor ve balon karakterin kafasina biniyordu.
          Mobilde tam genislikte bir ufuk seridi (`w-full` -- boylece sert
          dikey kenar hic olusmuyor), masaustunde yukseklikten sinirlanan
          bir kose susu.
          Olculer px degil vh/w-full: tarayici yakinlastirmasinda klip
          ekranda ayni kalmali. */}
      <ChromaKeyVideo
        src="/Mustafa%20Rihle_seffaf.mp4"
        className="fixed bottom-0 left-0 h-auto w-full sm:left-auto sm:right-0 sm:h-[45vh] sm:w-auto sm:max-w-none"
      />
    </main>
  );
}
