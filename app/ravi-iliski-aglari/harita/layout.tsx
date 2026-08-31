import type { Metadata } from "next";

/* Bu rotanin sayfasi "use client" oldugu icin metadata export edemiyor;
   Next.js metadata'yi yalnizca sunucu bileseninden okur.

   SITEMAP'TE YOK ve olmasina da gerek yok: sayfa bastan asagi bir tuval,
   arama motorunun indeksleyecegi metin tasimiyor. Anlatan metin bir ust
   adreste (/ravi-iliski-aglari) ve o sitemap'te duruyor. `noindex` de
   KONMADI -- tanitim sayfasindan buraya giden bag izlenebilir kalsin,
   Google isterse tarasin; kopya icerik riski yok cunku metin yok. */
export const metadata: Metadata = {
  title: "Rivayet Haritası",
  description: "Hadis râvilerinin hoca-talebe bağlarının etkileşimli haritası.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
