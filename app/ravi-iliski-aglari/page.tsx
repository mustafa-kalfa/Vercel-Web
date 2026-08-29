"use client";

import Link from "next/link";
import ChromaKeyVideo from "../ChromaKeyVideo";
import { useLanguage } from "../LanguageContext";

/* YER TUTUCU. Asil icerik -- ravilerin hoca-talebe baglarini gosteren
   gorsellestirme -- sonra buraya gelecek.

   Duzen /mustafa-calisiyor'un aynisi bilerek: o sayfa da "hazir degil"
   demek icin duruyor ve ziyaretci ayni sayfayla iki farkli bicimde
   karsilasmasin. Icerik gelince bu dosyanin govdesi degisecek, ust
   logo ve kap ayni kalabilir. */
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

      <div className="flex w-full max-w-3xl flex-1 flex-col justify-center gap-3 px-8 pb-16 pt-28 sm:px-16">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-foreground">
          {t.cardNetworks}
        </h1>
        <p className="max-w-md text-base leading-7 text-zinc-600 dark:text-cream-dimmer">
          {t.workingOnIt}
        </p>
      </div>
    </main>
  );
}
