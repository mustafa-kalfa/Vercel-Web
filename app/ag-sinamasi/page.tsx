"use client";

import Link from "next/link";
import ChromaKeyVideo from "../ChromaKeyVideo";
import SilsileAgi from "../SilsileAgi";
import { useLanguage } from "../LanguageContext";

/* Silsile agi sayfasi. Site cercevesi (HD logosu, tema/dil dugmeleri,
   footer) 2026-08-29'da geri geldi -- bir sure kaldirilmisti, bkz.
   ciplakYollar.ts.

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
        className="absolute left-1/2 top-1 z-20 flex h-[72px] -translate-x-1/2 items-center transition-opacity hover:opacity-70"
      >
        <ChromaKeyVideo
          src="/HD-Mini.mp4"
          loop={false}
          className="h-[72px] w-auto max-w-none brightness-0 dark:brightness-100"
        />
      </Link>

      {/* Ag TAM BIR EKRAN: ust bantla (80px) birlikte 100dvh ediyor,
          boylece footer tam katlanma cizgisinin altina dusuyor.

          Yukseklik KESIN bir deger (`calc`), yuzde degil: bilesenin
          kok div'i `height:100%` istiyor ve yuzde yukseklik ancak
          kapsayicinin boyu kesinse cozuluyor. Kok layout govdeye
          `min-h-dvh` veriyor, `height` degil.

          `mt-20`: ag, logonun (72px) ve iki yandaki tema/dil
          dugmelerinin altindan basliyor. */}
      <div className="mt-20 h-[calc(100dvh-80px)]">
        <SilsileAgi />
      </div>
    </main>
  );
}
