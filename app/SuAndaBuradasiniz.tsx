"use client";

import Link from "next/link";
import ChromaKeyVideo from "./ChromaKeyVideo";
import { useLanguage } from "./LanguageContext";

// /su-anda-buradasiniz sayfasinin govdesi. IKI yerden kullaniliyor:
//   1) app/su-anda-buradasiniz/page.tsx  -- gercek adres
//   2) app/not-found.tsx               -- var olmayan her adres
// Duzen /mustafa-calisiyor ile ayni, tek fark balondaki cumle.
export default function SuAndaBuradasiniz() {
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
        <div className="relative ml-auto max-w-md rounded-3xl border border-black/20 bg-background px-6 py-5 dark:border-white/70">
          <p className="text-base leading-7 text-zinc-700 sm:text-lg sm:leading-8 dark:text-cream-dim ar-greeting">
            {t.pageNotCreated}
          </p>
          <span
            aria-hidden="true"
            className="absolute -bottom-2 right-12 h-4 w-4 rotate-45 border-b border-r border-black/20 bg-background dark:border-white/70"
          />
        </div>
      </div>

      {/* Karakter ve pay /selam ile AYNI (Mustafa'nin talebi,
          2026-08-29): klip 25vh, pay 30vh. Ikisi de once iki katiydi
          (50vh / 60vh).

          Pay'in isi: karakter dar ekranda balonun alt kismini ortuyor,
          bu bos alan sayfayi kaydirilabilir yapiyor ve asagi kaydirinca
          balon karakterin onunden yukari cikip tamamen okunuyor. Genis
          ekranda ortusme olmadigi icin pay kapatiliyor. Klip yarilandigi
          icin pay da yarilandi.

          KONUM `absolute`, `fixed` DEGIL: fixed iken klip gorunum
          alaninin dibine yapisip sayfa sonunda footer'in uzerini
          ortuyor. absolute olunca sarmalayici <main>'in (relative)
          dibine, yani footer'in tam ustune oturuyor. */}
      <div aria-hidden="true" className="h-[30vh] shrink-0 sm:h-0" />

      <ChromaKeyVideo
        src="/Mustafa%20Karsilama_seffaf.mp4"
        className="absolute bottom-0 right-0 h-[25vh] w-auto max-w-none"
      />
    </main>
  );
}
