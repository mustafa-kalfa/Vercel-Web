"use client";

import Link from "next/link";
import ChromaKeyVideo from "../../ChromaKeyVideo";
import SilsileAgi from "../../SilsileAgi";
import { useLanguage } from "../../LanguageContext";

/* Silsile agi gorsellestirmesinin kendisi.

   2026-08-30'a kadar bu icerik bir ust dizinde, /ravi-iliski-aglari'nda
   duruyordu. Mustafa haritadan once kisa bir tanitim sayfasi isteyince
   tanitim o adrese gecti, harita da buraya indi. Boylece sitemap'teki
   ve kartlardaki adres degismedi, yalnizca ARDINDA ne oldugu degisti.

   UC SAYFA AYNI BILESENI CAGIRIYOR (burasi, /ag-sinamasi ve gelecekte
   eklenecekler), kopya kod yok. Duzeni degistirmen gerekirse hepsine
   birden uygula, yoksa deneme yayindakini temsil etmez hale gelir.

   FOOTER KENDILIGINDEN KATLANMA CIZGISININ ALTINDA: kok layout govdeyi
   `min-h-dvh` bir kaba koyup footer'i o kabin ARDINA ekliyor, asagidaki
   ag da tam bir ekran kapladigi icin footer ancak kaydirinca goruntuye
   giriyor -- diger sayfalarda oldugu gibi. */
export default function RaviIliskiAglariHarita() {
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
        <SilsileAgi />
      </div>
    </main>
  );
}
