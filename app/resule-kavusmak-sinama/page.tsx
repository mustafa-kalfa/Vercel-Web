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

// Eski SINAMA adresi. Icerik 2026-08-19'da gercek sayfaya
// (/resule-kavusmak) tasindi; bu rota, daha once paylasilmis
// baglantilar kirilmasin diye AYNI bileseni render etmeye devam
// ediyor. Artik ayri bir "deneme surumu" degil -- iki adres birebir
// ayni sayfayi gosterir. Gerek kalmadiginda bu klasor silinebilir.
export default function ResuleKavusmakSinama() {
  return <ResuleKavusmakHub />;
}
