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

/* SINAMA adresi. Burada denenen ezber akisi 2026-08-29'da onaylanip
   yayina alindi, yani su an iki dosya AYNI ICERIKTE:
   `resule-kavusmak-game-sinama.html` yayindaki dosyanin uzerine
   kopyalandi.

   Rota ve ayri dosya bilerek duruyor. Duzenek su: hub ve oyun bileseni
   ortak, yalnizca `oyunDosyasi` farkli. Bir sonraki deneme yine
   sinama dosyasinda yapilir, yayindaki oyun hic etkilenmez, onay gelince
   yine uzerine kopyalanir. Dosyayi silmek bu yalitimi bozar.

   Sirasiyla: once tek hadis (niyet), sonra coklu-hadis deneyimi
   (2026-08-19'da yayina), sonra ezber akisi (2026-08-29'da yayina). */
export default function ResuleKavusmakSinama() {
  return <ResuleKavusmakHub oyunDosyasi="/resule-kavusmak-game-sinama.html" />;
}
