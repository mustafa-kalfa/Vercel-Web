"use client";

import Link from "next/link";
import ChromaKeyVideo from "../ChromaKeyVideo";
import SilsileAgiTuval from "../SilsileAgiTuval";
import { useLanguage } from "../LanguageContext";

/* CANVAS DENEMESININ SAYFASI.

   Duzen /ravi-iliski-aglari/harita ile BIREBIR ayni olmali, yoksa
   olcum karsilastirilamaz. Tek fark cagrilan bilesen: burada
   SilsileAgiTuval, orada SilsileAgi. Ikisi de ayni veriyi
   (app/silsileVeri.js) kullaniyor.

   FOOTER KENDILIGINDEN KATLANMA CIZGISININ ALTINDA: kok layout
   govdeyi `min-h-dvh` bir kaba koyup footer'i o kabin ARDINA
   ekliyor, asagidaki ag da tam bir ekran kapladigi icin footer ancak
   kaydirinca goruntuye giriyor -- diger sayfalarda oldugu gibi. */
export default function AgSinamasi() {
  const { t } = useLanguage();

  return (
    <main className="relative flex flex-1 flex-col">
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

      {/* Ag TAM BIR EKRAN: ust bantla (54px) birlikte 100dvh ediyor,
          boylece footer tam katlanma cizgisinin altina dusuyor.

          Yukseklik KESIN bir deger (`calc`), yuzde degil: bilesenin
          kok div'i `height:100%` istiyor ve yuzde yukseklik ancak
          kapsayicinin boyu kesinse cozuluyor. Kok layout govdeye
          `min-h-dvh` veriyor, `height` degil.

          Ust bant 2026-08-29'da %33 kuculdu: logo 72 -> 48 px, bant
          80 -> 54 px. Sayfanin ust seridi ag'dan cok yer aliyordu. */}
      <div className="mt-[54px] h-[calc(100dvh-54px)]">
        <SilsileAgiTuval />
      </div>
    </main>
  );
}
