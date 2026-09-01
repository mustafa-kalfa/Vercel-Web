"use client";

import Link from "next/link";
import ChromaKeyVideo from "../ChromaKeyVideo";
import SilsileAgi from "../SilsileAgi";
import { useLanguage } from "../LanguageContext";

/* DENEME ADRESI.

   Su an /ravi-iliski-aglari/harita ile BIREBIR ayni: ikisi de
   SilsileAgi'yi cagiriyor ve tek bir veri dosyasindan besleniyor.

   2026-08-30'da bir sure veri BURADA catallanmisti (bilgi kartlari
   Takrib'den doldurulurken yayindaki harita etkilenmesin diye);
   calisma yayina alinip catal kapatildi. Yeni bir deneme gerekirse
   ayni yol acik: veriyi ya da bileseni kopyala, burayi kopyaya bagla.

   Arama motorlarina KAPALI kalmali (bkz. layout.tsx): iki adres de
   indekse girseydi Google birini kopya sayip ikisini birden
   dusururdu. */
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
        <SilsileAgi />
      </div>
    </main>
  );
}
