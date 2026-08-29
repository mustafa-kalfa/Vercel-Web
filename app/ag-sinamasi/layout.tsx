import type { Metadata } from "next";

// Bu rotanin sayfasi "use client" oldugu icin metadata export edemiyor;
// Next.js metadata'yi yalnizca sunucu bileseninden okur. Ince bir layout
// bu isi cozuyor -- sayfaya hic dokunmadan basligi veriyor.
export const metadata: Metadata = {
  title: "Ağ Sınaması",
  description: "Silsile ağı görselleştirmesinin sınama sayfası.",
  /* SINAMA SAYFASI, arama motorlarina KAPALI KALIYOR. Icerik 2026-08-29'da
     asil adresine tasindi (/ravi-iliski-aglari, sitemap'te). Bu adres
     silinmedi: bileseni yayindakini bozmadan denemek icin bir yer lazim
     ve ikisi ayni bileseni cagirdigi icin kopya kod yok.

     Bu satir DURMALI -- iki sayfa da indekse girseydi Google birini kopya
     sayip ikisini birden dusururdu. */
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
