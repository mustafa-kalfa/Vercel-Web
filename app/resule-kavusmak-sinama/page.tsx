import ResuleKavusmakHub from "../ResuleKavusmakHub";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resûle Kavuşmak",
  // /resule-kavusmak ile BIREBIR ayni sayfa (eski baglantilar kirilmasin
  // diye duruyor). Arama motorlarina kapali ve asil adres canonical olarak
  // gosteriliyor, yoksa Google ikisini kopya sayip ikisini de dusururdu.
  robots: { index: false, follow: true },
  alternates: { canonical: "/resule-kavusmak" },
};

/* SINAMA adresi -- 2026-08-29'da yeniden gercek bir deneme surumu oldu.

   Bir sure /resule-kavusmak ile birebir ayni sayfayi gosteriyordu (icerik
   2026-08-19'da gercek sayfaya tasinmisti, bu rota yalnizca eski
   baglantilar kirilmasin diye duruyordu). Simdi yeni oyun akisi burada
   deneniyor: hadis gelir, oyuncu isnadi ezberler, "Ezberledim" dedikten
   sonra Arapca isnad kaybolur ve oyun baslar.

   Fark tek bir yerde: oynatilan HTML dosyasi. Hub ve oyun bileseni ayni,
   yalnizca `oyunDosyasi` farkli. Boylece yayindaki oyun
   (/resule-kavusmak) denemelerden hic etkilenmiyor. Akis onaylanirsa
   iki dosya birlestirilir. */
export default function ResuleKavusmakSinama() {
  return <ResuleKavusmakHub oyunDosyasi="/resule-kavusmak-game-sinama.html" />;
}
