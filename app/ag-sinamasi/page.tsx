"use client";

import Link from "next/link";
import ChromaKeyVideo from "../ChromaKeyVideo";
import SilsileAgiSinama from "../SilsileAgiSinama";
import { useLanguage } from "../LanguageContext";

/* DENEME ADRESI.

   Cizim kodu ve veri yayindaki haritayla AYNI; fark yalnizca
   SilsileAgiSinama'nin `kur`a verdigi `deneme` bayragi. Su an tek bir
   sey aciyor: arama kutusunun yanindaki hamburger menu ve icindeki
   "Sadece Ağları Göster" dugmesi (Mustafa, 2026-09-02).

   BILESENI KOPYALAMA. 1400 satir iki yerde yasarsa her duzeltmeyi iki
   kez uygulamak gerekir; SVG surumu son gunlerin butun
   iyilestirmelerini tam bu yuzden kacirmisti. Yeni bir deneme
   gerekirse `kur`un secenek nesnesine bir bayrak daha ekle.

   2026-08-30'da bir sure VERI burada catallanmisti (bilgi kartlari
   Takrib'den doldurulurken yayindaki harita etkilenmesin diye);
   calisma yayina alinip catal kapatildi. Veri catallamak gerekirse o
   yol da acik.

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
        <SilsileAgiSinama />
      </div>
    </main>
  );
}
