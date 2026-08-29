import type { Metadata } from "next";

// Bu rotanin sayfasi "use client" oldugu icin metadata export edemiyor;
// Next.js metadata'yi yalnizca sunucu bileseninden okur. Ince bir layout
// bu isi cozuyor -- sayfaya hic dokunmadan basligi veriyor.
export const metadata: Metadata = {
  title: "Ağ Sınaması",
  description: "Silsile ağı görselleştirmesinin sınama sayfası.",
  /* SINAMA SAYFASI, arama motorlarina KAPALI. Icerik (silsile agi) hala
     deneniyor; asil yeri belli olunca -- muhtemelen /ravi-iliski-aglari --
     bu satir silinip yol app/sitemap.ts'teki YOLLAR listesine eklenir.
     Ikisi birlikte yapilmali: sitemap'te olup noindex tasiyan bir sayfa
     kendi kendiyle celisir. */
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
